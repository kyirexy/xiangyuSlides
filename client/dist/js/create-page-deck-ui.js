window.XiangyuCreateDeckUi = window.XiangyuCreateDeckUi || {};

(function bootstrapCreateDeckUi(namespace) {
    function setDisabled(elements, disabled) {
        (Array.isArray(elements) ? elements : []).forEach((element) => {
            if (element) {
                element.disabled = disabled;
            }
        });
    }

    function renderSceneOptions(select, sceneCount, getLabel, escapeHtml) {
        if (!select) {
            return;
        }

        const safeEscape = typeof escapeHtml === 'function' ? escapeHtml : (value) => String(value || '');
        const count = Math.max(1, Number(sceneCount) || 1);
        select.innerHTML = Array.from({ length: count }, (_, index) => (
            `<option value="${index}">${safeEscape(typeof getLabel === 'function' ? getLabel(index) : `Scene ${index + 1}`)}</option>`
        )).join('');
    }

    function applyInvalidState(options = {}) {
        const renderEmptyState = typeof options.renderEmptyState === 'function'
            ? options.renderEmptyState
            : ((message) => `<div>${String(message || '')}</div>`);
        const message = String(options.message || '');
        const containers = Array.isArray(options.containers) ? options.containers : [];

        setDisabled(options.buttons, true);
        containers.forEach((container) => {
            if (container) {
                container.innerHTML = renderEmptyState(message);
            }
        });
    }

    function renderSelectable(options = {}) {
        const renderSelectableList = typeof options.renderSelectableList === 'function'
            ? options.renderSelectableList
            : null;
        if (!renderSelectableList) {
            return;
        }

        renderSelectableList({
            container: options.container,
            items: options.items,
            emptyMessage: options.emptyMessage,
            renderEmptyState: options.renderEmptyState,
            renderHtml: options.renderHtml,
            selector: options.selector,
            datasetKey: options.datasetKey,
            onSelect: options.onSelect
        });
    }

    namespace.setDisabled = setDisabled;
    namespace.renderSceneOptions = renderSceneOptions;
    namespace.applyInvalidState = applyInvalidState;
    namespace.renderSelectable = renderSelectable;
})(window.XiangyuCreateDeckUi);
