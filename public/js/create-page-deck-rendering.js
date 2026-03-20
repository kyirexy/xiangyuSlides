window.XiangyuCreateDeckRendering = window.XiangyuCreateDeckRendering || {};

(function bootstrapCreateDeckRendering(namespace) {
    function renderEmptyState(message, escapeHtml) {
        const safeEscape = typeof escapeHtml === 'function' ? escapeHtml : (value) => String(value || '');
        return `<div class="deck-marker-empty">${safeEscape(message || '')}</div>`;
    }

    function renderMarkerList(options = {}) {
        const {
            markers = [],
            selectedIndex = null,
            placeholderText = '',
            getSceneLabel,
            getKindLabel,
            getAnchorLabel,
            escapeHtml
        } = options;
        const safeEscape = typeof escapeHtml === 'function' ? escapeHtml : (value) => String(value || '');

        return markers.map((marker, index) => {
            const sceneIndex = Number.isInteger(Number(marker?.sceneIndex)) ? Number(marker.sceneIndex) : index;
            const label = marker?.label || placeholderText;
            const sceneLabel = typeof getSceneLabel === 'function' ? getSceneLabel(sceneIndex) : `Scene ${sceneIndex + 1}`;
            const kindLabel = typeof getKindLabel === 'function' ? getKindLabel(marker?.kind) : String(marker?.kind || '');
            const anchorLabel = typeof getAnchorLabel === 'function' ? getAnchorLabel(marker?.anchor) : String(marker?.anchor || '');

            return `
                <button
                    type="button"
                    class="deck-marker-item${selectedIndex === index ? ' active' : ''}"
                    data-marker-index="${index}"
                >
                    <strong>${safeEscape(label)}</strong>
                    <span class="deck-marker-meta">
                        ${safeEscape(sceneLabel)}
                        · ${safeEscape(kindLabel)}
                        · ${safeEscape(anchorLabel)}
                    </span>
                </button>
            `;
        }).join('');
    }

    function renderAudioList(options = {}) {
        const {
            audioTracks = [],
            selectedIndex = null,
            formatTime,
            getStartLabel,
            getAutoplayLabel,
            getLoopLabel,
            escapeHtml
        } = options;
        const safeEscape = typeof escapeHtml === 'function' ? escapeHtml : (value) => String(value || '');
        const safeFormatTime = typeof formatTime === 'function' ? formatTime : (value) => `${value || 0}`;

        return audioTracks.map((track, index) => {
            const metaParts = [];
            const startLabel = typeof getStartLabel === 'function'
                ? getStartLabel(safeFormatTime(track?.startMs))
                : safeFormatTime(track?.startMs);
            metaParts.push(startLabel);

            if (track?.autoplay && typeof getAutoplayLabel === 'function') {
                metaParts.push(getAutoplayLabel());
            }

            if (track?.loop && typeof getLoopLabel === 'function') {
                metaParts.push(getLoopLabel());
            }

            return `
                <button
                    type="button"
                    class="deck-audio-item${selectedIndex === index ? ' active' : ''}"
                    data-audio-index="${index}"
                >
                    <strong>${safeEscape(track?.label || `Audio ${index + 1}`)}</strong>
                    <span class="deck-marker-meta">${safeEscape(metaParts.join(' · '))}</span>
                    <span class="deck-audio-source">${safeEscape(track?.source || track?.assetId || '')}</span>
                </button>
            `;
        }).join('');
    }

    function renderCueList(options = {}) {
        const {
            cues = [],
            selectedIndex = null,
            formatTime,
            getAtLabel,
            escapeHtml
        } = options;
        const safeEscape = typeof escapeHtml === 'function' ? escapeHtml : (value) => String(value || '');
        const safeFormatTime = typeof formatTime === 'function' ? formatTime : (value) => `${value || 0}`;

        return cues.map((cue, index) => {
            const atLabel = typeof getAtLabel === 'function'
                ? getAtLabel(safeFormatTime(cue?.atMs))
                : safeFormatTime(cue?.atMs);

            return `
                <button
                    type="button"
                    class="deck-cue-item${selectedIndex === index ? ' active' : ''}"
                    data-cue-index="${index}"
                >
                    <strong>${safeEscape(cue?.text || '')}</strong>
                    <span class="deck-marker-meta">${safeEscape(atLabel)}</span>
                </button>
            `;
        }).join('');
    }

    namespace.renderEmptyState = renderEmptyState;
    namespace.renderMarkerList = renderMarkerList;
    namespace.renderAudioList = renderAudioList;
    namespace.renderCueList = renderCueList;
})(window.XiangyuCreateDeckRendering);
