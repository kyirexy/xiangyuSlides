window.XiangyuCreateDeckState = window.XiangyuCreateDeckState || {};

(function bootstrapCreateDeckState(namespace) {
    function normalizeIndex(index, length, fallback = null) {
        if (!Number.isInteger(Number(length)) || Number(length) <= 0) {
            return fallback;
        }

        if (!Number.isInteger(Number(index))) {
            return fallback;
        }

        return Math.min(Math.max(0, Number(index)), Number(length) - 1);
    }

    function normalizeSceneIndex(index, sceneCount) {
        return normalizeIndex(index, sceneCount, 0) ?? 0;
    }

    function resolveSelectionState(options = {}) {
        const timeline = options.timeline && typeof options.timeline === 'object'
            ? options.timeline
            : { markers: [], audioTracks: [] };
        const sceneVoiceover = Array.isArray(options.sceneVoiceover) ? options.sceneVoiceover : [];
        const sceneCount = Math.max(1, Number(options.sceneCount) || 1);
        const resetSelection = options.resetSelection === true;

        const selectedDeckMarkerIndex = resetSelection
            ? null
            : normalizeIndex(options.selectedDeckMarkerIndex, Array.isArray(timeline.markers) ? timeline.markers.length : 0, null);
        const selectedDeckAudioIndex = resetSelection
            ? null
            : normalizeIndex(options.selectedDeckAudioIndex, Array.isArray(timeline.audioTracks) ? timeline.audioTracks.length : 0, null);
        const selectedDeckVoiceoverSceneIndex = resetSelection
            ? 0
            : normalizeSceneIndex(options.selectedDeckVoiceoverSceneIndex, sceneCount);

        const createDefaultVoiceover = typeof options.createDefaultVoiceover === 'function'
            ? options.createDefaultVoiceover
            : (sceneIndex) => ({
                sceneIndex,
                language: 'en',
                text: '',
                cues: []
            });

        const activeVoiceoverEntry = sceneVoiceover.find((entry) => Number(entry?.sceneIndex) === selectedDeckVoiceoverSceneIndex)
            || createDefaultVoiceover(selectedDeckVoiceoverSceneIndex);
        const activeVoiceoverCues = Array.isArray(activeVoiceoverEntry?.cues) ? activeVoiceoverEntry.cues : [];
        const selectedDeckCueIndex = resetSelection
            ? null
            : normalizeIndex(options.selectedDeckCueIndex, activeVoiceoverCues.length, null);

        return {
            selectedDeckMarkerIndex,
            selectedDeckAudioIndex,
            selectedDeckVoiceoverSceneIndex,
            selectedDeckCueIndex,
            activeVoiceoverEntry,
            activeVoiceoverCues
        };
    }

    namespace.resolveSelectionState = resolveSelectionState;
})(window.XiangyuCreateDeckState);
