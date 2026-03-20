const crypto = require('crypto');
const {
    DEFAULT_STYLE_ID,
    getStyleInfo,
    getStylesForVisualFamily
} = require('../generator/theme-registry');

const SUPPORTED_PURPOSES = new Set([
    'teaching',
    'pitch',
    'product',
    'meeting',
    'company',
    'tech',
    'personal',
    'story',
    'marketing',
    'event'
]);
const SUPPORTED_LENGTHS = new Set(['short', 'medium', 'long']);
const SUPPORTED_VISUAL_FAMILIES = new Set(['showcase', 'editorial', 'briefing']);
const SUPPORTED_OUTPUT_INTENTS = new Set(['showcase', 'briefing', 'short-video']);
const SUPPORTED_VOICEOVER_MODES = new Set(['placeholder', 'guided', 'off']);
const SUPPORTED_MEDIA_INTENTS = new Set(['balanced', 'text-first', 'media-forward']);

function asString(value, fallback = '') {
    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value);
}

function normalizeLocale(locale, fallback = 'zh-CN') {
    const normalized = asString(locale, fallback).trim().toLowerCase();
    if (!normalized) {
        return normalizeLocale(fallback, 'zh-CN');
    }

    if (
        normalized.startsWith('zh')
        || normalized.includes('chinese')
        || normalized.includes('中文')
        || normalized.includes('简体')
        || normalized.includes('繁体')
    ) {
        return 'zh-CN';
    }

    if (
        normalized === 'en'
        || normalized.startsWith('en-')
        || normalized.includes('english')
        || normalized.includes('英文')
    ) {
        return 'en';
    }

    const fallbackNormalized = asString(fallback, 'zh-CN').trim().toLowerCase();
    if (fallbackNormalized && fallbackNormalized !== normalized) {
        return normalizeLocale(fallbackNormalized, 'zh-CN');
    }

    return 'zh-CN';
}

function normalizePurpose(purpose, fallback = 'product') {
    const normalized = asString(purpose, fallback).trim().toLowerCase();
    return SUPPORTED_PURPOSES.has(normalized) ? normalized : fallback;
}

function normalizeLength(length, fallback = 'medium') {
    const normalized = asString(length, fallback).trim().toLowerCase();
    return SUPPORTED_LENGTHS.has(normalized) ? normalized : fallback;
}

function normalizeVisualFamily(visualFamily, fallback = 'showcase') {
    const normalized = asString(visualFamily, fallback).trim().toLowerCase();
    return SUPPORTED_VISUAL_FAMILIES.has(normalized) ? normalized : fallback;
}

function normalizeOutputIntent(outputIntent, fallback = 'showcase') {
    const normalized = asString(outputIntent, fallback).trim().toLowerCase();
    if (normalized === 'presentation' || normalized === 'presentation-friendly') {
        return 'showcase';
    }

    return SUPPORTED_OUTPUT_INTENTS.has(normalized) ? normalized : fallback;
}

function normalizeVoiceoverMode(mode, fallback = 'placeholder') {
    const normalized = asString(mode, fallback).trim().toLowerCase();
    if (normalized === 'voiceover' || normalized === 'placeholder') {
        return 'placeholder';
    }

    return SUPPORTED_VOICEOVER_MODES.has(normalized) ? normalized : fallback;
}

function normalizeMediaIntent(mediaIntent, fallback = 'balanced') {
    const normalized = asString(mediaIntent, fallback).trim().toLowerCase();
    return SUPPORTED_MEDIA_INTENTS.has(normalized) ? normalized : fallback;
}

function normalizeAudience(audience, locale) {
    const value = asString(audience, '').trim();
    if (value) {
        return value.slice(0, 120);
    }

    return locale === 'zh-CN' ? '现场演示观众' : 'Live presentation audience';
}

function lastUserMessage(messages) {
    return (Array.isArray(messages) ? messages : [])
        .filter((item) => item && item.role === 'user')
        .map((item) => asString(item.content, '').trim())
        .filter(Boolean)
        .pop() || '';
}

function extractJSONObject(text) {
    const match = asString(text, '').match(/\{[\s\S]*\}/);
    if (!match) {
        throw new Error('No JSON found in response');
    }

    return JSON.parse(match[0]);
}

function generatePresentationId() {
    return `pres_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;
}

function inferPurposeFromText(text) {
    const normalized = text.toLowerCase();

    if (/融资|路演|投资人|融资演讲|pitch|fundraising|investor/.test(normalized)) {
        return 'pitch';
    }
    if (/教学|课程|培训|课堂|learn|teaching|lesson|workshop/.test(normalized)) {
        return 'teaching';
    }
    if (/产品|发布会|发布|功能|launch|product/.test(normalized)) {
        return 'product';
    }
    if (/技术|架构|工程|code|developer|tech|architecture/.test(normalized)) {
        return 'tech';
    }
    if (/营销|品牌|campaign|marketing|增长|投放/.test(normalized)) {
        return 'marketing';
    }
    if (/会议|汇报|周会|review|meeting|briefing/.test(normalized)) {
        return 'meeting';
    }
    if (/故事|叙事|story|journey/.test(normalized)) {
        return 'story';
    }
    if (/公司|团队介绍|company|about us/.test(normalized)) {
        return 'company';
    }
    if (/活动|峰会|论坛|event|conference/.test(normalized)) {
        return 'event';
    }

    return 'product';
}

function inferLengthFromText(text) {
    const normalized = text.toLowerCase();

    if (/3页|4页|5页|短一点|short|brief|quick/.test(normalized)) {
        return 'short';
    }
    if (/10页|12页|详细|深入|long|deep dive|detailed/.test(normalized)) {
        return 'long';
    }

    return 'medium';
}

function inferOutputIntent(text, requestedOutputIntent) {
    const requested = normalizeOutputIntent(requestedOutputIntent || '', '');
    if (requested) {
        return requested;
    }

    const normalized = text.toLowerCase();
    if (/短视频|视频|reel|short video|social video/.test(normalized)) {
        return 'short-video';
    }
    if (/汇报|briefing|board|review|exec/.test(normalized)) {
        return 'briefing';
    }

    return 'showcase';
}

function inferVisualFamily(text, requestedVisualPreference, outputIntent) {
    const requested = asString(requestedVisualPreference, '').trim().toLowerCase();
    if (requested === 'cinematic' || requested === 'showcase' || requested === '电影感') {
        return 'showcase';
    }
    if (requested === 'editorial' || requested === '编辑感') {
        return 'editorial';
    }
    if (requested === 'briefing' || requested === '商务感') {
        return 'briefing';
    }

    const normalized = text.toLowerCase();
    if (/杂志|编辑|editorial|magazine/.test(normalized)) {
        return 'editorial';
    }
    if (/商务|briefing|board|汇报/.test(normalized)) {
        return 'briefing';
    }
    if (/电影|舞台|cinematic|apple 发布会|apple keynote|showcase/.test(normalized)) {
        return 'showcase';
    }

    return outputIntent === 'briefing' ? 'briefing' : 'showcase';
}

function pickStyleId(visualFamily, purpose, locale) {
    const candidateStyles = getStylesForVisualFamily(visualFamily);

    if (visualFamily === 'briefing') {
        return purpose === 'pitch' ? 'swiss-modern' : (candidateStyles[0] || DEFAULT_STYLE_ID);
    }

    if (visualFamily === 'editorial') {
        return locale === 'zh-CN' ? 'notebook-tabs' : (candidateStyles[0] || DEFAULT_STYLE_ID);
    }

    if (purpose === 'tech') {
        return 'electric-studio';
    }

    return candidateStyles[0] || DEFAULT_STYLE_ID;
}

function buildHeuristicBrief({ messages, locale, outputIntent, visualPreference }) {
    const latestMessage = lastUserMessage(messages);
    const normalizedLocale = normalizeLocale(locale);
    const resolvedOutputIntent = inferOutputIntent(latestMessage, outputIntent);
    const visualFamily = inferVisualFamily(latestMessage, visualPreference, resolvedOutputIntent);
    const purpose = inferPurposeFromText(latestMessage);
    const length = inferLengthFromText(latestMessage);
    const styleId = pickStyleId(visualFamily, purpose, normalizedLocale);
    const audience = normalizeAudience('', normalizedLocale);

    return {
        topic: latestMessage || (normalizedLocale === 'zh-CN' ? '新的演示主题' : 'A new presentation topic'),
        purpose,
        length,
        audience,
        locale: normalizedLocale,
        visualFamily,
        styleId,
        outputIntent: resolvedOutputIntent,
        voiceoverMode: resolvedOutputIntent === 'briefing' ? 'guided' : 'placeholder',
        mediaIntent: resolvedOutputIntent === 'short-video' ? 'media-forward' : 'balanced',
        outlineHints: {
            tone: visualFamily === 'briefing'
                ? (normalizedLocale === 'zh-CN' ? '清晰、克制、适合汇报' : 'Clear, restrained, briefing-ready')
                : (normalizedLocale === 'zh-CN' ? '有展示感、节奏感强' : 'Showcase-oriented with strong pacing'),
            sceneFlow: resolvedOutputIntent === 'short-video'
                ? ['hook', 'setup', 'payoff', 'cta']
                : ['opening', 'context', 'proof', 'closing'],
            keywords: latestMessage
                .split(/[，。,.!?！？\s]+/)
                .map((item) => item.trim())
                .filter(Boolean)
                .slice(0, 8)
        }
    };
}

function sanitizeOutlineHints(rawHints, fallback) {
    const hints = rawHints && typeof rawHints === 'object' ? rawHints : {};

    return {
        tone: asString(hints.tone, fallback?.tone || '').slice(0, 180),
        sceneFlow: Array.isArray(hints.sceneFlow)
            ? hints.sceneFlow.map((item) => asString(item, '').trim()).filter(Boolean).slice(0, 8)
            : (Array.isArray(fallback?.sceneFlow) ? fallback.sceneFlow.slice(0, 8) : []),
        keywords: Array.isArray(hints.keywords)
            ? hints.keywords.map((item) => asString(item, '').trim()).filter(Boolean).slice(0, 12)
            : (Array.isArray(fallback?.keywords) ? fallback.keywords.slice(0, 12) : [])
    };
}

function sanitizeDraftBrief(rawBrief, fallbackBrief, options = {}) {
    const source = rawBrief && typeof rawBrief === 'object' ? rawBrief : {};
    const lockedLocale = options.lockedLocale ? normalizeLocale(options.lockedLocale, fallbackBrief.locale) : '';
    const locale = lockedLocale || normalizeLocale(source.locale, fallbackBrief.locale);
    const visualFamily = options.lockedVisualFamily
        ? normalizeVisualFamily(options.lockedVisualFamily, fallbackBrief.visualFamily)
        : normalizeVisualFamily(source.visualFamily, fallbackBrief.visualFamily);
    const inferredPurpose = normalizePurpose(source.purpose, fallbackBrief.purpose);
    const purpose = fallbackBrief.purpose !== 'product' && inferredPurpose === 'product'
        ? fallbackBrief.purpose
        : inferredPurpose;
    const inferredOutputIntent = options.lockedOutputIntent
        ? normalizeOutputIntent(options.lockedOutputIntent, fallbackBrief.outputIntent)
        : normalizeOutputIntent(source.outputIntent, fallbackBrief.outputIntent);
    const outputIntent = fallbackBrief.outputIntent !== 'showcase' && inferredOutputIntent === 'showcase'
        ? fallbackBrief.outputIntent
        : inferredOutputIntent;
    const styleInfo = getStyleInfo(
        options.lockedStyleId
            || source.styleId
            || fallbackBrief.styleId
            || pickStyleId(visualFamily, purpose, locale)
    );

    return {
        topic: asString(source.topic, fallbackBrief.topic).trim().slice(0, 240) || fallbackBrief.topic,
        purpose,
        length: normalizeLength(source.length, fallbackBrief.length),
        audience: normalizeAudience(source.audience, locale),
        locale,
        visualFamily,
        styleId: styleInfo?.id || DEFAULT_STYLE_ID,
        outputIntent,
        voiceoverMode: normalizeVoiceoverMode(source.voiceoverMode, fallbackBrief.voiceoverMode),
        mediaIntent: normalizeMediaIntent(source.mediaIntent, fallbackBrief.mediaIntent),
        outlineHints: sanitizeOutlineHints(source.outlineHints, fallbackBrief.outlineHints)
    };
}

function isVaguePrompt(prompt) {
    const normalized = asString(prompt, '').trim();
    if (normalized.length < 8) {
        return true;
    }

    return /^(做个ppt|做个演示|presentation|slides?|deck)$/i.test(normalized);
}

function buildPlanPrompt({ messages, locale, uiLocale, outputIntent, visualPreference, allowClarification, fallbackBrief }) {
    const uiLanguageLabel = uiLocale === 'zh-CN' ? 'Chinese (Simplified)' : 'English';
    const deckLanguageLabel = locale === 'zh-CN' ? 'Chinese (Simplified)' : 'English';

    return `You are the copilot planner for an AI presentation product.

You must read the conversation and decide whether it is clear enough to build a deck immediately.

Return JSON only with this shape:
{
  "assistantMessage": "Short assistant response in ${uiLanguageLabel}.",
  "readyToBuild": true,
  "clarification": "",
  "draftBrief": {
    "topic": "string",
    "purpose": "teaching|pitch|product|meeting|company|tech|personal|story|marketing|event",
    "length": "short|medium|long",
    "audience": "string",
    "locale": "${deckLanguageLabel}",
    "visualFamily": "showcase|editorial|briefing",
    "styleId": "valid style id",
    "outputIntent": "showcase|briefing|short-video",
    "voiceoverMode": "placeholder|guided|off",
    "mediaIntent": "balanced|text-first|media-forward",
    "outlineHints": {
      "tone": "string",
      "sceneFlow": ["string"],
      "keywords": ["string"]
    }
  }
}

Rules:
- Prefer readyToBuild=true unless the prompt is genuinely ambiguous.
- If clarification is needed, ask at most one short question.
- If allowClarification is false, set readyToBuild=true.
- Use these defaults when unsure: ${JSON.stringify(fallbackBrief)}.
- Respect requested output intent: ${outputIntent || 'auto'}.
- Respect requested visual preference: ${visualPreference || 'auto'}.
- Keep assistantMessage concise and helpful.

Conversation:
${JSON.stringify(messages, null, 2)}`;
}

function buildAssistantAck(brief, uiLocale) {
    if (uiLocale === 'zh-CN') {
        const outputLabel = brief.outputIntent === 'briefing'
            ? '汇报型'
            : (brief.outputIntent === 'short-video' ? '短视频友好' : '展示型');
        return `我已整理好你的需求，将按${outputLabel}、${brief.visualFamily}风格生成一份${brief.locale === 'zh-CN' ? '中文' : '英文'}演示稿。`;
    }

    const outputLabel = brief.outputIntent === 'briefing'
        ? 'briefing-oriented'
        : (brief.outputIntent === 'short-video' ? 'short-video-friendly' : 'showcase-oriented');
    return `I have enough context. I will generate a ${brief.locale === 'zh-CN' ? 'Chinese' : 'English'} deck with a ${brief.visualFamily} visual family and a ${outputLabel} flow.`;
}

function buildClarificationMessage(uiLocale, promptLocale) {
    if (uiLocale === 'zh-CN') {
        return promptLocale === 'zh-CN'
            ? '这份演示更偏融资路演、产品发布，还是内部汇报？'
            : '你希望这份演示更偏融资路演、产品发布，还是内部汇报？';
    }

    return 'Should this deck lean more toward a fundraising pitch, a product launch, or an internal briefing?';
}

function buildTopicContext(brief) {
    const hintKeywords = Array.isArray(brief.outlineHints?.keywords)
        ? brief.outlineHints.keywords.filter(Boolean).join(', ')
        : '';
    const sceneFlow = Array.isArray(brief.outlineHints?.sceneFlow)
        ? brief.outlineHints.sceneFlow.filter(Boolean).join(' -> ')
        : '';

    return [
        `Audience: ${brief.audience}`,
        `Deck locale: ${brief.locale}`,
        `Output intent: ${brief.outputIntent}`,
        `Visual family: ${brief.visualFamily}`,
        `Voiceover mode: ${brief.voiceoverMode}`,
        `Media intent: ${brief.mediaIntent}`,
        brief.outlineHints?.tone ? `Tone: ${brief.outlineHints.tone}` : '',
        hintKeywords ? `Keywords: ${hintKeywords}` : '',
        sceneFlow ? `Preferred flow: ${sceneFlow}` : ''
    ].filter(Boolean).join('\n');
}

function buildVoiceoverPlaceholder(slide, brief, index) {
    if (brief.voiceoverMode === 'off') {
        return null;
    }

    const locale = brief.locale;
    const title = asString(slide?.title, '').trim();
    const subtitle = asString(slide?.subtitle, '').trim();
    const content = Array.isArray(slide?.content)
        ? slide.content.map((item) => asString(item, '').trim()).filter(Boolean)
        : [];
    const caption = asString(slide?.media?.caption, '').trim();

    const segments = locale === 'zh-CN'
        ? [title, subtitle, content.slice(0, 2).join('，'), caption].filter(Boolean)
        : [title, subtitle, content.slice(0, 2).join(', '), caption].filter(Boolean);

    if (segments.length === 0) {
        return null;
    }

    const text = locale === 'zh-CN'
        ? `第${index + 1}页：${segments.join('。')}。`
        : `Scene ${index + 1}: ${segments.join('. ')}.`;

    const cueTexts = content.length > 1
        ? content.slice(0, 3)
        : [segments.join(locale === 'zh-CN' ? '，' : ', ')];

    const durationMs = Number(slide?.durationMs) > 0 ? Number(slide.durationMs) : 4200;
    const step = Math.max(800, Math.round(durationMs / Math.max(cueTexts.length, 1)));

    return {
        language: locale,
        text,
        cues: cueTexts.map((cueText, cueIndex) => ({
            atMs: cueIndex * step,
            text: cueText
        }))
    };
}

function buildDefaultTransition(brief, slide, index) {
    if (slide?.transition) {
        return slide.transition;
    }

    if (brief.outputIntent === 'short-video') {
        return {
            preset: index % 2 === 0 ? 'push-left' : 'zoom-fade',
            enterMs: 240,
            holdMs: 300,
            exitMs: 520,
            contentDelayMs: 80,
            motionDurationMs: 520,
            staggerStepMs: 50,
            overlay: 'accent'
        };
    }

    if (brief.visualFamily === 'briefing') {
        return {
            preset: 'crossfade',
            enterMs: 220,
            holdMs: 420,
            exitMs: 420,
            contentDelayMs: 60,
            motionDurationMs: 420,
            staggerStepMs: 40,
            overlay: 'light'
        };
    }

    return {
        preset: 'lift-fade',
        enterMs: 260,
        holdMs: 520,
        exitMs: 560,
        contentDelayMs: 100,
        motionDurationMs: 560,
        staggerStepMs: 60,
        overlay: brief.visualFamily === 'showcase' ? 'accent' : 'light'
    };
}

function buildDefaultAnimation(brief, slide) {
    if (slide?.animation) {
        return slide.animation;
    }

    const hasMedia = Boolean(slide?.media);

    if (brief.visualFamily === 'briefing') {
        return {
            scene: 'fade',
            heading: 'fade-up',
            subtitle: 'fade',
            content: 'stagger-up',
            media: hasMedia ? 'fade' : ''
        };
    }

    return {
        scene: 'fade',
        heading: hasMedia ? 'slide-left' : 'fade-up',
        subtitle: 'fade',
        content: 'stagger-up',
        media: hasMedia ? 'zoom-in' : ''
    };
}

function estimateSceneDuration(slide, brief) {
    const bulletCount = Array.isArray(slide?.content) ? slide.content.length : 0;
    const base = brief.outputIntent === 'short-video' ? 2600 : 4200;
    const extra = bulletCount * (brief.outputIntent === 'short-video' ? 420 : 680);
    return Math.min(base + extra, brief.outputIntent === 'short-video' ? 5200 : 9000);
}

function enrichOutlineForCopilot(outline, brief) {
    const slides = Array.isArray(outline?.slides) ? outline.slides : [];
    const enrichedSlides = slides.map((slide, index) => {
        const durationMs = Number(slide?.durationMs) > 0 ? Number(slide.durationMs) : estimateSceneDuration(slide, brief);

        return {
            ...slide,
            durationMs,
            animation: buildDefaultAnimation(brief, slide),
            transition: buildDefaultTransition(brief, slide, index),
            voiceover: slide?.voiceover || buildVoiceoverPlaceholder({ ...slide, durationMs }, brief, index)
        };
    });

    return {
        ...outline,
        timeline: {
            ...(outline?.timeline || {}),
            enabled: true,
            autoplay: brief.outputIntent === 'short-video',
            subtitleMode: brief.voiceoverMode === 'off' ? 'off' : 'voiceover-placeholder'
        },
        slides: enrichedSlides
    };
}

function buildSsePayload(presentationId, progress, step, message, overrides = {}) {
    return {
        presentationId,
        progress,
        step,
        message,
        status: overrides.status || 'building',
        url: `/presentations/${presentationId}`,
        pptxUrl: `/api/presentations/${presentationId}/export.pptx`,
        ...overrides
    };
}

function createCopilotService({ miniMaxClient, outlineService, presentationService }) {
    async function plan({
        messages,
        locale,
        uiLocale,
        outputIntent,
        visualPreference,
        allowClarification = true
    }) {
        const normalizedMessages = Array.isArray(messages)
            ? messages
                .map((item) => ({
                    role: item?.role === 'assistant' ? 'assistant' : 'user',
                    content: asString(item?.content, '').trim()
                }))
                .filter((item) => item.content)
            : [];

        const deckLocale = normalizeLocale(locale);
        const messageLocale = normalizeLocale(uiLocale || deckLocale);
        const fallbackBrief = buildHeuristicBrief({
            messages: normalizedMessages,
            locale: deckLocale,
            outputIntent,
            visualPreference
        });

        let parsed = null;
        try {
            const completion = await miniMaxClient.chat([
                {
                    role: 'user',
                    content: buildPlanPrompt({
                        messages: normalizedMessages,
                        locale: deckLocale,
                        uiLocale: messageLocale,
                        outputIntent,
                        visualPreference,
                        allowClarification,
                        fallbackBrief
                    })
                }
            ], {
                temperature: 0.25,
                maxTokens: 2200
            });

            parsed = extractJSONObject(completion);
        } catch (error) {
            parsed = null;
        }

        const draftBrief = sanitizeDraftBrief(parsed?.draftBrief, fallbackBrief, {
            lockedLocale: deckLocale
        });
        const prompt = lastUserMessage(normalizedMessages);
        const aiWantsClarification = parsed?.readyToBuild === false && asString(parsed?.clarification, '').trim();
        const heuristicClarification = allowClarification && isVaguePrompt(prompt);
        const shouldClarify = allowClarification && (aiWantsClarification || heuristicClarification);

        if (shouldClarify) {
            const clarification = asString(parsed?.clarification, '').trim()
                || buildClarificationMessage(messageLocale, deckLocale);

            return {
                assistantMessage: asString(parsed?.assistantMessage, '').trim() || clarification,
                draftBrief,
                readyToBuild: false,
                clarification
            };
        }

        return {
            assistantMessage: asString(parsed?.assistantMessage, '').trim() || buildAssistantAck(draftBrief, messageLocale),
            draftBrief,
            readyToBuild: true,
            clarification: ''
        };
    }

    async function buildStream({ draftBrief, locale, ownerId, presentationId, onProgress }) {
        const normalizedBrief = sanitizeDraftBrief(draftBrief, buildHeuristicBrief({
            messages: [{ role: 'user', content: asString(draftBrief?.topic, '') }],
            locale,
            outputIntent: draftBrief?.outputIntent,
            visualPreference: draftBrief?.visualFamily
        }), {
            lockedLocale: locale || draftBrief?.locale
        });
        const resolvedPresentationId = asString(presentationId, '') || generatePresentationId();

        onProgress?.(buildSsePayload(
            resolvedPresentationId,
            4,
            1,
            normalizedBrief.locale === 'zh-CN'
                ? 'Copilot 正在整理需求并补全生成参数...'
                : 'Copilot is structuring your request and filling missing build parameters...'
        ));

        const outline = await outlineService.generateStableOutline({
            topic: normalizedBrief.topic,
            purpose: normalizedBrief.purpose,
            length: normalizedBrief.length,
            content: buildTopicContext(normalizedBrief)
        });

        onProgress?.(buildSsePayload(
            resolvedPresentationId,
            18,
            1,
            normalizedBrief.locale === 'zh-CN'
                ? `已生成 ${outline.slides.length} 页的基础提纲，正在补全节奏与展示风格...`
                : `A base outline with ${outline.slides.length} scenes is ready. Refining pacing and presentation style...`
        ));

        const enrichedOutline = enrichOutlineForCopilot(outline, normalizedBrief);
        const result = await presentationService.buildPresentation({
            outline: enrichedOutline,
            ownerId,
            presentationId: resolvedPresentationId,
            style: normalizedBrief.styleId,
            onProgress,
            metaOverrides: {
                purpose: normalizedBrief.purpose,
                length: normalizedBrief.length
            },
            legacyData: {
                copilot: {
                    draftBrief: normalizedBrief,
                    visualFamily: normalizedBrief.visualFamily,
                    outputIntent: normalizedBrief.outputIntent,
                    plannedAt: new Date().toISOString()
                }
            }
        });

        return {
            presentationId: resolvedPresentationId,
            ...result
        };
    }

    return {
        buildStream,
        generatePresentationId,
        plan
    };
}

module.exports = {
    createCopilotService
};
