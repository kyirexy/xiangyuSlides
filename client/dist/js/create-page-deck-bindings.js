window.XiangyuCreateDeckBindings = window.XiangyuCreateDeckBindings || {};

(function bootstrapCreateDeckBindings(namespace) {
    function bindDeckToolingEvents(studio) {
        const elements = studio?.elements;
        if (!studio || !elements) {
            return;
        }

        elements.deckTimelineEnabled?.addEventListener('change', () => {
            studio.updateDeckTimelineSetting({
                enabled: elements.deckTimelineEnabled.checked
            });
        });

        elements.deckTimelineAutoplay?.addEventListener('change', () => {
            studio.updateDeckTimelineSetting({
                autoplay: elements.deckTimelineAutoplay.checked
            });
        });

        elements.deckSubtitleModeSelect?.addEventListener('change', () => {
            studio.updateDeckTimelineSetting({
                subtitleMode: elements.deckSubtitleModeSelect.value
            });
        });

        elements.deckTimelineStarterSelect?.addEventListener('change', () => {
            studio.deckTimelineStarterTemplate = studio.normalizeDeckTimelineStarterTemplate(
                elements.deckTimelineStarterSelect.value
            );
        });

        elements.deckTimelineStarterApplyBtn?.addEventListener('click', () => studio.applyDeckTimelineStarter());
        elements.deckTimelineStarterResetBtn?.addEventListener('click', () => studio.resetDeckTimelineStarter());

        elements.deckMarkerAddBtn?.addEventListener('click', () => studio.addDeckMarker());
        elements.deckMarkerGenerateBtn?.addEventListener('click', () => studio.generateDeckNavigationMarkers());
        elements.deckMarkerGenerateEditBtn?.addEventListener('click', () => studio.generateDeckEditMarkers());
        elements.deckMarkerGenerateSuiteBtn?.addEventListener('click', () => studio.generateDeckMarkerSuite());
        elements.deckMarkerClearGeneratedBtn?.addEventListener('click', () => studio.clearGeneratedDeckMarkers());
        elements.deckMarkerApplyBtn?.addEventListener('click', () => studio.applySelectedDeckMarker());
        elements.deckMarkerRemoveBtn?.addEventListener('click', () => studio.removeSelectedDeckMarker());

        elements.deckAudioAddBtn?.addEventListener('click', () => studio.addDeckAudioTrack());
        elements.deckAudioTemplateSelect?.addEventListener('change', () => {
            studio.deckAudioTemplateKey = studio.normalizeDeckAudioPresetKey(
                elements.deckAudioTemplateSelect.value
            );
        });
        elements.deckAudioTemplateApplyBtn?.addEventListener('click', () => studio.applyDeckAudioTemplate());
        elements.deckAudioApplyBtn?.addEventListener('click', () => studio.applySelectedDeckAudioTrack());
        elements.deckAudioDuplicateBtn?.addEventListener('click', () => studio.duplicateSelectedDeckAudioTrack());
        elements.deckAudioRemoveBtn?.addEventListener('click', () => studio.removeSelectedDeckAudioTrack());

        elements.deckVoiceoverSceneSelect?.addEventListener('change', () => {
            studio.setSelectedDeckVoiceoverScene(
                Number.isFinite(Number(elements.deckVoiceoverSceneSelect.value))
                    ? Math.max(0, Math.round(Number(elements.deckVoiceoverSceneSelect.value)))
                    : 0
            );
        });

        elements.deckVoiceoverLanguageSelect?.addEventListener('change', () => {
            if (studio.modalMode === 'deck') {
                studio.updateDeckVoiceoverSceneDraft({ sync: true });
            }
        });

        elements.deckVoiceoverCopyPrevBtn?.addEventListener('click', () => studio.copyPreviousDeckVoiceoverScene());
        elements.deckVoiceoverCopyNextBtn?.addEventListener('click', () => studio.copyNextDeckVoiceoverScene());
        elements.deckVoiceoverGenerateMarkersBtn?.addEventListener('click', () => studio.generateDeckNarrationMarkers());
        elements.deckVoiceoverGenerateBtn?.addEventListener('click', () => studio.generateDeckVoiceoverPlaceholders());
        elements.deckVoiceoverClearGeneratedBtn?.addEventListener('click', () => studio.clearGeneratedDeckVoiceover());

        elements.deckVoiceoverTextInput?.addEventListener('input', () => {
            if (studio.modalMode === 'deck') {
                studio.updateDeckVoiceoverSceneDraft({ sync: false });
            }
        });

        elements.deckCueAddBtn?.addEventListener('click', () => studio.addDeckCue());
        elements.deckCueGenerateBtn?.addEventListener('click', () => studio.generateDeckCueSet());
        elements.deckCueAppendBtn?.addEventListener('click', () => studio.appendDeckCueSet());
        elements.deckCueRetimeBtn?.addEventListener('click', () => studio.retimeDeckCues());
        elements.deckCueApplyBtn?.addEventListener('click', () => studio.applySelectedDeckCue());
        elements.deckCueDuplicateBtn?.addEventListener('click', () => studio.duplicateSelectedDeckCue());
        elements.deckCueRemoveBtn?.addEventListener('click', () => studio.removeSelectedDeckCue());
    }

    namespace.bindDeckToolingEvents = bindDeckToolingEvents;
})(window.XiangyuCreateDeckBindings);
