(function () {
    const STYLE_TO_VISUAL_FAMILY = {
        'bold-signal': 'showcase',
        'electric-studio': 'showcase',
        'creative-voltage': 'showcase',
        'dark-botanical': 'showcase',
        'neon-cyber': 'showcase',
        'notebook-tabs': 'editorial',
        'split-pastel': 'editorial',
        'vintage-editorial': 'editorial',
        'paper-ink': 'editorial',
        'pastel-geometry': 'briefing',
        'swiss-modern': 'briefing',
        'terminal-green': 'briefing'
    };

    function resolveVisualFamily(presentation, styleId) {
        const explicit = String(
            presentation?.legacy?.copilot?.visualFamily
            || presentation?.theme?.visualFamily
            || ''
        ).trim().toLowerCase();

        if (explicit === 'showcase' || explicit === 'editorial' || explicit === 'briefing') {
            return explicit;
        }

        return STYLE_TO_VISUAL_FAMILY[styleId] || 'showcase';
    }

    function resolveOutputIntent(presentation) {
        const value = String(presentation?.legacy?.copilot?.outputIntent || '').trim().toLowerCase();
        if (value === 'showcase' || value === 'briefing' || value === 'short-video') {
            return value;
        }

        return 'showcase';
    }

    function applyRuntimeFamily(runtime, styleId) {
        const presentation = runtime?.presentation;
        const body = document.body;
        if (!body) {
            return;
        }

        body.dataset.visualFamily = resolveVisualFamily(presentation, styleId);
        body.dataset.outputIntent = resolveOutputIntent(presentation);
    }

    if (typeof PresentationRuntime !== 'undefined' && PresentationRuntime.prototype) {
        const originalApplyTheme = PresentationRuntime.prototype.applyTheme;
        PresentationRuntime.prototype.applyTheme = function patchedApplyTheme(styleId) {
            const result = originalApplyTheme.call(this, styleId);
            applyRuntimeFamily(this, styleId);
            return result;
        };
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (window.presentationRuntime) {
            applyRuntimeFamily(window.presentationRuntime, window.presentationRuntime.presentation?.theme?.presetId);
        }
    });
})();
