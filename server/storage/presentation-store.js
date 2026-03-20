const path = require('path');
const { createPresentationV1, isPresentationV1 } = require('../models/presentation-v1');
const { upgradeLegacyRecordToPresentation } = require('../adapters/legacy-record-to-presentation');
const { createMemoryCollection } = require('./memory-json-store');
const { readJsonFile, writeJsonFile } = require('./file-json-store');

const PRESENTATION_ID_PATTERN = /^pres_[a-zA-Z0-9_-]{6,128}$/;

function asString(value, fallback = '') {
    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value);
}

function mergePresentation(existing, incoming) {
    const nextInput = incoming || {};
    const previous = existing || {};
    const now = new Date().toISOString();

    return createPresentationV1({
        ...previous,
        ...nextInput,
        id: asString(nextInput.id || previous.id, 'pres_unknown'),
        status: asString(nextInput.status, previous.status || 'draft'),
        build: {
            ...(previous.build || {}),
            ...(nextInput.build || {})
        },
        meta: {
            ...(previous.meta || {}),
            ...(nextInput.meta || {}),
            createdAt: asString(nextInput.meta?.createdAt || previous.meta?.createdAt, now),
            updatedAt: asString(nextInput.meta?.updatedAt, now)
        },
        theme: {
            ...(previous.theme || {}),
            ...(nextInput.theme || {})
        },
        sceneOrder: Array.isArray(nextInput.sceneOrder) && nextInput.sceneOrder.length > 0
            ? nextInput.sceneOrder
            : (previous.sceneOrder || []),
        scenes: Array.isArray(nextInput.scenes) && nextInput.scenes.length > 0
            ? nextInput.scenes
            : (previous.scenes || []),
        assets: Array.isArray(nextInput.assets)
            ? nextInput.assets
            : (previous.assets || []),
        renderPlan: nextInput.renderPlan || previous.renderPlan,
        outputs: {
            ...(previous.outputs || {}),
            ...(nextInput.outputs || {}),
            html: {
                ...((previous.outputs && previous.outputs.html) || {}),
                ...((nextInput.outputs && nextInput.outputs.html) || {})
            }
        },
        legacy: {
            ...(previous.legacy || {}),
            ...(nextInput.legacy || {}),
            outlineSnapshot: nextInput.legacy?.outlineSnapshot
                || previous.legacy?.outlineSnapshot
                || null
        }
    });
}

function createPresentationStore({ config }) {
    const memoryStore = createMemoryCollection();

    function isValidId(presentationId) {
        return PRESENTATION_ID_PATTERN.test(presentationId || '');
    }

    function getFilePath(presentationId) {
        return path.join(config.PRESENTATIONS_DIR, `${presentationId}.json`);
    }

    function readRaw(presentationId) {
        if (!isValidId(presentationId)) {
            return null;
        }

        if (config.isVercel) {
            return memoryStore.get(presentationId);
        }

        return readJsonFile(getFilePath(presentationId), null);
    }

    function normalizeRecord(record) {
        if (!record) {
            return null;
        }

        if (isPresentationV1(record)) {
            return createPresentationV1(record);
        }

        return upgradeLegacyRecordToPresentation(record);
    }

    function getById(presentationId) {
        return normalizeRecord(readRaw(presentationId));
    }

    function save(presentationInput) {
        const existing = getById(presentationInput.id);
        const normalized = mergePresentation(existing, presentationInput);

        if (config.isVercel) {
            memoryStore.set(normalized.id, normalized);
            return normalized;
        }

        writeJsonFile(getFilePath(normalized.id), normalized);
        return normalized;
    }

    return {
        isValidId,
        getById,
        save
    };
}

module.exports = {
    createPresentationStore
};
