import {
    buildCopilotStream,
    getCopilotThread,
    getPresentationRecord,
    planCopilot,
    streamCopilotAgui
} from './api';
import { buildLocalePath } from './locale';
import { pushRecentPresentation } from './storage';
import { createXiangyuAgentStateManager } from './xiangyu-agent-state-manager';

function createId(prefix = 'item') {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(16).slice(2, 8)}`;
}

function uniqueByMessage(events) {
    const seen = new Set();
    return (Array.isArray(events) ? events : []).filter((item) => {
        const key = `${item?.step}:${item?.progress}:${item?.message}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function createLogEntry(role, content, tone = 'default', extra = {}) {
    return {
        id: createId('log'),
        role,
        content,
        tone,
        createdAt: new Date().toISOString(),
        ...extra
    };
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

function toneFromEventType(eventType, status = '') {
    const normalizedType = String(eventType || '').trim().toLowerCase();
    const normalizedStatus = String(status || '').trim().toLowerCase();

    if (normalizedStatus === 'failed' || normalizedStatus === 'error' || normalizedType.includes('failed')) {
        return 'error';
    }

    if (
        normalizedType === 'intent_parsed'
        || normalizedType === 'brief_locked'
        || normalizedType === 'clarification_requested'
        || normalizedType === 'needs_input'
        || normalizedType === 'brief_updated'
    ) {
        return 'reasoning';
    }

    if (normalizedType.startsWith('media_task_')) {
        return normalizedType.endsWith('ready') ? 'result' : 'tool';
    }

    if (
        normalizedType === 'presentation_ready'
        || normalizedType === 'build_ready'
        || normalizedType === 'result_ready'
    ) {
        return 'result';
    }

    return 'execution';
}

function buildStepLogFromEventShape({
    id,
    message,
    eventType,
    stepLabel,
    status,
    artifact,
    createdAt,
    runId
}) {
    return {
        id: id || createId('step'),
        role: 'system',
        tone: toneFromEventType(eventType, status),
        content: String(message || '').trim(),
        createdAt: createdAt || new Date().toISOString(),
        eventType: String(eventType || '').trim(),
        stepLabel: String(stepLabel || '').trim(),
        stepStatus: String(status || '').trim(),
        artifact: artifact || null,
        runId: runId || ''
    };
}

function buildAguiStepLog(event) {
    const payload = event?.payload || {};
    return buildStepLogFromEventShape({
        id: String(payload.stepId || event.type || createId('agui_step')),
        message: payload.message,
        eventType: payload.eventType || event.type,
        stepLabel: payload.title,
        status: payload.status || (event.type === 'STEP_STARTED' ? 'running' : ''),
        artifact: payload.artifact || null,
        createdAt: event.timestamp || new Date().toISOString(),
        runId: event.runId || ''
    });
}

function buildBuildLogFromEvent(event) {
    return buildStepLogFromEventShape({
        id: `${event?.eventType || 'build'}_${event?.presentationId || 'none'}_${event?.progress || 0}_${event?.step || 0}`,
        message: event?.message,
        eventType: event?.eventType || 'build_event',
        stepLabel: event?.stepLabel || '',
        status: event?.status || '',
        artifact: event?.artifact || null,
        createdAt: new Date().toISOString(),
        runId: event?.runId || ''
    });
}

function buildLogsFromThread(thread) {
    const logs = [];
    const threadUpdatedAt = thread?.updatedAt || new Date().toISOString();

    for (const message of Array.isArray(thread?.messages) ? thread.messages : []) {
        logs.push({
            id: createId(message.role === 'assistant' ? 'assistant' : 'user'),
            role: message.role === 'assistant' ? 'assistant' : 'user',
            tone: message.role === 'assistant' ? 'assistant' : 'user',
            content: String(message.content || '').trim(),
            createdAt: threadUpdatedAt,
            runId: thread?.uiRunState?.runId || ''
        });
    }

    for (const step of Array.isArray(thread?.agentSteps) ? thread.agentSteps : []) {
        logs.push(buildStepLogFromEventShape({
            id: createId('thread_step'),
            message: step.message,
            eventType: step.eventType,
            stepLabel: step.stepLabel,
            status: step.status,
            artifact: step.artifact || null,
            createdAt: threadUpdatedAt,
            runId: thread?.uiRunState?.runId || ''
        }));
    }

    return logs;
}

function buildMediaTaskLog(task, createdAt = new Date().toISOString()) {
    const status = String(task?.status || '').trim() || 'queued';
    const label = String(task?.label || task?.kind || task?.type || 'media').trim();
    const locale = String(task?.locale || 'zh-CN').trim();
    const message = task?.statusMessage
        || (locale === 'zh-CN'
            ? `${label} 当前状态：${status}。`
            : `${label} is now ${status}.`);

    return buildStepLogFromEventShape({
        id: `media_${task?.id || createId('task')}_${status}`,
        message,
        eventType: `media_task_${status}`,
        stepLabel: label,
        status,
        artifact: {
            type: task?.kind || 'media',
            label,
            url: task?.url || '',
            presentationId: task?.presentationId || '',
            taskId: task?.id || '',
            status,
            providerTaskId: task?.providerTaskId || ''
        },
        createdAt
    });
}

function mergeUniqueLogs(current, incoming) {
    const existingKeys = new Set(
        (Array.isArray(current) ? current : []).map((entry) => (
            `${entry.role}|${entry.tone}|${entry.eventType || ''}|${entry.stepLabel || ''}|${entry.content || ''}|${entry.artifact?.taskId || ''}|${entry.artifact?.status || ''}`
        ))
    );

    const additions = [];
    for (const entry of Array.isArray(incoming) ? incoming : []) {
        const key = `${entry.role}|${entry.tone}|${entry.eventType || ''}|${entry.stepLabel || ''}|${entry.content || ''}|${entry.artifact?.taskId || ''}|${entry.artifact?.status || ''}`;
        if (existingKeys.has(key)) {
            continue;
        }
        existingKeys.add(key);
        additions.push(entry);
    }

    return [...(Array.isArray(current) ? current : []), ...additions];
}

function shouldPollThread(thread) {
    return Array.isArray(thread?.mediaTaskSummary)
        && thread.mediaTaskSummary.some((task) => ['queued', 'running'].includes(String(task?.status || '').trim().toLowerCase()));
}

function createInitialState() {
    return {
        messages: [],
        logs: [],
        draftBrief: null,
        threadId: '',
        presentationId: '',
        clarification: '',
        isPlanning: false,
        isBuilding: false,
        isLoadingExisting: false,
        buildEvents: [],
        resultRecord: null,
        error: '',
        contextSummary: '',
        mediaTaskSummary: [],
        lastBuildArtifacts: [],
        pendingAction: '',
        reasoningMode: 'thinking',
        webSearchEnabled: false,
        selectedModelId: 'balanced',
        uiRunState: null,
        currentRunId: ''
    };
}

export function createXiangyuRuntimeAgent() {
    const listeners = new Set();
    const stateManager = createXiangyuAgentStateManager();
    let state = createInitialState();
    let pollTimer = null;
    const mediaStatusMap = new Map();

    function notify() {
        const snapshot = getState();
        listeners.forEach((listener) => listener(snapshot));
    }

    function getState() {
        return JSON.parse(JSON.stringify(state));
    }

    function setState(patch) {
        state = typeof patch === 'function' ? patch(state) : { ...state, ...patch };
        notify();
        return state;
    }

    function updateRunState(threadId, runId, patch = {}) {
        if (!threadId || !runId) {
            return;
        }
        stateManager.saveState(threadId, runId, {
            ...state,
            ...patch
        });
    }

    function subscribe(listener) {
        listeners.add(listener);
        listener(getState());
        return () => {
            listeners.delete(listener);
            if (!listeners.size) {
                stopThreadPolling();
            }
        };
    }

    function stopThreadPolling() {
        if (pollTimer) {
            clearTimeout(pollTimer);
            pollTimer = null;
        }
    }

    function scheduleThreadPolling(threadId, locale = 'zh-CN') {
        stopThreadPolling();
        if (!threadId) {
            return;
        }

        pollTimer = setTimeout(async () => {
            try {
                await refreshThread(threadId, { locale, silent: true });
            } catch {}
        }, 3500);
    }

    function appendLog(role, content, tone = 'default', extra = {}) {
        const entry = createLogEntry(role, content, tone, extra);
        setState((current) => ({
            ...current,
            logs: [...current.logs, entry]
        }));
        return entry;
    }

    async function hydrateResultRecord(presentationId) {
        if (!presentationId) {
            return null;
        }
        const record = await getPresentationRecord(presentationId);
        setState((current) => ({
            ...current,
            presentationId,
            resultRecord: record
        }));
        return record;
    }

    async function refreshThread(threadId, { locale = 'zh-CN', silent = false } = {}) {
        if (!threadId) {
            return null;
        }

        const thread = await getCopilotThread(threadId);
        const nextMediaSummary = Array.isArray(thread?.mediaTaskSummary) ? thread.mediaTaskSummary : [];
        const nextLogs = [];

        for (const task of nextMediaSummary) {
            const taskId = String(task?.id || '').trim();
            if (!taskId) {
                continue;
            }
            const previousStatus = mediaStatusMap.get(taskId);
            const nextStatus = String(task?.status || '').trim();
            if (previousStatus !== nextStatus) {
                mediaStatusMap.set(taskId, nextStatus);
                nextLogs.push(buildMediaTaskLog({ ...task, locale }));
            }
        }

        setState((current) => ({
            ...current,
            threadId,
            presentationId: thread?.activePresentationId || thread?.presentationId || current.presentationId,
            draftBrief: thread?.draftBrief || current.draftBrief,
            clarification: thread?.clarification || current.clarification,
            contextSummary: thread?.contextSummary || current.contextSummary,
            mediaTaskSummary: nextMediaSummary,
            lastBuildArtifacts: Array.isArray(thread?.lastBuildArtifacts) ? thread.lastBuildArtifacts : current.lastBuildArtifacts,
            pendingAction: thread?.pendingAction || current.pendingAction,
            reasoningMode: thread?.reasoningMode || current.reasoningMode,
            webSearchEnabled: Boolean(thread?.webSearchEnabled ?? current.webSearchEnabled),
            selectedModelId: thread?.selectedModelId || current.selectedModelId,
            uiRunState: thread?.uiRunState || current.uiRunState,
            logs: nextLogs.length ? mergeUniqueLogs(current.logs, nextLogs) : current.logs
        }));

        if (shouldPollThread(thread)) {
            scheduleThreadPolling(threadId, locale);
        } else {
            stopThreadPolling();
        }

        return thread;
    }

    function persistRecentPresentation({ record, presentationId, draftBrief, locale, threadId }) {
        if (!record || !presentationId) {
            return;
        }

        pushRecentPresentation({
            id: presentationId,
            title: record.title || draftBrief?.topic || '',
            styleName: record.style?.name || '',
            previewUrl: `/presentations/${presentationId}`,
            workspaceUrl: buildLocalePath('/create', locale, {
                presentationId,
                threadId: threadId || ''
            }),
            threadId: threadId || '',
            updatedAt: record.updatedAt || new Date().toISOString()
        });
    }

    async function loadPresentation(presentationId, { copy, deckLocale, outputIntent } = {}) {
        if (!presentationId) {
            return null;
        }

        setState((current) => ({
            ...current,
            isLoadingExisting: true,
            error: '',
            presentationId
        }));
        appendLog('system', copy?.createLoadExistingStart?.replace('{id}', presentationId) || presentationId, 'system');

        try {
            const record = await getPresentationRecord(presentationId);
            setState((current) => ({
                ...current,
                isLoadingExisting: false,
                presentationId,
                resultRecord: record,
                draftBrief: current.draftBrief || {
                    topic: record.title || record.outline?.title || '',
                    locale: deckLocale || 'zh-CN',
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
                }
            }));
            appendLog('system', copy?.createLoadExistingDone?.replace('{title}', record.title || presentationId) || presentationId, 'success');
            return record;
        } catch (error) {
            const message = error?.message || String(error);
            setState((current) => ({
                ...current,
                isLoadingExisting: false,
                error: message
            }));
            appendLog('system', copy?.createLoadExistingFailed?.replace('{message}', message) || message, 'error');
            throw error;
        }
    }

    async function buildDraft(brief, options = {}) {
        const {
            locale = 'zh-CN',
            threadId = state.threadId,
            reasoningMode = state.reasoningMode,
            webSearchEnabled = state.webSearchEnabled,
            selectedModelId = state.selectedModelId,
            recentLocale = locale,
            buildWorkspaceMessage = ''
        } = options;

        const runId = createId('build_run');
        stateManager.startRun(threadId || 'pending', runId, state);
        setState((current) => ({
            ...current,
            draftBrief: brief || current.draftBrief,
            threadId: threadId || current.threadId,
            isBuilding: true,
            isPlanning: false,
            clarification: '',
            error: '',
            buildEvents: [],
            currentRunId: runId,
            uiRunState: {
                runId,
                lastEventType: 'BUILD_STARTED',
                lastSnapshotAt: new Date().toISOString()
            },
            reasoningMode,
            webSearchEnabled,
            selectedModelId
        }));

        try {
            await buildCopilotStream({
                draftBrief: brief,
                locale,
                threadId: threadId || '',
                reasoningMode,
                webSearchEnabled,
                selectedModelId
            }, async (event) => {
                const nextThreadId = event.threadId || state.threadId || '';
                if (nextThreadId && nextThreadId !== state.threadId) {
                    setState((current) => ({
                        ...current,
                        threadId: nextThreadId
                    }));
                }

                const buildLog = {
                    ...buildBuildLogFromEvent(event),
                    runId
                };
                setState((current) => ({
                    ...current,
                    threadId: nextThreadId || current.threadId,
                    presentationId: event.presentationId || current.presentationId,
                    buildEvents: uniqueByMessage([...current.buildEvents, event]),
                    logs: event.message ? mergeLogEntry(current.logs, buildLog) : current.logs,
                    error: event.status === 'failed' ? (event.error || event.message || current.error) : current.error
                }));
                updateRunState(nextThreadId || 'pending', runId, {
                    uiRunState: {
                        runId,
                        lastEventType: event.eventType || event.status || '',
                        lastSnapshotAt: new Date().toISOString()
                    }
                });

                if (event.status === 'ready' && event.presentationId) {
                    const record = await hydrateResultRecord(event.presentationId);
                    let threadSnapshot = null;
                    if (nextThreadId) {
                        try {
                            threadSnapshot = await getCopilotThread(nextThreadId);
                        } catch {}
                    }

                    setState((current) => ({
                        ...current,
                        draftBrief: current.draftBrief || brief,
                        lastBuildArtifacts: Array.isArray(threadSnapshot?.lastBuildArtifacts)
                            ? threadSnapshot.lastBuildArtifacts
                            : current.lastBuildArtifacts,
                        mediaTaskSummary: Array.isArray(threadSnapshot?.mediaTaskSummary)
                            ? threadSnapshot.mediaTaskSummary
                            : current.mediaTaskSummary,
                        pendingAction: threadSnapshot?.pendingAction || current.pendingAction,
                        contextSummary: threadSnapshot?.contextSummary || current.contextSummary
                    }));

                    persistRecentPresentation({
                        record,
                        presentationId: event.presentationId,
                        draftBrief: brief,
                        locale: recentLocale,
                        threadId: nextThreadId || state.threadId
                    });

                    if (nextThreadId) {
                        scheduleThreadPolling(nextThreadId, recentLocale);
                    }
                }
            });
        } finally {
            setState((current) => ({
                ...current,
                isBuilding: false
            }));
        }
    }

    async function restoreThread(threadId, options = {}) {
        if (!threadId) {
            return null;
        }

        const {
            locale = 'zh-CN',
            fallbackPresentationId = '',
            copy
        } = options;

        setState((current) => ({
            ...current,
            isLoadingExisting: true,
            error: ''
        }));

        try {
            const thread = await getCopilotThread(threadId);
            const resolvedRunId = thread?.uiRunState?.runId || createId('restored_run');
            const restoredLogs = buildLogsFromThread(thread);
            const resolvedPresentationId = thread?.activePresentationId || thread?.presentationId || fallbackPresentationId || '';

            stateManager.startRun(threadId, resolvedRunId, {
                ...state,
                threadId,
                messages: Array.isArray(thread?.messages) ? thread.messages : [],
                logs: restoredLogs,
                draftBrief: thread?.draftBrief || null,
                presentationId: resolvedPresentationId,
                clarification: thread?.clarification || '',
                contextSummary: thread?.contextSummary || '',
                mediaTaskSummary: Array.isArray(thread?.mediaTaskSummary) ? thread.mediaTaskSummary : [],
                lastBuildArtifacts: Array.isArray(thread?.lastBuildArtifacts) ? thread.lastBuildArtifacts : [],
                pendingAction: thread?.pendingAction || '',
                reasoningMode: thread?.reasoningMode || 'thinking',
                webSearchEnabled: Boolean(thread?.webSearchEnabled),
                selectedModelId: thread?.selectedModelId || 'balanced',
                uiRunState: thread?.uiRunState || null,
                currentRunId: resolvedRunId
            });

            setState((current) => ({
                ...current,
                threadId,
                messages: Array.isArray(thread?.messages) ? thread.messages : [],
                logs: restoredLogs,
                draftBrief: thread?.draftBrief || null,
                presentationId: resolvedPresentationId,
                clarification: thread?.clarification || '',
                isPlanning: false,
                isBuilding: false,
                isLoadingExisting: false,
                contextSummary: thread?.contextSummary || '',
                mediaTaskSummary: Array.isArray(thread?.mediaTaskSummary) ? thread.mediaTaskSummary : [],
                lastBuildArtifacts: Array.isArray(thread?.lastBuildArtifacts) ? thread.lastBuildArtifacts : [],
                pendingAction: thread?.pendingAction || '',
                reasoningMode: thread?.reasoningMode || current.reasoningMode,
                webSearchEnabled: Boolean(thread?.webSearchEnabled),
                selectedModelId: thread?.selectedModelId || current.selectedModelId,
                uiRunState: thread?.uiRunState || null,
                currentRunId: resolvedRunId,
                error: ''
            }));

            if (resolvedPresentationId) {
                const record = await hydrateResultRecord(resolvedPresentationId);
                persistRecentPresentation({
                    record,
                    presentationId: resolvedPresentationId,
                    draftBrief: thread?.draftBrief || null,
                    locale,
                    threadId
                });
            }

            if (shouldPollThread(thread)) {
                scheduleThreadPolling(threadId, locale);
            } else {
                stopThreadPolling();
            }

            return thread;
        } catch (error) {
            const message = error?.message || String(error);
            setState((current) => ({
                ...current,
                isLoadingExisting: false,
                error: message
            }));
            appendLog('system', copy?.createLoadExistingFailed?.replace('{message}', message) || message, 'error');
            throw error;
        }
    }

    async function sendMessage(prompt, options = {}) {
        const {
            locale = 'zh-CN',
            uiLocale = locale,
            outputIntent = '',
            visualPreference = '',
            allowClarification = true,
            reasoningMode = state.reasoningMode,
            webSearchEnabled = state.webSearchEnabled,
            selectedModelId = state.selectedModelId,
            buildAutoStartMessage = '',
            buildWorkspaceMessage = ''
        } = options;

        const userMessage = { role: 'user', content: prompt };
        const nextMessages = [...state.messages, userMessage];
        const runId = createId('plan_run');

        stateManager.startRun(state.threadId || 'pending', runId, state);
        setState((current) => ({
            ...current,
            messages: nextMessages,
            logs: [...current.logs, createLogEntry('user', prompt, 'user', { runId })],
            isPlanning: true,
            isBuilding: false,
            clarification: '',
            error: '',
            buildEvents: [],
            currentRunId: runId,
            uiRunState: {
                runId,
                lastEventType: 'RUN_STARTED',
                lastSnapshotAt: new Date().toISOString()
            },
            reasoningMode,
            webSearchEnabled,
            selectedModelId
        }));

        let aguiCompleted = false;

        try {
            try {
                await streamCopilotAgui({
                    messages: nextMessages,
                    locale,
                    uiLocale,
                    outputIntent,
                    visualPreference,
                    allowClarification,
                    threadId: state.threadId,
                    reasoningMode,
                    webSearchEnabled,
                    selectedModelId
                }, async (event) => {
                    const nextThreadId = event.threadId || state.threadId || '';
                    if (nextThreadId && nextThreadId !== state.threadId) {
                        setState((current) => ({
                            ...current,
                            threadId: nextThreadId
                        }));
                    }

                    if (event.type === 'RUN_STARTED') {
                        updateRunState(nextThreadId || 'pending', runId, {
                            uiRunState: {
                                runId,
                                lastEventType: 'RUN_STARTED',
                                lastSnapshotAt: new Date().toISOString()
                            }
                        });
                        return;
                    }

                    if (event.type === 'STATE_SNAPSHOT' || event.type === 'STATE_DELTA') {
                        const payload = event.payload || {};
                        setState((current) => ({
                            ...current,
                            threadId: nextThreadId || current.threadId,
                            draftBrief: payload.draftBrief || current.draftBrief,
                            clarification: typeof payload.clarification === 'string' ? payload.clarification : current.clarification,
                            presentationId: payload.activePresentationId || current.presentationId,
                            reasoningMode: payload.reasoningMode || current.reasoningMode,
                            webSearchEnabled: typeof payload.webSearchEnabled === 'boolean' ? payload.webSearchEnabled : current.webSearchEnabled,
                            selectedModelId: typeof payload.selectedModelId === 'string' && payload.selectedModelId.trim()
                                ? payload.selectedModelId
                                : current.selectedModelId,
                            contextSummary: typeof payload.contextSummary === 'string' ? payload.contextSummary : current.contextSummary,
                            mediaTaskSummary: Array.isArray(payload.mediaTaskSummary) ? payload.mediaTaskSummary : current.mediaTaskSummary,
                            lastBuildArtifacts: Array.isArray(payload.lastBuildArtifacts) ? payload.lastBuildArtifacts : current.lastBuildArtifacts,
                            pendingAction: typeof payload.pendingAction === 'string' ? payload.pendingAction : current.pendingAction,
                            uiRunState: {
                                runId,
                                lastEventType: event.type,
                                lastSnapshotAt: new Date().toISOString()
                            }
                        }));
                        return;
                    }

                    if (event.type === 'TEXT_MESSAGE_START') {
                        const messageId = String(event.payload?.messageId || createId('assistant'));
                        stateManager.associateMessage(nextThreadId || 'pending', runId, messageId);
                        setState((current) => ({
                            ...current,
                            logs: mergeLogEntry(current.logs, {
                                id: messageId,
                                role: 'assistant',
                                tone: 'assistant',
                                content: '',
                                createdAt: event.timestamp || new Date().toISOString(),
                                runId
                            }),
                            isPlanning: false
                        }));
                        return;
                    }

                    if (event.type === 'TEXT_MESSAGE_CONTENT') {
                        const messageId = String(event.payload?.messageId || '').trim();
                        const delta = String(event.payload?.delta || '');
                        if (!messageId) {
                            return;
                        }
                        setState((current) => ({
                            ...current,
                            logs: current.logs.map((item) => (
                                item.id === messageId
                                    ? { ...item, content: `${item.content || ''}${delta}` }
                                    : item
                            ))
                        }));
                        return;
                    }

                    if (event.type === 'TEXT_MESSAGE_END') {
                        const finalContent = String(event.payload?.content || '').trim();
                        const messageId = String(event.payload?.messageId || '').trim();
                        if (messageId) {
                            stateManager.associateMessage(nextThreadId || 'pending', runId, messageId);
                        }
                        if (finalContent) {
                            setState((current) => ({
                                ...current,
                                messages: [...current.messages, { role: 'assistant', content: finalContent }]
                            }));
                        }
                        return;
                    }

                    if (
                        event.type === 'STEP_STARTED'
                        || event.type === 'STEP_FINISHED'
                        || event.type === 'TOOL_CALL_START'
                        || event.type === 'TOOL_CALL_END'
                    ) {
                        const nextLog = {
                            ...buildAguiStepLog(event),
                            runId
                        };
                        setState((current) => ({
                            ...current,
                            logs: mergeLogEntry(current.logs, nextLog),
                            isPlanning: nextLog.tone === 'reasoning',
                            isBuilding: nextLog.tone === 'execution' || nextLog.tone === 'tool' || nextLog.tone === 'result'
                        }));
                        return;
                    }

                    if (event.type === 'RUN_ERROR') {
                        const message = String(event.payload?.message || 'Build failed');
                        setState((current) => ({
                            ...current,
                            isPlanning: false,
                            isBuilding: false,
                            error: message,
                            logs: mergeLogEntry(current.logs, createLogEntry('system', message, 'error'))
                        }));
                        return;
                    }

                    if (event.type === 'RUN_FINISHED') {
                        aguiCompleted = true;
                        const payload = event.payload || {};
                        setState((current) => ({
                            ...current,
                            isPlanning: false,
                            isBuilding: false,
                            draftBrief: payload.draftBrief || current.draftBrief,
                            clarification: payload.status === 'clarifying'
                                ? String(payload.clarification || '')
                                : '',
                            contextSummary: typeof payload.contextSummary === 'string' ? payload.contextSummary : current.contextSummary,
                            pendingAction: typeof payload.pendingAction === 'string' ? payload.pendingAction : current.pendingAction,
                            presentationId: String(payload.presentationId || event.presentationId || current.presentationId || '').trim(),
                            lastBuildArtifacts: Array.isArray(payload.lastBuildArtifacts) ? payload.lastBuildArtifacts : current.lastBuildArtifacts,
                            mediaTaskSummary: Array.isArray(payload.mediaTaskSummary) ? payload.mediaTaskSummary : current.mediaTaskSummary
                        }));

                        if (payload.status === 'clarifying') {
                            return;
                        }

                        const finalPresentationId = String(payload.presentationId || event.presentationId || '').trim();
                        if (!finalPresentationId) {
                            return;
                        }

                        const record = await hydrateResultRecord(finalPresentationId);
                        persistRecentPresentation({
                            record,
                            presentationId: finalPresentationId,
                            draftBrief: payload.draftBrief || state.draftBrief,
                            locale: uiLocale,
                            threadId: nextThreadId || state.threadId
                        });

                        if (nextThreadId) {
                            scheduleThreadPolling(nextThreadId, uiLocale);
                        }
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
                locale,
                uiLocale,
                outputIntent,
                visualPreference,
                allowClarification,
                threadId: state.threadId,
                reasoningMode,
                webSearchEnabled,
                selectedModelId
            });

            setState((current) => ({
                ...current,
                threadId: plan.threadId || current.threadId,
                draftBrief: plan.draftBrief || null,
                isPlanning: false,
                clarification: plan.readyToBuild === false ? (plan.clarification || plan.assistantMessage || '') : '',
                contextSummary: typeof plan.contextSummary === 'string' ? plan.contextSummary : current.contextSummary
            }));

            if (plan.assistantMessage) {
                setState((current) => ({
                    ...current,
                    logs: [...current.logs, createLogEntry('assistant', plan.assistantMessage, 'assistant', { runId })],
                    messages: [...current.messages, { role: 'assistant', content: plan.assistantMessage }]
                }));
            }

            if (plan.readyToBuild === false) {
                return;
            }

            await buildDraft(plan.draftBrief || null, {
                locale,
                threadId: plan.threadId || state.threadId,
                reasoningMode,
                webSearchEnabled,
                selectedModelId,
                recentLocale: uiLocale,
                buildWorkspaceMessage
            });
        } catch (error) {
            const message = error?.message || String(error);
            setState((current) => ({
                ...current,
                isPlanning: false,
                error: message,
                logs: [...current.logs, createLogEntry('system', message, 'error')]
            }));
            throw error;
        }
    }

    return {
        subscribe,
        getState,
        appendLog,
        loadPresentation,
        refreshThread,
        buildDraft,
        restoreThread,
        sendMessage
    };
}
