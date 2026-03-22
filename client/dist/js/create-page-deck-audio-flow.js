window.XiangyuCreateDeckAudioFlow = window.XiangyuCreateDeckAudioFlow || {};

(function bootstrapCreateDeckAudioFlow(namespace) {
    function buildTemplateTrack(options = {}) {
        const activeTrack = options.selectedTrack || options.formTrack || options.defaultTrack || {};
        const preserveSource = options.formSource || options.selectedTrack?.source || activeTrack.source || '';

        return options.applyAudioPresetToTrack(activeTrack, options.template, {
            locale: options.locale,
            purposeLabel: options.purposeLabel || '',
            preserveSource,
            preserveMimeType: activeTrack.mimeType || '',
            preserveAssetId: activeTrack.assetId || ''
        });
    }

    function buildDuplicatedTrack(options = {}) {
        const duplicate = options.buildDuplicateAudioTrack(options.track, {
            locale: options.locale,
            duplicateLabel: options.duplicateLabel,
            fallbackLabel: options.fallbackLabel || 'Audio Track',
            existingLabels: Array.isArray(options.audioTracks)
                ? options.audioTracks.map((item) => item?.label)
                : []
        });

        return options.normalizeAudioTrack
            ? (options.normalizeAudioTrack(duplicate, options.nextIndex ?? 0) || duplicate)
            : duplicate;
    }

    namespace.buildTemplateTrack = buildTemplateTrack;
    namespace.buildDuplicatedTrack = buildDuplicatedTrack;
})(window.XiangyuCreateDeckAudioFlow);
