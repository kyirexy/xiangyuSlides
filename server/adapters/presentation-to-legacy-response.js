const { DEFAULT_STYLE_ID, getStyleInfo } = require('../generator/theme-registry');
const {
    createPresentationV1,
    isPresentationV1
} = require('../models/presentation-v1');

function asString(value, fallback = '') {
    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value);
}

function asArray(value) {
    return Array.isArray(value) ? value : [];
}

function asObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
}

function collectSceneContent(scene) {
    const legacyContent = asArray(scene?.legacy?.content).map((item) => asString(item)).filter(Boolean);
    if (legacyContent.length > 0) {
        return legacyContent;
    }

    const content = [];
    const subtitle = asString(scene?.subtitle, '');

    asArray(scene?.elements).forEach((element) => {
        if (!element || typeof element !== 'object') {
            return;
        }

        if (element.type === 'heading') {
            return;
        }

        if (element.type === 'bulletList' && Array.isArray(element.content)) {
            element.content.forEach((item) => {
                const normalized = asString(item, '');
                if (normalized) {
                    content.push(normalized);
                }
            });
            return;
        }

        if (element.type === 'code') {
            asString(element.content, '')
                .split(/\n+/)
                .map((item) => item.trim())
                .filter(Boolean)
                .forEach((item) => content.push(item));
            return;
        }

        if (element.type === 'image' || element.type === 'video') {
            return;
        }

        if (typeof element.content === 'string') {
            const normalized = asString(element.content, '');
            if (normalized && normalized !== subtitle) {
                content.push(normalized);
            }
        }
    });

    return content;
}

function buildLegacyMedia(scene, assetsById) {
    const mediaElement = asArray(scene?.elements).find((element) => {
        const type = asString(element?.type, '');
        return type === 'image' || type === 'video';
    });
    const mediaAssetId = asString(mediaElement?.mediaAssetId || scene?.mediaRefs?.[0], '');
    const asset = assetsById.get(mediaAssetId);

    if (!asset) {
        return null;
    }

    const props = asObject(mediaElement?.props) || {};
    const meta = asObject(asset.meta) || {};
    const source = asset.source?.url || asset.source?.path || '';
    if (!source) {
        return null;
    }

    const media = {
        type: asset.type === 'video' ? 'video' : 'image',
        source
    };

    if (asset.mimeType) {
        media.mimeType = asset.mimeType;
    }

    if (props.alt || meta.alt) {
        media.alt = asString(props.alt || meta.alt, '');
    }

    if (props.caption || meta.caption) {
        media.caption = asString(props.caption || meta.caption, '');
    }

    if (props.poster || meta.poster) {
        media.poster = asString(props.poster || meta.poster, '');
    }

    if (props.autoplay || meta.autoplay) {
        media.autoplay = Boolean(props.autoplay || meta.autoplay);
    }

    if (props.loop || meta.loop) {
        media.loop = Boolean(props.loop || meta.loop);
    }

    return media;
}

function buildLegacyAnimation(scene) {
    const motion = scene?.motion;
    if (!motion || typeof motion !== 'object') {
        return null;
    }

    const normalized = {
        scene: asString(motion.scene, '').trim(),
        heading: asString(motion.heading, '').trim(),
        subtitle: asString(motion.subtitle, '').trim(),
        content: asString(motion.content, '').trim(),
        media: asString(motion.media, '').trim()
    };
    const compact = Object.fromEntries(
        Object.entries(normalized).filter(([, value]) => Boolean(value))
    );

    return Object.keys(compact).length > 0 ? compact : null;
}

function buildLegacyTransition(scene) {
    const transition = scene?.transition;
    if (!transition || typeof transition !== 'object') {
        return null;
    }

    const normalized = {
        preset: asString(transition.preset, '').trim(),
        durationMs: Number.isFinite(Number(transition.durationMs)) ? Number(transition.durationMs) : null,
        enterMs: Number.isFinite(Number(transition.enterMs)) ? Number(transition.enterMs) : null,
        holdMs: Number.isFinite(Number(transition.holdMs)) ? Number(transition.holdMs) : null,
        exitMs: Number.isFinite(Number(transition.exitMs)) ? Number(transition.exitMs) : null,
        contentDelayMs: Number.isFinite(Number(transition.contentDelayMs)) ? Number(transition.contentDelayMs) : null,
        motionDurationMs: Number.isFinite(Number(transition.motionDurationMs)) ? Number(transition.motionDurationMs) : null,
        staggerStepMs: Number.isFinite(Number(transition.staggerStepMs)) ? Number(transition.staggerStepMs) : null,
        overlay: asString(transition.overlay, '').trim()
    };
    const compact = Object.fromEntries(
        Object.entries(normalized).filter(([, value]) => value !== null && value !== '')
    );

    return Object.keys(compact).length > 0 ? compact : null;
}

function buildLegacyVoiceover(scene, voiceoverBySceneId) {
    const entry = voiceoverBySceneId.get(asString(scene?.id, ''));
    if (!entry) {
        return null;
    }

    const voiceover = {
        text: asString(entry.text, ''),
        language: asString(entry.language, 'zh-CN')
    };

    if (Array.isArray(entry.cues) && entry.cues.length > 0) {
        voiceover.cues = entry.cues
            .map((cue) => ({
                atMs: Number.isFinite(Number(cue?.atMs)) ? Number(cue.atMs) : 0,
                text: asString(cue?.text, '')
            }))
            .filter((cue) => cue.text);
    }

    return voiceover.text || (voiceover.cues && voiceover.cues.length > 0) ? voiceover : null;
}

function buildLegacyAudioTrack(track, assetsById, index) {
    const asset = assetsById.get(asString(track?.assetId, ''));
    const source = asset?.source?.url || asset?.source?.path || asString(track?.source, '');
    if (!source && !track?.assetId) {
        return null;
    }

    return {
        id: asString(track?.id, `audio_track_${index + 1}`),
        assetId: asString(track?.assetId, ''),
        source,
        label: asString(track?.label, asset?.meta?.label || `Audio ${index + 1}`),
        startMs: Number.isFinite(Number(track?.startMs)) ? Number(track.startMs) : 0,
        autoplay: track?.autoplay === true,
        loop: track?.loop === true,
        gain: Number.isFinite(Number(track?.gain)) ? Number(track.gain) : 1,
        status: asString(track?.status, 'ready')
    };
}

function sceneToLegacySlide(scene, index, assetsById, voiceoverBySceneId) {
    const slide = {
        type: asString(scene?.legacy?.slideType || scene?.kind, 'content'),
        title: asString(scene?.title, `Slide ${index + 1}`),
        subtitle: asString(scene?.subtitle, ''),
        content: collectSceneContent(scene)
    };

    const media = buildLegacyMedia(scene, assetsById);
    if (media) {
        slide.media = media;
    }

    const animation = buildLegacyAnimation(scene);
    if (animation) {
        slide.animation = animation;
    }

    const transition = buildLegacyTransition(scene);
    if (transition) {
        slide.transition = transition;
    }

    if (Number.isFinite(Number(scene?.durationMs)) && Number(scene.durationMs) > 0) {
        slide.durationMs = Number(scene.durationMs);
    }

    const voiceover = buildLegacyVoiceover(scene, voiceoverBySceneId);
    if (voiceover) {
        slide.voiceover = voiceover;
    }

    return slide;
}

function toLegacyOutline(presentation) {
    const safePresentation = isPresentationV1(presentation)
        ? presentation
        : createPresentationV1(presentation || {});
    const assetsById = new Map(asArray(safePresentation.assets).map((asset) => [asset.id, asset]));
    const voiceoverBySceneId = new Map(
        asArray(safePresentation.voiceover)
            .filter((entry) => entry?.sceneId)
            .map((entry) => [entry.sceneId, entry])
    );

    const scenes = asArray(safePresentation.scenes);
    if (scenes.length > 0) {
        const outline = {
            title: asString(safePresentation.meta?.title, ''),
            subtitle: asString(safePresentation.meta?.subtitle, ''),
            slides: scenes.map((scene, index) => sceneToLegacySlide(scene, index, assetsById, voiceoverBySceneId))
        };

        if (safePresentation.timeline && Array.isArray(safePresentation.timeline.sceneTracks)) {
            outline.timeline = {
                autoplay: safePresentation.timeline.autoplay === true,
                enabled: safePresentation.timeline.enabled !== false,
                subtitleMode: asString(safePresentation.timeline.subtitleMode, 'voiceover-placeholder')
            };

            if (Array.isArray(safePresentation.timeline.markers) && safePresentation.timeline.markers.length > 0) {
                outline.timeline.markers = safePresentation.timeline.markers.map((marker, index) => ({
                    id: asString(marker?.id, `marker_${index + 1}`),
                    label: asString(marker?.label, `Marker ${index + 1}`),
                    sceneId: asString(marker?.sceneId, ''),
                    ...(asString(marker?.kind, '') ? { kind: asString(marker?.kind, '') } : {}),
                    ...(asString(marker?.anchor, '') ? { anchor: asString(marker?.anchor, '') } : {}),
                    atMs: Number.isFinite(Number(marker?.atMs)) ? Number(marker.atMs) : 0
                }));
            }

            if (Array.isArray(safePresentation.timeline.audioTracks) && safePresentation.timeline.audioTracks.length > 0) {
                outline.timeline.audioTracks = safePresentation.timeline.audioTracks
                    .map((track, index) => buildLegacyAudioTrack(track, assetsById, index))
                    .filter(Boolean);
            }
        }

        return outline;
    }

    if (safePresentation.legacy && safePresentation.legacy.outlineSnapshot) {
        return {
            title: asString(safePresentation.legacy.outlineSnapshot.title, ''),
            subtitle: asString(safePresentation.legacy.outlineSnapshot.subtitle, ''),
            timeline: safePresentation.legacy.outlineSnapshot.timeline || undefined,
            slides: asArray(safePresentation.legacy.outlineSnapshot.slides).map((slide, index) => ({
                type: asString(slide?.type, 'content'),
                title: asString(slide?.title, `Slide ${index + 1}`),
                subtitle: asString(slide?.subtitle, ''),
                content: asArray(slide?.content).map((item) => asString(item)).filter(Boolean),
                durationMs: Number.isFinite(Number(slide?.durationMs)) ? Number(slide.durationMs) : undefined,
                media: slide?.media || undefined,
                animation: slide?.animation || undefined,
                transition: slide?.transition || undefined,
                voiceover: slide?.voiceover || undefined
            }))
        };
    }

    return {
        title: asString(safePresentation.meta?.title, ''),
        subtitle: asString(safePresentation.meta?.subtitle, ''),
        slides: []
    };
}

function toLegacyStyle(presentation) {
    const presetId = asString(presentation?.theme?.presetId, DEFAULT_STYLE_ID);
    const preset = getStyleInfo(presetId);

    return {
        id: presetId,
        name: preset?.name || presetId,
        vibe: preset?.vibe || '',
        category: preset?.category || ''
    };
}

function toLegacyPresentationResponse(presentation, options = {}) {
    const safePresentation = isPresentationV1(presentation)
        ? presentation
        : createPresentationV1(presentation || {});
    const outline = toLegacyOutline(safePresentation);
    const html = asString(safePresentation.outputs?.html?.content, '');
    const pptxUrl = asString(
        options.pptxUrl,
        `/api/presentations/${asString(safePresentation.id, 'pres_unknown')}/export.pptx`
    );

    return {
        id: asString(safePresentation.id, 'pres_unknown'),
        status: asString(safePresentation.status, 'draft'),
        progress: Number.isFinite(Number(safePresentation.build?.progress))
            ? Number(safePresentation.build.progress)
            : 0,
        step: Number.isFinite(Number(safePresentation.build?.step))
            ? Number(safePresentation.build.step)
            : 1,
        message: asString(safePresentation.build?.message, ''),
        title: asString(safePresentation.meta?.title, outline.title),
        createdAt: asString(safePresentation.meta?.createdAt, ''),
        updatedAt: asString(safePresentation.meta?.updatedAt, ''),
        style: toLegacyStyle(safePresentation),
        outline,
        timeline: safePresentation.timeline || null,
        voiceover: asArray(safePresentation.voiceover),
        html,
        pptxUrl
    };
}

module.exports = {
    toLegacyPresentationResponse,
    toLegacyOutline
};
