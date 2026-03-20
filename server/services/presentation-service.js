const { normalizeOutline } = require('../generator/normalize-outline');
const { renderHtmlFromOutline } = require('../generator/html-renderer');
const { exportPptxFromOutline } = require('../generator/pptx-renderer');
const { DEFAULT_STYLE_ID, getStyleInfo } = require('../generator/theme-registry');
const { adaptOutlineToPresentation } = require('../adapters/outline-to-presentation');
const { toLegacyOutline, toLegacyPresentationResponse } = require('../adapters/presentation-to-legacy-response');

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function asString(value, fallback = '') {
    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value);
}

function resolveStyleInfo(style) {
    if (style && typeof style === 'object' && style.id) {
        return getStyleInfo(style.id);
    }

    return getStyleInfo(style || DEFAULT_STYLE_ID);
}

function buildSsePayload(presentation, overrides = {}) {
    return {
        presentationId: presentation.id,
        progress: presentation.build.progress,
        step: presentation.build.step,
        message: presentation.build.message,
        status: presentation.status,
        url: `/presentations/${presentation.id}`,
        pptxUrl: `/api/presentations/${presentation.id}/export.pptx`,
        ...overrides
    };
}

function sanitizeFileName(value, fallback) {
    return asString(value || fallback, fallback)
        .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
        .slice(0, 80);
}

function createPresentationService({ assetStore, outlineService, presentationStore }) {
    function hydrateAssets(presentation) {
        if (!presentation) {
            return null;
        }

        const storedAssets = assetStore.getByPresentationId(presentation.id) || [];
        if (!Array.isArray(storedAssets) || storedAssets.length === 0) {
            return presentation;
        }

        const assetsById = new Map();
        (presentation.assets || []).forEach((asset) => {
            if (asset?.id) {
                assetsById.set(asset.id, asset);
            }
        });
        storedAssets.forEach((asset) => {
            if (asset?.id) {
                assetsById.set(asset.id, asset);
            }
        });

        return {
            ...presentation,
            assets: Array.from(assetsById.values())
        };
    }

    async function ensureRenderedHtml(presentation) {
        if (!presentation) {
            return null;
        }

        if (presentation.outputs?.html?.content) {
            return presentation;
        }

        const hydrated = hydrateAssets(presentation);
        const outline = toLegacyOutline(hydrated);
        const html = renderHtmlFromOutline(outline, hydrated.theme?.presetId || DEFAULT_STYLE_ID);

        return presentationStore.save({
            ...hydrated,
            outputs: {
                ...(hydrated.outputs || {}),
                html: {
                    status: 'ready',
                    content: html
                }
            }
        });
    }

    async function generateHtml({ outline, style }) {
        const normalizedOutline = normalizeOutline(outline || {});
        const styleInfo = resolveStyleInfo(style);
        const html = renderHtmlFromOutline(normalizedOutline, styleInfo.id);

        return {
            html,
            outline: normalizedOutline,
            style: styleInfo
        };
    }

    async function generateFromTopic({ topic, purpose, length, style, content }) {
        const outline = await outlineService.generateStableOutline({ topic, purpose, length, content });
        const rendered = await generateHtml({ outline, style });

        return {
            success: true,
            outline: rendered.outline,
            html: rendered.html,
            style: rendered.style
        };
    }

    async function generateStream({ topic, purpose, length, style, content, onProgress }) {
        const styleInfo = resolveStyleInfo(style);

        onProgress?.({ progress: 5, message: 'Analyzing topic and constraints...' });
        const outline = await outlineService.generateStableOutline({ topic, purpose, length, content });
        onProgress?.({
            progress: 42,
            message: `Outline ready with ${outline.slides.length} slides.`,
            outline
        });

        await sleep(200);
        onProgress?.({
            progress: 64,
            message: `Applying ${styleInfo.name} theme...`
        });

        await sleep(180);
        onProgress?.({
            progress: 82,
            message: 'Rendering stable HTML slides...'
        });

        const html = renderHtmlFromOutline(outline, styleInfo.id);
        await sleep(120);

        onProgress?.({
            progress: 100,
            message: 'Presentation ready.',
            html,
            outline,
            style: styleInfo
        });

        return {
            html,
            outline,
            style: styleInfo
        };
    }

    async function buildPresentation({
        outline,
        ownerId,
        presentationId,
        style,
        onProgress,
        metaOverrides,
        legacyData
    }) {
        const normalizedOutline = normalizeOutline(outline || {});
        const styleInfo = resolveStyleInfo(style);

        let presentation = adaptOutlineToPresentation({
            presentationId,
            outline: normalizedOutline,
            styleId: styleInfo.id,
            ownerId,
            status: 'building',
            build: {
                progress: 8,
                step: 1,
                message: 'Validating outline structure...',
                error: null
            }
        });

        if (metaOverrides && typeof metaOverrides === 'object') {
            presentation = {
                ...presentation,
                meta: {
                    ...(presentation.meta || {}),
                    ...metaOverrides
                }
            };
        }

        if (legacyData && typeof legacyData === 'object') {
            presentation = {
                ...presentation,
                legacy: {
                    ...(presentation.legacy || {}),
                    ...legacyData
                }
            };
        }

        presentation = presentationStore.save(presentation);
        onProgress?.(buildSsePayload(presentation));
        await sleep(100);

        presentation = presentationStore.save({
            ...presentation,
            status: 'building',
            build: {
                progress: 26,
                step: 1,
                message: `Outline normalized to ${normalizedOutline.slides.length} slides.`,
                error: null
            }
        });
        onProgress?.(buildSsePayload(presentation));
        await sleep(120);

        presentation = presentationStore.save({
            ...presentation,
            status: 'building',
            build: {
                progress: 48,
                step: 2,
                message: `Applying ${styleInfo.name} theme tokens...`,
                error: null
            }
        });
        onProgress?.(buildSsePayload(presentation));
        await sleep(120);

        const html = renderHtmlFromOutline(normalizedOutline, styleInfo.id);
        presentation = presentationStore.save({
            ...presentation,
            status: 'building',
            build: {
                progress: 72,
                step: 3,
                message: 'Rendering viewport-safe slides locally...',
                error: null
            }
        });
        onProgress?.(buildSsePayload(presentation));
        await sleep(80);

        const persistedAssets = assetStore.saveMany(presentationId, presentation.assets || []);
        presentation = presentationStore.save({
            ...presentation,
            assets: persistedAssets,
            status: 'building',
            build: {
                progress: 90,
                step: 4,
                message: 'Saving presentation record and export metadata...',
                error: null
            }
        });
        onProgress?.(buildSsePayload(presentation));
        await sleep(80);

        presentation = presentationStore.save({
            ...presentation,
            status: 'ready',
            build: {
                progress: 100,
                step: 5,
                message: 'Presentation ready. HTML and PPTX export are available.',
                error: null
            },
            outputs: {
                ...(presentation.outputs || {}),
                html: {
                    status: 'ready',
                    content: html
                }
            }
        });

        const response = toLegacyPresentationResponse(presentation);
        onProgress?.(buildSsePayload(presentation, {
            title: response.title
        }));

        return {
            presentation,
            response
        };
    }

    async function getPresentationResponse(presentationId) {
        const presentation = presentationStore.getById(presentationId);
        if (!presentation) {
            return null;
        }

        const hydrated = hydrateAssets(presentation);

        const ensured = hydrated.status === 'ready'
            ? await ensureRenderedHtml(hydrated)
            : hydrated;

        return toLegacyPresentationResponse(ensured);
    }

    async function getPresentationSpec(presentationId) {
        const presentation = presentationStore.getById(presentationId);
        if (!presentation) {
            return null;
        }

        return hydrateAssets(presentation);
    }

    async function getPresentationHtml(presentationId) {
        const presentation = presentationStore.getById(presentationId);
        if (!presentation || presentation.status !== 'ready') {
            return null;
        }

        const ensured = await ensureRenderedHtml(hydrateAssets(presentation));
        return ensured.outputs?.html?.content || '';
    }

    async function exportPresentationPptx(presentationId) {
        const presentation = presentationStore.getById(presentationId);
        if (!presentation) {
            return null;
        }

        const hydrated = hydrateAssets(presentation);
        const outline = toLegacyOutline(hydrated);
        const buffer = await exportPptxFromOutline(outline, hydrated.theme?.presetId || DEFAULT_STYLE_ID);

        return {
            buffer,
            fileName: sanitizeFileName(hydrated.meta?.title, presentationId)
        };
    }

    return {
        buildPresentation,
        exportPresentationPptx,
        generateFromTopic,
        generateHtml,
        generateStream,
        getPresentationHtml,
        getPresentationSpec,
        getPresentationResponse
    };
}

module.exports = {
    createPresentationService
};
