window.XiangyuCreateDeckSync = window.XiangyuCreateDeckSync || {};

(function bootstrapCreateDeckSync(namespace) {
    function asText(value, fallback = '') {
        if (value === null || value === undefined) {
            return fallback;
        }

        return String(value).trim() || fallback;
    }

    function normalizeGeneratedAt(value) {
        const text = asText(value);
        if (!text) {
            return '';
        }

        const date = new Date(text);
        return Number.isNaN(date.getTime()) ? '' : date.toISOString();
    }

    function getStarterGeneratedState(timeline, sceneVoiceover) {
        const markers = Array.isArray(timeline?.markers)
            ? timeline.markers.filter((marker) => marker?.generatedBy === 'timeline-starter')
            : [];
        const voiceover = Array.isArray(sceneVoiceover)
            ? sceneVoiceover.filter((entry) => entry?.generatedBy === 'timeline-starter')
            : [];
        const primary = markers[0] || voiceover[0] || null;

        return {
            markers,
            voiceover,
            markerCount: markers.length,
            voiceoverCount: voiceover.length,
            hasStarter: markers.length > 0 || voiceover.length > 0,
            template: asText(primary?.starterTemplate),
            purposeKey: asText(primary?.starterPurpose),
            generatedAt: normalizeGeneratedAt(primary?.generatedAt)
        };
    }

    function formatGeneratedAt(value, options = {}) {
        const normalized = normalizeGeneratedAt(value);
        if (!normalized) {
            return '';
        }

        try {
            return new Intl.DateTimeFormat(options.locale || 'en', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(new Date(normalized));
        } catch (error) {
            return normalized;
        }
    }

    function renderStarterSummary(options = {}) {
        const state = options.state || {};
        const hasStarter = state.hasStarter === true;
        const renderEmptyState = typeof options.renderEmptyState === 'function'
            ? options.renderEmptyState
            : ((message) => `<div>${String(message || '')}</div>`);

        if (!hasStarter) {
            return renderEmptyState(options.emptyMessage || '');
        }

        const escapeHtml = typeof options.escapeHtml === 'function'
            ? options.escapeHtml
            : (value) => String(value || '');
        const templateLabel = asText(options.templateLabel, '');
        const purposeLabel = asText(options.purposeLabel, '');
        const generatedLabel = asText(options.generatedLabel, '');
        const formatCountLabel = typeof options.formatCountLabel === 'function'
            ? options.formatCountLabel
            : (label, count) => `${label}: ${count}`;

        const statItems = [
            formatCountLabel(options.markersLabel || 'Markers', state.markerCount || 0),
            formatCountLabel(options.voiceoverLabel || 'Voiceover', state.voiceoverCount || 0)
        ].filter(Boolean);

        const metaItems = [
            templateLabel,
            purposeLabel,
            generatedLabel
        ].filter(Boolean);

        return `
            <div class="deck-starter-summary-card">
                <div class="deck-starter-summary-title">${escapeHtml(options.title || '')}</div>
                ${metaItems.length > 0 ? `
                    <div class="deck-starter-summary-meta">
                        ${metaItems.map((item) => `<span class="deck-starter-pill">${escapeHtml(item)}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="deck-starter-summary-stats">
                    ${statItems.map((item) => `<span class="deck-starter-pill subtle">${escapeHtml(item)}</span>`).join('')}
                </div>
            </div>
        `;
    }

    function bindSelectableItems(container, selector, onSelect, datasetKey = 'index') {
        if (!container || !selector || typeof onSelect !== 'function') {
            return;
        }

        Array.from(container.querySelectorAll(selector)).forEach((button) => {
            button.addEventListener('click', () => {
                const value = Number(button.dataset[datasetKey]);
                onSelect(Number.isInteger(value) ? value : null);
            });
        });
    }

    function renderSelectableList(container, options = {}) {
        if (!container) {
            return;
        }

        const renderEmptyState = typeof options.renderEmptyState === 'function'
            ? options.renderEmptyState
            : ((message) => `<div>${String(message || '')}</div>`);

        if (!options.items || options.items.length === 0) {
            container.innerHTML = renderEmptyState(options.emptyMessage || '');
            return;
        }

        container.innerHTML = typeof options.renderHtml === 'function'
            ? options.renderHtml()
            : '';
        bindSelectableItems(container, options.selector, options.onSelect, options.datasetKey || 'index');
    }

    namespace.getStarterGeneratedState = getStarterGeneratedState;
    namespace.formatGeneratedAt = formatGeneratedAt;
    namespace.renderStarterSummary = renderStarterSummary;
    namespace.renderSelectableList = renderSelectableList;
})(window.XiangyuCreateDeckSync);
