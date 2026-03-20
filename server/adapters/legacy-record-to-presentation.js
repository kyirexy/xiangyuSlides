const { DEFAULT_STYLE_ID } = require('../generator/theme-registry');
const {
    createPresentationV1,
    isPresentationV1
} = require('../models/presentation-v1');
const { adaptOutlineToPresentation } = require('./outline-to-presentation');

function asString(value, fallback = '') {
    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value);
}

function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function resolveStyleId(record) {
    if (!isPlainObject(record)) {
        return DEFAULT_STYLE_ID;
    }

    if (isPlainObject(record.style) && record.style.id) {
        return asString(record.style.id, DEFAULT_STYLE_ID);
    }

    if (record.styleId) {
        return asString(record.styleId, DEFAULT_STYLE_ID);
    }

    if (isPlainObject(record.theme) && record.theme.presetId) {
        return asString(record.theme.presetId, DEFAULT_STYLE_ID);
    }

    return DEFAULT_STYLE_ID;
}

function resolveHtml(record) {
    if (!isPlainObject(record)) {
        return '';
    }

    if (typeof record.html === 'string') {
        return record.html;
    }

    if (isPlainObject(record.outputs) && isPlainObject(record.outputs.html) && typeof record.outputs.html.content === 'string') {
        return record.outputs.html.content;
    }

    return '';
}

function resolveOutline(record) {
    if (!isPlainObject(record)) {
        return {};
    }

    if (isPlainObject(record.outline)) {
        return record.outline;
    }

    if (isPlainObject(record.legacy) && isPlainObject(record.legacy.outlineSnapshot)) {
        return record.legacy.outlineSnapshot;
    }

    if (Array.isArray(record.slides)) {
        return {
            title: asString(record.title || record.meta?.title, 'Untitled presentation'),
            subtitle: asString(record.subtitle || record.meta?.subtitle, ''),
            slides: record.slides
        };
    }

    return {
        title: asString(record.title || record.meta?.title, 'Untitled presentation'),
        subtitle: asString(record.subtitle || record.meta?.subtitle, ''),
        slides: []
    };
}

function upgradeLegacyRecordToPresentation(record) {
    if (isPresentationV1(record)) {
        return createPresentationV1(record);
    }

    const safeRecord = isPlainObject(record) ? record : {};
    const presentation = adaptOutlineToPresentation({
        presentationId: safeRecord.id || safeRecord.presentationId || 'pres_unknown',
        outline: resolveOutline(safeRecord),
        styleId: resolveStyleId(safeRecord),
        ownerId: safeRecord.ownerId || safeRecord.meta?.ownerId,
        status: safeRecord.status || 'draft',
        build: {
            progress: safeRecord.progress,
            step: safeRecord.step,
            message: safeRecord.message,
            error: safeRecord.error
        },
        html: resolveHtml(safeRecord),
        createdAt: safeRecord.createdAt || safeRecord.meta?.createdAt,
        updatedAt: safeRecord.updatedAt || safeRecord.meta?.updatedAt,
        purpose: safeRecord.purpose || safeRecord.meta?.purpose,
        length: safeRecord.length || safeRecord.meta?.length
    });

    return createPresentationV1({
        ...presentation,
        status: asString(safeRecord.status, presentation.status),
        build: {
            progress: safeRecord.progress ?? presentation.build.progress,
            step: safeRecord.step ?? presentation.build.step,
            message: asString(safeRecord.message, presentation.build.message),
            error: safeRecord.error ?? presentation.build.error
        },
        meta: {
            ...presentation.meta,
            createdAt: asString(safeRecord.createdAt || presentation.meta.createdAt, presentation.meta.createdAt),
            updatedAt: asString(safeRecord.updatedAt || presentation.meta.updatedAt, presentation.meta.updatedAt)
        },
        outputs: {
            html: {
                status: resolveHtml(safeRecord) ? 'ready' : presentation.outputs.html.status,
                content: resolveHtml(safeRecord) || presentation.outputs.html.content
            }
        },
        voiceover: Array.isArray(safeRecord.voiceover) ? safeRecord.voiceover : presentation.voiceover,
        timeline: isPlainObject(safeRecord.timeline) ? safeRecord.timeline : presentation.timeline,
        legacy: {
            ...presentation.legacy,
            outlineSnapshot: presentation.legacy.outlineSnapshot
        }
    });
}

module.exports = {
    upgradeLegacyRecordToPresentation
};
