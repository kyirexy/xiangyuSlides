function deepClone(value) {
    return JSON.parse(JSON.stringify(value ?? null));
}

export function createXiangyuAgentStateManager() {
    const threadStates = new Map();
    const messageToRun = new Map();

    function ensureThread(threadId) {
        const key = String(threadId || '').trim();
        if (!key) {
            return null;
        }

        if (!threadStates.has(key)) {
            threadStates.set(key, {
                latestRunId: '',
                runs: new Map()
            });
        }

        if (!messageToRun.has(key)) {
            messageToRun.set(key, new Map());
        }

        return {
            key,
            stateBucket: threadStates.get(key),
            messageBucket: messageToRun.get(key)
        };
    }

    function startRun(threadId, runId, baseState = {}) {
        const thread = ensureThread(threadId);
        if (!thread || !runId) {
            return;
        }

        thread.stateBucket.latestRunId = runId;
        thread.stateBucket.runs.set(runId, deepClone(baseState) || {});
    }

    function saveState(threadId, runId, nextState) {
        const thread = ensureThread(threadId);
        if (!thread || !runId) {
            return;
        }

        thread.stateBucket.latestRunId = runId;
        thread.stateBucket.runs.set(runId, deepClone(nextState) || {});
    }

    function patchState(threadId, runId, delta = {}) {
        const current = getStateByRun(threadId, runId) || {};
        saveState(threadId, runId, {
            ...current,
            ...deepClone(delta)
        });
    }

    function associateMessage(threadId, runId, messageId) {
        const thread = ensureThread(threadId);
        if (!thread || !runId || !messageId) {
            return;
        }

        thread.messageBucket.set(String(messageId), String(runId));
    }

    function getStateByRun(threadId, runId) {
        const thread = ensureThread(threadId);
        if (!thread || !runId) {
            return undefined;
        }

        const state = thread.stateBucket.runs.get(String(runId));
        return state ? deepClone(state) : undefined;
    }

    function getLatestRunId(threadId) {
        const thread = ensureThread(threadId);
        if (!thread) {
            return '';
        }

        return thread.stateBucket.latestRunId || '';
    }

    function getLatestThreadState(threadId) {
        const latestRunId = getLatestRunId(threadId);
        if (!latestRunId) {
            return undefined;
        }

        return getStateByRun(threadId, latestRunId);
    }

    function getRunIdForMessage(threadId, messageId) {
        const thread = ensureThread(threadId);
        if (!thread || !messageId) {
            return undefined;
        }

        return thread.messageBucket.get(String(messageId));
    }

    return {
        startRun,
        saveState,
        patchState,
        associateMessage,
        getStateByRun,
        getLatestRunId,
        getLatestThreadState,
        getRunIdForMessage
    };
}
