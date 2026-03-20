const SUPPORTED_TYPES = new Set(['title', 'content', 'features', 'quote', 'code', 'end']);
const SUPPORTED_ANIMATIONS = new Set([
    'fade',
    'fade-up',
    'slide-left',
    'slide-right',
    'zoom-in',
    'stagger-up'
]);
const SUPPORTED_SCENE_TRANSITIONS = new Set([
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
const SUPPORTED_SUBTITLE_MODES = new Set([
    'voiceover-placeholder',
    'static',
    'off'
]);

function inferMediaType(source, explicitType = '') {
    const normalizedType = String(explicitType || '').trim().toLowerCase();
    if (normalizedType === 'image' || normalizedType === 'video') {
        return normalizedType;
    }

    const normalizedSource = String(source || '').trim().toLowerCase();
    if (/\.(mp4|webm|ogg|mov|m4v)(?:$|\?)/.test(normalizedSource)) {
        return 'video';
    }

    return 'image';
}

function sanitizeText(value, maxLength = 180) {
    const text = String(value || '')
        .replace(/\r/g, '\n')
        .replace(/\t/g, ' ')
        .replace(/\u00a0/g, ' ')
        .replace(/\s*\n\s*/g, '\n')
        .replace(/[ ]{2,}/g, ' ')
        .trim();

    if (!text) {
        return '';
    }

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength - 1).trimEnd()}...`;
}

function normalizeAnimationValue(value) {
    const normalized = sanitizeText(value || '', 60).toLowerCase();
    if (!normalized || normalized === 'none') {
        return '';
    }

    return SUPPORTED_ANIMATIONS.has(normalized) ? normalized : '';
}

function normalizeAnimation(rawAnimation) {
    if (!rawAnimation) {
        return null;
    }

    if (typeof rawAnimation === 'string') {
        const scene = normalizeAnimationValue(rawAnimation);
        return scene ? { scene } : null;
    }

    if (typeof rawAnimation !== 'object') {
        return null;
    }

    const normalized = {
        scene: normalizeAnimationValue(rawAnimation.scene),
        heading: normalizeAnimationValue(rawAnimation.heading),
        subtitle: normalizeAnimationValue(rawAnimation.subtitle),
        content: normalizeAnimationValue(rawAnimation.content),
        media: normalizeAnimationValue(rawAnimation.media)
    };

    return Object.values(normalized).some(Boolean) ? normalized : null;
}

function normalizeTransitionPreset(value) {
    const normalized = sanitizeText(value || '', 60).toLowerCase();
    if (!normalized || normalized === 'none') {
        return '';
    }

    if (normalized === 'fade') {
        return 'crossfade';
    }

    if (normalized === 'slide-up') {
        return 'lift-fade';
    }

    return SUPPORTED_SCENE_TRANSITIONS.has(normalized) ? normalized : '';
}

function normalizeTransitionOverlay(value) {
    const normalized = sanitizeText(value || '', 30).toLowerCase();
    if (!normalized) {
        return '';
    }

    return SUPPORTED_SCENE_TRANSITION_OVERLAYS.has(normalized) ? normalized : '';
}

function normalizeTransition(rawTransition) {
    if (!rawTransition) {
        return null;
    }

    if (typeof rawTransition === 'string') {
        const preset = normalizeTransitionPreset(rawTransition);
        return preset ? { preset } : null;
    }

    if (typeof rawTransition !== 'object') {
        return null;
    }

    const preset = normalizeTransitionPreset(rawTransition.preset || rawTransition.enter || rawTransition.type);
    const durationMs = normalizeTransitionDurationMs(rawTransition.durationMs);
    const enterMs = normalizeTransitionDurationMs(
        rawTransition.enterMs ?? rawTransition.enterDurationMs ?? rawTransition.durationMs
    );
    const holdMs = normalizeTransitionHoldMs(
        rawTransition.holdMs ?? rawTransition.holdDurationMs
    );
    const exitMs = normalizeTransitionDurationMs(
        rawTransition.exitMs ?? rawTransition.exitDurationMs
    );
    const contentDelayMs = normalizeTransitionDelayMs(
        rawTransition.contentDelayMs ?? rawTransition.delayMs
    );
    const motionDurationMs = normalizeTransitionDurationMs(
        rawTransition.motionDurationMs ?? rawTransition.elementDurationMs
    );
    const staggerStepMs = normalizeTransitionStaggerStepMs(rawTransition.staggerStepMs);
    const overlay = normalizeTransitionOverlay(rawTransition.overlay);

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
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
        return null;
    }

    return Math.max(1000, Math.min(120000, Math.round(numeric)));
}

function normalizeTransitionDurationMs(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
        return null;
    }

    return Math.max(180, Math.min(1800, Math.round(numeric)));
}

function normalizeTransitionHoldMs(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
        return null;
    }

    return Math.max(0, Math.min(120000, Math.round(numeric)));
}

function normalizeTransitionDelayMs(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
        return null;
    }

    return Math.max(0, Math.min(2000, Math.round(numeric)));
}

function normalizeTransitionStaggerStepMs(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
        return null;
    }

    return Math.max(0, Math.min(600, Math.round(numeric)));
}

function normalizeTimestampMs(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
        return null;
    }

    return Math.round(numeric);
}

function normalizeGain(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
        return 1;
    }

    return Math.max(0.05, Math.min(2, Math.round(numeric * 100) / 100));
}

function normalizeCue(rawCue) {
    if (!rawCue || typeof rawCue !== 'object') {
        return null;
    }

    const text = sanitizeText(rawCue.text || '', 180);
    const atMs = normalizeTimestampMs(rawCue.atMs);
    if (!text || atMs === null) {
        return null;
    }

    return {
        atMs,
        text
    };
}

function normalizeVoiceover(rawVoiceover) {
    if (!rawVoiceover) {
        return null;
    }

    const voiceover = typeof rawVoiceover === 'string'
        ? { text: rawVoiceover }
        : (rawVoiceover && typeof rawVoiceover === 'object' ? rawVoiceover : null);

    if (!voiceover) {
        return null;
    }

    const text = sanitizeText(voiceover.text || '', 1200);
    const language = sanitizeText(voiceover.language || '', 40) || 'zh-CN';
    const cues = Array.isArray(voiceover.cues)
        ? voiceover.cues.map((cue) => normalizeCue(cue)).filter(Boolean)
        : [];

    if (!text && cues.length === 0) {
        return null;
    }

    return {
        text,
        language,
        cues
    };
}

function normalizeSubtitleMode(value) {
    const normalized = sanitizeText(value || '', 60).toLowerCase();
    if (!normalized) {
        return 'voiceover-placeholder';
    }

    if (normalized === 'voiceover' || normalized === 'placeholder') {
        return 'voiceover-placeholder';
    }

    if (normalized === 'caption' || normalized === 'captions') {
        return 'static';
    }

    return SUPPORTED_SUBTITLE_MODES.has(normalized)
        ? normalized
        : 'voiceover-placeholder';
}

function normalizeMarkerAnchor(value) {
    const normalized = sanitizeText(value || '', 40).toLowerCase();
    if (normalized === 'start' || normalized === 'advance' || normalized === 'exit') {
        return normalized;
    }

    return '';
}

function normalizeMarkerKind(value) {
    const normalized = sanitizeText(value || '', 40).toLowerCase();
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

function normalizeTimelineMarker(rawMarker, index) {
    if (!rawMarker) {
        return null;
    }

    const marker = typeof rawMarker === 'string'
        ? { label: rawMarker }
        : (typeof rawMarker === 'object' ? rawMarker : null);

    if (!marker) {
        return null;
    }

    const label = sanitizeText(marker.label || marker.name || '', 80);
    const sceneId = sanitizeText(marker.sceneId || '', 80);
    const sceneIndex = marker.sceneIndex !== null
        && marker.sceneIndex !== undefined
        && Number.isInteger(Number(marker.sceneIndex))
        ? Number(marker.sceneIndex)
        : null;
    const atMs = normalizeTimestampMs(marker.atMs);
    const anchor = normalizeMarkerAnchor(marker.anchor || marker.phase);
    const kind = normalizeMarkerKind(marker.kind || marker.type || marker.use || marker.role);

    if (!label && !sceneId && sceneIndex === null && atMs === null) {
        return null;
    }

    return {
        id: sanitizeText(marker.id || `marker_${index + 1}`, 80),
        label: label || `Marker ${index + 1}`,
        sceneId,
        sceneIndex,
        atMs,
        ...(kind ? { kind } : {}),
        ...(anchor ? { anchor } : {})
    };
}

function normalizeAudioTrack(rawTrack, index) {
    if (!rawTrack) {
        return null;
    }

    const track = typeof rawTrack === 'string'
        ? { source: rawTrack }
        : (typeof rawTrack === 'object' ? rawTrack : null);

    if (!track) {
        return null;
    }

    const source = String(track.source || track.url || track.path || '').trim();
    const assetId = sanitizeText(track.assetId || '', 120);
    const label = sanitizeText(track.label || track.name || '', 80);
    if (!source && !assetId && !label) {
        return null;
    }

    return {
        id: sanitizeText(track.id || `audio_track_${index + 1}`, 80),
        assetId,
        source,
        mimeType: sanitizeText(track.mimeType || '', 120),
        label: label || `Audio ${index + 1}`,
        startMs: normalizeTimestampMs(track.startMs) ?? 0,
        autoplay: Boolean(track.autoplay),
        loop: Boolean(track.loop),
        gain: normalizeGain(track.gain)
    };
}

function normalizeTimeline(rawTimeline) {
    if (!rawTimeline || typeof rawTimeline !== 'object') {
        return null;
    }

    return {
        autoplay: Boolean(rawTimeline.autoplay),
        enabled: rawTimeline.enabled !== false,
        subtitleMode: normalizeSubtitleMode(rawTimeline.subtitleMode),
        markers: Array.isArray(rawTimeline.markers)
            ? rawTimeline.markers.map((marker, index) => normalizeTimelineMarker(marker, index)).filter(Boolean)
            : [],
        audioTracks: Array.isArray(rawTimeline.audioTracks)
            ? rawTimeline.audioTracks.map((track, index) => normalizeAudioTrack(track, index)).filter(Boolean)
            : []
    };
}

function normalizeMedia(rawMedia) {
    if (!rawMedia) {
        return null;
    }

    const media = typeof rawMedia === 'string'
        ? { source: rawMedia }
        : (rawMedia && typeof rawMedia === 'object' ? rawMedia : null);

    if (!media) {
        return null;
    }

    const source = String(media.source || media.url || media.path || '').trim();
    if (!source) {
        return null;
    }

    const type = inferMediaType(source, media.type);

    return {
        type,
        source,
        mimeType: sanitizeText(media.mimeType || '', 120),
        alt: sanitizeText(media.alt || '', 180),
        caption: sanitizeText(media.caption || '', 180),
        poster: sanitizeText(media.poster || '', 240),
        autoplay: Boolean(media.autoplay),
        loop: Boolean(media.loop)
    };
}

function chunkArray(items, size) {
    const chunks = [];
    for (let index = 0; index < items.length; index += size) {
        chunks.push(items.slice(index, index + size));
    }
    return chunks;
}

function normalizeItems(rawContent, maxLength = 180) {
    if (Array.isArray(rawContent)) {
        return rawContent
            .map((item) => sanitizeText(item, maxLength))
            .filter(Boolean);
    }

    if (typeof rawContent === 'string') {
        return rawContent
            .split(/\n+/)
            .map((item) => sanitizeText(item, maxLength))
            .filter(Boolean);
    }

    if (rawContent && typeof rawContent === 'object') {
        return Object.values(rawContent)
            .map((item) => sanitizeText(item, maxLength))
            .filter(Boolean);
    }

    return [];
}

function inferSlideType(slide, index, total) {
    const rawType = String(slide?.type || '').trim().toLowerCase();
    if (SUPPORTED_TYPES.has(rawType)) {
        return rawType;
    }

    if (index === 0) {
        return 'title';
    }

    if (index === total - 1) {
        return 'end';
    }

    return 'content';
}

function buildNormalizedSlide(rawSlide, index, total, deckTitle) {
    const type = inferSlideType(rawSlide, index, total);
    const items = normalizeItems(
        rawSlide?.content || rawSlide?.items || rawSlide?.points || rawSlide?.bullets,
        type === 'code' ? 240 : 180
    );

    return {
        type,
        title: sanitizeText(rawSlide?.title || (type === 'title' ? deckTitle : `Slide ${index + 1}`), 90),
        subtitle: sanitizeText(rawSlide?.subtitle || '', 140),
        content: items,
        media: normalizeMedia(rawSlide?.media),
        animation: normalizeAnimation(rawSlide?.animation),
        transition: normalizeTransition(rawSlide?.transition),
        durationMs: normalizeDurationMs(rawSlide?.durationMs),
        voiceover: normalizeVoiceover(rawSlide?.voiceover)
    };
}

function splitDenseSlide(slide) {
    const limits = {
        title: 3,
        content: 5,
        features: 4,
        quote: 2,
        code: 12,
        end: 4
    };

    const limit = limits[slide.type] || limits.content;
    if (slide.content.length <= limit) {
        return [slide];
    }

    return chunkArray(slide.content, limit).map((contentChunk, chunkIndex) => ({
        ...slide,
        title: chunkIndex === 0 ? slide.title : `${slide.title} (continued)`,
        content: contentChunk,
        media: chunkIndex === 0 ? slide.media : null,
        animation: chunkIndex === 0 ? slide.animation : null,
        transition: chunkIndex === 0 ? slide.transition : null,
        durationMs: chunkIndex === 0 ? slide.durationMs : null,
        voiceover: chunkIndex === 0 ? slide.voiceover : null
    }));
}

function normalizeOutline(inputOutline = {}) {
    const fallbackTitle = sanitizeText(inputOutline.title || inputOutline.topic || 'Untitled presentation', 90);
    const fallbackSubtitle = sanitizeText(inputOutline.subtitle || '', 140);
    const rawSlides = Array.isArray(inputOutline.slides) ? inputOutline.slides : [];

    const normalizedSlides = rawSlides
        .map((slide, index) => buildNormalizedSlide(slide, index, rawSlides.length || 1, fallbackTitle))
        .flatMap((slide) => splitDenseSlide(slide))
        .filter((slide) => slide.title || slide.content.length > 0);

    if (normalizedSlides.length === 0) {
        normalizedSlides.push({
            type: 'title',
            title: fallbackTitle,
            subtitle: fallbackSubtitle,
            content: fallbackSubtitle ? [fallbackSubtitle] : []
        });
    }

    if (normalizedSlides[0].type !== 'title') {
        normalizedSlides.unshift({
            type: 'title',
            title: fallbackTitle,
            subtitle: fallbackSubtitle,
            content: fallbackSubtitle ? [fallbackSubtitle] : []
        });
    }

    return {
        title: fallbackTitle,
        subtitle: fallbackSubtitle,
        timeline: normalizeTimeline(inputOutline.timeline),
        slides: normalizedSlides.map((slide, index, slides) => ({
            ...slide,
            type: inferSlideType(slide, index, slides.length),
            title: sanitizeText(slide.title || `Slide ${index + 1}`, 90),
            subtitle: sanitizeText(slide.subtitle || '', 140),
            content: normalizeItems(slide.content, slide.type === 'code' ? 240 : 180),
            media: normalizeMedia(slide.media),
            animation: normalizeAnimation(slide.animation),
            transition: normalizeTransition(slide.transition),
            durationMs: normalizeDurationMs(slide.durationMs),
            voiceover: normalizeVoiceover(slide.voiceover)
        }))
    };
}
module.exports = {
    normalizeOutline
};
