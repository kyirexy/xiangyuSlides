import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ArrowRightToLine,
    ArrowUp,
    ChevronDown,
    Download,
    Globe,
    Home,
    MonitorPlay,
    Box,
    Wand2
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { buildCopilotStream, getPresentationRecord, getStyles, planCopilot } from '../lib/api';
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

function buildAgentTraceSummary(brief, locale) {
    if (!brief || typeof brief !== 'object') {
        return '';
    }

    const topic = String(brief.topic || '').trim();
    const purpose = String(brief.purpose || '').trim() || 'product';
    const length = String(brief.length || '').trim() || 'medium';
    const visualFamily = String(brief.visualFamily || '').trim() || 'showcase';
    const outputIntent = String(brief.outputIntent || '').trim() || 'showcase';

    if (locale === 'zh-CN') {
        return [
            '已理解当前需求：',
            `1. 类型：${purpose}`,
            `2. 篇幅：${length}`,
            `3. 视觉：${visualFamily}`,
            `4. 输出：${outputIntent}`,
            topic ? `5. 主题：${topic}` : ''
        ].filter(Boolean).join('\n');
    }

    return [
        'Interpreted request:',
        `1. Purpose: ${purpose}`,
        `2. Length: ${length}`,
        `3. Visual: ${visualFamily}`,
        `4. Output: ${outputIntent}`,
        topic ? `5. Topic: ${topic}` : ''
    ].filter(Boolean).join('\n');
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

    async function handleSend() {
        const nextPrompt = prompt.trim();
        if (!nextPrompt) {
            setError(copy.createNeedPrompt);
            return;
        }

        await runCopilot(nextPrompt);
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
                appendLog('system', buildAgentTraceSummary(plan.draftBrief, locale), 'trace');
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
                        ? copy.createBuildAutoStart
                        : copy.createStageEmptyBody);
    const showStageDock = stageMode === 'planning'
        || stageMode === 'building'
        || stageMode === 'loading'
        || stageMode === 'clarify'
        || stageMode === 'error';
    const showStageTrack = stageMode === 'planning'
        || stageMode === 'building'
        || stageMode === 'loading';
    const showStageProgress = stageMode === 'planning'
        || stageMode === 'building'
        || stageMode === 'loading';
    const showPromptPresets = !messages.length
        && !logs.length
        && !draftBrief
        && !clarification
        && !isPlanning
        && !isBuilding
        && !isLoadingExisting
        && !resultRecord;
    const canBrowseStageViews = Boolean(resultRecord);
    const stageDockCards = [
        {
            label: copy.createMetaStyle,
            value: resultRecord?.style?.name || draftBrief?.styleId || copy.createVisualAuto,
            note: currentFamily
        },
        {
            label: copy.createMetaSlides,
            value: String(resultRecord?.outline?.slides?.length || stageScenes.length),
            note: stageStatus
        },
        {
            label: copy.createMetaExport,
            value: resultRecord ? copy.buildStatusReady : copy.createStageOutputWaiting,
            note: resultRecord?.pptxUrl ? copy.createActionPptx : copy.createStageModeSpec
        }
    ];
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
                                    <strong>{stageStatus}</strong>
                                </div>
                                <div className="stage-chips">
                                    <span>{draftBrief?.visualFamily || copy.visualFamilyShowcase}</span>
                                    <span>{draftBrief?.outputIntent || outputIntent || copy.createIntentAuto}</span>
                                    <span>{deckLocale === 'zh-CN' ? copy.zhLabel : copy.enLabel}</span>
                                </div>
                            </div>
                            <div className="stage-workspace">
                                <div className="stage-meta-panel">
                                    <div className="stage-meta-copy">
                                        <span className="stage-kicker">{resultRecord ? copy.createResultLabel : copy.createSubtitle}</span>
                                        <h1>{stagePreviewTitle}</h1>
                                        <p>{error || clarification || (isBuilding ? latestEvent?.message || copy.createBuildWorkspaceBody : stagePreviewBody)}</p>
                                    </div>
                                    <div className="stage-status-grid">
                                        <article className="result-card stage-stat-card">
                                            <span>{copy.createMetaStyle}</span>
                                            <strong>{resultRecord?.style?.name || draftBrief?.styleId || copy.createVisualAuto}</strong>
                                            <p>{resultRecord?.style?.vibe || copy.styleSwitchHint}</p>
                                        </article>
                                        <article className="result-card stage-stat-card">
                                            <span>{copy.createMetaSlides}</span>
                                            <strong>{resultRecord?.outline?.slides?.length || stageScenes.length}</strong>
                                            <p>{copy.createMetaExport}: {resultRecord ? copy.buildStatusReady : stageStatus}</p>
                                        </article>
                                    </div>
                                </div>

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
                                            <div className="presentation-frame-topbar">
                                                <span className="presentation-frame-badge">{resultRecord ? copy.createActionPreview : copy.createStageLabel}</span>
                                                <span className="presentation-frame-route">
                                                    {resultRecord ? buildLocalePath(`/presentations/${presentationId}`, locale) : copy.createBuildWorkspaceBody}
                                                </span>
                                            </div>

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
                                                                        <strong>{stagePreviewTitle}</strong>
                                                                        <p>{stagePrimaryMessage}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {showStageDock ? (
                                                            <div className="presentation-stage-dock">
                                                                {stageDockCards
                                                                    .slice(0, stageMode === 'clarify' ? 2 : 3)
                                                                    .map((item) => (
                                                                        <article className="stage-dock-card" key={`${item.label}_${item.value}`}>
                                                                            <span>{item.label}</span>
                                                                            <strong>{item.value}</strong>
                                                                            <p>{item.note}</p>
                                                                        </article>
                                                                    ))}
                                                            </div>
                                                        ) : null}
                                                        {showStageTrack ? (
                                                            <div className="presentation-stage-track">
                                                                {stageScenes.slice(0, 4).map((item) => (
                                                                    <article className="stage-track-card" key={`track_${item.label}_${item.title}`}>
                                                                        <span>{item.label}</span>
                                                                        <strong>{item.title}</strong>
                                                                    </article>
                                                                ))}
                                                            </div>
                                                        ) : null}
                                                        {showStageProgress ? (
                                                            <div className="presentation-stage-progress">
                                                                <div className="presentation-stage-progress-head">
                                                                    <strong>{copy.createBuildLogTitle}</strong>
                                                                    <span>{buildProgress}%</span>
                                                                </div>
                                                                <div className="stage-progress-bar">
                                                                    <span style={{ width: `${buildProgress}%` }} />
                                                                </div>
                                                            </div>
                                                        ) : null}
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
                                        </div>
                                    ) : null}

                                    {(draftBrief || resultRecord || isPlanning || isBuilding || isLoadingExisting || clarification) ? (
                                        <div className="stage-sequence-rail">
                                            {stageScenes.map((item) => (
                                                <article className="stage-sequence-card" key={`${item.label}_${item.title}`}>
                                                    <span>{item.label}</span>
                                                    <strong>{item.title}</strong>
                                                </article>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>

                                <div className="stage-side-panel">
                                    <div className="result-outline-panel stage-monitor-panel">
                                        <div className="result-outline-head">
                                            <strong>{copy.createStageMonitor}</strong>
                                            <span>{buildProgress}%</span>
                                        </div>
                                        <div className="stage-progress-bar">
                                            <span style={{ width: `${buildProgress}%` }} />
                                        </div>
                                        <div className="stage-monitor-list">
                                            {stageActivity.map((item, index) => (
                                                <article className="stage-monitor-item" key={`monitor_${index}_${item.message}`}>
                                                    <span>{item.progress}%</span>
                                                    <p>{item.message}</p>
                                                </article>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="result-outline-panel stage-summary-panel">
                                        <div className="result-outline-head">
                                            <strong>{copy.createMetaOutline}</strong>
                                            <span>{stageScenes.length}</span>
                                        </div>
                                        <div className="result-outline-list">
                                            {stageScenes.map((item) => (
                                                <article className="story-card compact" key={`summary_${item.label}_${item.title}`}>
                                                    <span>{item.label}</span>
                                                    <strong>{item.title}</strong>
                                                </article>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="result-outline-panel stage-modes-panel">
                                        <div className="result-outline-head">
                                            <strong>{copy.createStageModes}</strong>
                                            <span>4</span>
                                        </div>
                                        <div className="stage-mode-grid">
                                            <span>{copy.createStageModeSlides}</span>
                                            <span>{copy.createStageModeMedia}</span>
                                            <span>{copy.createStageModeSpec}</span>
                                            <span>{copy.createStageModeExports}</span>
                                        </div>
                                    </div>

                                    {resultRecord ? (
                                        <div className="stage-action-panel">
                                            <div className="result-hero-actions stacked">
                                                <button type="button" className="solid-action" onClick={() => { window.location.href = buildLocalePath(`/presentations/${presentationId}`, locale); }}>
                                                    {copy.createActionPreview}
                                                </button>
                                                <button type="button" className="ghost-action" onClick={copyResultLink}>
                                                    {copy.createActionCopy}
                                                </button>
                                                <button type="button" className="ghost-action" onClick={() => { window.location.href = buildLocalePath('/create-classic', locale, { presentationId }); }}>
                                                    {copy.createActionAdvanced}
                                                </button>
                                            </div>
                                            <div className="result-card stage-stat-card">
                                                <span>{copy.createMetaRoute}</span>
                                                <strong>{resultRecord.id}</strong>
                                                <p>{formatDate(resultRecord.updatedAt, locale)}</p>
                                            </div>
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

                <aside className="editor-sidebar">
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
                        {showPromptPresets ? (
                            <section className="sidebar-block">
                                <div className="sidebar-block-head">
                                    <strong>{copy.createPresetTitle}</strong>
                                    <span>{copy.createSidebarHint}</span>
                                </div>
                                <div className="preset-grid compact">
                                    <button type="button" className="preset-tile" onClick={() => setPrompt(copy.homeQuickFinancePrompt)}>{copy.createPresetPitch}</button>
                                    <button type="button" className="preset-tile" onClick={() => setPrompt(copy.homeQuickProductPrompt)}>{copy.createPresetProduct}</button>
                                    <button type="button" className="preset-tile" onClick={() => setPrompt(copy.homeQuickTeachingPrompt)}>{copy.createPresetTeaching}</button>
                                    <button type="button" className="preset-tile" onClick={() => setPrompt(copy.homeQuickShowcasePrompt)}>{copy.createPresetShowcase}</button>
                                </div>
                            </section>
                        ) : null}

                        <section className="sidebar-block log-block">
    <div className="sidebar-block-head">
        <strong>{copy.createLogTitle}</strong>
        <span>{copy.createAgentRailHint}</span>
    </div>
    <div className="log-list" ref={logListRef}>
        {logs.length === 0 ? (
            <article className="log-item assistant agent-message-card">
                <div className="log-item-meta">
                    <span>AI</span>
                    <time>{locale === 'zh-CN' ? '等待中' : 'Waiting'}</time>
                </div>
                <p>{copy.createChatEmpty}</p>
            </article>
        ) : logs.map((entry) => (
            <article
                className={`log-item agent-message-card ${
                    entry.role === 'user'
                        ? 'user'
                        : entry.tone === 'error'
                            ? 'error'
                            : entry.tone === 'trace' || entry.tone === 'system' || entry.tone === 'success'
                                ? 'trace'
                                : 'assistant'
                }`}
                key={entry.id}
            >
                <div className="log-item-meta">
                    <span>{getLogRoleLabel(entry, locale)}</span>
                    <time>{formatDate(entry.createdAt, locale)}</time>
                </div>
                <p>{entry.content}</p>
            </article>
        ))}
    </div>
</section>

                        {resultRecord ? (
                            <section className="sidebar-block result-chat-card">
                                <div className="sidebar-block-head">
                                    <strong>{copy.createResultLabel}</strong>
                                    <span>{formatDate(resultRecord.updatedAt, locale)}</span>
                                </div>
                                <p className="agent-status-copy">{copy.createResultTitle}</p>
                                <div className="build-ready-tags">
                                    <span>{resultRecord.style?.name || copy.createVisualAuto}</span>
                                    <span>{resultRecord.outline?.slides?.length || stageScenes.length} {copy.createMetaSlides}</span>
                                    <span>{resultRecord.id}</span>
                                </div>
                                <div className="result-action-grid">
                                    <button type="button" className="ghost-action" onClick={() => { window.location.href = buildLocalePath(`/presentations/${presentationId}`, locale); }}>
                                        {copy.createActionPreview}
                                    </button>
                                    <button type="button" className="ghost-action" onClick={copyResultLink}>
                                        {copy.createActionCopy}
                                    </button>
                                    <button type="button" className="ghost-action" onClick={() => { window.location.href = `/api/presentations/${presentationId}/html`; }}>
                                        {copy.createActionOpenHtml}
                                    </button>
                                    <button type="button" className="ghost-action" onClick={() => { window.location.href = resultRecord?.pptxUrl || '#'; }}>
                                        {copy.createActionPptx}
                                    </button>
                                </div>
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
                            </section>
                        ) : null}
                    </div>

                    <div className="sidebar-composer">
                        <textarea
                            value={prompt}
                            onChange={(event) => setPrompt(event.target.value)}
                            placeholder={clarification || copy.createPromptPlaceholder}
                            disabled={isPlanning || isBuilding}
                        />
                        <div className="sidebar-composer-footer">
                            <div className="composer-tools">
                                <span className="composer-status-pill">{deckLocale === 'zh-CN' ? copy.zhLabel : copy.enLabel}</span>
                                <span className="composer-status-pill subtle">{draftBrief?.visualFamily || copy.visualFamilyShowcase}</span>
                                <span className="composer-status-pill subtle">{stageStatus}</span>
                            </div>
                            <button
                                type="button"
                                className="composer-submit composer-submit-icon"
                                onClick={handleSend}
                                disabled={!prompt.trim() || isPlanning || isBuilding}
                                aria-label={clarification ? copy.createContinue : copy.createSend}
                                title={clarification ? copy.createContinue : copy.createSend}
                            >
                                <ArrowUp size={16} />
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

