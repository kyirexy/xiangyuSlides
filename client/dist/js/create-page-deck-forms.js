window.XiangyuCreateDeckForms = window.XiangyuCreateDeckForms || {};

(function bootstrapCreateDeckForms(namespace) {
    function readMarkerForm(elements, options = {}) {
        const normalizeMarker = typeof options.normalizeMarker === 'function' ? options.normalizeMarker : null;
        if (!normalizeMarker) {
            return null;
        }

        return normalizeMarker({
            label: elements?.deckMarkerLabelInput?.value || '',
            sceneIndex: Number(elements?.deckMarkerSceneSelect?.value || 0),
            kind: elements?.deckMarkerKindSelect?.value || 'navigation',
            anchor: elements?.deckMarkerAnchorSelect?.value || 'start'
        }, options.selectedIndex ?? 0);
    }

    function applyMarkerForm(elements, marker, options = {}) {
        const normalizeMarker = typeof options.normalizeMarker === 'function' ? options.normalizeMarker : null;
        const getDefaultMarker = typeof options.getDefaultMarker === 'function' ? options.getDefaultMarker : null;
        const normalized = normalizeMarker
            ? (normalizeMarker(marker, options.selectedIndex ?? 0) || (getDefaultMarker ? getDefaultMarker() : null))
            : marker;
        const activeMarker = normalized || { label: '', sceneIndex: 0, kind: 'navigation', anchor: 'start' };

        if (elements?.deckMarkerLabelInput) {
            elements.deckMarkerLabelInput.value = activeMarker.label || '';
        }

        if (elements?.deckMarkerSceneSelect) {
            elements.deckMarkerSceneSelect.value = String(
                Number.isInteger(Number(activeMarker.sceneIndex))
                    ? Math.max(0, Number(activeMarker.sceneIndex))
                    : 0
            );
        }

        if (elements?.deckMarkerKindSelect) {
            elements.deckMarkerKindSelect.value = activeMarker.kind || 'navigation';
        }

        if (elements?.deckMarkerAnchorSelect) {
            elements.deckMarkerAnchorSelect.value = activeMarker.anchor || 'start';
        }
    }

    function readAudioForm(elements, options = {}) {
        const normalizeAudioTrack = typeof options.normalizeAudioTrack === 'function' ? options.normalizeAudioTrack : null;
        const notify = typeof options.notify === 'function' ? options.notify : null;
        const rawSource = String(elements?.deckAudioSourceInput?.value || '').trim();
        if (!rawSource) {
            if (options.notifyOnError && notify && options.missingSourceMessage) {
                notify(options.missingSourceMessage, 'error');
            }
            return null;
        }

        const rawGain = String(elements?.deckAudioGainInput?.value || '').trim();
        const normalized = normalizeAudioTrack
            ? normalizeAudioTrack({
                label: elements?.deckAudioLabelInput?.value || '',
                source: rawSource,
                startMs: Number(elements?.deckAudioStartInput?.value || 0),
                gain: rawGain === '' ? undefined : Number(rawGain),
                autoplay: elements?.deckAudioAutoplay?.checked === true,
                loop: elements?.deckAudioLoop?.checked === true
            }, options.selectedIndex ?? 0)
            : null;

        if (!normalized && options.notifyOnError && notify && options.missingSourceMessage) {
            notify(options.missingSourceMessage, 'error');
        }

        return normalized;
    }

    function applyAudioForm(elements, track, options = {}) {
        const normalizeAudioTrack = typeof options.normalizeAudioTrack === 'function' ? options.normalizeAudioTrack : null;
        const getDefaultAudioTrack = typeof options.getDefaultAudioTrack === 'function' ? options.getDefaultAudioTrack : null;
        const normalized = normalizeAudioTrack
            ? (normalizeAudioTrack(track, options.selectedIndex ?? 0) || (getDefaultAudioTrack ? getDefaultAudioTrack() : null))
            : track;
        const activeTrack = normalized || { label: '', source: '', startMs: 0, autoplay: false, loop: false };

        if (elements?.deckAudioLabelInput) {
            elements.deckAudioLabelInput.value = activeTrack.label || '';
        }

        if (elements?.deckAudioSourceInput) {
            elements.deckAudioSourceInput.value = activeTrack.source || '';
        }

        if (elements?.deckAudioStartInput) {
            elements.deckAudioStartInput.value = String(
                Number.isFinite(Number(activeTrack.startMs)) ? Math.max(0, Number(activeTrack.startMs)) : 0
            );
        }

        if (elements?.deckAudioGainInput) {
            elements.deckAudioGainInput.value = Number.isFinite(Number(activeTrack.gain))
                ? String(Number(activeTrack.gain))
                : '';
        }

        if (elements?.deckAudioAutoplay) {
            elements.deckAudioAutoplay.checked = activeTrack.autoplay === true;
        }

        if (elements?.deckAudioLoop) {
            elements.deckAudioLoop.checked = activeTrack.loop === true;
        }
    }

    function readSelectedVoiceoverSceneIndex(elements, fallback = 0) {
        return Number.isFinite(Number(elements?.deckVoiceoverSceneSelect?.value))
            ? Math.max(0, Math.round(Number(elements.deckVoiceoverSceneSelect.value)))
            : Math.max(0, Number(fallback) || 0);
    }

    function readVoiceoverEntryForm(elements, existingEntry = null, options = {}) {
        const normalizeSceneVoiceover = typeof options.normalizeSceneVoiceover === 'function' ? options.normalizeSceneVoiceover : null;
        const sceneIndex = readSelectedVoiceoverSceneIndex(elements, options.selectedSceneIndex ?? 0);
        const cues = Array.isArray(existingEntry?.cues) ? existingEntry.cues : [];

        return normalizeSceneVoiceover
            ? normalizeSceneVoiceover({
                sceneIndex,
                language: elements?.deckVoiceoverLanguageSelect?.value || existingEntry?.language,
                text: elements?.deckVoiceoverTextInput?.value || '',
                cues
            }, sceneIndex)
            : null;
    }

    function applyVoiceoverForm(elements, entry, options = {}) {
        const normalizeSceneVoiceover = typeof options.normalizeSceneVoiceover === 'function' ? options.normalizeSceneVoiceover : null;
        const getDefaultVoiceover = typeof options.getDefaultVoiceover === 'function' ? options.getDefaultVoiceover : null;
        const selectedSceneIndex = Math.max(0, Number(options.selectedSceneIndex) || 0);
        const normalized = normalizeSceneVoiceover
            ? (normalizeSceneVoiceover(entry, selectedSceneIndex) || (getDefaultVoiceover ? getDefaultVoiceover(selectedSceneIndex) : null))
            : entry;
        const locale = String(options.locale || '').trim().toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
        const activeEntry = normalized || {
            sceneIndex: selectedSceneIndex,
            language: locale,
            text: '',
            cues: []
        };

        if (elements?.deckVoiceoverSceneSelect) {
            elements.deckVoiceoverSceneSelect.value = String(activeEntry.sceneIndex);
        }

        if (elements?.deckVoiceoverLanguageSelect) {
            elements.deckVoiceoverLanguageSelect.value = activeEntry.language || locale;
        }

        if (elements?.deckVoiceoverTextInput) {
            elements.deckVoiceoverTextInput.value = activeEntry.text || '';
        }
    }

    function readCueForm(elements, options = {}) {
        const normalizeCue = typeof options.normalizeCue === 'function' ? options.normalizeCue : null;
        const notify = typeof options.notify === 'function' ? options.notify : null;
        const text = String(elements?.deckCueTextInput?.value || '').trim();
        if (!text) {
            if (options.notifyOnError && notify && options.missingTextMessage) {
                notify(options.missingTextMessage, 'error');
            }
            return null;
        }

        return normalizeCue
            ? normalizeCue({
                atMs: Number(elements?.deckCueAtInput?.value || 0),
                text
            }, options.selectedIndex ?? 0)
            : null;
    }

    function applyCueForm(elements, cue, options = {}) {
        const normalizeCue = typeof options.normalizeCue === 'function' ? options.normalizeCue : null;
        const normalized = normalizeCue
            ? (normalizeCue(cue, options.selectedIndex ?? 0) || { atMs: 0, text: '' })
            : (cue || { atMs: 0, text: '' });

        if (elements?.deckCueAtInput) {
            elements.deckCueAtInput.value = String(
                Number.isFinite(Number(normalized.atMs)) ? Math.max(0, Number(normalized.atMs)) : 0
            );
        }

        if (elements?.deckCueTextInput) {
            elements.deckCueTextInput.value = normalized.text || '';
        }
    }

    namespace.readMarkerForm = readMarkerForm;
    namespace.applyMarkerForm = applyMarkerForm;
    namespace.readAudioForm = readAudioForm;
    namespace.applyAudioForm = applyAudioForm;
    namespace.readSelectedVoiceoverSceneIndex = readSelectedVoiceoverSceneIndex;
    namespace.readVoiceoverEntryForm = readVoiceoverEntryForm;
    namespace.applyVoiceoverForm = applyVoiceoverForm;
    namespace.readCueForm = readCueForm;
    namespace.applyCueForm = applyCueForm;
})(window.XiangyuCreateDeckForms);
