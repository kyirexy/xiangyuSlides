import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ArrowRightToLine,
    ArrowUp,
    Check,
    ChevronDown,
    Download,
    Globe,
    Home,
    Lightbulb,
    Mic,
    MonitorPlay,
    Paperclip,
    Box,
    Sparkles,
    Zap,
    Wand2
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    buildCopilotStream,
    getPresentationRecord,
    getStyles,
    planCopilot,
    streamCopilotAgui
} from '../lib/api';
import { AgentRailMessages } from '../components/AgentRailMessages';
import { buildLocalePath, formatDate, I18N, resolveLocale } from '../lib/locale';
import { pushRecentPresentation } from '../lib/storage';

function BrandMark() {
    return (
        <div className="brand-mark brand-mark-small">
            <img src="/tubiao.jpg" alt="Xiangyu Slides" />
        </div>
    );
}

function buildOutlinePeek(outline) {
    if (!outline?.slides?.length) {
        return [];
    }

    return outline.slides.slice(0, 3).map((slide, index) => ({
        label: `Scene ${String(index + 1).padStart(2, '0')}`,
        title: slide.title || slide.subtitle || slide.type || `Slide ${index + 1}`
    }));
}

function buildHintPeek(draftBrief) {
    const flow = Array.isArray(draftBrief?.outlineHints?.flow)
        ? draftBrief.outlineHints.flow.filter(Boolean)
        : [];

    if (!flow.length) {
        return [];
    }

    return flow.slice(0, 4).map((title, index) => ({
        label: `Scene ${String(index + 1).padStart(2, '0')}`,
        title
    }));
}

function uniqueByMessage(events) {
    const seen = new Set();
    return events.filter((item) => {
        const key = `${item.step}:${item.progress}:${item.message}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function createLogEntry(role, content, tone = 'default') {
    return {
        id: `${Date.now().toString(36)}_${Math.random().toString(16).slice(2, 8)}`,
        role,
        content,
        tone,
        createdAt: new Date().toISOString()
    };
}

function getLogRoleLabel(entry, locale) {
    if (entry.role === 'user') {
        return locale === 'zh-CN' ? '你' : 'You';
    }

    if (entry.tone === 'error') {
        return locale === 'zh-CN' ? '错误' : 'Error';
    }

    if (entry.tone === 'trace' || entry.tone === 'system' || entry.tone === 'success') {
        return locale === 'zh-CN' ? '执行步骤' : 'Execution';
    }

    return locale === 'zh-CN' ? 'AI 助手' : 'AI Agent';
}

function getRailMessageKind(entry) {
    if (!entry) {
        return 'assistant';
    }

    if (entry.role === 'user') {
        return 'user';
    }

    if (entry.role === 'assistant' && entry.tone !== 'reasoning' && entry.tone !== 'execution' && entry.tone !== 'tool' && entry.tone !== 'result') {
        return 'assistant';
    }

    if (entry.tone === 'tool') {
        return 'tool';
    }

    if (entry.tone === 'result') {
        return 'result';
    }

    if (entry.tone === 'error') {
        return 'error';
    }

    if (entry.tone === 'reasoning') {
        return 'thinking';
    }

    return 'execution';
}

function buildArtifactTags(artifact, locale) {
    if (!artifact || typeof artifact !== 'object') {
        return [];
    }

    const tags = [];
    if (artifact.type) {
        tags.push(String(artifact.type));
    }
    if (artifact.status) {
        tags.push(String(artifact.status));
    }
    if (artifact.kind) {
        tags.push(String(artifact.kind));
    }
    if (artifact.label && artifact.label !== artifact.type) {
        tags.push(String(artifact.label));
    }

    return Array.from(new Set(tags.filter(Boolean))).slice(0, 4);
}

function mergeLogEntry(current, nextEntry) {
    const index = current.findIndex((item) => item.id === nextEntry.id);
    if (index === -1) {
        return [...current, nextEntry];
    }

    const updated = [...current];
    updated[index] = {
        ...updated[index],
        ...nextEntry,
        content: typeof nextEntry.content === 'string' ? nextEntry.content : updated[index].content,
        artifact: nextEntry.artifact ?? updated[index].artifact,
        stepLabel: nextEntry.stepLabel || updated[index].stepLabel,
        stepStatus: nextEntry.stepStatus || updated[index].stepStatus,
        eventType: nextEntry.eventType || updated[index].eventType
    };
    return updated;
}

function buildAguiStepLog(event) {
    const payload = event?.payload || {};
    const phase = String(payload.phase || '').trim();
    const status = String(payload.status || '').trim();

    let tone = 'execution';
    if (status === 'failed' || status === 'error') {
        tone = 'error';
    } else if (phase === 'reasoning') {
        tone = 'reasoning';
    } else if (phase === 'tool') {
        tone = 'tool';
    } else if (phase === 'result') {
        tone = 'result';
    }

    return {
        id: String(payload.stepId || event.type || `step_${Date.now()}`),
        role: 'system',
        tone,
        content: String(payload.message || '').trim(),
        createdAt: event.timestamp || new Date().toISOString(),
        eventType: String(payload.eventType || '').trim(),
        stepLabel: String(payload.title || '').trim(),
        stepStatus: String(payload.status || '').trim() || (event.type === 'STEP_STARTED' ? 'running' : ''),
        artifact: payload.artifact || null
    };
}

export default function CreatePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const locale = resolveLocale(location.search);
    const copy = I18N[locale];
    const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const initialPrompt = params.get('prompt') || '';
    const initialPresentationId = params.get('presentationId') || '';
    const initialThreadId = params.get('threadId') || '';
    const shouldAutoStart = params.get('autostart') === '1';
    const startedRef = useRef(false);
    const logListRef = useRef(null);
    const modeMenuRef = useRef(null);
    const modelMenuRef = useRef(null);
    const recognitionRef = useRef(null);

    const [prompt, setPrompt] = useState(initialPrompt);
    const [messages, setMessages] = useState([]);
    const [logs, setLogs] = useState([]);
    const [styles, setStyles] = useState([]);
    const [outputIntent, setOutputIntent] = useState('');
    const [visualPreference, setVisualPreference] = useState('');
    const [deckLocale, setDeckLocale] = useState(locale);
    const [draftBrief, setDraftBrief] = useState(null);
    const [threadId, setThreadId] = useState(initialThreadId);
    const [isPlanning, setIsPlanning] = useState(false);
    const [isBuilding, setIsBuilding] = useState(false);
    const [clarification, setClarification] = useState('');
    const [buildEvents, setBuildEvents] = useState([]);
    const [resultRecord, setResultRecord] = useState(null);
    const [presentationId, setPresentationId] = useState('');
    const [error, setError] = useState('');
    const [switchingFamily, setSwitchingFamily] = useState('');
    const [activeStageView, setActiveStageView] = useState('live');
    const [isLoadingExisting, setIsLoadingExisting] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(430);
    const [agentMode, setAgentMode] = useState('agent');
    const [modeMenuOpen, setModeMenuOpen] = useState(false);
    const [webSearchEnabled, setWebSearchEnabled] = useState(false);
    const [reasoningMode, setReasoningMode] = useState('thinking');
    const [modelPickerEnabled, setModelPickerEnabled] = useState(false);
    const [selectedModelId, setSelectedModelId] = useState('balanced');
    const [isListening, setIsListening] = useState(false);

    const modeOptions = useMemo(() => ([
        {
            id: 'agent',
            label: 'Agent',
            icon: Sparkles
        },
        {
            id: 'image',
            label: locale === 'zh-CN' ? '图像生成器' : 'Image generator',
            icon: Box
        },
        {
            id: 'video',
            label: locale === 'zh-CN' ? '视频生成器' : 'Video generator',
            icon: MonitorPlay
        }
    ]), [locale]);

    const modelOptions = useMemo(() => ([
        {
            id: 'balanced',
            label: locale === 'zh-CN' ? '均衡模型' : 'Balanced model',
            note: locale === 'zh-CN' ? '默认生成体验。' : 'Default generation mode.'
        },
        {
            id: 'quality',
            label: locale === 'zh-CN' ? '高质量模型' : 'Quality model',
            note: locale === 'zh-CN' ? '更偏精细输出。' : 'More detailed outputs.'
        },
        {
            id: 'fast',
            label: locale === 'zh-CN' ? '极速模型' : 'Fast model',
            note: locale === 'zh-CN' ? '更快返回结果。' : 'Faster turnaround.'
        }
    ]), [locale]);

    const selectedMode = modeOptions.find((item) => item.id === agentMode) || modeOptions[0];
    const SelectedModeIcon = selectedMode.icon;

    useEffect(() => {
        getStyles()
            .then((payload) => setStyles(Array.isArray(payload) ? payload : []))
            .catch(() => setStyles([]));
    }, []);

    useEffect(() => {
        setDeckLocale(locale);
    }, [locale]);

    useEffect(() => {
        if (!shouldAutoStart || !initialPrompt || startedRef.current) {
            return;
        }

        startedRef.current = true;
        queueMicrotask(() => {
            runCopilot(initialPrompt);
        });
    }, [shouldAutoStart, initialPrompt]);

    useEffect(() => {
        if (!logListRef.current) {
            return;
        }

        logListRef.current.scrollTop = logListRef.current.scrollHeight;
    }, [logs, clarification, isPlanning, isBuilding, isLoadingExisting, resultRecord]);

    useEffect(() => {
        function handlePointerDown(event) {
            if (modeMenuRef.current && !modeMenuRef.current.contains(event.target)) {
                setModeMenuOpen(false);
            }

            if (modelMenuRef.current && !modelMenuRef.current.contains(event.target)) {
                setModelPickerEnabled(false);
            }
        }

        document.addEventListener('mousedown', handlePointerDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
        };
    }, []);

    useEffect(() => () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch {}
        }
    }, []);

    useEffect(() => {
        if (!initialPresentationId || shouldAutoStart || resultRecord || isBuilding) {
            return undefined;
        }

        let cancelled = false;

        setIsLoadingExisting(true);
        setError('');
        setPresentationId(initialPresentationId);
        setLogs((current) => [...current, createLogEntry(
            'system',
            copy.createLoadExistingStart.replace('{id}', initialPresentationId),
            'system'
        )]);

        getPresentationRecord(initialPresentationId)
            .then((record) => {
                if (cancelled) {
                    return;
                }

                setResultRecord(record);
                setDraftBrief((current) => current || {
                    topic: record.title || record.outline?.title || copy.createWelcomeTitle,
                    locale: deckLocale,
                    visualFamily: 'showcase',
                    styleId: record.style?.id || '',
                    outputIntent: outputIntent || '',
                    outlineHints: {
                        tone: record.outline?.subtitle || '',
                        flow: Array.isArray(record.outline?.slides)
                            ? record.outline.slides
                                .map((slide) => slide?.title || slide?.subtitle || slide?.type)
                                .filter(Boolean)
                                .slice(0, 6)
                            : [],
                        keywords: []
                    }
                });
                setLogs((current) => [...current, createLogEntry(
                    'system',
                    copy.createLoadExistingDone.replace('{title}', record.title || initialPresentationId),
                    'success'
                )]);
            })
            .catch((requestError) => {
                if (cancelled) {
                    return;
                }

                const message = requestError.message || String(requestError);
                setError(message);
                setLogs((current) => [...current, createLogEntry(
                    'system',
                    copy.createLoadExistingFailed.replace('{message}', message),
                    'error'
                )]);
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoadingExisting(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [initialPresentationId, shouldAutoStart, resultRecord, isBuilding, copy, deckLocale, outputIntent]);

    function appendLog(role, content, tone = 'default') {
        const entry = createLogEntry(role, content, tone);
        setLogs((current) => [...current, entry]);
    }

    function startSidebarResize(event) {
        event.preventDefault();
        event.target.setPointerCapture(event.pointerId);

        const startX = event.clientX;
        const startWidth = sidebarWidth;

        function onPointerMove(e) {
            const delta = startX - e.clientX;
            setSidebarWidth(Math.max(430, Math.min(560, startWidth + delta)));
        }

        function onPointerUp() {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    }

    async function handleSend() {
        const nextPrompt = prompt.trim();
        if (!nextPrompt) {
            setError(copy.createNeedPrompt);
            return;
        }

        await runCopilot(nextPrompt);
    }

    function handlePrimaryComposerAction() {
        if (prompt.trim()) {
            handleSend();
            return;
        }

        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Recognition) {
            setError(locale === 'zh-CN'
                ? '当前浏览器还不支持语音输入，请先直接输入文本。'
                : 'Voice input is not supported in this browser yet. Please type your request.');
            return;
        }

        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            return;
        }

        const recognition = new Recognition();
        recognition.lang = deckLocale === 'zh-CN' ? 'zh-CN' : 'en-US';
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onstart = () => {
            setIsListening(true);
            setError('');
        };

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results || [])
                .map((result) => result?.[0]?.transcript || '')
                .join('');
            setPrompt(transcript.trim());
        };

        recognition.onerror = () => {
            setIsListening(false);
            setError(locale === 'zh-CN'
                ? '语音输入没有成功，请再试一次或直接输入。'
                : 'Voice capture did not succeed. Please try again or type directly.');
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
    }

    async function runCopilot(nextPrompt) {
        setError('');
        setPrompt('');
        setResultRecord(null);
        setClarification('');
        setActiveStageView('live');

        const userMessage = { role: 'user', content: nextPrompt };
        const nextMessages = [...messages, userMessage];
        setMessages(nextMessages);
        appendLog('user', nextPrompt, 'user');
        setIsPlanning(true);
        setBuildEvents([]);

        try {
            let aguiCompleted = false;

            try {
                await streamCopilotAgui({
                    messages: nextMessages,
                    locale: deckLocale,
                    uiLocale: locale,
                    outputIntent,
                    visualPreference,
                    allowClarification: true,
                    threadId,
                    reasoningMode,
                    webSearchEnabled,
                    selectedModelId
                }, async (event) => {
                    if (!event || typeof event !== 'object') {
                        return;
                    }

                    if (event.threadId) {
                        setThreadId(event.threadId);
                    }

                    if (event.presentationId) {
                        setPresentationId(event.presentationId);
                    }

                    if (event.type === 'RUN_STARTED') {
                        setIsPlanning(true);
                        setIsBuilding(false);
                        return;
                    }

                    if (event.type === 'STATE_SNAPSHOT' || event.type === 'STATE_DELTA') {
                        const payload = event.payload || {};
                        if (payload.draftBrief) {
                            setDraftBrief(payload.draftBrief);
                        }
                        if (typeof payload.clarification === 'string') {
                            setClarification(payload.clarification);
                        }
                        if (payload.activePresentationId) {
                            setPresentationId(payload.activePresentationId);
                        }
                        if (payload.reasoningMode) {
                            setReasoningMode(payload.reasoningMode);
                        }
                        if (typeof payload.webSearchEnabled === 'boolean') {
                            setWebSearchEnabled(payload.webSearchEnabled);
                        }
                        if (typeof payload.selectedModelId === 'string' && payload.selectedModelId.trim()) {
                            setSelectedModelId(payload.selectedModelId);
                        }
                        return;
                    }

                    if (event.type === 'TEXT_MESSAGE_START') {
                        const messageId = String(event.payload?.messageId || `assistant_${Date.now()}`);
                        setLogs((current) => mergeLogEntry(current, {
                            id: messageId,
                            role: 'assistant',
                            tone: 'assistant',
                            content: '',
                            createdAt: event.timestamp || new Date().toISOString()
                        }));
                        setIsPlanning(false);
                        return;
                    }

                    if (event.type === 'TEXT_MESSAGE_CONTENT') {
                        const messageId = String(event.payload?.messageId || '');
                        const delta = String(event.payload?.delta || '');
                        if (!messageId) {
                            return;
                        }
                        setLogs((current) => current.map((item) => (
                            item.id === messageId
                                ? { ...item, content: `${item.content || ''}${delta}` }
                                : item
                        )));
                        return;
                    }

                    if (event.type === 'TEXT_MESSAGE_END') {
                        const finalContent = String(event.payload?.content || '').trim();
                        if (finalContent) {
                            setMessages((current) => [...current, { role: 'assistant', content: finalContent }]);
                        }
                        return;
                    }

                    if (
                        event.type === 'STEP_STARTED'
                        || event.type === 'STEP_FINISHED'
                        || event.type === 'TOOL_CALL_START'
                        || event.type === 'TOOL_CALL_END'
                    ) {
                        const nextLog = buildAguiStepLog(event);
                        setLogs((current) => mergeLogEntry(current, nextLog));

                        if (nextLog.tone === 'execution' || nextLog.tone === 'tool' || nextLog.tone === 'result') {
                            setIsPlanning(false);
                            setIsBuilding(true);
                        }
                        return;
                    }

                    if (event.type === 'RUN_ERROR') {
                        setIsPlanning(false);
                        setIsBuilding(false);
                        const message = String(event.payload?.message || 'Build failed');
                        setError(message);
                        setLogs((current) => mergeLogEntry(current, createLogEntry('system', message, 'error')));
                        return;
                    }

                    if (event.type === 'RUN_FINISHED') {
                        aguiCompleted = true;
                        setIsPlanning(false);
                        setIsBuilding(false);

                        const payload = event.payload || {};
                        if (payload.draftBrief) {
                            setDraftBrief(payload.draftBrief);
                        }

                        if (payload.status === 'clarifying') {
                            setClarification(String(payload.clarification || ''));
                            return;
                        }

                        const finalPresentationId = String(
                            payload.presentationId
                            || event.presentationId
                            || ''
                        ).trim();

                        if (!finalPresentationId) {
                            return;
                        }

                        setPresentationId(finalPresentationId);
                        const record = await getPresentationRecord(finalPresentationId);
                        setResultRecord(record);
                        setActiveStageView('live');
                        pushRecentPresentation({
                            id: finalPresentationId,
                            title: record.title || payload.draftBrief?.topic || nextPrompt,
                            styleName: record.style?.name || '',
                            previewUrl: `/presentations/${finalPresentationId}`,
                            workspaceUrl: buildLocalePath('/create', locale, {
                                presentationId: finalPresentationId,
                                threadId: event.threadId || threadId || ''
                            }),
                            threadId: event.threadId || threadId || '',
                            updatedAt: record.updatedAt || new Date().toISOString()
                        });
                    }
                });
            } catch (aguiError) {
                const message = aguiError?.message || String(aguiError);
                if (!/404|AG-UI/i.test(message)) {
                    throw aguiError;
                }
            }

            if (aguiCompleted) {
                return;
            }

            const plan = await planCopilot({
                messages: nextMessages,
                locale: deckLocale,
                uiLocale: locale,
                outputIntent,
                visualPreference,
                allowClarification: true,
                threadId
            });

            if (plan.threadId) {
                setThreadId(plan.threadId);
            }

            if (plan.assistantMessage) {
                appendLog('assistant', plan.assistantMessage, 'assistant');
                setMessages((current) => [...current, {
                    role: 'assistant',
                    content: plan.assistantMessage
                }]);
            }

            setDraftBrief(plan.draftBrief || null);
            setIsPlanning(false);

            if (plan.draftBrief) {
                setLogs((current) => mergeLogEntry(current, {
                    id: `fallback_brief_${Date.now().toString(36)}`,
                    role: 'system',
                    tone: 'reasoning',
                    content: locale === 'zh-CN'
                        ? `已锁定 ${plan.draftBrief.purpose || 'product'} / ${plan.draftBrief.length || 'medium'} / ${plan.draftBrief.visualFamily || 'showcase'}。`
                        : `Locked ${plan.draftBrief.purpose || 'product'} / ${plan.draftBrief.length || 'medium'} / ${plan.draftBrief.visualFamily || 'showcase'}.`,
                    createdAt: new Date().toISOString(),
                    eventType: 'brief_locked',
                    stepLabel: locale === 'zh-CN' ? '已锁定 brief' : 'Brief locked',
                    stepStatus: 'ready'
                }));
            }

            if (plan.readyToBuild === false) {
                setClarification(plan.clarification || plan.assistantMessage || '');
                return;
            }

            appendLog('system', copy.createBuildAutoStart, 'trace');
            await runBuild(plan.draftBrief || null, plan.threadId || threadId);
        } catch (requestError) {
            setIsPlanning(false);
            setError(requestError.message || String(requestError));
            appendLog('system', copy.createBuildFailure.replace('{message}', requestError.message || String(requestError)), 'error');
        }
    }

    async function runBuild(brief, nextThreadId = threadId) {
        setIsBuilding(true);
        setError('');
        setClarification('');
        setBuildEvents([]);
        appendLog('system', copy.createBuildWorkspaceBody, 'trace');

        try {
            await buildCopilotStream({
                draftBrief: brief,
                locale: deckLocale,
                threadId: nextThreadId || ''
            }, async (event) => {
                if (event.threadId) {
                    setThreadId(event.threadId);
                }
                setPresentationId(event.presentationId || '');
                setBuildEvents((current) => uniqueByMessage([...current, event]));

                if (event.message) {
                    appendLog('system', event.message, event.status === 'failed' ? 'error' : 'trace');
                }

                if (event.status === 'ready' && event.presentationId) {
                    const record = await getPresentationRecord(event.presentationId);
                    setResultRecord(record);
                    setDraftBrief((current) => current || brief);
                    pushRecentPresentation({
                        id: event.presentationId,
                        title: record.title || brief.topic,
                        styleName: record.style?.name || '',
                        previewUrl: `/presentations/${event.presentationId}`,
                        workspaceUrl: buildLocalePath('/create', locale, {
                            presentationId: event.presentationId,
                            threadId: event.threadId || nextThreadId || threadId || ''
                        }),
                        threadId: event.threadId || nextThreadId || threadId || '',
                        updatedAt: record.updatedAt || new Date().toISOString()
                    });
                }

                if (event.status === 'failed') {
                    setError(event.error || event.message || 'Build failed');
                }
            });
        } finally {
            setIsBuilding(false);
        }
    }

    async function handleVisualSwitch(nextFamily) {
        if (!draftBrief || isBuilding) {
            return;
        }

        setSwitchingFamily(nextFamily);
        const familyStyles = styles.filter((item) => item.visualFamily === nextFamily);
        const nextStyle = familyStyles[0]?.id || draftBrief.styleId;

        try {
            await runBuild({
                ...draftBrief,
                visualFamily: nextFamily,
                styleId: nextStyle
            });
        } finally {
            setSwitchingFamily('');
        }
    }

    async function copyResultLink() {
        if (!presentationId) {
            return;
        }

        const url = `${window.location.origin}${buildLocalePath(`/presentations/${presentationId}`, locale)}`;
        await navigator.clipboard.writeText(url);
        appendLog('system', copy.createActionCopy, 'success');
    }

    const latestEvent = buildEvents[buildEvents.length - 1] || null;
    const outlinePeek = buildOutlinePeek(resultRecord?.outline);
    const hintPeek = buildHintPeek(draftBrief);
    const currentFamily = draftBrief?.visualFamily || visualPreference || 'showcase';
    const stagePreviewTitle = resultRecord?.title || draftBrief?.topic || copy.createWelcomeTitle;
    const stagePreviewBody = resultRecord?.outline?.subtitle || draftBrief?.outlineHints?.tone || copy.createWelcomeBody;
    const buildProgress = resultRecord ? 100 : Math.max(
        8,
        (isLoadingExisting ? 26 : 0),
        latestEvent?.progress || (isPlanning ? 14 : 0) || (clarification ? 18 : 0)
    );
    const stageScenes = outlinePeek.length
        ? outlinePeek
        : hintPeek.length
            ? hintPeek
        : [
            { label: 'Scene 01', title: copy.createIdleSceneOne },
            { label: 'Scene 02', title: copy.createIdleSceneTwo },
            { label: 'Scene 03', title: copy.createIdleSceneThree }
        ];
    const stageActivity = buildEvents.length
        ? buildEvents.slice(-4)
        : isLoadingExisting
            ? [
                { progress: 18, message: copy.createLoadExistingStart.replace('{id}', initialPresentationId) },
                { progress: 38, message: copy.createStageModeSpec },
                { progress: 58, message: copy.createLoadExistingDone.replace('{title}', stagePreviewTitle) }
            ]
        : [
            { progress: 1, message: copy.createStageMonitorIdle },
            { progress: 2, message: copy.createStageModeSlides },
            { progress: 3, message: copy.createStageModeMedia }
        ];

    const stageStatus = error
        ? copy.createStageError
        : isLoadingExisting
            ? copy.createStageLoadingExisting
        : isBuilding
            ? copy.createStageBuilding
            : clarification
                ? copy.createStageClarify
                : resultRecord
                    ? copy.createStageReadyDone
                    : isPlanning
                        ? copy.createStagePlanning
                : copy.createStageReady;
    const stageMode = error
        ? 'error'
        : isLoadingExisting
            ? 'loading'
            : isBuilding
                ? 'building'
                : clarification
                    ? 'clarify'
                    : resultRecord
                        ? 'ready'
                        : isPlanning
                            ? 'planning'
                            : 'idle';
    const stagePrimaryMessage = error
        || clarification
        || (isLoadingExisting
            ? copy.createStageLoadedBody
            : isBuilding
                ? latestEvent?.message || copy.createStageBuildingBody
                : isPlanning
                    ? copy.createStageAwaitingBody
                    : draftBrief
                        ? copy.createStageAwaitingBody
                        : copy.createStageEmptyBody);
    const showStageDock = false;
    const showStageTrack = false;
    const showStageProgress = false;
    const showPromptPresets = !messages.length
        && !logs.length
        && !draftBrief
        && !clarification
        && !isPlanning
        && !isBuilding
        && !isLoadingExisting
        && !resultRecord;
    const canBrowseStageViews = Boolean(resultRecord);
    const outlineSlides = resultRecord?.outline?.slides || [];
    const stageViewOptions = [
        { key: 'live', label: copy.createStageViewLive, icon: MonitorPlay },
        { key: 'outline', label: copy.createStageViewOutline, icon: Box },
        { key: 'output', label: copy.createStageViewOutput, icon: Download }
    ];
    const outputCards = [
        {
            key: 'route',
            label: copy.createMetaRoute,
            value: presentationId ? buildLocalePath(`/presentations/${presentationId}`, locale) : copy.createStageOutputPending,
            note: resultRecord ? copy.createStageOutputReady : copy.createStageOutputWaiting
        },
        {
            key: 'html',
            label: copy.createActionHtml,
            value: resultRecord?.html ? copy.createStageOutputReady : copy.createStageOutputPending,
            note: copy.createStageModeExports
        },
        {
            key: 'pptx',
            label: copy.createActionPptx,
            value: resultRecord?.pptxUrl ? copy.createStageOutputReady : copy.createStageOutputPending,
            note: copy.buildStatusReady
        },
        {
            key: 'editor',
            label: copy.createActionAdvanced,
            value: resultRecord ? copy.createClassic : copy.createStageOutputWaiting,
            note: copy.createAdvancedHint
        }
    ];

    return (
        <div className="app-page editor-page">
            <div className="editor-shell">
                <section className="editor-canvas">
                    <header className="editor-topbar">
                        <button type="button" className="editor-brand-link" onClick={() => navigate(buildLocalePath('/', locale))}>
                            <BrandMark />
                            <div className="editor-brand-copy">
                                <strong>{copy.brand}</strong>
                                <span>{copy.createTitle}</span>
                            </div>
                        </button>
                        <div className="editor-top-actions">
                            <button
                                type="button"
                                className="editor-top-pill"
                                onClick={() => navigate(buildLocalePath(location.pathname, locale === 'zh-CN' ? 'en' : 'zh-CN'))}
                            >
                                <Globe size={15} />
                                {locale === 'zh-CN' ? copy.zhLabel : copy.enLabel}
                                <ChevronDown size={14} />
                            </button>
                            <div className="avatar-pill">X</div>
                        </div>
                    </header>

                    <div className="editor-canvas-body">
                        <div className="stage-surface">
                            <div className="stage-head">
                                <div>
                                    <span className="stage-label">{copy.createStageLabel}</span>
                                    {resultRecord ? <strong>{stageStatus}</strong> : null}
                                </div>
                                {resultRecord ? (
                                    <div className="stage-chips">
                                        <span>{draftBrief?.visualFamily || copy.visualFamilyShowcase}</span>
                                        <span>{draftBrief?.outputIntent || outputIntent || copy.createIntentAuto}</span>
                                        <span>{deckLocale === 'zh-CN' ? copy.zhLabel : copy.enLabel}</span>
                                    </div>
                                ) : null}
                            </div>
                            <div className="stage-workspace">
                                <div className="stage-canvas-panel">
                                    {canBrowseStageViews ? (
                                        <div className="stage-view-switch">
                                            {stageViewOptions.map(({ key, label, icon: Icon }) => (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    className={`stage-view-btn ${activeStageView === key ? 'active' : ''}`}
                                                    onClick={() => setActiveStageView(key)}
                                                >
                                                    <Icon size={14} />
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}

                                    {!canBrowseStageViews || activeStageView === 'live' ? (
                                        <div className={`presentation-frame ${resultRecord ? 'is-ready' : 'is-placeholder'}`}>
                                            {resultRecord ? (
                                                <div className="presentation-frame-topbar">
                                                    <span className="presentation-frame-badge">{copy.createActionPreview}</span>
                                                    <span className="presentation-frame-route">
                                                        {buildLocalePath(`/presentations/${presentationId}`, locale)}
                                                    </span>
                                                </div>
                                            ) : null}

                                            {resultRecord?.html ? (
                                                <iframe
                                                    className="presentation-frame-embed"
                                                    title={stagePreviewTitle}
                                                    srcDoc={resultRecord.html}
                                                />
                                            ) : (
                                                <div className="presentation-frame-placeholder">
                                                    <div className={`presentation-stage-shell stage-mode-${stageMode}`}>
                                                        <div className="presentation-stage-ambient">
                                                            <div className="presentation-stage-glow" />
                                                            <div className="presentation-stage-ring ring-one" />
                                                            <div className="presentation-stage-ring ring-two" />
                                                        </div>
                                                        <div className="presentation-slide-sheet">
                                                            <div className="presentation-stage-screen">
                                                                <div className="presentation-stage-screen-frame">
                                                                    <div className="presentation-slide-copy">
                                                                        <span>{copy.createStageLabel}</span>
                                                                        {(isPlanning || isBuilding || isLoadingExisting || clarification || error) ? (
                                                                            <strong>{stageStatus}</strong>
                                                                        ) : null}
                                                                        <p>{stagePrimaryMessage}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : null}

                                    {canBrowseStageViews && activeStageView === 'outline' ? (
                                        <div className="stage-panel-surface outline-stage-board">
                                            <div className="outline-stage-head">
                                                <div>
                                                    <span>{copy.createMetaOutline}</span>
                                                    <strong>{stagePreviewTitle}</strong>
                                                </div>
                                                <p>{resultRecord ? copy.createResultTitle : copy.createNoOutline}</p>
                                            </div>
                                            <div className="outline-stage-list">
                                                {stageScenes.map((item, index) => (
                                                    <article className="outline-stage-card" key={`outline_${item.label}_${item.title}`}>
                                                        <span>{item.label}</span>
                                                        <strong>{item.title}</strong>
                                                        <p>
                                                            {outlineSlides[index]?.subtitle
                                                                || (Array.isArray(outlineSlides[index]?.content) ? outlineSlides[index].content[0] : outlineSlides[index]?.content)
                                                                || draftBrief?.outlineHints?.tone
                                                                || copy.createBuildWorkspaceBody}
                                                        </p>
                                                    </article>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}

                                    {canBrowseStageViews && activeStageView === 'output' ? (
                                        <div className="stage-panel-surface output-stage-board">
                                            <div className="outline-stage-head">
                                                <div>
                                                    <span>{copy.createStageModes}</span>
                                                    <strong>{copy.createResultLabel}</strong>
                                                </div>
                                                <p>{resultRecord ? copy.buildStatusReady : copy.createBuildWorkspaceBody}</p>
                                            </div>
                                            <div className="output-stage-grid">
                                                {outputCards.map((item) => (
                                                    <article className="output-stage-card" key={item.key}>
                                                        <span>{item.label}</span>
                                                        <strong>{item.value}</strong>
                                                        <p>{item.note}</p>
                                                    </article>
                                                ))}
                                            </div>
                                            <div className="output-stage-actions">
                                                <button
                                                    type="button"
                                                    className="solid-action"
                                                    disabled={!resultRecord}
                                                    onClick={() => { window.location.href = buildLocalePath(`/presentations/${presentationId}`, locale); }}
                                                >
                                                    {copy.createActionPreview}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="ghost-action"
                                                    disabled={!resultRecord?.html}
                                                    onClick={() => { window.location.href = `/api/presentations/${presentationId}/html`; }}
                                                >
                                                    {copy.createActionOpenHtml}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="ghost-action"
                                                    disabled={!resultRecord?.pptxUrl}
                                                    onClick={() => { window.location.href = resultRecord?.pptxUrl || '#'; }}
                                                >
                                                    {copy.createActionPptx}
                                                </button>
                                            </div>
                                            {resultRecord ? (
                                                <div className="visual-switch-row">
                                                    {['showcase', 'editorial', 'briefing'].map((family) => (
                                                        <button
                                                            key={family}
                                                            type="button"
                                                            className={`visual-family-btn ${currentFamily === family ? 'active' : ''}`}
                                                            disabled={isBuilding || switchingFamily === family}
                                                            onClick={() => handleVisualSwitch(family)}
                                                        >
                                                            {copy[`visualFamily${family[0].toUpperCase()}${family.slice(1)}`]}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="editor-bottom-toolbar">
                        <div className="toolbar-cluster">
                            <button type="button" className="toolbar-pill"><MonitorPlay size={15} />{copy.createBottomPreview}</button>
                            <button type="button" className="toolbar-pill"><Wand2 size={15} />{copy.createBottomVisual}</button>
                            <button type="button" className="toolbar-pill"><Download size={15} />{copy.createBottomExport}</button>
                        </div>
                        <div className="toolbar-cluster">
                            <button type="button" className="toolbar-pill strong" onClick={() => { window.location.href = buildLocalePath('/create-classic', locale, { presentationId }); }}>
                                <ArrowRightToLine size={15} />
                                {copy.createBottomAdvanced}
                            </button>
                        </div>
                    </div>
                </section>

                <aside className="editor-sidebar" style={{ width: `${sidebarWidth}px` }}>
                    <button
                        type="button"
                        className="editor-sidebar-resize"
                        aria-label={locale === "zh-CN" ? "调整右侧宽度" : "Resize sidebar"}
                        onPointerDown={startSidebarResize}
                    />
                    <div className="sidebar-head">
                        <div>
                            <span>{copy.createLogTitle}</span>
                            <strong>{draftBrief?.topic || copy.createTitle}</strong>
                        </div>
                        <div className="sidebar-head-actions">
                            <button type="button" className="icon-action" onClick={() => navigate(buildLocalePath('/', locale))}>
                                <Home size={17} />
                            </button>
                            <button type="button" className="icon-action" onClick={() => { window.location.href = buildLocalePath('/create-classic', locale, { presentationId }); }}>
                                <ArrowRightToLine size={17} />
                            </button>
                        </div>
                    </div>

                    <div className="sidebar-scroll">
                        <section className="sidebar-block log-block">
                            <div className="sidebar-block-head">
                                <strong>{copy.createLogTitle}</strong>
                                <span>{copy.createAgentRailHint}</span>
                            </div>
                            <div className="log-list log-list-chat agent-rail-list" ref={logListRef}>
                                {showPromptPresets ? (
                                    <div className="chat-quickstart-empty-state">
                                        <strong>{copy.createPresetTitle}</strong>
                                        <div className="chat-quickstart-list">
                                            <button type="button" className="chat-quickstart-item" onClick={() => setPrompt(copy.homeQuickFinancePrompt)}>
                                                {copy.createPresetPitch}
                                            </button>
                                            <button type="button" className="chat-quickstart-item" onClick={() => setPrompt(copy.homeQuickProductPrompt)}>
                                                {copy.createPresetProduct}
                                            </button>
                                            <button type="button" className="chat-quickstart-item" onClick={() => setPrompt(copy.homeQuickTeachingPrompt)}>
                                                {copy.createPresetTeaching}
                                            </button>
                                            <button type="button" className="chat-quickstart-item" onClick={() => setPrompt(copy.homeQuickShowcasePrompt)}>
                                                {copy.createPresetShowcase}
                                            </button>
                                        </div>
                                    </div>
                                ) : logs.length ? (
                                    <AgentRailMessages
                                        logs={logs}
                                        locale={locale}
                                        getRailMessageKind={getRailMessageKind}
                                        getLogRoleLabel={getLogRoleLabel}
                                        buildArtifactTags={buildArtifactTags}
                                        buildLocalePath={buildLocalePath}
                                        previewLabel={copy.createActionPreview}
                                        openLabel={copy.createActionOpenHtml}
                                    />
                                ) : (
                                    <p className="log-empty">{copy.createChatEmpty}</p>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="sidebar-composer sidebar-composer-chat">
                        <textarea
                            value={prompt}
                            onChange={(event) => setPrompt(event.target.value)}
                            placeholder={clarification || copy.createPromptPlaceholder}
                            disabled={isPlanning || isBuilding}
                        />
                        <div className="sidebar-composer-footer composer-toolbar-row">
                            <button
                                type="button"
                                className="composer-tool-icon composer-tool-attach composer-tooltip-anchor"
                                aria-label={copy.createAttach || 'Attach'}
                                title={copy.createAttach || 'Attach'}
                                data-tooltip={copy.createAttach || 'Attach'}
                            >
                                <Paperclip size={15} />
                            </button>
                            <div className="composer-mode-wrap" ref={modeMenuRef}>
                                <button
                                    type="button"
                                    className={`composer-mode-pill composer-tooltip-anchor ${modeMenuOpen ? 'active' : ''}`}
                                    onClick={() => setModeMenuOpen((current) => !current)}
                                    aria-label={selectedMode.label}
                                    title={selectedMode.label}
                                    data-tooltip={selectedMode.label}
                                >
                                    <SelectedModeIcon size={15} />
                                    <span>{selectedMode.label}</span>
                                    <ChevronDown size={14} />
                                </button>
                                {modeMenuOpen ? (
                                    <div className="composer-popover composer-mode-menu">
                                        {modeOptions.map((option) => {
                                            const Icon = option.icon;
                                            return (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    className={`composer-menu-item ${agentMode === option.id ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setAgentMode(option.id);
                                                        setModeMenuOpen(false);
                                                    }}
                                                >
                                                    <div className="composer-menu-item-main">
                                                        <Icon size={15} />
                                                        <span>{option.label}</span>
                                                    </div>
                                                    {agentMode === option.id ? <Check size={14} /> : null}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>
                            <div className="composer-tool-group">
                                <div className="composer-reasoning-switch" role="group" aria-label={locale === 'zh-CN' ? '模式切换' : 'Mode switch'}>
                                    <button
                                        type="button"
                                        className={`composer-reasoning-btn composer-tooltip-anchor ${reasoningMode === 'thinking' ? 'active' : ''}`}
                                        onClick={() => setReasoningMode('thinking')}
                                        aria-label={copy.createThinkingMode || 'Thinking'}
                                        title={copy.createThinkingMode || 'Thinking'}
                                        data-tooltip={copy.createThinkingMode || 'Thinking'}
                                    >
                                        <Lightbulb size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        className={`composer-reasoning-btn composer-tooltip-anchor ${reasoningMode === 'fast' ? 'active' : ''}`}
                                        onClick={() => setReasoningMode('fast')}
                                        aria-label={copy.createFastMode || 'Fast'}
                                        title={copy.createFastMode || 'Fast'}
                                        data-tooltip={copy.createFastMode || 'Fast'}
                                    >
                                        <Zap size={14} />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    className={`composer-tool-icon composer-tooltip-anchor ${webSearchEnabled ? 'active' : ''}`}
                                    onClick={() => setWebSearchEnabled((current) => !current)}
                                    aria-label={copy.createWebSearch || 'Web search'}
                                    title={copy.createWebSearch || 'Web search'}
                                    data-tooltip={copy.createWebSearch || 'Web search'}
                                >
                                    <Globe size={15} />
                                </button>
                                <div className="composer-model-wrap" ref={modelMenuRef}>
                                    <button
                                        type="button"
                                        className={`composer-tool-icon composer-tooltip-anchor ${modelPickerEnabled ? 'active' : ''}`}
                                        onClick={() => setModelPickerEnabled((current) => !current)}
                                        aria-label={copy.createModelPicker || 'Model'}
                                        title={copy.createModelPicker || 'Model'}
                                        data-tooltip={copy.createModelPicker || 'Model'}
                                    >
                                        <Box size={15} />
                                    </button>
                                    {modelPickerEnabled ? (
                                        <div className="composer-popover composer-model-menu composer-model-menu-compact">
                                            <div className="composer-model-head">
                                                <div>
                                                    <strong>{copy.createModelPreference || '模型偏好'}</strong>
                                                </div>
                                            </div>
                                            <div className="composer-model-list">
                                                {modelOptions.map((model) => (
                                                    <button
                                                        key={model.id}
                                                        type="button"
                                                        className={`composer-model-card ${selectedModelId === model.id ? 'active' : ''}`}
                                                        onClick={() => {
                                                            setSelectedModelId(model.id);
                                                            setModelPickerEnabled(false);
                                                        }}
                                                    >
                                                        <div className="composer-model-card-main">
                                                            <strong>{model.label}</strong>
                                                            <p>{model.note}</p>
                                                        </div>
                                                        {selectedModelId === model.id ? <Check size={15} /> : null}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                            <button
                                type="button"
                                className={`composer-submit composer-submit-icon composer-submit-dark ${isListening ? 'is-listening' : ''}`}
                                onClick={handlePrimaryComposerAction}
                                disabled={isPlanning || isBuilding}
                                aria-label={prompt.trim() ? (clarification ? copy.createContinue : copy.createSend) : (locale === 'zh-CN' ? '语音输入' : 'Voice input')}
                                title={prompt.trim() ? (clarification ? copy.createContinue : copy.createSend) : (locale === 'zh-CN' ? '语音输入' : 'Voice input')}
                            >
                                {prompt.trim() ? <ArrowUp size={16} /> : <Mic size={16} />}
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
