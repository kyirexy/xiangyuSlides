window.XiangyuCreateDeckAudioPresets = window.XiangyuCreateDeckAudioPresets || {};

(function bootstrapCreateDeckAudioPresets(namespace) {
    const PRESET_KEYS = ['ambient-bed', 'narration-track', 'intro-sting', 'loop-bed'];

    function asText(value, fallback = '') {
        if (value === null || value === undefined) {
            return fallback;
        }

        return String(value).trim() || fallback;
    }

    function resolveLocale(locale) {
        return String(locale || '').trim().toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    }

    function normalizeAudioPresetKey(value) {
        const normalized = String(value || '').trim().toLowerCase();
        return PRESET_KEYS.includes(normalized) ? normalized : 'ambient-bed';
    }

    function getAudioPresetKeys() {
        return [...PRESET_KEYS];
    }

    function getPresetLabelSuffix(key, locale) {
        const resolvedLocale = resolveLocale(locale);
        const suffixes = {
            'zh-CN': {
                'ambient-bed': '环境氛围',
                'narration-track': '旁白轨道',
                'intro-sting': '开场提示音',
                'loop-bed': '循环氛围'
            },
            en: {
                'ambient-bed': 'Ambient Bed',
                'narration-track': 'Narration Track',
                'intro-sting': 'Intro Sting',
                'loop-bed': 'Looping Bed'
            }
        };

        return suffixes[resolvedLocale]?.[key] || suffixes.en[key] || key;
    }

    function getPresetDefaults(key) {
        switch (normalizeAudioPresetKey(key)) {
            case 'narration-track':
                return {
                    startMs: 0,
                    gain: 1,
                    autoplay: false,
                    loop: false
                };
            case 'intro-sting':
                return {
                    startMs: 0,
                    gain: 0.82,
                    autoplay: true,
                    loop: false
                };
            case 'loop-bed':
                return {
                    startMs: 0,
                    gain: 0.45,
                    autoplay: true,
                    loop: true
                };
            case 'ambient-bed':
            default:
                return {
                    startMs: 0,
                    gain: 0.35,
                    autoplay: true,
                    loop: true
                };
        }
    }

    function buildAudioPreset(key, options = {}) {
        const normalizedKey = normalizeAudioPresetKey(key);
        const locale = resolveLocale(options.locale);
        const defaults = getPresetDefaults(normalizedKey);
        const purposeLabel = asText(options.purposeLabel);
        const suffix = getPresetLabelSuffix(normalizedKey, locale);

        return {
            presetKey: normalizedKey,
            label: purposeLabel ? `${purposeLabel} · ${suffix}` : suffix,
            source: '',
            startMs: defaults.startMs,
            gain: defaults.gain,
            autoplay: defaults.autoplay,
            loop: defaults.loop
        };
    }

    function applyAudioPresetToTrack(track, key, options = {}) {
        const baseTrack = track && typeof track === 'object' ? track : {};
        const preset = buildAudioPreset(key, options);

        return {
            ...baseTrack,
            ...preset,
            source: asText(options.preserveSource ?? baseTrack.source, ''),
            mimeType: asText(options.preserveMimeType ?? baseTrack.mimeType, ''),
            assetId: asText(options.preserveAssetId ?? baseTrack.assetId, '')
        };
    }

    function buildDuplicateLabel(baseLabel, options = {}) {
        const locale = resolveLocale(options.locale);
        const duplicateLabel = asText(options.duplicateLabel, locale === 'zh-CN' ? '副本' : 'Copy');
        const fallbackLabel = asText(options.fallbackLabel, locale === 'zh-CN' ? '音轨' : 'Audio Track');
        const existingLabels = Array.isArray(options.existingLabels)
            ? options.existingLabels.map((label) => asText(label).toLowerCase()).filter(Boolean)
            : [];
        const root = asText(baseLabel, fallbackLabel);
        let candidate = `${root} ${duplicateLabel}`.trim();
        let counter = 2;

        while (existingLabels.includes(candidate.toLowerCase())) {
            candidate = `${root} ${duplicateLabel} ${counter}`.trim();
            counter += 1;
        }

        return candidate;
    }

    function buildDuplicateAudioTrack(track, options = {}) {
        const baseTrack = track && typeof track === 'object' ? track : {};
        const duplicated = {
            ...baseTrack,
            label: buildDuplicateLabel(baseTrack.label, options)
        };

        delete duplicated.id;
        return duplicated;
    }

    namespace.normalizeAudioPresetKey = normalizeAudioPresetKey;
    namespace.getAudioPresetKeys = getAudioPresetKeys;
    namespace.buildAudioPreset = buildAudioPreset;
    namespace.applyAudioPresetToTrack = applyAudioPresetToTrack;
    namespace.buildDuplicateAudioTrack = buildDuplicateAudioTrack;
})(window.XiangyuCreateDeckAudioPresets);
