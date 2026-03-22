window.XiangyuCreateDeckVoiceoverFlow = window.XiangyuCreateDeckVoiceoverFlow || {};

(function bootstrapCreateDeckVoiceoverFlow(namespace) {
    function findAdjacentVoiceoverEntry(entries, sceneIndex, direction = 'prev') {
        const safeEntries = Array.isArray(entries) ? entries : [];
        const targetSceneIndex = Math.max(0, Number(sceneIndex) || 0);
        const offset = String(direction || '').trim().toLowerCase() === 'next' ? 1 : -1;
        const adjacentIndex = targetSceneIndex + offset;

        if (adjacentIndex < 0) {
            return null;
        }

        return safeEntries.find((entry) => Number(entry?.sceneIndex) === adjacentIndex) || null;
    }

    function buildCopiedVoiceoverEntry(sourceEntry, targetSceneIndex, options = {}) {
        if (!sourceEntry || typeof sourceEntry !== 'object') {
            return null;
        }

        const normalizeSceneVoiceover = typeof options.normalizeSceneVoiceover === 'function'
            ? options.normalizeSceneVoiceover
            : null;
        const copiedEntry = {
            ...sourceEntry,
            sceneIndex: Math.max(0, Number(targetSceneIndex) || 0),
            generated: false
        };

        delete copiedEntry.generatedBy;
        delete copiedEntry.starterTemplate;
        delete copiedEntry.starterPurpose;
        delete copiedEntry.generatedAt;

        return normalizeSceneVoiceover
            ? (normalizeSceneVoiceover(copiedEntry, copiedEntry.sceneIndex) || copiedEntry)
            : copiedEntry;
    }

    function buildCueSceneContext(options = {}) {
        const sceneIndex = Math.max(0, Number(options.sceneIndex) || 0);
        const normalizeSceneVoiceoverList = typeof options.normalizeSceneVoiceoverList === 'function'
            ? options.normalizeSceneVoiceoverList
            : ((entries) => Array.isArray(entries) ? entries : []);
        const readVoiceoverEntryFromForm = typeof options.readVoiceoverEntryFromForm === 'function'
            ? options.readVoiceoverEntryFromForm
            : (() => null);
        const existingEntries = normalizeSceneVoiceoverList(options.sceneVoiceover);
        const existingEntry = existingEntries.find((entry) => Number(entry?.sceneIndex) === sceneIndex) || null;
        const nextEntry = readVoiceoverEntryFromForm(existingEntry);
        const voiceoverText = String(nextEntry?.text || '').trim();
        const slideDurationMs = Number(options.slideDurationMs || 0);

        return {
            sceneIndex,
            existingEntries,
            existingEntry,
            nextEntry,
            voiceoverText,
            slideDurationMs
        };
    }

    function buildDuplicatedCue(cue, options = {}) {
        if (!cue || typeof cue !== 'object') {
            return null;
        }

        const normalizeCue = typeof options.normalizeCue === 'function'
            ? options.normalizeCue
            : null;
        const offsetMs = Number.isFinite(Number(options.offsetMs))
            ? Math.max(100, Math.round(Number(options.offsetMs)))
            : 1000;
        const duplicatedCue = {
            ...cue,
            atMs: Math.max(0, Number(cue.atMs) || 0) + offsetMs
        };

        return normalizeCue
            ? (normalizeCue(duplicatedCue, options.selectedIndex ?? 0) || duplicatedCue)
            : duplicatedCue;
    }

    function splitVoiceoverText(text) {
        return String(text || '')
            .split(/\n+/)
            .flatMap((line) => line.split(/(?<=[。！？!?；;.!])\s+|(?<=[。！？!?；;.!])/))
            .map((segment) => String(segment || '').replace(/\s+/g, ' ').trim())
            .filter(Boolean)
            .slice(0, 8);
    }

    function buildCueSetFromText(text, options = {}) {
        const normalizeCue = typeof options.normalizeCue === 'function'
            ? options.normalizeCue
            : null;
        const segments = splitVoiceoverText(text);

        if (segments.length === 0) {
            return [];
        }

        const requestedDuration = Number.isFinite(Number(options.durationMs))
            ? Math.max(0, Math.round(Number(options.durationMs)))
            : 0;
        const durationMs = requestedDuration > 0
            ? requestedDuration
            : Math.max(3000, segments.length * 1800);
        const stepMs = segments.length > 1
            ? Math.max(600, Math.floor(durationMs / segments.length))
            : 0;

        return segments.map((segment, index) => {
            const cue = {
                atMs: index === 0 ? 0 : Math.min(durationMs - 300, stepMs * index),
                text: segment
            };

            return normalizeCue
                ? (normalizeCue(cue, index) || cue)
                : cue;
        }).filter(Boolean);
    }

    function retimeCueSet(cues, options = {}) {
        const normalizeCue = typeof options.normalizeCue === 'function'
            ? options.normalizeCue
            : null;
        const safeCues = Array.isArray(cues)
            ? cues.filter((cue) => cue && typeof cue === 'object' && String(cue.text || '').trim())
            : [];

        if (safeCues.length === 0) {
            return [];
        }

        const requestedDuration = Number.isFinite(Number(options.durationMs))
            ? Math.max(0, Math.round(Number(options.durationMs)))
            : 0;
        const existingMax = safeCues.reduce((max, cue) => Math.max(max, Math.max(0, Number(cue.atMs) || 0)), 0);
        const durationMs = requestedDuration > 0
            ? requestedDuration
            : Math.max(existingMax + 1000, safeCues.length * 1800, 3000);
        const stepMs = safeCues.length > 1
            ? Math.max(600, Math.floor(durationMs / safeCues.length))
            : 0;

        return safeCues.map((cue, index) => {
            const nextCue = {
                ...cue,
                atMs: index === 0 ? 0 : Math.min(durationMs - 300, stepMs * index)
            };

            return normalizeCue
                ? (normalizeCue(nextCue, index) || nextCue)
                : nextCue;
        }).filter(Boolean);
    }

    function appendCueSet(existingCues, generatedCues, options = {}) {
        const normalizeCue = typeof options.normalizeCue === 'function'
            ? options.normalizeCue
            : null;
        const safeExisting = Array.isArray(existingCues)
            ? existingCues.filter((cue) => cue && typeof cue === 'object' && String(cue.text || '').trim())
            : [];
        const safeGenerated = Array.isArray(generatedCues)
            ? generatedCues.filter((cue) => cue && typeof cue === 'object' && String(cue.text || '').trim())
            : [];
        const existingTextSet = new Set(
            safeExisting.map((cue) => String(cue.text || '').trim().toLowerCase()).filter(Boolean)
        );
        const incoming = safeGenerated.filter((cue) => !existingTextSet.has(String(cue.text || '').trim().toLowerCase()));

        if (incoming.length === 0) {
            return [...safeExisting];
        }

        const startAtMs = safeExisting.reduce((max, cue) => Math.max(max, Math.max(0, Number(cue.atMs) || 0)), 0);
        const requestedStep = Number.isFinite(Number(options.stepMs))
            ? Math.max(600, Math.round(Number(options.stepMs)))
            : 1200;
        const appended = incoming.map((cue, index) => {
            const nextCue = {
                ...cue,
                atMs: safeExisting.length > 0
                    ? startAtMs + requestedStep * (index + 1)
                    : Math.max(0, Number(cue.atMs) || 0)
            };

            return normalizeCue
                ? (normalizeCue(nextCue, safeExisting.length + index) || nextCue)
                : nextCue;
        }).filter(Boolean);

        return [...safeExisting, ...appended];
    }

    namespace.findAdjacentVoiceoverEntry = findAdjacentVoiceoverEntry;
    namespace.buildCopiedVoiceoverEntry = buildCopiedVoiceoverEntry;
    namespace.buildCueSceneContext = buildCueSceneContext;
    namespace.buildDuplicatedCue = buildDuplicatedCue;
    namespace.buildCueSetFromText = buildCueSetFromText;
    namespace.retimeCueSet = retimeCueSet;
    namespace.appendCueSet = appendCueSet;
})(window.XiangyuCreateDeckVoiceoverFlow);
