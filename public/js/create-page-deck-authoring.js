window.XiangyuCreateDeckAuthoring = window.XiangyuCreateDeckAuthoring || {};

(function bootstrapCreateDeckAuthoring(namespace) {
    function asText(value, fallback = '') {
        if (value === null || value === undefined) {
            return fallback;
        }

        return String(value).trim() || fallback;
    }

    function asNonNegativeInteger(value, fallback = 0) {
        return Number.isFinite(Number(value)) ? Math.max(0, Math.round(Number(value))) : fallback;
    }

    function normalizeMarkerKind(value) {
        const normalized = String(value || '').trim().toLowerCase();
        if (normalized === 'navigation' || normalized === 'nav') {
            return 'navigation';
        }

        if (normalized === 'narration' || normalized === 'voiceover' || normalized === 'subtitle') {
            return 'narration';
        }

        if (normalized === 'edit' || normalized === 'editorial' || normalized === 'note') {
            return 'edit';
        }

        return 'navigation';
    }

    function normalizeMarkerAnchor(value) {
        const normalized = String(value || '').trim().toLowerCase();
        if (normalized === 'advance' || normalized === 'exit' || normalized === 'start') {
            return normalized;
        }

        return 'start';
    }

    function normalizeMarker(marker, index) {
        if (!marker) {
            return null;
        }

        if (typeof marker === 'string') {
            return {
                label: marker.trim() || `Marker ${index + 1}`,
                sceneIndex: index,
                kind: 'navigation',
                anchor: 'start'
            };
        }

        if (typeof marker !== 'object') {
            return null;
        }

        const normalized = {
            label: asText(marker.label, `Marker ${index + 1}`),
            kind: normalizeMarkerKind(marker.kind || marker.type || marker.use || marker.role),
            anchor: normalizeMarkerAnchor(marker.anchor || marker.phase)
        };

        if (marker.id) {
            normalized.id = asText(marker.id);
        }

        if (marker.sceneId) {
            normalized.sceneId = asText(marker.sceneId);
        }

        if (marker.generated === true) {
            normalized.generated = true;
        }

        if (marker.generatedBy) {
            normalized.generatedBy = asText(marker.generatedBy);
        }

        if (marker.starterTemplate) {
            normalized.starterTemplate = asText(marker.starterTemplate);
        }

        if (marker.starterPurpose) {
            normalized.starterPurpose = asText(marker.starterPurpose);
        }

        if (marker.generatedAt) {
            normalized.generatedAt = asText(marker.generatedAt);
        }

        if (Number.isInteger(Number(marker.sceneIndex))) {
            normalized.sceneIndex = Math.max(0, Number(marker.sceneIndex));
        }

        if (marker.atMs !== null && marker.atMs !== undefined && Number.isFinite(Number(marker.atMs))) {
            normalized.atMs = asNonNegativeInteger(marker.atMs, 0);
        }

        return normalized;
    }

    function normalizeAudioTrack(track, index) {
        if (!track) {
            return null;
        }

        if (typeof track === 'string') {
            return {
                label: `Audio ${index + 1}`,
                source: track.trim(),
                startMs: 0
            };
        }

        if (typeof track !== 'object') {
            return null;
        }

        const normalized = {
            label: asText(track.label, `Audio ${index + 1}`),
            startMs: asNonNegativeInteger(track.startMs, 0),
            autoplay: track.autoplay === true,
            loop: track.loop === true
        };

        if (track.id) {
            normalized.id = asText(track.id);
        }

        if (track.assetId) {
            normalized.assetId = asText(track.assetId);
        }

        if (track.source) {
            normalized.source = asText(track.source);
        }

        if (Number.isFinite(Number(track.gain))) {
            normalized.gain = Math.max(0, Math.min(1, Number(track.gain)));
        }

        return normalized.source || normalized.assetId ? normalized : null;
    }

    function normalizeCue(cue, index) {
        if (!cue) {
            return null;
        }

        const rawCue = typeof cue === 'string'
            ? { text: cue, atMs: index * 1000 }
            : (typeof cue === 'object' ? cue : null);

        if (!rawCue) {
            return null;
        }

        const text = asText(rawCue.text);
        if (!text) {
            return null;
        }

        return {
            atMs: asNonNegativeInteger(rawCue.atMs, 0),
            text
        };
    }

    function normalizeSceneVoiceover(entry, index, options = {}) {
        if (!entry || typeof entry !== 'object') {
            return null;
        }

        const locale = String(options.locale || '').trim().toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
        const sceneIndex = asNonNegativeInteger(entry.sceneIndex, Math.max(0, index));
        const text = asText(entry.text);
        const language = asText(entry.language, locale);
        const cues = Array.isArray(entry.cues)
            ? entry.cues
                .map((cue, cueIndex) => normalizeCue(cue, cueIndex))
                .filter(Boolean)
                .sort((left, right) => left.atMs - right.atMs)
            : [];

        if (!text && cues.length === 0) {
            return null;
        }

        return {
            sceneIndex,
            language,
            text,
            cues,
            ...(entry.generated === true ? { generated: true } : {}),
            ...(entry.generatedBy ? { generatedBy: asText(entry.generatedBy) } : {}),
            ...(entry.starterTemplate ? { starterTemplate: asText(entry.starterTemplate) } : {}),
            ...(entry.starterPurpose ? { starterPurpose: asText(entry.starterPurpose) } : {}),
            ...(entry.generatedAt ? { generatedAt: asText(entry.generatedAt) } : {})
        };
    }

    function normalizeSceneVoiceoverList(entries, options = {}) {
        return Array.isArray(entries)
            ? entries.map((entry, index) => normalizeSceneVoiceover(entry, index, options)).filter(Boolean)
            : [];
    }

    function normalizeSubtitleMode(value) {
        const requested = String(value || '').trim().toLowerCase();
        if (requested === 'static' || requested === 'caption' || requested === 'captions' || requested === 'subtitle' || requested === 'subtitles') {
            return 'static';
        }

        if (requested === 'off') {
            return 'off';
        }

        return 'voiceover-placeholder';
    }

    function normalizeTimeline(timeline, options = {}) {
        const fallback = {
            enabled: true,
            autoplay: false,
            subtitleMode: 'voiceover-placeholder',
            markers: [],
            audioTracks: []
        };

        if (!timeline || typeof timeline !== 'object') {
            return { ...fallback };
        }

        return {
            enabled: timeline.enabled !== false,
            autoplay: timeline.autoplay === true,
            subtitleMode: normalizeSubtitleMode(timeline.subtitleMode),
            markers: Array.isArray(timeline.markers)
                ? timeline.markers.map((marker, index) => normalizeMarker(marker, index)).filter(Boolean)
                : [],
            audioTracks: Array.isArray(timeline.audioTracks)
                ? timeline.audioTracks.map((track, index) => normalizeAudioTrack(track, index)).filter(Boolean)
                : [],
            sceneVoiceover: normalizeSceneVoiceoverList(timeline.sceneVoiceover, options)
        };
    }

    function getDefaultMarker() {
        return {
            label: '',
            sceneIndex: 0,
            kind: 'navigation',
            anchor: 'start'
        };
    }

    function getDefaultAudioTrack() {
        return {
            label: '',
            source: '',
            startMs: 0,
            autoplay: false,
            loop: false
        };
    }

    function getDefaultVoiceover(sceneIndex = 0, options = {}) {
        const locale = String(options.locale || '').trim().toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
        return {
            sceneIndex: asNonNegativeInteger(sceneIndex, 0),
            language: locale,
            text: '',
            cues: []
        };
    }

    namespace.normalizeMarkerKind = normalizeMarkerKind;
    namespace.normalizeMarkerAnchor = normalizeMarkerAnchor;
    namespace.normalizeMarker = normalizeMarker;
    namespace.normalizeAudioTrack = normalizeAudioTrack;
    namespace.normalizeCue = normalizeCue;
    namespace.normalizeSceneVoiceover = normalizeSceneVoiceover;
    namespace.normalizeSceneVoiceoverList = normalizeSceneVoiceoverList;
    namespace.normalizeTimeline = normalizeTimeline;
    namespace.getDefaultMarker = getDefaultMarker;
    namespace.getDefaultAudioTrack = getDefaultAudioTrack;
    namespace.getDefaultVoiceover = getDefaultVoiceover;
})(window.XiangyuCreateDeckAuthoring);
