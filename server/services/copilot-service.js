const crypto = require('crypto');
const { createCopilotBuildGraph } = require('../agents/graphs/copilot-build-graph');
const { createCopilotPlanGraph } = require('../agents/graphs/copilot-plan-graph');
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
const MAX_PLAN_CONTEXT_MESSAGES = 6;
const MAX_PLAN_CONTEXT_CHARS = 220;

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

    if (normalized.startsWith('zh') || normalized.includes('chinese')) {
        return 'zh-CN';
    }

    if (normalized === 'en' || normalized.startsWith('en-') || normalized.includes('english')) {
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

function normalizeReasoningMode(mode, fallback = 'thinking') {
    const normalized = asString(mode, fallback).trim().toLowerCase();
    return normalized === 'fast' ? 'fast' : 'thinking';
}

function normalizeAudience(audience, locale) {
    const value = asString(audience, '').trim();
    if (value) {
        return value.slice(0, 120);
    }

    return locale === 'zh-CN' ? '鐜板満婕旂ず瑙備紬' : 'Live presentation audience';
}

function lastUserMessage(messages) {
    return (Array.isArray(messages) ? messages : [])
        .filter((item) => item && item.role === 'user')
        .map((item) => asString(item.content, '').trim())
        .filter(Boolean)
        .pop() || '';
}

function normalizeMessages(messages) {
    return Array.isArray(messages)
        ? messages
            .map((item) => ({
                role: item?.role === 'assistant' ? 'assistant' : 'user',
                content: asString(item?.content, '').trim()
            }))
            .filter((item) => item.content)
        : [];
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

function truncateText(value, maxLength = MAX_PLAN_CONTEXT_CHARS) {
    const normalized = asString(value, '').replace(/\s+/g, ' ').trim();
    if (!normalized || normalized.length <= maxLength) {
        return normalized;
    }

    return `${normalized.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
}

function compactMessagesForPrompt(messages, limit = MAX_PLAN_CONTEXT_MESSAGES) {
    return normalizeMessages(messages)
        .slice(-limit)
        .map((item) => ({
            role: item.role,
            content: truncateText(item.content)
        }));
}

function summarizeOlderUserTurns(messages, limit = 3) {
    const normalizedMessages = normalizeMessages(messages);
    const olderMessages = normalizedMessages.slice(0, Math.max(0, normalizedMessages.length - MAX_PLAN_CONTEXT_MESSAGES));
    return olderMessages
        .filter((item) => item.role === 'user')
        .map((item) => truncateText(item.content, 120))
        .filter(Boolean)
        .slice(-limit);
}

function buildContextSummary({
    existingThread,
    messages,
    latestPrompt,
    fallbackBrief,
    draftBrief,
    clarification,
    editIntent,
    reasoningMode,
    webSearchEnabled,
    selectedModelId,
    outputIntent,
    visualPreference
}) {
    const normalizedBrief = draftBrief && typeof draftBrief === 'object'
        ? draftBrief
        : (existingThread?.draftBrief && typeof existingThread.draftBrief === 'object'
            ? existingThread.draftBrief
            : (fallbackBrief && typeof fallbackBrief === 'object' ? fallbackBrief : {}));
    const purpose = asString(normalizedBrief.purpose, '');
    const length = asString(normalizedBrief.length, '');
    const visualFamily = asString(normalizedBrief.visualFamily, '');
    const briefLocale = asString(normalizedBrief.locale, '');
    const summaryLines = [];

    if (asString(normalizedBrief.topic, '')) {
        summaryLines.push(`Current topic: ${truncateText(normalizedBrief.topic, 160)}`);
    }

    if (purpose || length || visualFamily || briefLocale) {
        summaryLines.push(
            `Current brief: purpose=${purpose || 'product'}, length=${length || 'medium'}, visual=${visualFamily || 'showcase'}, locale=${briefLocale || 'zh-CN'}`
        );
    }

    if (asString(normalizedBrief.outputIntent, '') || asString(normalizedBrief.styleId, '')) {
        summaryLines.push(
            `Output plan: output=${asString(normalizedBrief.outputIntent, outputIntent || 'showcase')}, style=${asString(normalizedBrief.styleId, 'default')}`
        );
    }

    const activePresentationId = asString(
        existingThread?.activePresentationId || existingThread?.presentationId,
        ''
    );
    if (activePresentationId) {
        summaryLines.push(`Active presentation: ${activePresentationId}`);
    }

    const pendingAction = asString(existingThread?.pendingAction, '');
    if (pendingAction) {
        summaryLines.push(`Pending action: ${pendingAction}`);
    }

    const unresolvedClarification = asString(clarification || existingThread?.clarification, '');
    if (unresolvedClarification) {
        summaryLines.push(`Outstanding clarification: ${truncateText(unresolvedClarification, 180)}`);
    }

    if (editIntent?.summary) {
        summaryLines.push(`Editing intent: ${truncateText(editIntent.summary, 180)}`);
    }

    const olderUserTurns = summarizeOlderUserTurns(
        Array.isArray(messages) && messages.length ? messages : existingThread?.messages
    );
    if (olderUserTurns.length) {
        summaryLines.push(`Earlier user requests: ${olderUserTurns.join(' | ')}`);
    }

    if (latestPrompt) {
        summaryLines.push(`Latest user input: ${truncateText(latestPrompt, 180)}`);
    }

    if (outputIntent || visualPreference) {
        summaryLines.push(`Requested UI preferences: output=${outputIntent || 'auto'}, visual=${visualPreference || 'auto'}`);
    }

    summaryLines.push(
        `Run mode: ${reasoningMode === 'fast' ? 'fast' : 'thinking'}; webSearch=${webSearchEnabled ? 'enabled' : 'disabled'}; model=${selectedModelId || 'default'}`
    );

    return summaryLines.filter(Boolean).join('\n');
}

function inferPurposeFromText(text) {
    const normalized = text.toLowerCase();

    if (/铻嶈祫|璺紨|鎶曡祫浜簗铻嶈祫婕旇|pitch|fundraising|investor/.test(normalized)) {
        return 'pitch';
    }
    if (/鏁欏|璇剧▼|鍩硅|璇惧爞|learn|teaching|lesson|workshop/.test(normalized)) {
        return 'teaching';
    }
    if (/浜у搧|鍙戝竷浼殀鍙戝竷|鍔熻兘|launch|product/.test(normalized)) {
        return 'product';
    }
    if (/鎶€鏈瘄鏋舵瀯|宸ョ▼|code|developer|tech|architecture/.test(normalized)) {
        return 'tech';
    }
    if (/钀ラ攢|鍝佺墝|campaign|marketing|澧為暱|鎶曟斁/.test(normalized)) {
        return 'marketing';
    }
    if (/浼氳|姹囨姤|鍛ㄤ細|review|meeting|briefing/.test(normalized)) {
        return 'meeting';
    }
    if (/鏁呬簨|鍙欎簨|story|journey/.test(normalized)) {
        return 'story';
    }
    if (/鍏徃|鍥㈤槦浠嬬粛|company|about us/.test(normalized)) {
        return 'company';
    }
    if (/娲诲姩|宄颁細|璁哄潧|event|conference/.test(normalized)) {
        return 'event';
    }

    return 'product';
}

function inferLengthFromText(text) {
    const normalized = text.toLowerCase();

    if (/3椤祙4椤祙5椤祙鐭竴鐐箌short|brief|quick/.test(normalized)) {
        return 'short';
    }
    if (/10椤祙12椤祙璇︾粏|娣卞叆|long|deep dive|detailed/.test(normalized)) {
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
    if (/鐭棰憒瑙嗛|reel|short video|social video/.test(normalized)) {
        return 'short-video';
    }
    if (/姹囨姤|briefing|board|review|exec/.test(normalized)) {
        return 'briefing';
    }

    return 'showcase';
}

function inferVisualFamily(text, requestedVisualPreference, outputIntent) {
    const requested = asString(requestedVisualPreference, '').trim().toLowerCase();
    if (requested === 'cinematic' || requested === 'showcase') {
        return 'showcase';
    }
    if (requested === 'editorial') {
        return 'editorial';
    }
    if (requested === 'briefing') {
        return 'briefing';
    }

    const normalized = text.toLowerCase();
    if (/鏉傚織|缂栬緫|editorial|magazine/.test(normalized)) {
        return 'editorial';
    }
    if (/鍟嗗姟|briefing|board|姹囨姤/.test(normalized)) {
        return 'briefing';
    }
    if (/鐢靛奖|鑸炲彴|cinematic|apple 鍙戝竷浼殀apple keynote|showcase/.test(normalized)) {
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
                .split(/[锛屻€?.!?锛侊紵\s]+/)
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

    return /^(鍋氫釜ppt|鍋氫釜婕旂ず|presentation|slides?|deck)$/i.test(normalized);
}

function buildPlanPrompt({
    messages,
    recentMessages,
    contextSummary,
    locale,
    uiLocale,
    outputIntent,
    visualPreference,
    allowClarification,
    fallbackBrief
}) {
    const uiLanguageLabel = uiLocale === 'zh-CN' ? 'Chinese (Simplified)' : 'English';
    const deckLanguageLabel = locale === 'zh-CN' ? 'Chinese (Simplified)' : 'English';
    const promptMessages = Array.isArray(recentMessages) && recentMessages.length
        ? recentMessages
        : compactMessagesForPrompt(messages);
    const compressedContext = asString(contextSummary, '').trim() || 'No prior thread context.';

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
- Use the context snapshot as compressed memory of earlier turns.
- Prioritize the latest user input when it clearly updates the current deck.

Context snapshot:
${compressedContext}

Recent turns (most recent last):
${JSON.stringify(promptMessages, null, 2)}`;
}

function buildAssistantAck(brief, uiLocale) {
    if (uiLocale === 'zh-CN') {
        const outputLabel = brief.outputIntent === 'briefing'
            ? '汇报型'
            : (brief.outputIntent === 'short-video' ? '短视频友好型' : '展示型');
        return `我已经整理好你的需求，将按${outputLabel}、${brief.visualFamily}视觉家族生成一份${brief.locale === 'zh-CN' ? '中文' : '英文'}演示稿。`;
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

function createEventId(prefix = 'evt') {
    return `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`;
}

function normalizeArtifacts(artifacts) {
    if (!Array.isArray(artifacts)) {
        return [];
    }

    return artifacts
        .map((item) => ({
            type: asString(item?.type, '').trim(),
            label: asString(item?.label, '').trim(),
            url: asString(item?.url, '').trim(),
            presentationId: asString(item?.presentationId, '').trim(),
            taskId: asString(item?.taskId, '').trim(),
            status: asString(item?.status, '').trim(),
            providerTaskId: asString(item?.providerTaskId, '').trim()
        }))
        .filter((item) => item.type || item.url || item.presentationId || item.taskId);
}

function normalizeAgentSteps(agentSteps) {
    if (!Array.isArray(agentSteps)) {
        return [];
    }

    return agentSteps
        .map((item) => ({
            id: asString(item?.id, createEventId('step')),
            eventType: asString(item?.eventType, '').trim(),
            stepLabel: asString(item?.stepLabel, '').trim(),
            message: asString(item?.message, '').trim(),
            status: asString(item?.status, '').trim() || 'info',
            artifact: item?.artifact && typeof item.artifact === 'object' ? item.artifact : null
        }))
        .filter((item) => item.eventType || item.stepLabel || item.message);
}

function buildBriefArtifact(draftBrief) {
    if (!draftBrief || typeof draftBrief !== 'object') {
        return null;
    }

    return {
        type: 'brief',
        topic: asString(draftBrief.topic, ''),
        purpose: asString(draftBrief.purpose, ''),
        length: asString(draftBrief.length, ''),
        visualFamily: asString(draftBrief.visualFamily, ''),
        styleId: asString(draftBrief.styleId, ''),
        outputIntent: asString(draftBrief.outputIntent, ''),
        locale: asString(draftBrief.locale, '')
    };
}

function buildPresentationArtifacts(presentationId) {
    if (!presentationId) {
        return [];
    }

    return normalizeArtifacts([
        {
            type: 'presentation',
            label: 'preview',
            url: `/presentations/${presentationId}`,
            presentationId
        },
        {
            type: 'spec',
            label: 'spec',
            url: `/api/presentations/${presentationId}/spec`,
            presentationId
        },
        {
            type: 'html',
            label: 'html',
            url: `/api/presentations/${presentationId}/html`,
            presentationId
        },
        {
            type: 'pptx',
            label: 'pptx',
            url: `/api/presentations/${presentationId}/export.pptx`,
            presentationId
        }
    ]);
}

function buildStepLabel(eventType, locale) {
    const zh = locale === 'zh-CN';
    const labels = {
        planning_started: zh ? '开始理解需求' : 'Planning started',
        intent_parsed: zh ? '已解析需求' : 'Intent parsed',
        clarification_requested: zh ? '等待补充信息' : 'Clarification requested',
        brief_locked: zh ? '已锁定 brief' : 'Brief locked',
        outline_generating: zh ? '正在生成大纲' : 'Generating outline',
        slides_rendering: zh ? '正在渲染演示' : 'Rendering slides',
        presentation_ready: zh ? '演示已就绪' : 'Presentation ready',
        media_task_queued: zh ? '媒体任务已排队' : 'Media task queued',
        media_task_running: zh ? '媒体任务进行中' : 'Media task running',
        media_task_ready: zh ? '媒体任务已完成' : 'Media task ready',
        media_task_failed: zh ? '媒体任务失败' : 'Media task failed',
        build_failed: zh ? '生成失败' : 'Build failed',
        workspace_restored: zh ? '已恢复工作台' : 'Workspace restored'
    };

    return labels[eventType] || (zh ? '执行步骤' : 'Execution');
}

function buildStepEvent({ eventType, locale, message, status = 'info', artifact = null }) {
    return {
        id: createEventId('step'),
        eventType,
        stepLabel: buildStepLabel(eventType, locale),
        message,
        status,
        artifact
    };
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function createRunId() {
    return `run_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;
}

function createAguiEvent({ type, threadId, runId, presentationId = '', payload = {} }) {
    return {
        type,
        threadId,
        runId,
        presentationId: asString(presentationId, '').trim() || undefined,
        timestamp: new Date().toISOString(),
        payload
    };
}

function mapAguiStepPhase(eventType) {
    const value = asString(eventType, '').trim();

    if (
        value === 'planning_started'
        || value === 'intent_parsed'
        || value === 'brief_locked'
        || value === 'clarification_requested'
        || value === 'workspace_restored'
    ) {
        return 'reasoning';
    }

    if (
        value === 'media_task_queued'
        || value === 'media_task_running'
        || value === 'media_task_ready'
        || value === 'media_task_failed'
    ) {
        return 'tool';
    }

    if (
        value === 'presentation_ready'
        || value === 'build_failed'
    ) {
        return 'result';
    }

    return 'execution';
}

function buildAguiThreadSnapshot(thread) {
    if (!thread || typeof thread !== 'object') {
        return {};
    }

    return {
        threadId: thread.id,
        status: thread.status,
        pendingAction: thread.pendingAction,
        presentationId: thread.presentationId || '',
        activePresentationId: thread.activePresentationId || '',
        draftBrief: thread.draftBrief || null,
        clarification: thread.clarification || '',
        messages: Array.isArray(thread.messages) ? thread.messages.slice(-8) : [],
        lastBuildArtifacts: normalizeArtifacts(thread.lastBuildArtifacts),
        agentSteps: normalizeAgentSteps(thread.agentSteps).slice(-6),
        reasoningMode: thread.reasoningMode || 'thinking',
        webSearchEnabled: Boolean(thread.webSearchEnabled),
        selectedModelId: thread.selectedModelId || '',
        uiRunState: thread.uiRunState || null,
        contextSummary: asString(thread.contextSummary || thread.meta?.contextSummary, '')
    };
}

function splitTextForStreaming(text) {
    const source = asString(text, '').trim();
    if (!source) {
        return [];
    }

    const chunks = [];
    let cursor = 0;
    while (cursor < source.length) {
        const next = source.slice(cursor, cursor + 18);
        chunks.push(next);
        cursor += next.length;
    }
    return chunks;
}

async function streamAguiAssistantMessage(writer, { threadId, runId, presentationId = '', message }) {
    const content = asString(message, '').trim();
    if (!content) {
        return;
    }

    const messageId = createEventId('assistant');
    writer(createAguiEvent({
        type: 'TEXT_MESSAGE_START',
        threadId,
        runId,
        presentationId,
        payload: {
            messageId,
            role: 'assistant'
        }
    }));

    for (const chunk of splitTextForStreaming(content)) {
        await wait(22);
        writer(createAguiEvent({
            type: 'TEXT_MESSAGE_CONTENT',
            threadId,
            runId,
            presentationId,
            payload: {
                messageId,
                delta: chunk
            }
        }));
    }

    writer(createAguiEvent({
        type: 'TEXT_MESSAGE_END',
        threadId,
        runId,
        presentationId,
        payload: {
            messageId,
            role: 'assistant',
            content
        }
    }));
}

async function emitAguiStep(writer, { threadId, runId, presentationId = '', step }) {
    const phase = mapAguiStepPhase(step?.eventType);
    const basePayload = {
        stepId: step?.id || createEventId('step'),
        phase,
        eventType: step?.eventType || '',
        title: step?.stepLabel || '',
        message: step?.message || '',
        status: step?.status || 'info',
        artifact: step?.artifact || null
    };

    if (phase === 'tool') {
        writer(createAguiEvent({
            type: 'TOOL_CALL_START',
            threadId,
            runId,
            presentationId,
            payload: {
                ...basePayload,
                toolCallId: basePayload.stepId,
                toolName: step?.artifact?.type || step?.eventType || 'tool'
            }
        }));
        await wait(120);
        writer(createAguiEvent({
            type: 'TOOL_CALL_END',
            threadId,
            runId,
            presentationId,
            payload: {
                ...basePayload,
                toolCallId: basePayload.stepId,
                toolName: step?.artifact?.type || step?.eventType || 'tool'
            }
        }));
        return;
    }

    writer(createAguiEvent({
        type: 'STEP_STARTED',
        threadId,
        runId,
        presentationId,
        payload: basePayload
    }));
    await wait(120);
    writer(createAguiEvent({
        type: 'STEP_FINISHED',
        threadId,
        runId,
        presentationId,
        payload: basePayload
    }));
}

function buildMediaTaskBlueprints(draftBrief, presentationId, threadId, locale) {
    const normalizedBrief = draftBrief && typeof draftBrief === 'object' ? draftBrief : {};
    const tasks = [];
    const mediaIntent = asString(normalizedBrief.mediaIntent, 'balanced');
    const voiceoverMode = asString(normalizedBrief.voiceoverMode, 'placeholder');
    const outputIntent = asString(normalizedBrief.outputIntent, 'showcase');

    if (mediaIntent !== 'text-first') {
        tasks.push({
            kind: 'image_generation',
            label: locale === 'zh-CN' ? '封面与场景图生成' : 'Scene image generation',
            threadId,
            presentationId,
            payload: {
                topic: normalizedBrief.topic,
                visualFamily: normalizedBrief.visualFamily,
                styleId: normalizedBrief.styleId
            }
        });
    }

    if (voiceoverMode !== 'off') {
        tasks.push({
            kind: 'tts_generation',
            label: locale === 'zh-CN' ? '旁白音频生成' : 'Voiceover generation',
            threadId,
            presentationId,
            payload: {
                topic: normalizedBrief.topic,
                locale: normalizedBrief.locale
            }
        });
    }

    if (outputIntent === 'short-video') {
        tasks.push({
            kind: 'video_generation',
            label: locale === 'zh-CN' ? '短视频合成' : 'Short video assembly',
            threadId,
            presentationId,
            payload: {
                topic: normalizedBrief.topic,
                locale: normalizedBrief.locale
            }
        });
    }

    return tasks;
}

function buildMediaTaskArtifact(task) {
    return {
        type: task.kind,
        label: task.label || task.payload?.label || task.kind,
        presentationId: task.presentationId,
        taskId: task.id,
        status: task.status,
        providerTaskId: asString(task.providerTaskId, ''),
        url: asString(task.result?.previewUrl || task.result?.assetUrl, '')
    };
}

function buildMediaTaskMessage(task, locale) {
    const label = task.label || task.payload?.label || task.kind || 'task';
    const status = asString(task.status, 'queued').toLowerCase();

    if (locale === 'zh-CN') {
        if (status === 'running') {
            return `${label} 正在执行。`;
        }
        if (status === 'ready') {
            return task.result?.message || `${label} 已完成，可以继续使用。`;
        }
        if (status === 'failed') {
            return `${label} 执行失败：${task.error || 'unknown error'}`;
        }
        return `${label} 已加入任务队列。`;
    }

    if (status === 'running') {
        return `${label} is running.`;
    }
    if (status === 'ready') {
        return task.result?.message || `${label} is ready.`;
    }
    if (status === 'failed') {
        return `${label} failed: ${task.error || 'unknown error'}`;
    }
    return `${label} has been queued.`;
}

function mergeArtifactsWithTask(artifacts, task) {
    const nextArtifact = buildMediaTaskArtifact(task);
    const current = normalizeArtifacts(artifacts).filter((item) => item.taskId !== task.id);
    current.push(nextArtifact);
    return current;
}

function parseSceneTarget(prompt) {
    const match = asString(prompt, '').match(/(?:第\s*(\d+)\s*页|slide\s*(\d+))/i);
    if (!match) {
        return null;
    }

    return Number(match[1] || match[2] || 0) || null;
}

function detectEditIntent(prompt, existingThread, locale) {
    const activePresentationId = asString(
        existingThread?.activePresentationId || existingThread?.presentationId,
        ''
    );
    const latestPrompt = asString(prompt, '').trim();
    if (!activePresentationId || !latestPrompt) {
        return null;
    }

    const normalized = latestPrompt.toLowerCase();
    const explicitEditSignal = /(改|调整|重新|优化|增加|新增|删掉|删除|更像|换成|改成|补充|再加|refine|revise|update|change|adjust|make it|add|remove|short video|reel)/i
        .test(latestPrompt);
    const contextualEditSignal = /(继续|基于这个|在这个基础上|当前这个|这份|这一版|刚才那个|把它|让它|再来一版|继续完善|continue|based on this|current deck|same deck|keep this)/i
        .test(latestPrompt);
    const followUpEditSignal = /(然后|然后把|再把|顺便|另外|同时|那就|就按这个|就这样|改下|改一下|调下|调一下|帮我把|再补一个|补一页|补一段|再来个|顺手把|接着改|继续改|继续优化|继续完善)/i
        .test(latestPrompt);
    const newDeckSignal = /(重新做一个|重新生成一个|新做一个|新建一个|start over|new deck|new presentation)/i
        .test(latestPrompt);
    const looksLikeEdit = !newDeckSignal && (explicitEditSignal || contextualEditSignal || followUpEditSignal);

    if (!looksLikeEdit) {
        return null;
    }

    const directives = {};
    if (/apple|keynote/.test(normalized)) {
        directives.visualFamily = 'showcase';
        directives.styleId = pickStyleId('showcase', existingThread?.draftBrief?.purpose || 'pitch', locale);
    } else if (/editorial|杂志|编辑感/.test(normalized)) {
        directives.visualFamily = 'editorial';
        directives.styleId = pickStyleId('editorial', existingThread?.draftBrief?.purpose || 'product', locale);
    } else if (/briefing|汇报|board/.test(normalized)) {
        directives.visualFamily = 'briefing';
        directives.styleId = pickStyleId('briefing', existingThread?.draftBrief?.purpose || 'meeting', locale);
    }

    if (/短视频|short video|reel|视频版/.test(normalized)) {
        directives.outputIntent = 'short-video';
        directives.mediaIntent = 'media-forward';
    } else if (/现场展示|showcase|stage|现场/.test(normalized)) {
        directives.outputIntent = 'showcase';
    }

    if (/英文|english/.test(normalized)) {
        directives.locale = 'en';
    } else if (/中文|chinese/.test(normalized)) {
        directives.locale = 'zh-CN';
    }

    if (/12页|10页|更详细|更完整|deep dive|detailed|longer|more detailed/.test(normalized)) {
        directives.length = 'long';
    } else if (/4页|5页|精简|更短|summary|shorter|tighter/.test(normalized)) {
        directives.length = 'short';
    }

    const targetScene = parseSceneTarget(latestPrompt);
    const scope = targetScene ? 'scene' : 'deck';
    const kind = targetScene ? 'deck-level' : 'brief-level';

    return {
        kind,
        scope,
        targetScene,
        summary: latestPrompt,
        directives
    };
}

function resolveClarificationFollowUp(latestPrompt, existingThread, locale, uiLocale) {
    if (!existingThread || existingThread.pendingAction !== 'clarification' || !existingThread.draftBrief) {
        return null;
    }

    const prompt = asString(latestPrompt, '').trim();
    if (!prompt) {
        return null;
    }

    const normalized = prompt.toLowerCase();
    const baseBrief = existingThread.draftBrief && typeof existingThread.draftBrief === 'object'
        ? existingThread.draftBrief
        : null;

    if (!baseBrief) {
        return null;
    }

    const nextBrief = {
        ...baseBrief,
        outlineHints: {
            ...(baseBrief.outlineHints || {})
        }
    };

    let matched = false;

    if (/融资|路演|投资人|pitch|fundraising|investor/.test(normalized)) {
        nextBrief.purpose = 'pitch';
        nextBrief.outputIntent = 'showcase';
        nextBrief.visualFamily = 'showcase';
        matched = true;
    } else if (/产品发布|产品演示|产品|launch|showcase|demo/.test(normalized)) {
        nextBrief.purpose = 'product';
        nextBrief.outputIntent = 'showcase';
        nextBrief.visualFamily = 'showcase';
        matched = true;
    } else if (/内部汇报|内部|汇报|briefing|review|board|meeting/.test(normalized)) {
        nextBrief.purpose = 'meeting';
        nextBrief.outputIntent = 'briefing';
        nextBrief.visualFamily = 'briefing';
        matched = true;
    } else if (/教学|培训|课程|teaching|lesson|workshop/.test(normalized)) {
        nextBrief.purpose = 'teaching';
        nextBrief.outputIntent = 'showcase';
        nextBrief.visualFamily = 'editorial';
        matched = true;
    }

    if (/apple|keynote/.test(normalized)) {
        nextBrief.visualFamily = 'showcase';
        matched = true;
    } else if (/editorial|杂志|编辑感/.test(normalized)) {
        nextBrief.visualFamily = 'editorial';
        matched = true;
    } else if (/briefing|board|商务|汇报风格/.test(normalized)) {
        nextBrief.visualFamily = 'briefing';
        matched = true;
    }

    if (/短视频|视频版|short video|reel/.test(normalized)) {
        nextBrief.outputIntent = 'short-video';
        nextBrief.mediaIntent = 'media-forward';
        matched = true;
    }

    if (/中文|chinese/.test(normalized)) {
        nextBrief.locale = 'zh-CN';
        matched = true;
    } else if (/英文|english/.test(normalized)) {
        nextBrief.locale = 'en';
        matched = true;
    }

    if (/简短|更短|shorter|short/.test(normalized)) {
        nextBrief.length = 'short';
        matched = true;
    } else if (/详细|更完整|longer|long|deep dive|detailed/.test(normalized)) {
        nextBrief.length = 'long';
        matched = true;
    }

    if (!matched) {
        const existingKeywords = Array.isArray(baseBrief.outlineHints?.keywords)
            ? baseBrief.outlineHints.keywords
            : [];
        const promptKeywords = prompt
            .split(/[，。！？、,.!?\s]+/)
            .map((item) => asString(item, '').trim())
            .filter(Boolean)
            .slice(0, 8);

        nextBrief.outlineHints.keywords = Array.from(new Set([
            ...existingKeywords,
            ...promptKeywords
        ])).slice(0, 12);

        if (prompt.length <= 120) {
            nextBrief.outlineHints.tone = prompt;
        }

        matched = true;
    }

    nextBrief.styleId = pickStyleId(
        nextBrief.visualFamily || baseBrief.visualFamily || 'showcase',
        nextBrief.purpose || baseBrief.purpose || 'product',
        nextBrief.locale || baseBrief.locale || locale
    );

    const sanitized = sanitizeDraftBrief(nextBrief, baseBrief, {
        lockedLocale: nextBrief.locale || baseBrief.locale || locale,
        lockedVisualFamily: nextBrief.visualFamily || baseBrief.visualFamily,
        lockedOutputIntent: nextBrief.outputIntent || baseBrief.outputIntent,
        lockedStyleId: nextBrief.styleId
    });

    const assistantMessage = uiLocale === 'zh-CN'
        ? '好，我已经接上你的补充信息，接着在当前这份演示上继续生成。'
        : 'Got it. I have folded that clarification into the current deck and will keep going.';

    return {
        assistantMessage,
        readyToBuild: true,
        clarification: '',
        draftBrief: sanitized
    };
}

function mergeBriefForEdit(existingBrief, nextBrief, editIntent, locale) {
    const baseBrief = existingBrief && typeof existingBrief === 'object'
        ? { ...existingBrief }
        : {};
    const generatedBrief = nextBrief && typeof nextBrief === 'object'
        ? { ...nextBrief }
        : {};

    if (!editIntent) {
        return sanitizeDraftBrief(generatedBrief, existingBrief || generatedBrief, {
            lockedLocale: locale
        });
    }

    const merged = {
        ...baseBrief,
        audience: generatedBrief.audience || baseBrief.audience || '',
        voiceoverMode: generatedBrief.voiceoverMode || baseBrief.voiceoverMode || 'placeholder',
        mediaIntent: generatedBrief.mediaIntent || baseBrief.mediaIntent || 'balanced',
        outlineHints: {
            ...(baseBrief.outlineHints || {}),
            ...(generatedBrief.outlineHints || {})
        }
    };

    if (editIntent.directives.visualFamily) {
        merged.visualFamily = editIntent.directives.visualFamily;
    }
    if (editIntent.directives.styleId) {
        merged.styleId = editIntent.directives.styleId;
    }
    if (editIntent.directives.outputIntent) {
        merged.outputIntent = editIntent.directives.outputIntent;
    }
    if (editIntent.directives.length) {
        merged.length = editIntent.directives.length;
    }
    if (editIntent.directives.locale) {
        merged.locale = editIntent.directives.locale;
    }
    if (editIntent.directives.mediaIntent) {
        merged.mediaIntent = editIntent.directives.mediaIntent;
    }

    const flow = Array.isArray(merged.outlineHints?.flow) ? merged.outlineHints.flow : [];
    const keywords = Array.isArray(merged.outlineHints?.keywords) ? merged.outlineHints.keywords : [];
    merged.outlineHints = {
        ...(merged.outlineHints || {}),
        flow: flow.slice(0, 8),
        keywords: Array.from(new Set([
            ...keywords,
            editIntent.scope === 'scene' && editIntent.targetScene ? `scene:${editIntent.targetScene}` : '',
            editIntent.summary
        ].filter(Boolean))).slice(0, 12)
    };

    return sanitizeDraftBrief(merged, baseBrief || generatedBrief, {
        lockedLocale: merged.locale || locale
    });
}

function buildEditAssistantAck(editIntent, locale) {
    if (!editIntent) {
        return '';
    }

    if (locale === 'zh-CN') {
        if (editIntent.scope === 'scene' && editIntent.targetScene) {
            return `好，我会直接在当前这份演示里继续调整第 ${editIntent.targetScene} 页。`;
        }

        return '好，我会基于当前这份演示继续调整整体结构和风格。';
    }

    if (editIntent.scope === 'scene' && editIntent.targetScene) {
        return `Understood. I will revise slide ${editIntent.targetScene} in the current deck and regenerate an updated version.`;
    }

    return 'Understood. I will refine the current deck direction and regenerate an updated version.';
}

function buildPlanAgentSteps({ draftBrief, locale, shouldClarify, clarification, editIntent }) {
    return normalizeAgentSteps([buildStepEvent({
        eventType: 'context_compacted',
        locale,
        message: locale === 'zh-CN'
            ? '系统已整理当前线程上下文，准备继续响应。'
            : 'The system compacted the current thread context and is ready to continue.',
        status: 'info'
    })]);
}

function mapBuildEventPayload(payload, locale) {
    const event = {
        ...payload
    };

    if (!event.eventType) {
        if (event.status === 'failed') {
            event.eventType = 'build_failed';
        } else if (event.status === 'ready') {
            event.eventType = 'presentation_ready';
        } else if (Number(event.step) <= 1) {
            event.eventType = 'outline_generating';
        } else {
            event.eventType = 'slides_rendering';
        }
    }

    if (!event.stepLabel) {
        event.stepLabel = buildStepLabel(event.eventType, locale);
    }

    if (!event.artifact && event.status === 'ready' && event.presentationId) {
        event.artifact = {
            type: 'presentation',
            label: 'preview',
            url: `/presentations/${event.presentationId}`,
            presentationId: event.presentationId
        };
    }

    return event;
}

function createFallbackThreadStore() {
    const records = new Map();

    return {
        createThreadId() {
            return `thread_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;
        },
        getById(threadId) {
            return records.get(asString(threadId, '')) || null;
        },
        isValidId(threadId) {
            return /^thread_[a-zA-Z0-9_-]{6,128}$/.test(asString(threadId, ''));
        },
        save(threadInput) {
            const nextId = this.isValidId(threadInput?.id) ? threadInput.id : this.createThreadId();
            const previous = records.get(nextId) || {};
            const now = new Date().toISOString();
            const normalized = {
                id: nextId,
                createdAt: previous.createdAt || now,
                updatedAt: now,
                locale: asString(threadInput?.locale || previous.locale, 'zh-CN'),
                uiLocale: asString(threadInput?.uiLocale || previous.uiLocale, 'zh-CN'),
                status: asString(threadInput?.status || previous.status, 'idle'),
                messages: normalizeMessages(threadInput?.messages ?? previous.messages),
                clarificationCount: Number.isFinite(Number(threadInput?.clarificationCount))
                    ? Number(threadInput.clarificationCount)
                    : Number(previous.clarificationCount) || 0,
                draftBrief: threadInput?.draftBrief || previous.draftBrief || null,
                lastAssistantMessage: asString(threadInput?.lastAssistantMessage || previous.lastAssistantMessage, ''),
                clarification: asString(threadInput?.clarification || previous.clarification, ''),
                presentationId: asString(threadInput?.presentationId || previous.presentationId, ''),
                activePresentationId: asString(
                    threadInput?.activePresentationId
                    || threadInput?.presentationId
                    || previous.activePresentationId
                    || previous.presentationId,
                    ''
                ),
                lastBuildArtifacts: normalizeArtifacts(threadInput?.lastBuildArtifacts ?? previous.lastBuildArtifacts),
                editIntent: threadInput?.editIntent || previous.editIntent || null,
                pendingAction: asString(threadInput?.pendingAction || previous.pendingAction, ''),
                agentSteps: normalizeAgentSteps(threadInput?.agentSteps ?? previous.agentSteps),
                reasoningMode: normalizeReasoningMode(threadInput?.reasoningMode ?? previous.reasoningMode),
                webSearchEnabled: Boolean(threadInput?.webSearchEnabled ?? previous.webSearchEnabled),
                selectedModelId: asString(threadInput?.selectedModelId || previous.selectedModelId, '').trim(),
                uiRunState: {
                    runId: asString(threadInput?.uiRunState?.runId || previous.uiRunState?.runId, '').trim(),
                    lastEventType: asString(threadInput?.uiRunState?.lastEventType || previous.uiRunState?.lastEventType, '').trim(),
                    lastSnapshotAt: asString(threadInput?.uiRunState?.lastSnapshotAt || previous.uiRunState?.lastSnapshotAt, '').trim()
                },
                contextSummary: asString(threadInput?.contextSummary || previous.contextSummary, ''),
                meta: {
                    ...(previous.meta && typeof previous.meta === 'object' ? previous.meta : {}),
                    ...(threadInput?.meta && typeof threadInput.meta === 'object' ? threadInput.meta : {})
                }
            };

            records.set(nextId, normalized);
            return normalized;
        }
    };
}

function appendAssistantMessage(messages, assistantMessage) {
    const normalizedMessages = normalizeMessages(messages);
    const nextMessage = asString(assistantMessage, '').trim();

    if (!nextMessage) {
        return normalizedMessages;
    }

    return [
        ...normalizedMessages,
        {
            role: 'assistant',
            content: nextMessage
        }
    ];
}

function buildThreadMeta(brief, overrides = {}) {
    const normalizedBrief = brief && typeof brief === 'object' ? brief : {};

    return {
        topic: asString(normalizedBrief.topic, ''),
        purpose: asString(normalizedBrief.purpose, ''),
        outputIntent: asString(normalizedBrief.outputIntent, ''),
        visualFamily: asString(normalizedBrief.visualFamily, ''),
        styleId: asString(normalizedBrief.styleId, ''),
        locale: asString(normalizedBrief.locale, ''),
        length: asString(normalizedBrief.length, ''),
        ...overrides
    };
}

function createCopilotService({
    miniMaxClient,
    outlineService,
    presentationService,
    threadStore,
    observability,
    execution,
    mediaTaskStore
}) {
    const resolvedThreadStore = threadStore || createFallbackThreadStore();
    const resolvedObservability = observability || {
        startSpan() {
            return {
                record() {},
                update() {},
                end() {},
                fail() {}
            };
        }
    };
    const resolvedExecution = execution || {
        provider: 'local',
        enabled: false,
        describe() {
            return {
                provider: 'local',
                enabled: false
            };
        },
        async enqueueMediaTask(task) {
            return {
                id: createEventId('task'),
                status: 'queued',
                provider: 'local',
                task
            };
        }
    };
    const planGraph = createCopilotPlanGraph({
        bootstrapPlan(state) {
            const fallbackBrief = buildHeuristicBrief({
                messages: state.messages,
                locale: state.locale,
                outputIntent: state.outputIntent,
                visualPreference: state.visualPreference
            });
            const latestPrompt = lastUserMessage(state.messages);
            const contextSummary = buildContextSummary({
                existingThread: state.existingThread,
                messages: state.messages,
                latestPrompt,
                fallbackBrief,
                draftBrief: state.existingThread?.draftBrief || null,
                clarification: state.existingThread?.clarification || '',
                editIntent: state.editIntent || null,
                reasoningMode: state.reasoningMode,
                webSearchEnabled: state.webSearchEnabled,
                selectedModelId: state.selectedModelId,
                outputIntent: state.outputIntent,
                visualPreference: state.visualPreference
            });

            return {
                latestPrompt,
                fallbackBrief,
                recentMessages: compactMessagesForPrompt(state.messages),
                contextSummary
            };
        },
        async callModelPlan(state) {
            try {
                const completion = await miniMaxClient.chat([
                    {
                        role: 'user',
                        content: buildPlanPrompt({
                            messages: state.messages,
                            recentMessages: state.recentMessages,
                            contextSummary: state.contextSummary,
                            locale: state.locale,
                            uiLocale: state.uiLocale,
                            outputIntent: state.outputIntent,
                            visualPreference: state.visualPreference,
                            allowClarification: state.allowClarification !== false,
                            fallbackBrief: state.fallbackBrief
                        })
                    }
                ], {
                    temperature: 0.25,
                    maxTokens: 2200
                });

                return {
                    parsedPlan: extractJSONObject(completion)
                };
            } catch (error) {
                return {
                    parsedPlan: null
                };
            }
        },
        finalizePlan(state) {
            const deckLocale = normalizeLocale(state.locale);
            const messageLocale = normalizeLocale(state.uiLocale || deckLocale);
            const draftBrief = sanitizeDraftBrief(state.parsedPlan?.draftBrief, state.fallbackBrief, {
                lockedLocale: deckLocale
            });
            const prompt = state.latestPrompt;
            const aiWantsClarification = state.parsedPlan?.readyToBuild === false
                && asString(state.parsedPlan?.clarification, '').trim();
            const heuristicClarification = state.allowClarification !== false && isVaguePrompt(prompt);
            const shouldClarify = state.allowClarification !== false && (aiWantsClarification || heuristicClarification);

            if (shouldClarify) {
                const clarification = asString(state.parsedPlan?.clarification, '').trim()
                    || buildClarificationMessage(messageLocale, deckLocale);

                return {
                    draftBrief,
                    readyToBuild: false,
                    shouldClarify: true,
                    clarification,
                    assistantMessage: asString(state.parsedPlan?.assistantMessage, '').trim() || clarification
                };
            }

            return {
                draftBrief,
                readyToBuild: true,
                shouldClarify: false,
                clarification: '',
                assistantMessage: asString(state.parsedPlan?.assistantMessage, '').trim()
                    || buildAssistantAck(draftBrief, messageLocale)
            };
        }
    });

    async function handleMediaTaskUpdate({
        taskId,
        status,
        result = {},
        error = '',
        provider = '',
        providerTaskId = ''
    }) {
        if (!mediaTaskStore) {
            return null;
        }

        const currentTask = mediaTaskStore.getById(taskId);
        if (!currentTask) {
            return null;
        }

        const nextStatus = asString(status, currentTask.status).trim().toLowerCase();
        const nextError = asString(error, '').trim();
        const nextResult = result && typeof result === 'object' ? result : {};
        if (
            currentTask.status === nextStatus
            && currentTask.error === nextError
            && JSON.stringify(currentTask.result || {}) === JSON.stringify(nextResult)
        ) {
            return currentTask;
        }

        const nextTask = mediaTaskStore.update(taskId, {
            status: nextStatus,
            provider: provider || currentTask.provider,
            providerTaskId: providerTaskId || currentTask.providerTaskId || '',
            result: nextResult,
            error: nextError
        });

        if (!nextTask) {
            return null;
        }

        const taskTrace = resolvedObservability.startSpan('copilot.media_task', {
            threadId: nextTask.threadId,
            presentationId: nextTask.presentationId,
            taskId: nextTask.id,
            input: {
                kind: nextTask.kind,
                status: nextTask.status,
                provider: nextTask.provider
            }
        });

        try {
            taskTrace.record('media_task.persisted', {
                output: {
                    status: nextTask.status,
                    result: nextTask.result
                },
                metadata: {
                    providerTaskId: nextTask.providerTaskId || ''
                }
            });

            const thread = resolvedThreadStore.isValidId(nextTask.threadId)
                ? resolvedThreadStore.getById(nextTask.threadId)
                : null;

            if (thread) {
                const uiLocale = normalizeLocale(thread.uiLocale || thread.locale || 'zh-CN');
                const nextStep = buildStepEvent({
                    eventType: nextTask.status === 'running'
                        ? 'media_task_running'
                        : nextTask.status === 'ready'
                            ? 'media_task_ready'
                            : nextTask.status === 'failed'
                                ? 'media_task_failed'
                                : 'media_task_queued',
                    locale: uiLocale,
                    message: buildMediaTaskMessage(nextTask, uiLocale),
                    status: nextTask.status === 'failed'
                        ? 'error'
                        : nextTask.status === 'ready'
                            ? 'success'
                            : 'info',
                    artifact: buildMediaTaskArtifact(nextTask)
                });

                resolvedThreadStore.save({
                    ...thread,
                    id: thread.id,
                    lastBuildArtifacts: mergeArtifactsWithTask(thread.lastBuildArtifacts, nextTask),
                    agentSteps: normalizeAgentSteps([
                        ...(thread.agentSteps || []),
                        nextStep
                    ]),
                    meta: {
                        ...(thread.meta || {}),
                        lastMediaTaskUpdateAt: new Date().toISOString()
                    }
                });
            }

            taskTrace.end({
                output: {
                    taskId: nextTask.id,
                    status: nextTask.status
                }
            });

            return nextTask;
        } catch (callbackError) {
            taskTrace.fail(callbackError, {
                metadata: {
                    taskId: nextTask.id
                }
            });
            throw callbackError;
        }
    }

    function scheduleLocalMediaTaskLifecycle(task) {
        if (!mediaTaskStore || resolvedExecution.provider !== 'local') {
            return;
        }

        const runningDelay = task.kind === 'video_generation' ? 1600 : 900;
        const readyDelay = task.kind === 'video_generation' ? 4200 : 2200;

        setTimeout(() => {
            handleMediaTaskUpdate({
                taskId: task.id,
                status: 'running',
                provider: 'local',
                result: {
                    message: `${task.label || task.payload?.label || task.kind} is running`
                }
            }).catch(() => {});
        }, runningDelay);

        setTimeout(() => {
            handleMediaTaskUpdate({
                taskId: task.id,
                status: 'ready',
                provider: 'local',
                result: {
                    message: `${task.label || task.payload?.label || task.kind} ready`,
                    previewUrl: `/presentations/${task.presentationId}`
                }
            }).catch(() => {});
        }, readyDelay);
    }

    async function enqueueMediaTasks({ draftBrief, presentationId, threadId, locale }) {
        if (!mediaTaskStore) {
            return [];
        }

        const blueprints = buildMediaTaskBlueprints(draftBrief, presentationId, threadId, locale);
        const tasks = [];

        for (const blueprint of blueprints) {
            const queued = await resolvedExecution.enqueueMediaTask(blueprint);
            const savedTask = mediaTaskStore.save({
                id: queued.id,
                kind: blueprint.kind,
                label: blueprint.label,
                status: queued.status || 'queued',
                threadId,
                presentationId,
                provider: queued.provider || resolvedExecution.provider || 'local',
                providerTaskId: queued.providerTaskId || '',
                payload: blueprint.payload,
                result: {},
                error: ''
            });
            tasks.push(savedTask);
            resolvedObservability.startSpan('copilot.media_task.enqueue', {
                threadId,
                presentationId,
                taskId: savedTask.id,
                input: {
                    kind: savedTask.kind,
                    provider: savedTask.provider
                }
            }).end({
                output: {
                    providerTaskId: savedTask.providerTaskId || '',
                    status: savedTask.status
                }
            });
            scheduleLocalMediaTaskLifecycle(savedTask);
        }

        return tasks;
    }

    async function plan({
        messages,
        locale,
        uiLocale,
        outputIntent,
        visualPreference,
        allowClarification = true,
        threadId,
        reasoningMode,
        webSearchEnabled,
        selectedModelId
    }) {
        const normalizedMessages = normalizeMessages(messages);
        const deckLocale = normalizeLocale(locale);
        const messageLocale = normalizeLocale(uiLocale || deckLocale);
        const existingThread = resolvedThreadStore.isValidId(threadId)
            ? resolvedThreadStore.getById(threadId)
            : null;
        const resolvedThreadId = existingThread?.id
            || (resolvedThreadStore.isValidId(threadId) ? threadId : resolvedThreadStore.createThreadId());
        const resolvedReasoningMode = normalizeReasoningMode(reasoningMode ?? existingThread?.reasoningMode);
        const resolvedWebSearchEnabled = typeof webSearchEnabled === 'boolean'
            ? webSearchEnabled
            : Boolean(existingThread?.webSearchEnabled);
        const resolvedSelectedModelId = asString(
            selectedModelId || existingThread?.selectedModelId,
            ''
        ).trim();
        const planTrace = resolvedObservability.startSpan('copilot.plan', {
            threadId: resolvedThreadId,
            input: {
                messageCount: normalizedMessages.length,
                locale: deckLocale,
                outputIntent,
                visualPreference,
                reasoningMode: resolvedReasoningMode,
                webSearchEnabled: resolvedWebSearchEnabled,
                selectedModelId: resolvedSelectedModelId
            }
        });

        try {
            const latestPrompt = lastUserMessage(normalizedMessages);
            const clarificationResolution = resolveClarificationFollowUp(
                latestPrompt,
                existingThread,
                deckLocale,
                messageLocale
            );
            const planState = clarificationResolution || await planGraph.invoke({
                threadId: resolvedThreadId,
                messages: normalizedMessages,
                locale: deckLocale,
                uiLocale: messageLocale,
                outputIntent,
                visualPreference,
                allowClarification,
                existingThread,
                reasoningMode: resolvedReasoningMode,
                webSearchEnabled: resolvedWebSearchEnabled,
                selectedModelId: resolvedSelectedModelId
            }, {
                configurable: {
                    thread_id: resolvedThreadId
                }
            });

            const editIntent = detectEditIntent(latestPrompt, existingThread, deckLocale);
            const mergedDraftBrief = mergeBriefForEdit(
                existingThread?.draftBrief || null,
                planState.draftBrief,
                editIntent,
                deckLocale
            );
            const assistantMessage = editIntent && planState.readyToBuild === true
                ? buildEditAssistantAck(editIntent, messageLocale)
                : planState.assistantMessage;
            const agentSteps = buildPlanAgentSteps({
                draftBrief: mergedDraftBrief,
                locale: messageLocale,
                shouldClarify: planState.readyToBuild !== true,
                clarification: planState.clarification || '',
                editIntent
            });
            const contextSummary = buildContextSummary({
                existingThread,
                messages: appendAssistantMessage(normalizedMessages, assistantMessage),
                latestPrompt,
                fallbackBrief: existingThread?.draftBrief || planState.draftBrief || mergedDraftBrief,
                draftBrief: mergedDraftBrief,
                clarification: planState.clarification || '',
                editIntent,
                reasoningMode: resolvedReasoningMode,
                webSearchEnabled: resolvedWebSearchEnabled,
                selectedModelId: resolvedSelectedModelId,
                outputIntent,
                visualPreference
            });

            const savedThread = resolvedThreadStore.save({
                id: resolvedThreadId,
                locale: deckLocale,
                uiLocale: messageLocale,
                status: planState.readyToBuild ? 'planned' : 'clarifying',
                messages: appendAssistantMessage(normalizedMessages, assistantMessage),
                clarificationCount: planState.readyToBuild
                    ? Number(existingThread?.clarificationCount) || 0
                    : (Number(existingThread?.clarificationCount) || 0) + 1,
                draftBrief: mergedDraftBrief,
                lastAssistantMessage: assistantMessage,
                clarification: planState.clarification,
                presentationId: existingThread?.presentationId || '',
                activePresentationId: existingThread?.activePresentationId || existingThread?.presentationId || '',
                lastBuildArtifacts: existingThread?.lastBuildArtifacts || [],
                editIntent,
                pendingAction: planState.readyToBuild ? 'build' : 'clarification',
                agentSteps,
                reasoningMode: resolvedReasoningMode,
                webSearchEnabled: resolvedWebSearchEnabled,
                selectedModelId: resolvedSelectedModelId,
                uiRunState: existingThread?.uiRunState || null,
                contextSummary,
                meta: buildThreadMeta(mergedDraftBrief, {
                    plannedAt: new Date().toISOString(),
                    lastEditIntent: editIntent?.kind || '',
                    contextSummary
                })
            });

            agentSteps.forEach((step) => {
                planTrace.record(step.eventType || 'plan_step', {
                    output: {
                        status: step.status,
                        message: step.message
                    },
                    metadata: {
                        stepLabel: step.stepLabel,
                        artifact: step.artifact || null
                    }
                });
            });
            planTrace.record('plan.finalized', {
                output: {
                    readyToBuild: planState.readyToBuild === true,
                    pendingAction: savedThread.pendingAction,
                    editIntent: editIntent?.kind || ''
                },
                metadata: {
                    agentSteps: agentSteps.map((item) => item.eventType)
                }
            });
            planTrace.end({
                output: {
                    draftBrief: buildBriefArtifact(mergedDraftBrief),
                    pendingAction: savedThread.pendingAction
                }
            });

            return {
                threadId: savedThread.id,
                assistantMessage,
                draftBrief: mergedDraftBrief,
                readyToBuild: planState.readyToBuild === true,
                clarification: planState.clarification || '',
                shouldAutoBuild: planState.readyToBuild === true,
                agentSteps,
                pendingAction: savedThread.pendingAction,
                activePresentationId: savedThread.activePresentationId || ''
            };
        } catch (error) {
            planTrace.fail(error, {
                metadata: {
                    threadId: resolvedThreadId
                }
            });
            throw error;
        }
    }

    async function planStream({
        messages,
        locale,
        uiLocale,
        outputIntent,
        visualPreference,
        allowClarification = true,
        threadId,
        reasoningMode,
        webSearchEnabled,
        selectedModelId,
        onProgress
    }) {
        const deckLocale = normalizeLocale(locale);
        const messageLocale = normalizeLocale(uiLocale || deckLocale);
        const writer = (payload) => {
            onProgress?.(payload);
        };

        const result = await plan({
            messages,
            locale: deckLocale,
            uiLocale: messageLocale,
            outputIntent,
            visualPreference,
            allowClarification,
            threadId,
            reasoningMode,
            webSearchEnabled,
            selectedModelId
        });

        const streamedSteps = Array.isArray(result.agentSteps) ? result.agentSteps : [];
        if (!streamedSteps.length) {
            writer({
                threadId: result.threadId,
                kind: 'step',
                eventType: 'context_compacted',
                stepLabel: messageLocale === 'zh-CN' ? '上下文已整理' : 'Context compacted',
                message: messageLocale === 'zh-CN'
                    ? '系统已整理当前线程上下文，准备继续响应。'
                    : 'The system compacted the current thread context and is ready to continue.',
                status: 'info'
            });
            await wait(60);
        } else {
            for (const [index, step] of streamedSteps.entries()) {
                await wait(index === 0 ? 120 : 160);
                writer({
                    threadId: result.threadId,
                    kind: 'step',
                    ...step
                });
            }

            await wait(120);
        }

        writer({
            threadId: result.threadId,
            kind: 'result',
            assistantMessage: result.assistantMessage,
            message: result.assistantMessage,
            draftBrief: result.draftBrief,
            readyToBuild: result.readyToBuild,
            clarification: result.clarification,
            shouldAutoBuild: result.shouldAutoBuild,
            agentSteps: result.agentSteps,
            pendingAction: result.pendingAction,
            activePresentationId: result.activePresentationId || '',
            status: result.readyToBuild ? 'ready' : 'clarifying'
        });

        return result;
    }

    async function buildStream({
        draftBrief,
        locale,
        ownerId,
        presentationId,
        onProgress,
        threadId,
        reasoningMode,
        webSearchEnabled,
        selectedModelId
    }) {
        const existingThread = resolvedThreadStore.isValidId(threadId)
            ? resolvedThreadStore.getById(threadId)
            : null;
        const resolvedThreadId = existingThread?.id
            || (resolvedThreadStore.isValidId(threadId) ? threadId : resolvedThreadStore.createThreadId());
        const resolvedPresentationId = asString(presentationId, '')
            || asString(existingThread?.presentationId, '')
            || generatePresentationId();
        const buildLocale = normalizeLocale(locale || draftBrief?.locale || existingThread?.locale);
        const buildUiLocale = normalizeLocale(existingThread?.uiLocale || buildLocale);
        const resolvedReasoningMode = normalizeReasoningMode(reasoningMode ?? existingThread?.reasoningMode);
        const resolvedWebSearchEnabled = typeof webSearchEnabled === 'boolean'
            ? webSearchEnabled
            : Boolean(existingThread?.webSearchEnabled);
        const resolvedSelectedModelId = asString(
            selectedModelId || existingThread?.selectedModelId,
            ''
        ).trim();
        const buildTrace = resolvedObservability.startSpan('copilot.build', {
            threadId: resolvedThreadId,
            presentationId: resolvedPresentationId,
            input: {
                draftBrief: buildBriefArtifact(draftBrief),
                reasoningMode: resolvedReasoningMode,
                webSearchEnabled: resolvedWebSearchEnabled,
                selectedModelId: resolvedSelectedModelId
            }
        });
        const threadContextSummary = buildContextSummary({
            existingThread,
            messages: existingThread?.messages || [],
            latestPrompt: lastUserMessage(existingThread?.messages || []),
            fallbackBrief: draftBrief,
            draftBrief,
            clarification: '',
            editIntent: existingThread?.editIntent || null,
            reasoningMode: resolvedReasoningMode,
            webSearchEnabled: resolvedWebSearchEnabled,
            selectedModelId: resolvedSelectedModelId,
            outputIntent: draftBrief?.outputIntent,
            visualPreference: draftBrief?.visualFamily
        });
        const progressWriter = (payload) => {
            const event = mapBuildEventPayload(payload, buildUiLocale);
            buildTrace.record(event.eventType || 'build_event', {
                output: {
                    progress: event.progress,
                    step: event.step,
                    status: event.status
                },
                metadata: {
                    stepLabel: event.stepLabel,
                    message: event.message
                }
            });
            onProgress?.({
                threadId: resolvedThreadId,
                ...event
            });
        };
        const buildGraph = createCopilotBuildGraph({
            normalizeBriefNode(state) {
                return {
                    normalizedBrief: sanitizeDraftBrief(state.draftBrief, buildHeuristicBrief({
                        messages: [{ role: 'user', content: asString(state.draftBrief?.topic, '') }],
                        locale: state.locale,
                        outputIntent: state.draftBrief?.outputIntent,
                        visualPreference: state.draftBrief?.visualFamily
                    }), {
                        lockedLocale: state.locale || state.draftBrief?.locale
                    })
                };
            },
            async generateOutlineNode(state) {
                progressWriter(buildSsePayload(
                    state.presentationId,
                    4,
                    1,
                    state.locale === 'zh-CN'
                        ? 'AI 正在整理需求并补全生成参数...'
                        : 'The agent is structuring your request and filling missing build parameters...',
                    {
                        eventType: 'outline_generating',
                        stepLabel: buildStepLabel('outline_generating', buildUiLocale)
                    }
                ));

                const outline = await outlineService.generateStableOutline({
                    topic: state.normalizedBrief.topic,
                    purpose: state.normalizedBrief.purpose,
                    length: state.normalizedBrief.length,
                    content: buildTopicContext(state.normalizedBrief)
                });

                progressWriter(buildSsePayload(
                    state.presentationId,
                    18,
                    1,
                    state.locale === 'zh-CN'
                        ? `已生成 ${outline.slides.length} 页的基础提纲，正在补全节奏与展示风格...`
                        : `A base outline with ${outline.slides.length} scenes is ready. Refining pacing and presentation style...`,
                    {
                        eventType: 'outline_generating',
                        stepLabel: buildStepLabel('outline_generating', buildUiLocale),
                        artifact: {
                            type: 'outline',
                            label: 'outline',
                            presentationId: state.presentationId
                        }
                    }
                ));

                return {
                    outline
                };
            },
            enrichOutlineNode(state) {
                progressWriter(buildSsePayload(
                    state.presentationId,
                    32,
                    2,
                    state.locale === 'zh-CN'
                        ? '已锁定结构和节奏，正在准备渲染演示内容...'
                        : 'Structure and pacing locked. Preparing to render the presentation...',
                    {
                        eventType: 'slides_rendering',
                        stepLabel: buildStepLabel('slides_rendering', buildUiLocale)
                    }
                ));
                return {
                    enrichedOutline: enrichOutlineForCopilot(state.outline, state.normalizedBrief)
                };
            },
            async buildPresentationNode(state) {
                return {
                    buildResult: await presentationService.buildPresentation({
                        outline: state.enrichedOutline,
                        ownerId: state.ownerId,
                        presentationId: state.presentationId,
                        style: state.normalizedBrief.styleId,
                        onProgress: progressWriter,
                        metaOverrides: {
                            purpose: state.normalizedBrief.purpose,
                            length: state.normalizedBrief.length
                        },
                        legacyData: {
                            copilot: {
                                draftBrief: state.normalizedBrief,
                                visualFamily: state.normalizedBrief.visualFamily,
                                outputIntent: state.normalizedBrief.outputIntent,
                                plannedAt: new Date().toISOString()
                            }
                        }
                    })
                };
            }
        });

        resolvedThreadStore.save({
            id: resolvedThreadId,
            locale: buildLocale,
            uiLocale: buildUiLocale,
            status: 'building',
            messages: existingThread?.messages || [],
            clarificationCount: existingThread?.clarificationCount || 0,
            draftBrief,
            lastAssistantMessage: existingThread?.lastAssistantMessage || '',
            clarification: '',
            presentationId: resolvedPresentationId,
            activePresentationId: resolvedPresentationId,
            lastBuildArtifacts: existingThread?.lastBuildArtifacts || [],
            editIntent: existingThread?.editIntent || null,
            pendingAction: 'building',
            agentSteps: existingThread?.agentSteps || [],
            reasoningMode: resolvedReasoningMode,
            webSearchEnabled: resolvedWebSearchEnabled,
            selectedModelId: resolvedSelectedModelId,
            uiRunState: existingThread?.uiRunState || null,
            contextSummary: threadContextSummary,
            meta: buildThreadMeta(draftBrief, {
                buildStartedAt: new Date().toISOString(),
                contextSummary: threadContextSummary
            })
        });

        try {
            const buildState = await buildGraph.invoke({
                threadId: resolvedThreadId,
                presentationId: resolvedPresentationId,
                ownerId,
                locale: buildLocale,
                draftBrief
            }, {
                configurable: {
                    thread_id: `${resolvedThreadId}:${resolvedPresentationId}`
                }
            });

            const normalizedBrief = buildState.normalizedBrief || draftBrief;
            const result = buildState.buildResult || {};
            const lastBuildArtifacts = buildPresentationArtifacts(resolvedPresentationId);
            const mediaTasks = await enqueueMediaTasks({
                draftBrief: normalizedBrief,
                presentationId: resolvedPresentationId,
                threadId: resolvedThreadId,
                locale: buildUiLocale
            });
            const completedContextSummary = buildContextSummary({
                existingThread: {
                    ...existingThread,
                    activePresentationId: resolvedPresentationId,
                    presentationId: resolvedPresentationId,
                    pendingAction: 'continue'
                },
                messages: existingThread?.messages || [],
                latestPrompt: lastUserMessage(existingThread?.messages || []),
                fallbackBrief: normalizedBrief,
                draftBrief: normalizedBrief,
                clarification: '',
                editIntent: null,
                reasoningMode: resolvedReasoningMode,
                webSearchEnabled: resolvedWebSearchEnabled,
                selectedModelId: resolvedSelectedModelId,
                outputIntent: normalizedBrief?.outputIntent,
                visualPreference: normalizedBrief?.visualFamily
            });

            resolvedThreadStore.save({
                id: resolvedThreadId,
                locale: buildLocale,
                uiLocale: buildUiLocale,
                status: 'ready',
                messages: existingThread?.messages || [],
                clarificationCount: existingThread?.clarificationCount || 0,
                draftBrief: normalizedBrief,
                lastAssistantMessage: existingThread?.lastAssistantMessage || '',
                clarification: '',
                presentationId: resolvedPresentationId,
                activePresentationId: resolvedPresentationId,
                lastBuildArtifacts: [
                    ...lastBuildArtifacts,
                    ...mediaTasks.map((task) => buildMediaTaskArtifact(task))
                ],
                editIntent: null,
                pendingAction: 'continue',
                reasoningMode: resolvedReasoningMode,
                webSearchEnabled: resolvedWebSearchEnabled,
                selectedModelId: resolvedSelectedModelId,
                uiRunState: existingThread?.uiRunState || null,
                contextSummary: completedContextSummary,
                agentSteps: normalizeAgentSteps([
                    ...(existingThread?.agentSteps || []),
                    buildStepEvent({
                        eventType: 'presentation_ready',
                        locale: buildUiLocale,
                        message: buildUiLocale === 'zh-CN'
                            ? '演示已生成完成，可以继续对话或直接预览。'
                            : 'The presentation is ready. You can keep chatting or open the preview.',
                        status: 'success',
                        artifact: {
                            type: 'presentation',
                            label: 'preview',
                            url: `/presentations/${resolvedPresentationId}`,
                            presentationId: resolvedPresentationId
                        }
                    })
                ]),
                meta: buildThreadMeta(normalizedBrief, {
                    buildCompletedAt: new Date().toISOString(),
                    contextSummary: completedContextSummary
                })
            });

            mediaTasks.forEach((task) => {
                progressWriter(buildSsePayload(
                    resolvedPresentationId,
                    100,
                    4,
                    buildUiLocale === 'zh-CN'
                        ? `${task.label} 已加入任务队列。`
                        : `${task.label} has been queued.`,
                    {
                        status: 'ready',
                        eventType: 'media_task_queued',
                        stepLabel: buildStepLabel('media_task_queued', buildUiLocale),
                        artifact: buildMediaTaskArtifact(task)
                    }
                ));
            });

            buildTrace.end({
                output: {
                    presentationId: resolvedPresentationId,
                    artifacts: [
                        ...lastBuildArtifacts,
                        ...mediaTasks.map((task) => buildMediaTaskArtifact(task))
                    ]
                }
            });

            return {
                threadId: resolvedThreadId,
                presentationId: resolvedPresentationId,
                ...result
            };
        } catch (error) {
            const failedContextSummary = buildContextSummary({
                existingThread: {
                    ...existingThread,
                    activePresentationId: resolvedPresentationId,
                    presentationId: resolvedPresentationId,
                    pendingAction: 'retry'
                },
                messages: existingThread?.messages || [],
                latestPrompt: lastUserMessage(existingThread?.messages || []),
                fallbackBrief: draftBrief,
                draftBrief,
                clarification: '',
                editIntent: existingThread?.editIntent || null,
                reasoningMode: resolvedReasoningMode,
                webSearchEnabled: resolvedWebSearchEnabled,
                selectedModelId: resolvedSelectedModelId,
                outputIntent: draftBrief?.outputIntent,
                visualPreference: draftBrief?.visualFamily
            });
            resolvedThreadStore.save({
                id: resolvedThreadId,
                locale: buildLocale,
                uiLocale: buildUiLocale,
                status: 'failed',
                messages: existingThread?.messages || [],
                clarificationCount: existingThread?.clarificationCount || 0,
                draftBrief,
                lastAssistantMessage: existingThread?.lastAssistantMessage || '',
                clarification: '',
                presentationId: resolvedPresentationId,
                activePresentationId: resolvedPresentationId,
                lastBuildArtifacts: existingThread?.lastBuildArtifacts || [],
                editIntent: existingThread?.editIntent || null,
                pendingAction: 'retry',
                reasoningMode: resolvedReasoningMode,
                webSearchEnabled: resolvedWebSearchEnabled,
                selectedModelId: resolvedSelectedModelId,
                uiRunState: existingThread?.uiRunState || null,
                contextSummary: failedContextSummary,
                agentSteps: normalizeAgentSteps([
                    ...(existingThread?.agentSteps || []),
                    buildStepEvent({
                        eventType: 'build_failed',
                        locale: buildUiLocale,
                        message: error.message,
                        status: 'error'
                    })
                ]),
                meta: buildThreadMeta(draftBrief, {
                    buildFailedAt: new Date().toISOString(),
                    lastError: error.message,
                    contextSummary: failedContextSummary
                })
            });
            buildTrace.fail(error, {
                metadata: {
                    threadId: resolvedThreadId,
                    presentationId: resolvedPresentationId
                }
            });
            throw error;
        }
    }

    async function aguiStream({
        messages,
        locale,
        uiLocale,
        outputIntent,
        visualPreference,
        allowClarification = true,
        threadId,
        reasoningMode,
        webSearchEnabled,
        selectedModelId,
        onEvent
    }) {
        const normalizedMessages = normalizeMessages(messages);
        const deckLocale = normalizeLocale(locale);
        const messageLocale = normalizeLocale(uiLocale || deckLocale);
        const existingThread = resolvedThreadStore.isValidId(threadId)
            ? resolvedThreadStore.getById(threadId)
            : null;
        const resolvedThreadId = existingThread?.id
            || (resolvedThreadStore.isValidId(threadId) ? threadId : resolvedThreadStore.createThreadId());
        const resolvedReasoningMode = normalizeReasoningMode(reasoningMode ?? existingThread?.reasoningMode);
        const resolvedWebSearchEnabled = typeof webSearchEnabled === 'boolean'
            ? webSearchEnabled
            : Boolean(existingThread?.webSearchEnabled);
        const resolvedSelectedModelId = asString(
            selectedModelId || existingThread?.selectedModelId,
            ''
        ).trim();
        const runId = createRunId();
        const writer = (payload) => {
            onEvent?.(payload);
        };
        const aguiTrace = resolvedObservability.startSpan('copilot.agui', {
            threadId: resolvedThreadId,
            presentationId: existingThread?.activePresentationId || existingThread?.presentationId || '',
            input: {
                messageCount: normalizedMessages.length,
                locale: deckLocale,
                uiLocale: messageLocale,
                outputIntent,
                visualPreference,
                reasoningMode: resolvedReasoningMode,
                webSearchEnabled: resolvedWebSearchEnabled,
                selectedModelId: resolvedSelectedModelId
            }
        });

        const persistUiRunState = (lastEventType) => {
            const latestThread = resolvedThreadStore.getById(resolvedThreadId) || existingThread || {};
            resolvedThreadStore.save({
                ...latestThread,
                id: resolvedThreadId,
                locale: latestThread.locale || deckLocale,
                uiLocale: latestThread.uiLocale || messageLocale,
                reasoningMode: resolvedReasoningMode,
                webSearchEnabled: resolvedWebSearchEnabled,
                selectedModelId: resolvedSelectedModelId,
                uiRunState: {
                    runId,
                    lastEventType,
                    lastSnapshotAt: new Date().toISOString()
                }
            });
        };

        try {
            persistUiRunState('RUN_STARTED');
            writer(createAguiEvent({
                type: 'RUN_STARTED',
                threadId: resolvedThreadId,
                runId,
                presentationId: existingThread?.activePresentationId || existingThread?.presentationId || '',
                payload: {
                    mode: resolvedReasoningMode,
                    webSearchEnabled: resolvedWebSearchEnabled,
                    selectedModelId: resolvedSelectedModelId
                }
            }));

            if (existingThread) {
                writer(createAguiEvent({
                    type: 'STATE_SNAPSHOT',
                    threadId: resolvedThreadId,
                    runId,
                    presentationId: existingThread.activePresentationId || existingThread.presentationId || '',
                    payload: buildAguiThreadSnapshot(existingThread)
                }));
                aguiTrace.record('agui.snapshot', {
                    metadata: {
                        runId,
                        status: existingThread.status || ''
                    }
                });
            }

            const planResult = await plan({
                messages: normalizedMessages,
                locale: deckLocale,
                uiLocale: messageLocale,
                outputIntent,
                visualPreference,
                allowClarification,
                threadId: resolvedThreadId,
                reasoningMode: resolvedReasoningMode,
                webSearchEnabled: resolvedWebSearchEnabled,
                selectedModelId: resolvedSelectedModelId
            });

            writer(createAguiEvent({
                type: 'STATE_DELTA',
                threadId: planResult.threadId,
                runId,
                presentationId: planResult.activePresentationId || '',
                payload: {
                    status: planResult.readyToBuild ? 'planned' : 'clarifying',
                    pendingAction: planResult.pendingAction,
                    draftBrief: planResult.draftBrief,
                    clarification: planResult.clarification || '',
                    activePresentationId: planResult.activePresentationId || '',
                    reasoningMode: resolvedReasoningMode,
                    webSearchEnabled: resolvedWebSearchEnabled,
                    selectedModelId: resolvedSelectedModelId
                }
            }));
            persistUiRunState('STATE_DELTA');

            const planSteps = Array.isArray(planResult.agentSteps) ? planResult.agentSteps : [];
            for (const step of planSteps) {
                await emitAguiStep(writer, {
                    threadId: planResult.threadId,
                    runId,
                    presentationId: planResult.activePresentationId || '',
                    step
                });
                aguiTrace.record('agui.plan_step', {
                    metadata: {
                        runId,
                        eventType: step.eventType || '',
                        stepType: mapAguiStepPhase(step.eventType)
                    }
                });
            }

            await streamAguiAssistantMessage(writer, {
                threadId: planResult.threadId,
                runId,
                presentationId: planResult.activePresentationId || '',
                message: planResult.assistantMessage
            });
            aguiTrace.record('agui.assistant_message', {
                output: {
                    length: asString(planResult.assistantMessage, '').length
                },
                metadata: {
                    runId
                }
            });

            if (planResult.readyToBuild !== true) {
                persistUiRunState('RUN_FINISHED');
                writer(createAguiEvent({
                    type: 'RUN_FINISHED',
                    threadId: planResult.threadId,
                    runId,
                    presentationId: planResult.activePresentationId || '',
                    payload: {
                        status: 'clarifying',
                        draftBrief: planResult.draftBrief,
                        clarification: planResult.clarification || '',
                        pendingAction: planResult.pendingAction
                    }
                }));
                aguiTrace.end({
                    output: {
                        status: 'clarifying',
                        pendingAction: planResult.pendingAction
                    },
                    metadata: {
                        runId
                    }
                });
                return planResult;
            }

            let buildEventQueue = Promise.resolve();
            const chainBuildEvent = (event) => {
                buildEventQueue = buildEventQueue.then(async () => {
                    const buildEvent = event?.eventType
                        ? event
                        : mapBuildEventPayload(event, messageLocale);
                    const currentPresentationId = buildEvent.presentationId
                        || planResult.activePresentationId
                        || existingThread?.activePresentationId
                        || '';
                    await emitAguiStep(writer, {
                        threadId: planResult.threadId,
                        runId,
                        presentationId: currentPresentationId,
                        step: {
                            id: createEventId('step'),
                            eventType: buildEvent.eventType,
                            stepLabel: buildEvent.stepLabel,
                            message: buildEvent.message,
                            status: buildEvent.status,
                            artifact: buildEvent.artifact || null
                        }
                    });
                    aguiTrace.record('agui.build_step', {
                        output: {
                            progress: buildEvent.progress,
                            status: buildEvent.status
                        },
                        metadata: {
                            runId,
                            eventType: buildEvent.eventType,
                            stepType: mapAguiStepPhase(buildEvent.eventType)
                        }
                    });
                });
                return buildEventQueue;
            };

            const buildResult = await buildStream({
                draftBrief: planResult.draftBrief,
                locale: deckLocale,
                presentationId: planResult.activePresentationId || existingThread?.activePresentationId || '',
                threadId: planResult.threadId,
                reasoningMode: resolvedReasoningMode,
                webSearchEnabled: resolvedWebSearchEnabled,
                selectedModelId: resolvedSelectedModelId,
                onProgress(event) {
                    void chainBuildEvent(event);
                }
            });

            await buildEventQueue;

            const finalThread = getThread(planResult.threadId) || {};
            const finalPresentationId = buildResult.presentationId
                || finalThread.activePresentationId
                || finalThread.presentationId
                || '';

            writer(createAguiEvent({
                type: 'STATE_DELTA',
                threadId: planResult.threadId,
                runId,
                presentationId: finalPresentationId,
                payload: {
                    status: 'ready',
                    pendingAction: finalThread.pendingAction || 'continue',
                    draftBrief: finalThread.draftBrief || planResult.draftBrief,
                    clarification: '',
                    activePresentationId: finalPresentationId,
                    lastBuildArtifacts: normalizeArtifacts(finalThread.lastBuildArtifacts),
                    mediaTaskSummary: Array.isArray(finalThread.mediaTaskSummary) ? finalThread.mediaTaskSummary : []
                }
            }));
            persistUiRunState('RUN_FINISHED');

            writer(createAguiEvent({
                type: 'RUN_FINISHED',
                threadId: planResult.threadId,
                runId,
                presentationId: finalPresentationId,
                payload: {
                    status: 'ready',
                    pendingAction: finalThread.pendingAction || 'continue',
                    draftBrief: finalThread.draftBrief || planResult.draftBrief,
                    presentationId: finalPresentationId,
                    previewUrl: finalPresentationId ? `/presentations/${finalPresentationId}` : '',
                    pptxUrl: finalPresentationId ? `/api/presentations/${finalPresentationId}/export.pptx` : '',
                    artifact: finalPresentationId
                        ? {
                            type: 'presentation',
                            label: 'preview',
                            url: `/presentations/${finalPresentationId}`,
                            presentationId: finalPresentationId
                        }
                        : null
                }
            }));
            aguiTrace.end({
                output: {
                    status: 'ready',
                    presentationId: finalPresentationId
                },
                metadata: {
                    runId
                }
            });
            return {
                ...planResult,
                presentationId: finalPresentationId
            };
        } catch (error) {
            persistUiRunState('RUN_ERROR');
            writer(createAguiEvent({
                type: 'RUN_ERROR',
                threadId: resolvedThreadId,
                runId,
                presentationId: existingThread?.activePresentationId || existingThread?.presentationId || '',
                payload: {
                    message: error.message || String(error),
                    status: 'failed'
                }
            }));
            aguiTrace.fail(error, {
                metadata: {
                    runId
                }
            });
            throw error;
        }
    }

    function getThread(threadId) {
        const thread = resolvedThreadStore.isValidId(threadId)
            ? resolvedThreadStore.getById(threadId)
            : null;

        if (!thread) {
            return null;
        }

        return {
            ...thread,
            agentSteps: normalizeAgentSteps(thread.agentSteps),
            lastBuildArtifacts: normalizeArtifacts(thread.lastBuildArtifacts),
            contextSummary: asString(thread.contextSummary || thread.meta?.contextSummary, ''),
            execution: resolvedExecution.describe(),
            mediaTaskSummary: thread.activePresentationId && mediaTaskStore?.listByPresentationId
                ? mediaTaskStore.listByPresentationId(thread.activePresentationId)
                : []
        };
    }

    return {
        buildStream,
        generatePresentationId,
        generateThreadId: () => resolvedThreadStore.createThreadId(),
        handleMediaTaskCallback: handleMediaTaskUpdate,
        getThread,
        aguiStream,
        planStream,
        plan
    };
}

module.exports = {
    createCopilotService
};
