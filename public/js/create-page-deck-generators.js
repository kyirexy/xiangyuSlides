window.XiangyuCreateDeckGenerators = window.XiangyuCreateDeckGenerators || {};

(function bootstrapCreateDeckGenerators(namespace) {
    function asText(value, fallback = '') {
        if (value === null || value === undefined) {
            return fallback;
        }

        return String(value).trim() || fallback;
    }

    function resolveLocale(locale) {
        return String(locale || '').trim().toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    }

    function uniqueParts(parts) {
        const seen = new Set();
        const output = [];

        parts.forEach((part) => {
            const normalized = asText(part);
            const dedupeKey = normalized.toLowerCase();
            if (!normalized || seen.has(dedupeKey)) {
                return;
            }

            seen.add(dedupeKey);
            output.push(normalized);
        });

        return output;
    }

    function trimSentenceEnding(text, locale) {
        const value = asText(text);
        if (!value) {
            return '';
        }

        return locale === 'zh-CN'
            ? value.replace(/[。！？；，、]+$/g, '')
            : value.replace(/[.?!;,:]+$/g, '');
    }

    function toContentLines(content) {
        if (Array.isArray(content)) {
            return content
                .map((item) => asText(item))
                .filter(Boolean);
        }

        const text = asText(content);
        if (!text) {
            return [];
        }

        return text
            .split(/\r?\n+/)
            .map((item) => asText(item))
            .filter(Boolean);
    }

    function buildNavigationMarkers(slides, options = {}) {
        const items = Array.isArray(slides) ? slides : [];
        const getLabel = typeof options.getLabel === 'function'
            ? options.getLabel
            : (slide, index) => asText(slide?.title, `Slide ${index + 1}`);

        return items
            .map((slide, index) => {
                const label = asText(getLabel(slide, index), `Slide ${index + 1}`);
                return {
                    label,
                    sceneIndex: index,
                    kind: 'navigation',
                    anchor: 'start',
                    generated: true,
                    generatedBy: 'navigation'
                };
            })
            .filter(Boolean);
    }

    function buildNarrationMarkers(entries, slides, options = {}) {
        const voiceoverEntries = Array.isArray(entries) ? entries : [];
        const slideItems = Array.isArray(slides) ? slides : [];
        const locale = resolveLocale(options.locale);
        const getLabel = typeof options.getLabel === 'function'
            ? options.getLabel
            : (entry, slide, sceneIndex) => {
                const title = asText(slide?.title, locale === 'zh-CN' ? `场景 ${sceneIndex + 1}` : `Scene ${sceneIndex + 1}`);
                return locale === 'zh-CN' ? `旁白 · ${title}` : `Narration · ${title}`;
            };

        return voiceoverEntries
            .filter((entry) => hasVoiceoverContent(entry))
            .map((entry) => {
                const sceneIndex = Math.max(0, Number(entry?.sceneIndex) || 0);
                const slide = slideItems[sceneIndex] || null;
                return {
                    label: asText(getLabel(entry, slide, sceneIndex)),
                    sceneIndex,
                    kind: 'narration',
                    anchor: 'start',
                    generated: true,
                    generatedBy: 'narration'
                };
            })
            .filter((marker) => marker.label);
    }

    function resolveEditMarkerReason(slide) {
        if (!slide || typeof slide !== 'object') {
            return '';
        }

        const media = slide.media && typeof slide.media === 'object' ? slide.media : null;
        const transition = slide.transition && typeof slide.transition === 'object' ? slide.transition : null;
        const animation = slide.animation && typeof slide.animation === 'object' ? slide.animation : null;
        const type = asText(slide.type, '').toLowerCase();

        if (media && asText(media.source || media.url)) {
            return 'media';
        }

        if (type === 'code') {
            return 'code';
        }

        if (transition && (
            asText(transition.preset) ||
            Number.isFinite(Number(transition.enterMs)) ||
            Number.isFinite(Number(transition.holdMs)) ||
            Number.isFinite(Number(transition.exitMs)) ||
            Number.isFinite(Number(transition.durationMs))
        )) {
            return 'transition';
        }

        if (animation && Object.values(animation).some((value) => asText(value))) {
            return 'motion';
        }

        return '';
    }

    function buildEditMarkers(slides, options = {}) {
        const items = Array.isArray(slides) ? slides : [];
        const locale = resolveLocale(options.locale);
        const getLabel = typeof options.getLabel === 'function'
            ? options.getLabel
            : (slide, index, reason) => {
                const title = asText(slide?.title, locale === 'zh-CN' ? `场景 ${index + 1}` : `Scene ${index + 1}`);
                const reasonLabel = {
                    media: locale === 'zh-CN' ? '检查媒体节奏' : 'Check media timing',
                    code: locale === 'zh-CN' ? '检查代码讲解' : 'Review code narration',
                    transition: locale === 'zh-CN' ? '检查转场节奏' : 'Check transition beat',
                    motion: locale === 'zh-CN' ? '检查动效节奏' : 'Check motion beat'
                }[reason] || (locale === 'zh-CN' ? '编辑提示' : 'Edit Cue');

                return `${reasonLabel} · ${title}`;
            };

        return items
            .map((slide, index) => {
                const reason = resolveEditMarkerReason(slide);
                if (!reason) {
                    return null;
                }

                return {
                    label: asText(getLabel(slide, index, reason)),
                    sceneIndex: index,
                    kind: 'edit',
                    anchor: reason === 'transition' ? 'exit' : 'advance',
                    generated: true,
                    generatedBy: 'edit'
                };
            })
            .filter((marker) => marker && marker.label);
    }

    function buildVoiceoverParts(slide, options = {}) {
        const locale = resolveLocale(options.locale);
        const type = asText(slide?.type, 'content').toLowerCase();
        const title = asText(slide?.title);
        const subtitle = asText(slide?.subtitle);
        const contentLines = toContentLines(slide?.content).slice(0, 3);
        const mediaCaption = asText(slide?.media?.caption || slide?.media?.alt);
        const parts = [];

        if (title) {
            parts.push(title);
        }

        if (subtitle && subtitle.toLowerCase() !== title.toLowerCase()) {
            parts.push(subtitle);
        }

        if (type === 'quote') {
            if (contentLines[0]) {
                parts.push(contentLines[0]);
            }

            if (contentLines[1] && contentLines[1].toLowerCase() !== subtitle.toLowerCase()) {
                parts.push(contentLines[1]);
            }
        } else if (type === 'code') {
            if (contentLines.length > 0) {
                parts.push(locale === 'zh-CN' ? '这页代码示例聚焦以下几行。' : 'This code example focuses on the following lines.');
                parts.push(...contentLines.slice(0, 2));
            }
        } else {
            parts.push(...contentLines);
        }

        if (mediaCaption) {
            parts.push(mediaCaption);
        }

        return uniqueParts(parts).slice(0, 4);
    }

    function buildVoiceoverText(parts, options = {}) {
        const locale = resolveLocale(options.locale);
        const items = uniqueParts(parts).map((part) => trimSentenceEnding(part, locale)).filter(Boolean);
        if (items.length === 0) {
            return '';
        }

        if (locale === 'zh-CN') {
            return `${items.join('。')}。`;
        }

        return `${items.join('. ')}.`;
    }

    function buildCueList(parts, slide, options = {}) {
        const items = uniqueParts(parts);
        if (items.length === 0) {
            return [];
        }

        const totalMs = Number.isFinite(Number(slide?.durationMs))
            ? Math.max(1600, Math.round(Number(slide.durationMs)))
            : Math.max(1600, items.length * 1600);
        const step = items.length > 1
            ? Math.max(700, Math.floor(totalMs / items.length))
            : 0;

        return items.map((text, index) => ({
            atMs: index === 0 ? 0 : Math.min(totalMs - 400, index * step),
            text
        }));
    }

    function hasVoiceoverContent(entry) {
        if (!entry || typeof entry !== 'object') {
            return false;
        }

        const text = asText(entry.text);
        const cues = Array.isArray(entry.cues) ? entry.cues.filter((cue) => asText(cue?.text)) : [];
        return Boolean(text || cues.length > 0);
    }

    function generateVoiceoverEntry(slide, sceneIndex, options = {}) {
        const locale = resolveLocale(options.locale);
        const parts = buildVoiceoverParts(slide, options);
        if (parts.length === 0) {
            return null;
        }

        return {
            sceneIndex: Math.max(0, Number(sceneIndex) || 0),
            language: locale,
            text: buildVoiceoverText(parts, options),
            cues: buildCueList(parts, slide, options),
            generated: true,
            generatedBy: 'voiceover'
        };
    }

    function mergeGeneratedVoiceoverEntries(slides, existingEntries, options = {}) {
        const items = Array.isArray(slides) ? slides : [];
        const entries = Array.isArray(existingEntries)
            ? existingEntries
                .filter((entry) => entry && typeof entry === 'object')
                .map((entry) => ({
                    ...entry,
                    cues: Array.isArray(entry.cues) ? entry.cues.map((cue) => ({ ...cue })) : []
                }))
            : [];
        const nextEntries = [...entries];
        let generatedCount = 0;

        items.forEach((slide, index) => {
            const existingEntry = nextEntries.find((entry) => Number(entry.sceneIndex) === index);
            if (hasVoiceoverContent(existingEntry)) {
                return;
            }

            const generated = generateVoiceoverEntry(slide, index, options);
            if (!generated) {
                return;
            }

            nextEntries.push(generated);
            generatedCount += 1;
        });

        nextEntries.sort((left, right) => Number(left.sceneIndex || 0) - Number(right.sceneIndex || 0));

        return {
            entries: nextEntries,
            generatedCount
        };
    }

    namespace.buildNavigationMarkers = buildNavigationMarkers;
    namespace.buildNarrationMarkers = buildNarrationMarkers;
    namespace.buildEditMarkers = buildEditMarkers;
    namespace.generateVoiceoverEntry = generateVoiceoverEntry;
    namespace.mergeGeneratedVoiceoverEntries = mergeGeneratedVoiceoverEntries;
})(window.XiangyuCreateDeckGenerators);
