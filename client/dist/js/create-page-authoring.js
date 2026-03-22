window.XiangyuCreateAuthoring = window.XiangyuCreateAuthoring || {};

(function bootstrapCreateAuthoring(namespace) {
    const SUPPORTED_SCENE_PACK_TEMPLATES = ['starter-flow', 'proof-flow', 'close-flow'];

    function normalizeScenePackTemplate(value) {
        const normalized = String(value || '').trim().toLowerCase();
        return SUPPORTED_SCENE_PACK_TEMPLATES.includes(normalized) ? normalized : 'starter-flow';
    }

    function getScenePackTemplateKeys() {
        return [...SUPPORTED_SCENE_PACK_TEMPLATES];
    }

    function getScenePackBlueprint(template, purposeKey) {
        const normalizedTemplate = normalizeScenePackTemplate(template);
        const normalizedPurpose = String(purposeKey || '').trim().toLowerCase();

        if (normalizedTemplate === 'starter-flow') {
            if (normalizedPurpose === 'story') {
                return ['title', 'content', 'quote'];
            }

            if (normalizedPurpose === 'personal') {
                return ['title', 'content', 'end'];
            }

            return ['title', 'content', 'features'];
        }

        if (normalizedTemplate === 'proof-flow') {
            if (normalizedPurpose === 'tech') {
                return ['content', 'code', 'features'];
            }

            if (normalizedPurpose === 'product') {
                return ['features', 'content', 'quote'];
            }

            return ['content', 'features', 'quote'];
        }

        if (normalizedPurpose === 'story') {
            return ['content', 'quote', 'end'];
        }

        return ['content', 'end'];
    }

    namespace.normalizeScenePackTemplate = normalizeScenePackTemplate;
    namespace.getScenePackTemplateKeys = getScenePackTemplateKeys;
    namespace.getScenePackBlueprint = getScenePackBlueprint;
})(window.XiangyuCreateAuthoring);
