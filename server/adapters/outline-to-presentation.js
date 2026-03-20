const { DEFAULT_STYLE_ID } = require('../generator/theme-registry');
const { normalizeOutline } = require('../generator/normalize-outline');
const {
    createPresentationV1,
    createSceneV1,
    createMediaAssetV1,
    createVoiceoverPlaceholderV1
} = require('../models/presentation-v1');

function asString(value, fallback = '') {
    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value);
}

function asArray(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (value === null || value === undefined || value === '') {
        return [];
    }

    return [value];
}

function sceneKindFromSlideType(slideType) {
    switch (slideType) {
        case 'title':
        case 'content':
        case 'features':
        case 'quote':
        case 'code':
        case 'end':
            return slideType;
        default:
            return 'content';
    }
}

function layoutFromSceneKind(kind) {
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

function defaultSceneMotion(kind) {
    switch (kind) {
        case 'title':
            return {
                scene: 'fade-up',
                heading: 'fade-up',
                subtitle: 'fade',
                content: 'stagger-up',
                media: 'zoom-in'
            };
        case 'quote':
            return {
                scene: 'fade-up',
                heading: 'fade',
                subtitle: 'fade',
                content: 'fade-up',
                media: 'zoom-in'
            };
        case 'code':
            return {
                scene: 'fade',
                heading: 'slide-left',
                subtitle: 'fade',
                content: 'fade-up',
                media: 'zoom-in'
            };
        case 'end':
            return {
                scene: 'zoom-in',
                heading: 'fade-up',
                subtitle: 'fade',
                content: 'fade',
                media: 'zoom-in'
            };
        case 'features':
        case 'content':
        default:
            return {
                scene: 'fade',
                heading: 'fade-up',
                subtitle: 'fade',
                content: 'stagger-up',
                media: 'zoom-in'
            };
    }
}

function resolveSceneMotion(slide, sceneKind) {
    const defaults = defaultSceneMotion(sceneKind);
    const input = slide && slide.animation && typeof slide.animation === 'object'
        ? slide.animation
        : (typeof slide.animation === 'string' ? { scene: slide.animation } : {});
    const pick = (value, fallback) => {
        const normalized = asString(value, '').trim();
        return normalized || fallback;
    };

    return {
        scene: pick(input.scene, defaults.scene),
        heading: pick(input.heading, defaults.heading),
        subtitle: pick(input.subtitle, defaults.subtitle),
        content: pick(input.content, defaults.content),
        media: pick(input.media, defaults.media)
    };
}

function defaultSceneTransition(sceneKind, mediaAsset) {
    switch (sceneKind) {
        case 'title':
            return {
                preset: 'lift-fade',
                durationMs: 760,
                enterMs: 760,
                exitMs: 260,
                overlay: 'accent',
                contentDelayMs: 110,
                motionDurationMs: 760,
                staggerStepMs: 110
            };
        case 'quote':
            return {
                preset: 'crossfade',
                durationMs: 680,
                enterMs: 680,
                exitMs: 220,
                overlay: 'accent',
                contentDelayMs: 90,
                motionDurationMs: 700,
                staggerStepMs: 110
            };
        case 'code':
            return {
                preset: 'push-right',
                durationMs: 620,
                enterMs: 620,
                exitMs: 200,
                overlay: 'dark',
                contentDelayMs: 140,
                motionDurationMs: 680,
                staggerStepMs: 90
            };
        case 'end':
            return {
                preset: 'zoom-fade',
                durationMs: 820,
                enterMs: 820,
                exitMs: 280,
                overlay: 'dark',
                contentDelayMs: 150,
                motionDurationMs: 720,
                staggerStepMs: 110
            };
        case 'features':
        case 'content':
        default:
            return {
                preset: mediaAsset?.type === 'video' ? 'push-left' : 'crossfade',
                durationMs: mediaAsset ? 660 : 560,
                enterMs: mediaAsset ? 660 : 560,
                exitMs: mediaAsset ? 240 : 200,
                overlay: mediaAsset ? 'accent' : 'none',
                contentDelayMs: mediaAsset ? 120 : 70,
                motionDurationMs: mediaAsset ? 760 : 720,
                staggerStepMs: mediaAsset ? 100 : 110
            };
    }
}

function resolveSceneTransition(slide, sceneKind, mediaAsset) {
    const defaults = defaultSceneTransition(sceneKind, mediaAsset);
    const input = slide && slide.transition && typeof slide.transition === 'object'
        ? slide.transition
        : (typeof slide?.transition === 'string' ? { preset: slide.transition } : {});
    const pickText = (value, fallback) => {
        const normalized = asString(value, '').trim();
        return normalized || fallback;
    };
    const pickDuration = (value, fallback) => {
        const numeric = Number(value);
        if (!Number.isFinite(numeric) || numeric <= 0) {
            return fallback;
        }

        return Math.max(180, Math.min(1800, Math.round(numeric)));
    };
    const pickDelay = (value, fallback) => {
        if (value === null || value === undefined || value === '') {
            return fallback;
        }

        const numeric = Number(value);
        if (!Number.isFinite(numeric) || numeric < 0) {
            return fallback;
        }

        return Math.max(0, Math.min(2000, Math.round(numeric)));
    };
    const pickHold = (value, fallback = null) => {
        if (value === null || value === undefined || value === '') {
            return fallback;
        }

        const numeric = Number(value);
        if (!Number.isFinite(numeric) || numeric < 0) {
            return fallback;
        }

        return Math.max(0, Math.min(120000, Math.round(numeric)));
    };
    const pickStep = (value, fallback) => {
        if (value === null || value === undefined || value === '') {
            return fallback;
        }

        const numeric = Number(value);
        if (!Number.isFinite(numeric) || numeric < 0) {
            return fallback;
        }

        return Math.max(0, Math.min(600, Math.round(numeric)));
    };

    return {
        preset: pickText(input.preset || input.enter || input.type, defaults.preset),
        durationMs: pickDuration(input.durationMs, defaults.durationMs),
        enterMs: pickDuration(input.enterMs ?? input.enterDurationMs ?? input.durationMs, defaults.enterMs),
        holdMs: pickHold(input.holdMs ?? input.holdDurationMs, defaults.holdMs ?? null),
        exitMs: pickDuration(input.exitMs ?? input.exitDurationMs, defaults.exitMs),
        overlay: pickText(input.overlay, defaults.overlay),
        contentDelayMs: pickDelay(input.contentDelayMs ?? input.delayMs, defaults.contentDelayMs),
        motionDurationMs: pickDuration(input.motionDurationMs ?? input.elementDurationMs, defaults.motionDurationMs),
        staggerStepMs: pickStep(input.staggerStepMs, defaults.staggerStepMs)
    };
}

function getMinimumDurationForTransition(transition) {
    if (!transition || typeof transition !== 'object') {
        return 0;
    }

    const enterMs = Number.isFinite(Number(transition.enterMs))
        ? Number(transition.enterMs)
        : (Number.isFinite(Number(transition.durationMs)) ? Number(transition.durationMs) : 0);
    const holdMs = Number.isFinite(Number(transition.holdMs)) ? Number(transition.holdMs) : 0;
    const exitMs = Number.isFinite(Number(transition.exitMs)) ? Number(transition.exitMs) : 0;

    return Math.max(0, Math.round(enterMs + holdMs + exitMs));
}

function estimateReadingDurationMs(text) {
    const normalized = asString(text, '').trim();
    if (!normalized) {
        return null;
    }

    const chars = normalized.replace(/\s+/g, '').length;
    return Math.max(3000, Math.min(22000, chars * 110));
}

function estimateSceneDurationMs(slide, sceneKind, mediaAsset, transition) {
    const explicit = Number(slide?.durationMs);
    if (Number.isFinite(explicit) && explicit > 0) {
        const minimumDuration = getMinimumDurationForTransition(transition);
        return Math.max(1000, Math.min(120000, Math.max(Math.round(explicit), minimumDuration)));
    }

    const contentItems = asArray(slide?.content).map((item) => asString(item)).filter(Boolean);
    let durationMs;

    switch (sceneKind) {
        case 'title':
            durationMs = 4500;
            break;
        case 'quote':
            durationMs = 5200;
            break;
        case 'code':
            durationMs = 6800 + (contentItems.length * 450);
            break;
        case 'end':
            durationMs = 3600;
            break;
        case 'features':
        case 'content':
        default:
            durationMs = 5200 + (contentItems.length * 700);
            break;
    }

    if (mediaAsset?.type === 'video') {
        durationMs += 2200;
    } else if (mediaAsset?.type === 'image') {
        durationMs += 1200;
    }

    const voiceoverText = asString(slide?.voiceover?.text, '');
    const readingDuration = estimateReadingDurationMs(voiceoverText);
    if (readingDuration) {
        durationMs = Math.max(durationMs, readingDuration);
    }

    durationMs = Math.max(durationMs, getMinimumDurationForTransition(transition));

    return Math.max(3000, Math.min(24000, Math.round(durationMs)));
}

function splitVoiceoverTextToCues(text, durationMs) {
    const normalized = asString(text, '').trim();
    if (!normalized) {
        return [];
    }

    const segments = normalized
        .split(/[。！？!?；;]+|\n+/)
        .map((segment) => asString(segment, '').trim())
        .filter(Boolean);

    if (segments.length === 0) {
        return [];
    }

    const step = Math.max(600, Math.floor(durationMs / Math.max(segments.length, 1)));
    return segments.map((segment, index) => ({
        atMs: index * step,
        text: segment
    }));
}

function buildVoiceoverPlaceholder(sceneId, slide, durationMs) {
    const voiceover = slide?.voiceover;
    if (!voiceover) {
        return null;
    }

    const text = asString(voiceover.text, '');
    const cues = Array.isArray(voiceover.cues) && voiceover.cues.length > 0
        ? voiceover.cues
        : splitVoiceoverTextToCues(text, durationMs);

    return createVoiceoverPlaceholderV1({
        id: `voiceover_${sceneId}`,
        sceneId,
        status: 'placeholder',
        language: asString(voiceover.language, 'zh-CN'),
        text,
        estimatedDurationMs: durationMs,
        cues
    });
}

function buildTimeline(scenes, outlineTimeline, audioTracks = []) {
    let cursor = 0;
    const sceneTracks = scenes.map((scene) => {
        const durationMs = Number.isFinite(Number(scene.durationMs)) ? Number(scene.durationMs) : null;
        const track = {
            sceneId: scene.id,
            startMs: cursor,
            durationMs
        };

        if (durationMs !== null) {
            cursor += durationMs;
        }

        return track;
    });
    const sceneTrackById = new Map(sceneTracks.map((track) => [track.sceneId, track]));
    const sceneTimingList = scenes.map((scene, index) => {
        const track = sceneTrackById.get(scene.id);
        const startMs = Number.isFinite(Number(track?.startMs)) ? Number(track.startMs) : 0;
        const durationMs = Number.isFinite(Number(track?.durationMs)) ? Number(track.durationMs) : 0;
        const exitMs = Number.isFinite(Number(scene?.transition?.exitMs)) ? Number(scene.transition.exitMs) : 0;
        const advanceAtMs = startMs + Math.max(0, durationMs - exitMs);

        return {
            sceneId: scene.id,
            sceneIndex: index,
            startMs,
            advanceAtMs,
            endMs: startMs + Math.max(0, durationMs)
        };
    });
    const normalizeMarkerAnchor = (value) => {
        const normalized = asString(value, '').trim().toLowerCase();
        if (normalized === 'start' || normalized === 'advance' || normalized === 'exit') {
            return normalized;
        }

        return '';
    };
    const normalizeMarkerKind = (value) => {
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
    };
    const getMarkerAnchorOrder = (anchor) => {
        switch (anchor) {
            case 'start':
                return 0;
            case 'advance':
                return 1;
            case 'exit':
                return 2;
            default:
                return 3;
        }
    };
    const getMarkerKindOrder = (kind) => {
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
    };
    const findSceneIdForMarker = (marker, fallbackIndex) => {
        const explicitSceneId = asString(marker.sceneId, '');
        if (explicitSceneId) {
            return explicitSceneId;
        }

        if (marker.sceneIndex !== null
            && marker.sceneIndex !== undefined
            && Number.isInteger(Number(marker.sceneIndex))) {
            const normalizedIndex = Math.max(0, Math.min(scenes.length - 1, Number(marker.sceneIndex)));
            return scenes[normalizedIndex]?.id || '';
        }

        const atMs = marker.atMs !== null && marker.atMs !== undefined && Number.isFinite(Number(marker.atMs))
            ? Number(marker.atMs)
            : null;
        if (atMs !== null) {
            const exactStart = sceneTimingList.find((sceneTiming) => atMs === sceneTiming.startMs);
            if (exactStart) {
                return exactStart.sceneId;
            }

            const containing = sceneTimingList.find((sceneTiming) => atMs >= sceneTiming.startMs && atMs < sceneTiming.endMs);
            if (containing) {
                return containing.sceneId;
            }

            const preceding = [...sceneTimingList].reverse().find((sceneTiming) => atMs >= sceneTiming.startMs);
            if (preceding) {
                return preceding.sceneId;
            }
        }

        const normalizedFallback = Math.max(0, Math.min(scenes.length - 1, fallbackIndex));
        return scenes[normalizedFallback]?.id || '';
    };
    const inferMarkerAnchor = (marker, sceneTiming) => {
        const explicitAnchor = normalizeMarkerAnchor(marker.anchor || marker.phase);
        if (explicitAnchor) {
            return explicitAnchor;
        }

        const atMs = marker.atMs !== null && marker.atMs !== undefined && Number.isFinite(Number(marker.atMs))
            ? Number(marker.atMs)
            : null;
        if (atMs === null || !sceneTiming) {
            return sceneTiming ? 'start' : '';
        }

        if (atMs === sceneTiming.startMs) {
            return 'start';
        }

        if (atMs === sceneTiming.advanceAtMs) {
            return 'advance';
        }

        if (atMs === sceneTiming.endMs) {
            return 'exit';
        }

        return '';
    };
    const resolveMarkerAtMs = (marker, sceneTiming) => {
        if (marker.atMs !== null && marker.atMs !== undefined && Number.isFinite(Number(marker.atMs))) {
            return Number(marker.atMs);
        }

        if (!sceneTiming) {
            return 0;
        }

        const anchor = inferMarkerAnchor(marker, sceneTiming);
        switch (anchor) {
            case 'advance':
                return sceneTiming.advanceAtMs;
            case 'exit':
                return sceneTiming.endMs;
            case 'start':
            default:
                return sceneTiming.startMs;
        }
    };
    const derivedMarkers = scenes.map((scene, index) => ({
        id: `marker_scene_${index + 1}`,
        label: asString(scene.title || scene.subtitle || `Scene ${index + 1}`, `Scene ${index + 1}`),
        sceneId: scene.id,
        kind: 'navigation',
        anchor: 'start',
        atMs: sceneTrackById.get(scene.id)?.startMs || 0
    }));
    const markers = Array.isArray(outlineTimeline?.markers) && outlineTimeline.markers.length > 0
        ? outlineTimeline.markers.map((marker, index) => {
            const sceneId = findSceneIdForMarker(marker, index);
            const fallbackScene = scenes.find((scene) => scene.id === sceneId) || scenes[Math.max(0, Math.min(scenes.length - 1, index))] || null;
            const sceneTiming = sceneTimingList.find((entry) => entry.sceneId === sceneId) || null;
            const kind = normalizeMarkerKind(marker.kind || marker.type || marker.use || marker.role) || 'navigation';
            const anchor = inferMarkerAnchor(marker, sceneTiming);

            return {
                id: asString(marker.id, `marker_${index + 1}`),
                label: asString(marker.label, fallbackScene?.title || `Marker ${index + 1}`),
                sceneId,
                kind,
                ...(anchor ? { anchor } : {}),
                atMs: resolveMarkerAtMs(marker, sceneTiming)
            };
        }).filter((marker) => marker.sceneId || Number.isFinite(Number(marker.atMs)))
            .sort((left, right) => {
                if (left.atMs !== right.atMs) {
                    return left.atMs - right.atMs;
                }

                if (getMarkerAnchorOrder(left.anchor) !== getMarkerAnchorOrder(right.anchor)) {
                    return getMarkerAnchorOrder(left.anchor) - getMarkerAnchorOrder(right.anchor);
                }

                return getMarkerKindOrder(left.kind) - getMarkerKindOrder(right.kind);
            })
        : derivedMarkers;

    return {
        enabled: outlineTimeline?.enabled !== false && sceneTracks.length > 0,
        autoplay: outlineTimeline?.autoplay === true,
        subtitleMode: asString(outlineTimeline?.subtitleMode, 'voiceover-placeholder'),
        totalDurationMs: cursor > 0 ? cursor : null,
        sceneTracks,
        markers,
        audioTracks
    };
}

function buildTextElement(id, type, content) {
    return {
        id,
        type,
        content: asString(content, ''),
        props: {}
    };
}

function buildListElement(id, content) {
    return {
        id,
        type: 'bulletList',
        content: asArray(content).map((item) => asString(item)).filter(Boolean),
        props: {}
    };
}

function buildCodeElement(id, content) {
    return {
        id,
        type: 'code',
        content: asArray(content).map((item) => asString(item)).filter(Boolean).join('\n'),
        props: {}
    };
}

function buildQuoteElements(baseId, slide, contentItems) {
    const elements = [];
    const quoteText = contentItems[0] || slide.title;
    const quoteMeta = slide.subtitle || contentItems[1] || '';

    if (quoteText) {
        elements.push({
            id: `${baseId}_quote`,
            type: 'quote',
            content: asString(quoteText, ''),
            props: {}
        });
    }

    if (quoteMeta) {
        elements.push(buildTextElement(`${baseId}_meta`, 'text', quoteMeta));
    }

    return elements;
}

function inferAssetSourceKind(source) {
    const normalized = asString(source, '').trim();
    if (/^https?:\/\//i.test(normalized)) {
        return 'remote';
    }

    if (normalized.startsWith('/')) {
        return 'public';
    }

    return 'presentation';
}

function resolveAssetSource(source) {
    const normalized = asString(source, '').trim();
    const kind = inferAssetSourceKind(normalized);

    if (kind === 'remote') {
        return {
            kind,
            path: '',
            url: normalized
        };
    }

    if (kind === 'public') {
        return {
            kind,
            path: normalized,
            url: ''
        };
    }

    return {
        kind,
        path: normalized.startsWith('/') ? normalized : `/assets/${normalized}`,
        url: ''
    };
}

function createSceneMediaAsset(presentationId, sceneId, media) {
    if (!media || !media.source) {
        return null;
    }

    return createMediaAssetV1({
        id: `asset_${sceneId}_media`,
        presentationId,
        type: media.type === 'video' ? 'video' : 'image',
        source: resolveAssetSource(media.source),
        mimeType: asString(media.mimeType, ''),
        status: 'ready',
        meta: {
            alt: asString(media.alt, ''),
            caption: asString(media.caption, ''),
            poster: asString(media.poster, ''),
            autoplay: Boolean(media.autoplay),
            loop: Boolean(media.loop)
        }
    });
}

function createTimelineAudioAsset(presentationId, audioTrack) {
    if (!audioTrack || !audioTrack.source) {
        return null;
    }

    const assetId = asString(audioTrack.assetId, '').trim() || `asset_${audioTrack.id}`;

    return createMediaAssetV1({
        id: assetId,
        presentationId,
        type: 'audio',
        source: resolveAssetSource(audioTrack.source),
        mimeType: asString(audioTrack.mimeType, ''),
        status: 'ready',
        meta: {
            label: asString(audioTrack.label, ''),
            autoplay: Boolean(audioTrack.autoplay),
            loop: Boolean(audioTrack.loop),
            gain: Number.isFinite(Number(audioTrack.gain)) ? Number(audioTrack.gain) : 1
        }
    });
}

function buildTimelineAudioTracks(presentationId, outlineTimeline) {
    const audioTracks = Array.isArray(outlineTimeline?.audioTracks)
        ? outlineTimeline.audioTracks
        : [];

    return audioTracks.map((track, index) => {
        const normalizedId = asString(track.id, `audio_track_${index + 1}`);
        const asset = createTimelineAudioAsset(presentationId, {
            ...track,
            id: normalizedId
        });

        return {
            asset,
            track: {
                id: normalizedId,
                assetId: asset?.id || asString(track.assetId, ''),
                source: asset ? '' : asString(track.source, ''),
                label: asString(track.label, `Audio ${index + 1}`),
                startMs: Number.isFinite(Number(track.startMs)) ? Number(track.startMs) : 0,
                autoplay: track.autoplay === true,
                loop: track.loop === true,
                gain: Number.isFinite(Number(track.gain)) ? Number(track.gain) : 1,
                status: asset || track.assetId ? 'ready' : 'pending'
            }
        };
    });
}

function withAnimation(element, animationName) {
    if (!animationName) {
        return element;
    }

    return {
        ...element,
        props: {
            ...(element.props || {}),
            animation: animationName
        }
    };
}

function buildSceneElements(sceneId, slide, sceneKind, mediaAsset, motion) {
    const contentItems = asArray(slide.content).map((item) => asString(item)).filter(Boolean);
    const elements = [];

    if (slide.title) {
        elements.push(withAnimation(
            buildTextElement(`${sceneId}_heading`, 'heading', slide.title),
            motion.heading
        ));
    }

    if (slide.subtitle) {
        elements.push(withAnimation(
            buildTextElement(`${sceneId}_subtitle`, 'text', slide.subtitle),
            motion.subtitle
        ));
    }

    if (contentItems.length > 0) {
        if (sceneKind === 'code') {
            elements.push(withAnimation(
                buildCodeElement(`${sceneId}_code`, contentItems),
                motion.content
            ));
        } else if (sceneKind === 'quote') {
            elements.push(...buildQuoteElements(sceneId, slide, contentItems).map((element) => withAnimation(element, motion.content)));
        } else {
            elements.push(withAnimation(
                buildListElement(`${sceneId}_content`, contentItems),
                motion.content
            ));
        }
    }

    if (mediaAsset) {
        elements.push({
            id: `${sceneId}_media`,
            type: mediaAsset.type === 'video' ? 'video' : 'image',
            mediaAssetId: mediaAsset.id,
            content: asString(slide.media?.caption || slide.media?.alt || '', ''),
            props: {
                animation: motion.media,
                alt: asString(slide.media?.alt, ''),
                caption: asString(slide.media?.caption, ''),
                poster: asString(slide.media?.poster, ''),
                autoplay: Boolean(slide.media?.autoplay),
                loop: Boolean(slide.media?.loop)
            }
        });
    }

    return elements;
}

function adaptSlideToScene(slide, index, presentationId) {
    const slideType = asString(slide.type, 'content').toLowerCase();
    const sceneKind = sceneKindFromSlideType(slideType);
    const sceneId = `scene_${String(index + 1).padStart(3, '0')}`;
    const contentItems = asArray(slide.content).map((item) => asString(item)).filter(Boolean);
    const mediaAsset = createSceneMediaAsset(presentationId, sceneId, slide.media);
    const motion = resolveSceneMotion(slide, sceneKind);
    const transition = resolveSceneTransition(slide, sceneKind, mediaAsset);
    const durationMs = estimateSceneDurationMs(slide, sceneKind, mediaAsset, transition);
    const voiceover = buildVoiceoverPlaceholder(sceneId, slide, durationMs);

    return {
        scene: createSceneV1({
            id: sceneId,
            kind: sceneKind,
            layout: layoutFromSceneKind(sceneKind),
            title: asString(slide.title, ''),
            subtitle: asString(slide.subtitle, ''),
            durationMs,
            motion,
            transition,
            mediaRefs: mediaAsset ? [mediaAsset.id] : [],
            elements: buildSceneElements(sceneId, slide, sceneKind, mediaAsset, motion),
            legacy: {
                slideType,
                content: contentItems
            }
        }),
        asset: mediaAsset,
        voiceover
    };
}

function adaptOutlineToPresentation(input = {}) {
    const normalizedOutline = normalizeOutline(input.outline || {});
    const presentationId = asString(input.presentationId || input.id, 'pres_unknown');
    const scenePairs = normalizedOutline.slides.map((slide, index) => adaptSlideToScene(slide, index, presentationId));
    const scenes = scenePairs.map((item) => item.scene);
    const sceneAssets = scenePairs.map((item) => item.asset).filter(Boolean);
    const timelineAudioPairs = buildTimelineAudioTracks(presentationId, normalizedOutline.timeline);
    const audioAssets = timelineAudioPairs.map((item) => item.asset).filter(Boolean);
    const assets = [...sceneAssets, ...audioAssets];
    const voiceover = scenePairs.map((item) => item.voiceover).filter(Boolean);
    const html = typeof input.html === 'string' ? input.html : '';
    const status = asString(input.status, html ? 'ready' : 'draft');
    const build = input.build && typeof input.build === 'object'
        ? input.build
        : {
            progress: status === 'ready' ? 100 : 0,
            step: status === 'ready' ? 5 : 1,
            message: '',
            error: null
        };

    return createPresentationV1({
        id: presentationId,
        status,
        build,
        meta: {
            title: normalizedOutline.title,
            subtitle: normalizedOutline.subtitle,
            purpose: asString(input.purpose, ''),
            length: asString(input.length, ''),
            ownerId: asString(input.ownerId, ''),
            createdAt: asString(input.createdAt, ''),
            updatedAt: asString(input.updatedAt, '')
        },
        theme: {
            presetId: asString(input.styleId, DEFAULT_STYLE_ID)
        },
        sceneOrder: scenes.map((scene) => scene.id),
        scenes,
        assets,
        voiceover,
        timeline: buildTimeline(
            scenes,
            normalizedOutline.timeline,
            timelineAudioPairs.map((item) => item.track)
        ),
        outputs: {
            html: {
                status: html ? 'ready' : 'pending',
                content: html
            }
        },
        legacy: {
            outlineSnapshot: normalizedOutline
        }
    });
}

module.exports = {
    adaptOutlineToPresentation
};
