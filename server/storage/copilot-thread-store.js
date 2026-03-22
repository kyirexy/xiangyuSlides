const crypto = require('crypto');
const path = require('path');
const { createMemoryCollection } = require('./memory-json-store');
const { readJsonFile, writeJsonFile } = require('./file-json-store');

const THREAD_ID_PATTERN = /^thread_[a-zA-Z0-9_-]{6,128}$/;

function asString(value, fallback = '') {
    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value);
}

function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function createThreadId() {
    return `thread_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;
}

function normalizeMessages(messages) {
    if (!Array.isArray(messages)) {
        return [];
    }

    return messages
        .map((item) => ({
            role: item?.role === 'assistant' ? 'assistant' : 'user',
            content: asString(item?.content, '').trim()
        }))
        .filter((item) => item.content);
}

function normalizeArtifacts(artifacts) {
    if (!Array.isArray(artifacts)) {
        return [];
    }

    return artifacts
        .map((item) => ({
            type: asString(item?.type, '').trim(),
            label: asString(item?.label, '').trim(),
            url: asString(item?.url, '').trim(),
            presentationId: asString(item?.presentationId, '').trim(),
            taskId: asString(item?.taskId, '').trim(),
            status: asString(item?.status, '').trim(),
            providerTaskId: asString(item?.providerTaskId, '').trim()
        }))
        .filter((item) => item.type || item.url || item.presentationId || item.taskId);
}

function normalizeAgentSteps(agentSteps) {
    if (!Array.isArray(agentSteps)) {
        return [];
    }

    return agentSteps
        .map((item) => ({
            eventType: asString(item?.eventType, '').trim(),
            stepLabel: asString(item?.stepLabel, '').trim(),
            message: asString(item?.message, '').trim(),
            status: asString(item?.status, '').trim() || 'info',
            artifact: item?.artifact && typeof item.artifact === 'object'
                ? {
                    type: asString(item.artifact.type, '').trim(),
                    label: asString(item.artifact.label, '').trim(),
                    url: asString(item.artifact.url, '').trim(),
                    presentationId: asString(item.artifact.presentationId, '').trim(),
                    taskId: asString(item.artifact.taskId, '').trim(),
                    status: asString(item.artifact.status, '').trim(),
                    providerTaskId: asString(item.artifact.providerTaskId, '').trim()
                }
                : null
        }))
        .filter((item) => item.eventType || item.stepLabel || item.message);
}

function normalizeReasoningMode(mode, fallback = 'thinking') {
    const normalized = asString(mode, fallback).trim().toLowerCase();
    return normalized === 'fast' ? 'fast' : 'thinking';
}

function normalizeUiRunState(uiRunState) {
    if (!isPlainObject(uiRunState)) {
        return {
            runId: '',
            lastEventType: '',
            lastSnapshotAt: ''
        };
    }

    return {
        runId: asString(uiRunState.runId, '').trim(),
        lastEventType: asString(uiRunState.lastEventType, '').trim(),
        lastSnapshotAt: asString(uiRunState.lastSnapshotAt, '').trim()
    };
}

function mergeThread(existing, incoming) {
    const previous = isPlainObject(existing) ? existing : {};
    const next = isPlainObject(incoming) ? incoming : {};
    const now = new Date().toISOString();

    return {
        id: asString(next.id || previous.id, createThreadId()),
        createdAt: asString(previous.createdAt, now),
        updatedAt: now,
        locale: asString(next.locale || previous.locale, 'zh-CN'),
        uiLocale: asString(next.uiLocale || previous.uiLocale, 'zh-CN'),
        status: asString(next.status || previous.status, 'idle'),
        messages: normalizeMessages(next.messages ?? previous.messages),
        clarificationCount: Number.isFinite(Number(next.clarificationCount))
            ? Number(next.clarificationCount)
            : Number(previous.clarificationCount) || 0,
        draftBrief: isPlainObject(next.draftBrief) ? next.draftBrief : (previous.draftBrief || null),
        lastAssistantMessage: asString(next.lastAssistantMessage || previous.lastAssistantMessage, ''),
        clarification: asString(next.clarification || previous.clarification, ''),
        presentationId: asString(next.presentationId || previous.presentationId, ''),
        activePresentationId: asString(
            next.activePresentationId
            || next.presentationId
            || previous.activePresentationId
            || previous.presentationId,
            ''
        ),
        lastBuildArtifacts: normalizeArtifacts(next.lastBuildArtifacts ?? previous.lastBuildArtifacts),
        editIntent: isPlainObject(next.editIntent) ? next.editIntent : (isPlainObject(previous.editIntent) ? previous.editIntent : null),
        pendingAction: asString(next.pendingAction || previous.pendingAction, ''),
        agentSteps: normalizeAgentSteps(next.agentSteps ?? previous.agentSteps),
        reasoningMode: normalizeReasoningMode(next.reasoningMode ?? previous.reasoningMode),
        webSearchEnabled: Boolean(next.webSearchEnabled ?? previous.webSearchEnabled),
        selectedModelId: asString(next.selectedModelId || previous.selectedModelId, '').trim(),
        uiRunState: normalizeUiRunState(next.uiRunState ?? previous.uiRunState),
        meta: {
            ...(isPlainObject(previous.meta) ? previous.meta : {}),
            ...(isPlainObject(next.meta) ? next.meta : {})
        }
    };
}

function createCopilotThreadStore({ config }) {
    const memoryStore = createMemoryCollection();

    function isValidId(threadId) {
        return THREAD_ID_PATTERN.test(asString(threadId, ''));
    }

    function getFilePath(threadId) {
        return path.join(config.THREADS_DIR, `${threadId}.json`);
    }

    function getById(threadId) {
        if (!isValidId(threadId)) {
            return null;
        }

        if (config.isVercel) {
            return memoryStore.get(threadId) || null;
        }

        return readJsonFile(getFilePath(threadId), null);
    }

    function save(threadInput) {
        const nextId = isValidId(threadInput?.id) ? threadInput.id : createThreadId();
        const existing = getById(nextId);
        const normalized = mergeThread(existing, {
            ...threadInput,
            id: nextId
        });

        if (config.isVercel) {
            memoryStore.set(nextId, normalized);
            return normalized;
        }

        writeJsonFile(getFilePath(nextId), normalized);
        return normalized;
    }

    return {
        createThreadId,
        getById,
        isValidId,
        save
    };
}

module.exports = {
    createCopilotThreadStore
};
