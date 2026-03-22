const crypto = require('crypto');
const { createMemoryCollection } = require('./memory-json-store');
const { readJsonFile, writeJsonFile } = require('./file-json-store');

const MEDIA_TASK_STATUSES = ['queued', 'running', 'ready', 'failed'];

function asString(value, fallback = '') {
    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value);
}

function normalizeStatus(status, fallback = 'queued') {
    const resolved = asString(status, fallback).trim().toLowerCase();
    return MEDIA_TASK_STATUSES.includes(resolved) ? resolved : fallback;
}

function normalizeTask(task) {
    const value = task && typeof task === 'object' ? task : {};
    return {
        id: asString(value.id, `media_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`),
        kind: asString(value.kind, 'generic'),
        label: asString(value.label || value.payload?.label, ''),
        status: normalizeStatus(value.status),
        threadId: asString(value.threadId, ''),
        presentationId: asString(value.presentationId, ''),
        provider: asString(value.provider, 'local'),
        providerTaskId: asString(value.providerTaskId || value.runId, ''),
        payload: value.payload && typeof value.payload === 'object' ? value.payload : {},
        result: value.result && typeof value.result === 'object' ? value.result : {},
        error: asString(value.error, ''),
        createdAt: asString(value.createdAt, new Date().toISOString()),
        updatedAt: new Date().toISOString()
    };
}

function createMediaTaskStore({ config }) {
    const memoryStore = createMemoryCollection();

    function readAll() {
        if (config.isVercel) {
            return memoryStore.values();
        }

        const payload = readJsonFile(config.MEDIA_TASKS_FILE, { tasks: [] });
        return Array.isArray(payload?.tasks) ? payload.tasks : [];
    }

    function writeAll(tasks) {
        if (config.isVercel) {
            tasks.forEach((task) => memoryStore.set(task.id, task));
            return tasks;
        }

        writeJsonFile(config.MEDIA_TASKS_FILE, { tasks });
        return tasks;
    }

    function save(taskInput) {
        const nextTask = normalizeTask(taskInput);
        const current = readAll().filter((task) => task.id !== nextTask.id);
        current.unshift(nextTask);
        writeAll(current.slice(0, 200));
        return nextTask;
    }

    function getById(taskId) {
        return readAll().find((task) => task.id === taskId) || null;
    }

    function listByPresentationId(presentationId) {
        return readAll().filter((task) => task.presentationId === presentationId);
    }

    function update(taskId, patch = {}) {
        const current = getById(taskId);
        if (!current) {
            return null;
        }

        return save({
            ...current,
            ...patch,
            id: current.id,
            createdAt: current.createdAt
        });
    }

    return {
        save,
        update,
        getById,
        listByPresentationId,
        statuses: [...MEDIA_TASK_STATUSES]
    };
}

module.exports = {
    MEDIA_TASK_STATUSES,
    createMediaTaskStore
};
