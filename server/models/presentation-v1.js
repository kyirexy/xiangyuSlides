const PRESENTATION_SCHEMA_VERSION = 'presentation/v1';
const RENDER_PLAN_VERSION = 'render-plan/v1';
const DEFAULT_PRESENTATION_ID = 'pres_unknown';
const DEFAULT_STATUS = 'draft';
const DEFAULT_STYLE_ID = 'bold-signal';
const SUPPORTED_SCENE_TRANSITION_PRESETS = new Set([
    'crossfade',
    'lift-fade',
    'push-left',
    'push-right',
    'zoom-fade'
]);
const SUPPORTED_SCENE_TRANSITION_OVERLAYS = new Set([
    'none',
    'accent',
    'dark',
    'light'
]);

function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asString(value, fallback = '') {
    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value);
}

function asNullableString(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    return String(value);
}

function asNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function cloneArray(items) {
    return Array.isArray(items) ? items.map((item) => item) : [];
}

function normalizeMotion(input) {
    if (!isPlainObject(input)) {
        return null;
    }

    const normalized = {
        scene: asString(input.scene, '').trim(),
        heading: asString(input.heading, '').trim(),
        subtitle: asString(input.subtitle, '').trim(),
        content: asString(input.content, '').trim(),
        media: asString(input.media, '').trim()
    };
    const compact = Object.fromEntries(
        Object.entries(normalized).filter(([, value]) => Boolean(value))
    );

    if (Object.keys(compact).length === 0) {
        return null;
    }

    return compact;
}

function normalizeSceneTransitionPreset(value) {
    const normalized = asString(value, '').trim().toLowerCase();
    if (!normalized) {
        return '';
    }

    if (normalized === 'fade') {
        return 'crossfade';
    }

    if (normalized === 'slide-up') {
        return 'lift-fade';
    }

    return SUPPORTED_SCENE_TRANSITION_PRESETS.has(normalized) ? normalized : '';
}

function normalizeSceneTransitionOverlay(value) {
    const normalized = asString(value, '').trim().toLowerCase();
    if (!normalized) {
        return '';
    }

    return SUPPORTED_SCENE_TRANSITION_OVERLAYS.has(normalized) ? normalized : '';
}

function normalizeSceneTransition(input) {
    if (typeof input === 'string') {
        const preset = normalizeSceneTransitionPreset(input);
        return preset ? { preset } : null;
    }

    if (!isPlainObject(input)) {
        return null;
    }

    const preset = normalizeSceneTransitionPreset(input.preset || input.enter || input.type);
    const durationMs = normalizeSceneTransitionDuration(input.durationMs);
    const enterMs = normalizeSceneTransitionDuration(input.enterMs ?? input.enterDurationMs ?? input.durationMs);
    const holdMs = normalizeSceneTransitionHold(input.holdMs ?? input.holdDurationMs);
    const exitMs = normalizeSceneTransitionDuration(input.exitMs ?? input.exitDurationMs);
    const contentDelayMs = normalizeSceneTransitionDelay(input.contentDelayMs ?? input.delayMs);
    const motionDurationMs = normalizeSceneTransitionDuration(input.motionDurationMs ?? input.elementDurationMs);
    const staggerStepMs = normalizeSceneTransitionStaggerStep(input.staggerStepMs);
    const overlay = normalizeSceneTransitionOverlay(input.overlay);

    if (!preset && durationMs === null && enterMs === null && holdMs === null && exitMs === null && contentDelayMs === null && motionDurationMs === null && staggerStepMs === null && !overlay) {
        return null;
    }

    return {
        ...(preset ? { preset } : {}),
        ...(durationMs !== null ? { durationMs } : {}),
        ...(enterMs !== null ? { enterMs } : {}),
        ...(holdMs !== null ? { holdMs } : {}),
        ...(exitMs !== null ? { exitMs } : {}),
        ...(contentDelayMs !== null ? { contentDelayMs } : {}),
        ...(motionDurationMs !== null ? { motionDurationMs } : {}),
        ...(staggerStepMs !== null ? { staggerStepMs } : {}),
        ...(overlay ? { overlay } : {})
    };
}

function normalizeDurationMs(value) {
    const numeric = asNumber(value, 0);
    if (numeric <= 0) {
        return null;
    }

    return Math.max(1000, Math.min(120000, Math.round(numeric)));
}

function normalizeSceneTransitionDuration(value) {
    const numeric = asNumber(value, 0);
    if (numeric <= 0) {
        return null;
    }

    return Math.max(180, Math.min(1800, Math.round(numeric)));
}

function normalizeSceneTransitionDelay(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numeric = asNumber(value, -1);
    if (numeric < 0) {
        return null;
    }

    return Math.max(0, Math.min(2000, Math.round(numeric)));
}

function normalizeSceneTransitionHold(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numeric = asNumber(value, -1);
    if (numeric < 0) {
        return null;
    }

    return Math.max(0, Math.min(120000, Math.round(numeric)));
}

function normalizeSceneTransitionStaggerStep(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numeric = asNumber(value, -1);
    if (numeric < 0) {
        return null;
    }

    return Math.max(0, Math.min(600, Math.round(numeric)));
}

function normalizeTimestampMs(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numeric = asNumber(value, -1);
    if (numeric < 0) {
        return null;
    }

    return Math.round(numeric);
}

function normalizeGain(value) {
    const numeric = asNumber(value, 1);
    if (!Number.isFinite(numeric) || numeric <= 0) {
        return 1;
    }

    return Math.max(0.05, Math.min(2, Math.round(numeric * 100) / 100));
}

function normalizeCue(input = {}) {
    if (!isPlainObject(input)) {
        return null;
    }

    const text = asString(input.text, '').trim();
    const atMs = normalizeTimestampMs(input.atMs);
    if (!text || atMs === null) {
        return null;
    }

    return {
        atMs,
        text
    };
}

function normalizeMarkerAnchor(value) {
    const normalized = asString(value, '').trim().toLowerCase();
    if (normalized === 'start' || normalized === 'advance' || normalized === 'exit') {
        return normalized;
    }

    return '';
}

function normalizeMarkerKind(value) {
    const normalized = asString(value, '').trim().toLowerCase();
    if (!normalized) {
        return '';
    }

    if (normalized === 'navigation' || normalized === 'nav') {
        return 'navigation';
    }

    if (normalized === 'narration' || normalized === 'voiceover' || normalized === 'subtitle') {
        return 'narration';
    }

    if (normalized === 'edit' || normalized === 'editorial' || normalized === 'note') {
        return 'edit';
    }

    return '';
}

function getMarkerAnchorOrder(anchor) {
    switch (normalizeMarkerAnchor(anchor)) {
        case 'start':
            return 0;
        case 'advance':
            return 1;
        case 'exit':
            return 2;
        default:
            return 3;
    }
}

function getMarkerKindOrder(kind) {
    switch (normalizeMarkerKind(kind)) {
        case 'navigation':
            return 0;
        case 'narration':
            return 1;
        case 'edit':
            return 2;
        default:
            return 3;
    }
}

function createVoiceoverPlaceholderV1(input = {}) {
    const cues = cloneArray(input.cues)
        .map((cue) => normalizeCue(cue))
        .filter(Boolean)
        .sort((left, right) => left.atMs - right.atMs);
    const text = asString(input.text, '').trim();
    const language = asString(input.language, '').trim() || 'zh-CN';
    const estimatedDurationMs = normalizeDurationMs(input.estimatedDurationMs);

    return {
        id: asString(input.id, 'voiceover'),
        sceneId: asString(input.sceneId, ''),
        status: asString(input.status, 'placeholder'),
        language,
        text,
        audioAssetId: asString(input.audioAssetId, ''),
        estimatedDurationMs,
        cues
    };
}

function createTimelineMarker(input = {}, index = 0) {
    if (!isPlainObject(input)) {
        return null;
    }

    const label = asString(input.label, '').trim();
    const sceneId = asString(input.sceneId, '').trim();
    const atMs = normalizeTimestampMs(input.atMs);
    const anchor = normalizeMarkerAnchor(input.anchor || input.phase);
    const kind = normalizeMarkerKind(input.kind || input.type || input.use || input.role);
    if (!label && !sceneId && atMs === null) {
        return null;
    }

    return {
        id: asString(input.id, `marker_${index + 1}`),
        label: label || sceneId || `Marker ${index + 1}`,
        sceneId,
        atMs,
        ...(kind ? { kind } : {}),
        ...(anchor ? { anchor } : {})
    };
}

function createTimelineAudioTrack(input = {}, index = 0) {
    if (!isPlainObject(input)) {
        return null;
    }

    const assetId = asString(input.assetId, '').trim();
    const source = asString(input.source, '').trim();
    const label = asString(input.label, '').trim();

    if (!assetId && !source && !label) {
        return null;
    }

    return {
        id: asString(input.id, `audio_track_${index + 1}`),
        assetId,
        source,
        label: label || assetId || `Audio ${index + 1}`,
        startMs: normalizeTimestampMs(input.startMs) ?? 0,
        autoplay: input.autoplay === true,
        loop: input.loop === true,
        gain: normalizeGain(input.gain),
        status: asString(input.status, assetId || source ? 'ready' : 'pending')
    };
}

function createTimelinePlaceholderV1(input = {}, scenes = []) {
    const providedTracks = cloneArray(input.sceneTracks)
        .map((track) => {
            if (!isPlainObject(track)) {
                return null;
            }

            return {
                sceneId: asString(track.sceneId, ''),
                startMs: normalizeTimestampMs(track.startMs),
                durationMs: normalizeDurationMs(track.durationMs)
            };
        })
        .filter((track) => track && track.sceneId);
    const derivedTracks = scenes.map((scene) => ({
        sceneId: scene.id,
        startMs: null,
        durationMs: normalizeDurationMs(scene.durationMs)
    }));
    const seedTracks = providedTracks.length > 0 ? providedTracks : derivedTracks;
    let cursor = 0;
    const sceneTracks = seedTracks.map((track) => {
        const startMs = track.startMs === null ? cursor : track.startMs;
        const durationMs = track.durationMs;
        if (durationMs !== null) {
            cursor = startMs + durationMs;
        }

        return {
            sceneId: track.sceneId,
            startMs,
            durationMs
        };
    });
    const totalDurationMs = sceneTracks.reduce((maxValue, track) => {
        if (track.durationMs === null) {
            return maxValue;
        }

        return Math.max(maxValue, track.startMs + track.durationMs);
    }, 0);
    const sceneTrackById = new Map(sceneTracks.map((track) => [track.sceneId, track]));
    const sceneById = new Map(cloneArray(scenes).map((scene) => [scene.id, scene]));
    const resolveMarkerAtMs = (marker) => {
        const track = sceneTrackById.get(marker.sceneId);
        if (marker.atMs !== null) {
            return marker.atMs;
        }

        if (!track) {
            return 0;
        }

        const startMs = Number.isFinite(Number(track.startMs)) ? Number(track.startMs) : 0;
        const durationMs = Number.isFinite(Number(track.durationMs))
            ? Number(track.durationMs)
            : (Number.isFinite(Number(sceneById.get(marker.sceneId)?.durationMs)) ? Number(sceneById.get(marker.sceneId).durationMs) : 0);
        const transition = sceneById.get(marker.sceneId)?.transition || {};
        const exitMs = Number.isFinite(Number(transition.exitMs)) ? Number(transition.exitMs) : 0;
        const advanceMs = Math.max(0, durationMs - exitMs);

        switch (marker.anchor) {
            case 'advance':
                return startMs + advanceMs;
            case 'exit':
                return startMs + durationMs;
            case 'start':
            default:
                return startMs;
        }
    };
    const markers = cloneArray(input.markers)
        .map((marker, index) => createTimelineMarker(marker, index))
        .filter(Boolean)
        .map((marker, index) => {
            return {
                ...marker,
                id: marker.id || `marker_${index + 1}`,
                kind: normalizeMarkerKind(marker.kind) || 'navigation',
                anchor: normalizeMarkerAnchor(marker.anchor) || (marker.sceneId ? 'start' : ''),
                atMs: resolveMarkerAtMs(marker)
            };
        })
        .sort((left, right) => {
            if (left.atMs !== right.atMs) {
                return left.atMs - right.atMs;
            }

            if (getMarkerAnchorOrder(left.anchor) !== getMarkerAnchorOrder(right.anchor)) {
                return getMarkerAnchorOrder(left.anchor) - getMarkerAnchorOrder(right.anchor);
            }

            return getMarkerKindOrder(left.kind) - getMarkerKindOrder(right.kind);
        });
    const audioTracks = cloneArray(input.audioTracks)
        .map((track, index) => createTimelineAudioTrack(track, index))
        .filter(Boolean);

    return {
        enabled: input.enabled !== false && sceneTracks.length > 0,
        autoplay: input.autoplay === true,
        totalDurationMs: totalDurationMs > 0 ? totalDurationMs : null,
        subtitleMode: asString(input.subtitleMode, 'voiceover-placeholder'),
        sceneTracks,
        markers,
        audioTracks
    };
}

function normalizeBuild(build, status) {
    const input = isPlainObject(build) ? build : {};
    const normalizedStatus = asString(status || DEFAULT_STATUS, DEFAULT_STATUS);
    const defaultProgress = normalizedStatus === 'ready' ? 100 : 0;
    const defaultStep = normalizedStatus === 'ready' ? 5 : 1;

    return {
        progress: asNumber(input.progress, defaultProgress),
        step: asNumber(input.step, defaultStep),
        message: asString(input.message, ''),
        error: asNullableString(input.error)
    };
}

function defaultLayoutForKind(kind) {
    switch (kind) {
        case 'title':
            return 'hero';
        case 'features':
            return 'feature-grid';
        case 'quote':
            return 'quote-focus';
        case 'code':
            return 'code-block';
        case 'end':
            return 'closing';
        case 'content':
        default:
            return 'bullet-list';
    }
}

function createSceneV1(input = {}) {
    const kind = asString(input.kind || input.type || 'content', 'content');
    const legacy = isPlainObject(input.legacy) ? input.legacy : {};

    return {
        id: asString(input.id, 'scene'),
        kind,
        layout: asString(input.layout, defaultLayoutForKind(kind)),
        title: asString(input.title, ''),
        subtitle: asString(input.subtitle, ''),
        durationMs: normalizeDurationMs(input.durationMs),
        motion: normalizeMotion(input.motion || input.animation),
        transition: normalizeSceneTransition(input.transition),
        mediaRefs: cloneArray(input.mediaRefs).map((item) => asString(item)).filter(Boolean),
        elements: cloneArray(input.elements).map((item) => item),
        legacy: {
            slideType: asString(legacy.slideType || kind, kind),
            content: cloneArray(legacy.content).map((item) => asString(item)).filter(Boolean)
        }
    };
}

function createMediaAssetV1(input = {}) {
    const source = isPlainObject(input.source) ? input.source : {};

    return {
        id: asString(input.id, 'asset'),
        presentationId: asString(input.presentationId, ''),
        type: asString(input.type, 'image'),
        source: {
            kind: asString(source.kind, 'public'),
            path: asString(source.path, ''),
            url: asString(source.url, '')
        },
        mimeType: asString(input.mimeType, ''),
        status: asString(input.status, 'pending'),
        meta: isPlainObject(input.meta) ? { ...input.meta } : {}
    };
}

function createRenderPlanV1(input = {}) {
    const html = isPlainObject(input.html) ? input.html : {};
    const pptx = isPlainObject(input.pptx) ? input.pptx : {};
    const targets = Array.isArray(input.targets) && input.targets.length > 0
        ? input.targets.map((item) => asString(item)).filter(Boolean)
        : ['html', 'pptx'];

    return {
        version: RENDER_PLAN_VERSION,
        targets,
        html: {
            enabled: html.enabled !== false,
            renderer: asString(html.renderer, 'html-v1'),
            mode: asString(html.mode, 'stored-html')
        },
        pptx: {
            enabled: pptx.enabled !== false,
            renderer: asString(pptx.renderer, 'pptx-v1'),
            mode: asString(pptx.mode, 'on-demand')
        }
    };
}

function createPresentationV1(input = {}) {
    const normalizedInput = isPlainObject(input) ? input : {};
    const meta = isPlainObject(normalizedInput.meta) ? normalizedInput.meta : {};
    const theme = isPlainObject(normalizedInput.theme) ? normalizedInput.theme : {};
    const legacy = isPlainObject(normalizedInput.legacy) ? normalizedInput.legacy : {};
    const outputs = isPlainObject(normalizedInput.outputs) ? normalizedInput.outputs : {};
    const htmlOutput = isPlainObject(outputs.html) ? outputs.html : {};
    const scenes = cloneArray(normalizedInput.scenes).map((scene) => createSceneV1(scene));
    const assets = cloneArray(normalizedInput.assets).map((asset) => createMediaAssetV1(asset));
    const voiceover = cloneArray(normalizedInput.voiceover).map((entry) => createVoiceoverPlaceholderV1(entry));
    const sceneOrder = Array.isArray(normalizedInput.sceneOrder) && normalizedInput.sceneOrder.length > 0
        ? normalizedInput.sceneOrder.map((item) => asString(item)).filter(Boolean)
        : scenes.map((scene) => scene.id);
    const status = asString(normalizedInput.status, DEFAULT_STATUS);
    const htmlContent = asString(htmlOutput.content, '');

    return {
        schemaVersion: PRESENTATION_SCHEMA_VERSION,
        id: asString(normalizedInput.id, DEFAULT_PRESENTATION_ID),
        status,
        build: normalizeBuild(normalizedInput.build, status),
        meta: {
            title: asString(meta.title, ''),
            subtitle: asString(meta.subtitle, ''),
            purpose: asString(meta.purpose, ''),
            length: asString(meta.length, ''),
            ownerId: asString(meta.ownerId, ''),
            createdAt: asString(meta.createdAt, ''),
            updatedAt: asString(meta.updatedAt, '')
        },
        theme: {
            presetId: asString(theme.presetId, DEFAULT_STYLE_ID)
        },
        sceneOrder,
        scenes,
        assets,
        voiceover,
        timeline: createTimelinePlaceholderV1(normalizedInput.timeline, scenes),
        renderPlan: createRenderPlanV1(normalizedInput.renderPlan),
        outputs: {
            html: {
                status: asString(htmlOutput.status, htmlContent ? 'ready' : 'pending'),
                content: htmlContent
            }
        },
        legacy: {
            ...legacy,
            outlineSnapshot: isPlainObject(legacy.outlineSnapshot) ? { ...legacy.outlineSnapshot } : null
        }
    };
}

function isPresentationV1(value) {
    return isPlainObject(value) && value.schemaVersion === PRESENTATION_SCHEMA_VERSION;
}

module.exports = {
    createPresentationV1,
    createSceneV1,
    createMediaAssetV1,
    createVoiceoverPlaceholderV1,
    createTimelinePlaceholderV1,
    createRenderPlanV1,
    isPresentationV1
};
