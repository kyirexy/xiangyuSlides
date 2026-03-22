window.XiangyuCreateDeckStarters = window.XiangyuCreateDeckStarters || {};

(function bootstrapCreateDeckStarters(namespace) {
    const DEFAULT_PROFILES = {
        'zh-CN': {
            default: {
                opening: ['开场', '背景'],
                proof: ['重点', '证据', '推进'],
                closing: ['结论', '下一步']
            },
            teaching: {
                opening: ['导入', '核心概念'],
                proof: ['示例', '练习', '检查点'],
                closing: ['总结', '问答']
            },
            pitch: {
                opening: ['钩子', '问题'],
                proof: ['验证', '增长', '差异化'],
                closing: ['融资请求', '下一步']
            },
            product: {
                opening: ['发布点', '目标用户'],
                proof: ['演示', '收益', '落地'],
                closing: ['行动号召', '发布节奏']
            },
            tech: {
                opening: ['背景', '架构'],
                proof: ['实现', '性能', '经验'],
                closing: ['结论', '下一步']
            },
            story: {
                opening: ['开端', '冲突'],
                proof: ['转折', '洞察', '推进'],
                closing: ['收束', '回响']
            }
        },
        en: {
            default: {
                opening: ['Opening', 'Context'],
                proof: ['Focus', 'Evidence', 'Momentum'],
                closing: ['Takeaway', 'Next Step']
            },
            teaching: {
                opening: ['Overview', 'Key Concept'],
                proof: ['Example', 'Practice', 'Checkpoint'],
                closing: ['Recap', 'Q&A']
            },
            pitch: {
                opening: ['Hook', 'Problem'],
                proof: ['Proof', 'Traction', 'Differentiation'],
                closing: ['Ask', 'Next Step']
            },
            product: {
                opening: ['Launch', 'Audience'],
                proof: ['Demo', 'Benefits', 'Rollout'],
                closing: ['CTA', 'Next Step']
            },
            tech: {
                opening: ['Context', 'Architecture'],
                proof: ['Implementation', 'Performance', 'Lessons'],
                closing: ['Takeaway', 'Next Step']
            },
            story: {
                opening: ['Setup', 'Turning Point'],
                proof: ['Insight', 'Momentum', 'Resolution'],
                closing: ['Wrap-up', 'Takeaway']
            }
        }
    };

    function asText(value, fallback = '') {
        if (value === null || value === undefined) {
            return fallback;
        }

        return String(value).trim() || fallback;
    }

    function resolveLocale(locale) {
        return String(locale || '').trim().toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    }

    function normalizeStarterTemplate(value) {
        const normalized = String(value || '').trim().toLowerCase();
        return ['opening', 'proof', 'closing', 'full-flow'].includes(normalized)
            ? normalized
            : 'full-flow';
    }

    function getStarterTemplateKeys() {
        return ['opening', 'proof', 'closing', 'full-flow'];
    }

    function uniqueIndices(values) {
        const seen = new Set();
        const output = [];

        values.forEach((value) => {
            if (!Number.isInteger(Number(value))) {
                return;
            }

            const normalized = Number(value);
            if (seen.has(normalized)) {
                return;
            }

            seen.add(normalized);
            output.push(normalized);
        });

        return output;
    }

    function getPurposeProfile(purposeKey, locale) {
        const resolvedLocale = resolveLocale(locale);
        const localeProfiles = DEFAULT_PROFILES[resolvedLocale] || DEFAULT_PROFILES.en;
        return localeProfiles[asText(purposeKey).toLowerCase()] || localeProfiles.default;
    }

    function getOpeningIndices(count) {
        if (count <= 0) {
            return [];
        }

        return uniqueIndices([0, count > 1 ? 1 : 0]).filter((index) => index < count);
    }

    function getProofIndices(count) {
        if (count <= 0) {
            return [];
        }

        if (count === 1) {
            return [0];
        }

        if (count === 2) {
            return [1];
        }

        if (count === 3) {
            return [1];
        }

        if (count === 4) {
            return [1, 2];
        }

        return uniqueIndices([1, Math.floor((count - 1) / 2), count - 2]).filter((index) => index >= 0 && index < count);
    }

    function getClosingIndices(count) {
        if (count <= 0) {
            return [];
        }

        return uniqueIndices([count > 1 ? count - 2 : 0, count - 1]).filter((index) => index >= 0 && index < count);
    }

    function getIndicesForTemplate(count, template) {
        const normalized = normalizeStarterTemplate(template);
        if (normalized === 'opening') {
            return getOpeningIndices(count);
        }

        if (normalized === 'proof') {
            return getProofIndices(count);
        }

        if (normalized === 'closing') {
            return getClosingIndices(count);
        }

        return uniqueIndices([
            ...getOpeningIndices(count),
            ...getProofIndices(count),
            ...getClosingIndices(count)
        ]);
    }

    function getStageForIndex(index, count) {
        const opening = new Set(getOpeningIndices(count));
        const closing = new Set(getClosingIndices(count));
        if (opening.has(index)) {
            return 'opening';
        }

        if (closing.has(index)) {
            return 'closing';
        }

        return 'proof';
    }

    function getStageLabel(stage, index, labels) {
        const items = Array.isArray(labels?.[stage]) ? labels[stage] : [];
        if (items.length === 0) {
            return '';
        }

        return items[index % items.length];
    }

    function hasVoiceoverContent(entry) {
        if (!entry || typeof entry !== 'object') {
            return false;
        }

        const text = asText(entry.text);
        const cues = Array.isArray(entry.cues) ? entry.cues.filter((cue) => asText(cue?.text)) : [];
        return Boolean(text || cues.length > 0);
    }

    function buildTimelineStarter(options = {}) {
        const slides = Array.isArray(options.slides) ? options.slides : [];
        const locale = resolveLocale(options.locale);
        const purposeKey = asText(options.purposeKey).toLowerCase();
        const template = normalizeStarterTemplate(options.template);
        const generatedAt = new Date().toISOString();
        const profile = getPurposeProfile(purposeKey, locale);
        const indices = getIndicesForTemplate(slides.length, template);
        const generators = window.XiangyuCreateDeckGenerators || {};
        const existingEntries = Array.isArray(options.existingEntries) ? options.existingEntries : [];
        const markers = [];
        const voiceoverEntries = [];

        indices.forEach((sceneIndex, order) => {
            const slide = slides[sceneIndex];
            if (!slide) {
                return;
            }

            const stage = getStageForIndex(sceneIndex, slides.length);
            const stageLabel = getStageLabel(stage, order, profile);
            const title = asText(slide.title, locale === 'zh-CN' ? `场景 ${sceneIndex + 1}` : `Scene ${sceneIndex + 1}`);
            const markerLabel = stageLabel ? `${stageLabel} · ${title}` : title;

            markers.push({
                label: markerLabel,
                sceneIndex,
                kind: 'navigation',
                anchor: 'start',
                generated: true,
                generatedBy: 'timeline-starter',
                starterTemplate: template,
                starterPurpose: purposeKey || 'default',
                generatedAt
            });

            const existingEntry = existingEntries.find((entry) => Number(entry?.sceneIndex) === sceneIndex);
            if (hasVoiceoverContent(existingEntry) && existingEntry.generatedBy !== 'timeline-starter') {
                return;
            }

            if (typeof generators.generateVoiceoverEntry !== 'function') {
                return;
            }

            const generatedVoiceover = generators.generateVoiceoverEntry(slide, sceneIndex, { locale });
            if (!generatedVoiceover) {
                return;
            }

            voiceoverEntries.push({
                ...generatedVoiceover,
                generated: true,
                generatedBy: 'timeline-starter',
                starterTemplate: template,
                starterPurpose: purposeKey || 'default',
                generatedAt
            });
        });

        const autoplay = ['pitch', 'product', 'story', 'marketing', 'event'].includes(purposeKey);

        return {
            template,
            purposeKey: purposeKey || 'default',
            generatedAt,
            timeline: {
                enabled: true,
                autoplay,
                subtitleMode: 'voiceover-placeholder',
                markers
            },
            sceneVoiceover: voiceoverEntries
        };
    }

    namespace.normalizeStarterTemplate = normalizeStarterTemplate;
    namespace.getStarterTemplateKeys = getStarterTemplateKeys;
    namespace.buildTimelineStarter = buildTimelineStarter;
})(window.XiangyuCreateDeckStarters);
