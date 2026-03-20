const DEFAULT_THEME_ID = 'bold-signal';
const SUPPORTED_MOTION_PRESETS = new Set([
    'fade',
    'fade-up',
    'slide-left',
    'slide-right',
    'zoom-in',
    'stagger-up'
]);
const SUPPORTED_SCENE_TRANSITIONS = new Set([
    'crossfade',
    'lift-fade',
    'push-left',
    'push-right',
    'zoom-fade'
]);
const SUPPORTED_SCENE_TRANSITION_OVERLAYS = new Set([
    'none',
    'accent',
    'dark',
    'light'
]);

const RUNTIME_I18N = {
    'zh-CN': {
        runtimeKicker: 'Scene Runtime',
        runtimeLoadingTitle: '正在加载结构化演示',
        runtimeLoadingMessage: '正在读取场景数据并准备预览运行时...',
        runtimeErrorKicker: 'Runtime Error',
        runtimeErrorTitle: '无法加载场景预览',
        missingPresentationId: '缺少 presentation id。',
        runtimeInitFailed: '运行时初始化失败。',
        readSpecFailed: '读取结构化演示失败。',
        noScenes: '当前演示稿没有可渲染的场景。',
        navToSlide: '跳转到第 {index} 页',
        navToMarker: '跳转到 {label}',
        marker: '标记',
        markerAnchorStart: '起点',
        markerAnchorAdvance: '推进',
        markerAnchorExit: '退场',
        markerKindNavigation: '导航',
        markerKindNarration: '旁白',
        markerKindEdit: '编辑',
        editCuesTitle: '编辑提示',
        scene: '场景',
        openingScene: '开场场景',
        closingScene: '结束场景',
        emptyScene: '当前场景没有可显示的文本内容。',
        assetMissing: '素材记录不存在或尚未注册。',
        assetUrlMissing: '素材地址为空，无法预览。',
        assetLoadFailed: '素材加载失败，请检查链接或资源路径。',
        autoplayOn: '自动播放：开',
        autoplayOff: '自动播放：关',
        audioOn: '音频：开',
        audioOff: '音频：关',
        subtitlesVoiceover: '字幕：旁白',
        subtitlesStatic: '字幕：静态',
        subtitlesOff: '字幕：关闭',
        noAudio: '无音频',
        audioReady: '音频待命：{label}',
        audioQueue: '音频排队：{label}',
        audioPlaying: '音频：{label}',
        audioReadyFallback: '音频待命'
    },
    en: {
        runtimeKicker: 'Scene Runtime',
        runtimeLoadingTitle: 'Loading Structured Presentation',
        runtimeLoadingMessage: 'Reading scene data and preparing the preview runtime...',
        runtimeErrorKicker: 'Runtime Error',
        runtimeErrorTitle: 'Unable to Load Scene Preview',
        missingPresentationId: 'Missing presentation id.',
        runtimeInitFailed: 'Runtime initialization failed.',
        readSpecFailed: 'Failed to read the structured presentation.',
        noScenes: 'This presentation has no renderable scenes.',
        navToSlide: 'Go to slide {index}',
        navToMarker: 'Go to {label}',
        marker: 'Marker',
        markerAnchorStart: 'Start',
        markerAnchorAdvance: 'Advance',
        markerAnchorExit: 'Exit',
        markerKindNavigation: 'Nav',
        markerKindNarration: 'Narration',
        markerKindEdit: 'Edit',
        editCuesTitle: 'Edit Cues',
        scene: 'Scene',
        openingScene: 'Opening Scene',
        closingScene: 'Closing Scene',
        emptyScene: 'This scene has no text content to display.',
        assetMissing: 'Asset record is missing or not registered yet.',
        assetUrlMissing: 'Asset URL is empty, so preview is unavailable.',
        assetLoadFailed: 'Media failed to load. Check the URL or asset path.',
        autoplayOn: 'Auto-play On',
        autoplayOff: 'Auto-play Off',
        audioOn: 'Audio On',
        audioOff: 'Audio Off',
        subtitlesVoiceover: 'Subtitles: Voiceover',
        subtitlesStatic: 'Subtitles: Static',
        subtitlesOff: 'Subtitles: Off',
        noAudio: 'No Audio',
        audioReady: 'Audio Ready: {label}',
        audioQueue: 'Audio Queue: {label}',
        audioPlaying: 'Audio: {label}',
        audioReadyFallback: 'Audio Ready'
    }
};

const THEME_TOKENS = {
    'bold-signal': {
        name: 'Bold Signal',
        background: '#0b1120',
        surface: 'rgba(17, 24, 39, 0.82)',
        surfaceAlt: 'rgba(23, 32, 51, 0.88)',
        border: 'rgba(148, 163, 184, 0.22)',
        text: '#f8fafc',
        muted: '#cbd5e1',
        textMuted: '#94a3b8',
        accent: '#f97316',
        accentSoft: 'rgba(249, 115, 22, 0.18)',
        accentStrong: '#fb923c',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'electric-studio': {
        name: 'Electric Studio',
        background: '#0f172a',
        surface: 'rgba(17, 28, 51, 0.82)',
        surfaceAlt: 'rgba(24, 35, 61, 0.88)',
        border: 'rgba(96, 165, 250, 0.22)',
        text: '#eff6ff',
        muted: '#bfdbfe',
        textMuted: '#93c5fd',
        accent: '#3b82f6',
        accentSoft: 'rgba(59, 130, 246, 0.18)',
        accentStrong: '#60a5fa',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'creative-voltage': {
        name: 'Creative Voltage',
        background: '#061826',
        surface: 'rgba(13, 39, 64, 0.82)',
        surfaceAlt: 'rgba(18, 52, 85, 0.88)',
        border: 'rgba(34, 211, 238, 0.2)',
        text: '#f0fdff',
        muted: '#bae6fd',
        textMuted: '#7dd3fc',
        accent: '#22d3ee',
        accentSoft: 'rgba(34, 211, 238, 0.18)',
        accentStrong: '#67e8f9',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'dark-botanical': {
        name: 'Dark Botanical',
        background: '#111315',
        surface: 'rgba(27, 32, 29, 0.84)',
        surfaceAlt: 'rgba(34, 41, 37, 0.9)',
        border: 'rgba(187, 247, 208, 0.18)',
        text: '#f7fee7',
        muted: '#d9f99d',
        textMuted: '#bef264',
        accent: '#84cc16',
        accentSoft: 'rgba(132, 204, 22, 0.16)',
        accentStrong: '#a3e635',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'notebook-tabs': {
        name: 'Notebook Tabs',
        background: '#f7f4ec',
        surface: 'rgba(255, 253, 250, 0.92)',
        surfaceAlt: 'rgba(239, 232, 218, 0.92)',
        border: 'rgba(161, 98, 7, 0.16)',
        text: '#1f2937',
        muted: '#6b7280',
        textMuted: '#78716c',
        accent: '#ea580c',
        accentSoft: 'rgba(234, 88, 12, 0.12)',
        accentStrong: '#f97316',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'pastel-geometry': {
        name: 'Pastel Geometry',
        background: '#edf6ff',
        surface: 'rgba(255, 255, 255, 0.92)',
        surfaceAlt: 'rgba(219, 234, 254, 0.92)',
        border: 'rgba(59, 130, 246, 0.16)',
        text: '#172554',
        muted: '#475569',
        textMuted: '#64748b',
        accent: '#7c3aed',
        accentSoft: 'rgba(124, 58, 237, 0.12)',
        accentStrong: '#8b5cf6',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'split-pastel': {
        name: 'Split Pastel',
        background: '#fff8f5',
        surface: 'rgba(255, 255, 255, 0.92)',
        surfaceAlt: 'rgba(245, 231, 251, 0.92)',
        border: 'rgba(236, 72, 153, 0.14)',
        text: '#3f2348',
        muted: '#6d4c74',
        textMuted: '#7c3f6a',
        accent: '#ec4899',
        accentSoft: 'rgba(236, 72, 153, 0.12)',
        accentStrong: '#f472b6',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'vintage-editorial': {
        name: 'Vintage Editorial',
        background: '#f5f1e8',
        surface: 'rgba(255, 252, 246, 0.92)',
        surfaceAlt: 'rgba(237, 228, 212, 0.92)',
        border: 'rgba(146, 64, 14, 0.14)',
        text: '#2f241d',
        muted: '#6b5b4d',
        textMuted: '#78716c',
        accent: '#b45309',
        accentSoft: 'rgba(180, 83, 9, 0.12)',
        accentStrong: '#d97706',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'neon-cyber': {
        name: 'Neon Cyber',
        background: '#09090f',
        surface: 'rgba(17, 17, 27, 0.84)',
        surfaceAlt: 'rgba(24, 24, 39, 0.9)',
        border: 'rgba(45, 212, 191, 0.2)',
        text: '#ecfeff',
        muted: '#a5f3fc',
        textMuted: '#67e8f9',
        accent: '#2dd4bf',
        accentSoft: 'rgba(45, 212, 191, 0.18)',
        accentStrong: '#5eead4',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'terminal-green': {
        name: 'Terminal Green',
        background: '#0d1117',
        surface: 'rgba(17, 22, 29, 0.86)',
        surfaceAlt: 'rgba(22, 27, 34, 0.92)',
        border: 'rgba(34, 197, 94, 0.2)',
        text: '#dcfce7',
        muted: '#86efac',
        textMuted: '#4ade80',
        accent: '#22c55e',
        accentSoft: 'rgba(34, 197, 94, 0.16)',
        accentStrong: '#4ade80',
        displayFont: '"JetBrains Mono", monospace',
        bodyFont: '"JetBrains Mono", monospace',
        codeFont: '"JetBrains Mono", monospace'
    },
    'swiss-modern': {
        name: 'Swiss Modern',
        background: '#ffffff',
        surface: 'rgba(255, 255, 255, 0.92)',
        surfaceAlt: 'rgba(244, 244, 245, 0.92)',
        border: 'rgba(15, 23, 42, 0.12)',
        text: '#0f172a',
        muted: '#475569',
        textMuted: '#64748b',
        accent: '#ef4444',
        accentSoft: 'rgba(239, 68, 68, 0.12)',
        accentStrong: '#f87171',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'paper-ink': {
        name: 'Paper & Ink',
        background: '#f7f5ee',
        surface: 'rgba(255, 253, 247, 0.92)',
        surfaceAlt: 'rgba(237, 233, 221, 0.92)',
        border: 'rgba(87, 83, 78, 0.14)',
        text: '#26231f',
        muted: '#57534e',
        textMuted: '#78716c',
        accent: '#8b5e34',
        accentSoft: 'rgba(139, 94, 52, 0.12)',
        accentStrong: '#a16207',
        displayFont: '"Clash Display", serif',
        bodyFont: '"Satoshi", serif',
        codeFont: '"JetBrains Mono", monospace'
    }
};

function asArray(value) {
    return Array.isArray(value) ? value : [];
}

function asString(value, fallback = '') {
    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value);
}

function escapeHtml(value) {
    return asString(value, '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function interpolate(template, values = {}) {
    if (window.XiangyuI18n?.interpolate) {
        return window.XiangyuI18n.interpolate(template, values);
    }

    return String(template || '').replace(/\{(\w+)\}/g, (_, key) => {
        const value = values[key];
        return value === undefined || value === null ? '' : String(value);
    });
}

function resolveRuntimeLocale() {
    if (window.XiangyuI18n?.resolveLocale) {
        return window.XiangyuI18n.resolveLocale();
    }

    const params = new URLSearchParams(window.location.search);
    const requested = asString(params.get('lang'), '').trim().toLowerCase();
    const preferred = requested
        || asString(navigator.language || navigator.userLanguage, '').trim().toLowerCase()
        || asString(document.documentElement.lang, '').trim().toLowerCase();

    return preferred.startsWith('zh') ? 'zh-CN' : 'en';
}

function normalizeMotionValue(value, fallback = '') {
    const normalized = asString(value, fallback).trim().toLowerCase();
    return SUPPORTED_MOTION_PRESETS.has(normalized) ? normalized : fallback;
}

function normalizeSceneTransitionPreset(value, fallback = '') {
    const normalized = asString(value, fallback).trim().toLowerCase();
    if (!normalized) {
        return fallback;
    }

    if (normalized === 'fade') {
        return 'crossfade';
    }

    if (normalized === 'slide-up') {
        return 'lift-fade';
    }

    return SUPPORTED_SCENE_TRANSITIONS.has(normalized) ? normalized : fallback;
}

function normalizeSceneTransitionOverlay(value, fallback = '') {
    const normalized = asString(value, fallback).trim().toLowerCase();
    if (!normalized) {
        return fallback;
    }

    return SUPPORTED_SCENE_TRANSITION_OVERLAYS.has(normalized) ? normalized : fallback;
}

function normalizeSceneTransitionDuration(value, fallback = 620) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
        return fallback;
    }

    return Math.max(180, Math.min(1800, Math.round(numeric)));
}

function normalizeSceneTransitionDelay(value, fallback = 0) {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
        return fallback;
    }

    return Math.max(0, Math.min(2000, Math.round(numeric)));
}

function normalizeSceneTransitionStaggerStep(value, fallback = 110) {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
        return fallback;
    }

    return Math.max(0, Math.min(600, Math.round(numeric)));
}

function normalizeSceneTransitionHold(value, fallback = null) {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
        return fallback;
    }

    return Math.max(0, Math.min(120000, Math.round(numeric)));
}

function defaultMotionForScene(sceneKind) {
    switch (sceneKind) {
        case 'title':
            return {
                scene: 'fade-up',
                heading: 'fade-up',
                subtitle: 'fade',
                content: 'stagger-up',
                media: 'zoom-in'
            };
        case 'quote':
            return {
                scene: 'fade-up',
                heading: 'fade',
                subtitle: 'fade',
                content: 'fade-up',
                media: 'zoom-in'
            };
        case 'code':
            return {
                scene: 'fade',
                heading: 'slide-left',
                subtitle: 'fade',
                content: 'fade-up',
                media: 'zoom-in'
            };
        case 'end':
            return {
                scene: 'zoom-in',
                heading: 'fade-up',
                subtitle: 'fade',
                content: 'fade',
                media: 'zoom-in'
            };
        case 'features':
        case 'content':
        default:
            return {
                scene: 'fade',
                heading: 'fade-up',
                subtitle: 'fade',
                content: 'stagger-up',
                media: 'zoom-in'
            };
    }
}

function defaultTransitionForScene(sceneKind, hasMedia = false) {
    switch (sceneKind) {
        case 'title':
            return {
                preset: 'lift-fade',
                durationMs: 760,
                enterMs: 760,
                exitMs: 260,
                overlay: 'accent',
                contentDelayMs: 110,
                motionDurationMs: 760,
                staggerStepMs: 110
            };
        case 'quote':
            return {
                preset: 'crossfade',
                durationMs: 680,
                enterMs: 680,
                exitMs: 220,
                overlay: 'accent',
                contentDelayMs: 90,
                motionDurationMs: 700,
                staggerStepMs: 110
            };
        case 'code':
            return {
                preset: 'push-right',
                durationMs: 620,
                enterMs: 620,
                exitMs: 200,
                overlay: 'dark',
                contentDelayMs: 140,
                motionDurationMs: 680,
                staggerStepMs: 90
            };
        case 'end':
            return {
                preset: 'zoom-fade',
                durationMs: 820,
                enterMs: 820,
                exitMs: 280,
                overlay: 'dark',
                contentDelayMs: 150,
                motionDurationMs: 720,
                staggerStepMs: 110
            };
        case 'features':
        case 'content':
        default:
            return {
                preset: hasMedia ? 'push-left' : 'crossfade',
                durationMs: hasMedia ? 660 : 560,
                enterMs: hasMedia ? 660 : 560,
                exitMs: hasMedia ? 240 : 200,
                overlay: hasMedia ? 'accent' : 'none',
                contentDelayMs: hasMedia ? 120 : 70,
                motionDurationMs: hasMedia ? 760 : 720,
                staggerStepMs: hasMedia ? 100 : 110
            };
    }
}

class PresentationRuntime {
    constructor() {
        this.presentationId = this.resolvePresentationId();
        this.sessionId = this.resolveSessionId();
        this.locale = resolveRuntimeLocale();
        this.copy = RUNTIME_I18N[this.locale] || RUNTIME_I18N.en;
        this.presentation = null;
        this.currentSlide = 0;
        this.slides = [];
        this.navDots = [];
        this.totalSlides = 0;
        this.touchStartY = 0;
        this.lockedUntil = 0;
        this.wheelDelta = 0;
        this.wheelResetTimer = null;
        this.scrollFrame = null;
        this.autoplayEnabled = false;
        this.autoplayTimer = null;
        this.subtitleTimers = [];
        this.subtitleMode = 'voiceover-placeholder';
        this.timelineMarkers = [];
        this.audioTracks = [];
        this.audioEnabled = false;
        this.audioStartTimers = [];
        this.audioElements = new Map();
        this.bottomLayoutFrame = null;
        this.bottomLayoutObserver = null;
        this.handleBottomLayoutResize = () => this.scheduleBottomLayoutUpdate();

        this.elements = {
            loading: document.getElementById('runtimeLoading'),
            loadingKicker: document.getElementById('runtimeLoadingKicker'),
            loadingTitle: document.getElementById('runtimeLoadingTitle'),
            loadingMessage: document.getElementById('runtimeLoadingMessage'),
            error: document.getElementById('runtimeError'),
            errorKicker: document.getElementById('runtimeErrorKicker'),
            errorTitle: document.getElementById('runtimeErrorTitle'),
            errorMessage: document.getElementById('runtimeErrorMessage'),
            shell: document.getElementById('runtimeShell'),
            deck: document.getElementById('runtimeDeck'),
            navDots: document.getElementById('navDots'),
            progressBar: document.getElementById('progressBar'),
            currentSlideNum: document.getElementById('currentSlideNum'),
            totalSlides: document.getElementById('totalSlides'),
            deckChrome: document.getElementById('deckChrome'),
            deckThemeName: document.getElementById('deckThemeName'),
            deckTiming: document.getElementById('deckTiming'),
            deckAudioStatus: document.getElementById('deckAudioStatus'),
            audioToggle: document.getElementById('runtimeAudioToggle'),
            autoplayToggle: document.getElementById('runtimeAutoplayToggle'),
            subtitleToggle: document.getElementById('runtimeSubtitleToggle'),
            markerRail: document.getElementById('timelineMarkers'),
            editCueBar: document.getElementById('editCueBar'),
            editCueTitle: document.getElementById('editCueTitle'),
            editCueList: document.getElementById('editCueList'),
            subtitleBar: document.getElementById('subtitleBar'),
            subtitleText: document.getElementById('subtitleText')
        };

        window.XiangyuI18n?.setPageLocale?.(this.locale);
        this.applyStaticI18n();
        this.init();
    }

    resolvePresentationId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    resolveSessionId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('session') || '';
    }

    t(key, values = {}) {
        return interpolate(this.copy?.[key] || key, values);
    }

    applyStaticI18n() {
        this.elements.loadingKicker && (this.elements.loadingKicker.textContent = this.t('runtimeKicker'));
        this.elements.loadingTitle && (this.elements.loadingTitle.textContent = this.t('runtimeLoadingTitle'));
        this.elements.loadingMessage && (this.elements.loadingMessage.textContent = this.t('runtimeLoadingMessage'));
        this.elements.errorKicker && (this.elements.errorKicker.textContent = this.t('runtimeErrorKicker'));
        this.elements.errorTitle && (this.elements.errorTitle.textContent = this.t('runtimeErrorTitle'));
        this.elements.errorMessage && (this.elements.errorMessage.textContent = this.t('runtimeInitFailed'));
        this.elements.editCueTitle && (this.elements.editCueTitle.textContent = this.t('editCuesTitle'));
        this.updateAutoplayButton();
        this.updateAudioButton();
        this.updateSubtitleModeButton();
    }

    async init() {
        if (!this.presentationId) {
            this.showError('缺少 presentation id。');
            this.notifyRuntimeError('缺少 presentation id。');
            return;
        }

        try {
            const presentation = await this.fetchPresentation();
            this.presentation = presentation;
            this.applyTheme(presentation.theme?.presetId);
            this.renderPresentation(presentation);
            this.bindTimelineControls();
            this.setupKeyboard();
            this.setupTouchNav();
            this.setupWheelNav();
            this.setupMessageBridge();
            this.setupObserver();
            this.setupBottomLayoutObserver();
            this.focusPresentationSurface();
            this.autoplayEnabled = this.resolveInitialAutoplay();
            this.subtitleMode = this.resolveInitialSubtitleMode();
            this.audioEnabled = this.resolveInitialAudioEnabled();
            this.updateAudioButton();
            this.updateAutoplayButton();
            this.updateSubtitleModeButton();
            this.goTo(this.resolveInitialSlide(), false);
            this.showShell();
            this.notifyRuntimeReady();
        } catch (error) {
            this.showError(error.message || '运行时初始化失败。');
            this.notifyRuntimeError(error.message || '运行时初始化失败。');
        }
    }

    async fetchPresentation() {
        const response = await fetch(`/api/presentations/${this.presentationId}/spec`, {
            cache: 'no-store'
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || '读取结构化演示失败。');
        }

        if (!Array.isArray(data.scenes) || data.scenes.length === 0) {
            throw new Error('当前演示稿没有可渲染的场景。');
        }

        return data;
    }

    applyTheme(styleId) {
        const theme = THEME_TOKENS[styleId] || THEME_TOKENS[DEFAULT_THEME_ID];
        const root = document.documentElement;

        root.style.setProperty('--bg-primary', theme.background);
        root.style.setProperty('--bg-surface', theme.surface);
        root.style.setProperty('--bg-surface-alt', theme.surfaceAlt);
        root.style.setProperty('--border-soft', theme.border);
        root.style.setProperty('--text-primary', theme.text);
        root.style.setProperty('--text-secondary', theme.muted);
        root.style.setProperty('--text-muted', theme.textMuted);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--accent-soft', theme.accentSoft);
        root.style.setProperty('--accent-strong', theme.accentStrong);
        root.style.setProperty('--font-display', theme.displayFont);
        root.style.setProperty('--font-body', theme.bodyFont);
        root.style.setProperty('--font-code', theme.codeFont);

        this.elements.deckThemeName.textContent = theme.name;
    }

    getOrderedScenes() {
        const scenes = asArray(this.presentation?.scenes);
        const byId = new Map(scenes.map((scene) => [scene.id, scene]));
        const ordered = asArray(this.presentation?.sceneOrder)
            .map((sceneId) => byId.get(sceneId))
            .filter(Boolean);

        return ordered.length > 0 ? ordered : scenes;
    }

    buildAssetMap() {
        return new Map(asArray(this.presentation?.assets).map((asset) => [asset.id, asset]));
    }

    buildVoiceoverMap() {
        return new Map(
            asArray(this.presentation?.voiceover)
                .filter((entry) => entry?.sceneId)
                .map((entry) => [entry.sceneId, entry])
        );
    }

    buildTimelineTrackMap() {
        return new Map(
            asArray(this.presentation?.timeline?.sceneTracks)
                .filter((track) => track?.sceneId)
                .map((track) => [track.sceneId, track])
        );
    }

    buildTimelineMarkerList() {
        const scenes = this.getOrderedScenes();
        const sceneIndexById = new Map(scenes.map((scene, index) => [scene.id, index]));
        const explicitMarkers = asArray(this.presentation?.timeline?.markers)
            .map((marker, index) => {
                const sceneIndex = sceneIndexById.get(marker?.sceneId);
                return {
                    id: asString(marker?.id, `marker_${index + 1}`),
                    label: asString(marker?.label, `Marker ${index + 1}`),
                    sceneId: asString(marker?.sceneId, ''),
                    sceneIndex: Number.isInteger(sceneIndex) ? sceneIndex : index,
                    atMs: marker?.atMs !== null && marker?.atMs !== undefined && Number.isFinite(Number(marker?.atMs))
                        ? Number(marker.atMs)
                        : 0
                };
            })
            .filter((marker) => Number.isInteger(marker.sceneIndex));

        if (explicitMarkers.length > 0) {
            return explicitMarkers;
        }

        return scenes.map((scene, index) => ({
            id: `marker_scene_${index + 1}`,
            label: asString(scene?.title || scene?.subtitle, `Scene ${index + 1}`),
            sceneId: asString(scene?.id, ''),
            sceneIndex: index,
            atMs: Number.isFinite(Number(this.timelineTrackBySceneId?.get(scene?.id)?.startMs))
                ? Number(this.timelineTrackBySceneId.get(scene.id).startMs)
                : 0
        }));
    }

    buildAudioTracks(assetMap) {
        const timelineTracks = asArray(this.presentation?.timeline?.audioTracks).map((track, index) => {
            const asset = assetMap.get(asString(track?.assetId, ''));
            return {
                id: asString(track?.id, `audio_track_${index + 1}`),
                assetId: asString(track?.assetId, ''),
                label: asString(track?.label, asset?.meta?.label || `Audio ${index + 1}`),
                source: asset?.source?.url || asset?.source?.path || asString(track?.source, ''),
                startMs: Number.isFinite(Number(track?.startMs)) ? Number(track.startMs) : 0,
                autoplay: track?.autoplay === true,
                loop: track?.loop === true,
                gain: Number.isFinite(Number(track?.gain)) ? Number(track.gain) : 1,
                status: asString(track?.status, asset || track?.source ? 'ready' : 'pending'),
                kind: 'timeline'
            };
        });

        const voiceoverTracks = asArray(this.presentation?.voiceover)
            .map((voiceover, index) => {
                const assetId = asString(voiceover?.audioAssetId, '');
                if (!assetId) {
                    return null;
                }

                const asset = assetMap.get(assetId);
                const sceneTrack = this.timelineTrackBySceneId?.get(voiceover?.sceneId);
                return {
                    id: `voiceover_audio_${index + 1}`,
                    assetId,
                    label: asString(voiceover?.text, `Voiceover ${index + 1}`).slice(0, 36) || `Voiceover ${index + 1}`,
                    source: asset?.source?.url || asset?.source?.path || '',
                    startMs: Number.isFinite(Number(sceneTrack?.startMs)) ? Number(sceneTrack.startMs) : 0,
                    autoplay: true,
                    loop: false,
                    gain: 1,
                    status: asString(voiceover?.status, asset ? 'ready' : 'pending'),
                    kind: 'voiceover'
                };
            })
            .filter(Boolean);

        return [...timelineTracks, ...voiceoverTracks];
    }

    resolveInitialAutoplay() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('autoplay') === '1') {
            return true;
        }

        return this.presentation?.timeline?.autoplay === true;
    }

    resolveInitialSubtitleMode() {
        const params = new URLSearchParams(window.location.search);
        const requested = asString(params.get('subtitles'), '').trim().toLowerCase();
        if (['voiceover-placeholder', 'static', 'off'].includes(requested)) {
            return requested;
        }

        const configured = asString(this.presentation?.timeline?.subtitleMode, 'voiceover-placeholder')
            .trim()
            .toLowerCase();

        return ['voiceover-placeholder', 'static', 'off'].includes(configured)
            ? configured
            : 'voiceover-placeholder';
    }

    resolveInitialAudioEnabled() {
        const params = new URLSearchParams(window.location.search);
        return params.get('audio') === '1';
    }

    formatDuration(ms) {
        const numeric = Number(ms);
        if (!Number.isFinite(numeric) || numeric < 0) {
            return '--';
        }

        const rawSeconds = numeric / 1000;
        const totalSeconds = Math.round(rawSeconds);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        if (minutes <= 0) {
            if (numeric > 0 && numeric < 10000 && Math.abs(rawSeconds - Math.round(rawSeconds)) >= 0.05) {
                return `${Math.round(rawSeconds * 10) / 10}s`;
            }

            return `${seconds}s`;
        }

        return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
    }

    normalizeMarkerAnchor(value) {
        const normalized = asString(value, '').trim().toLowerCase();
        if (normalized === 'start' || normalized === 'advance' || normalized === 'exit') {
            return normalized;
        }

        return '';
    }

    getMarkerAnchorOrder(anchor) {
        switch (anchor) {
            case 'start':
                return 0;
            case 'advance':
                return 1;
            case 'exit':
                return 2;
            default:
                return 3;
        }
    }

    normalizeMarkerKind(value) {
        const normalized = asString(value, '').trim().toLowerCase();
        if (!normalized) {
            return '';
        }

        if (normalized === 'navigation' || normalized === 'nav') {
            return 'navigation';
        }

        if (normalized === 'narration' || normalized === 'voiceover' || normalized === 'subtitle') {
            return 'narration';
        }

        if (normalized === 'edit' || normalized === 'editorial' || normalized === 'note') {
            return 'edit';
        }

        return '';
    }

    getMarkerKindOrder(kind) {
        switch (this.normalizeMarkerKind(kind)) {
            case 'navigation':
                return 0;
            case 'narration':
                return 1;
            case 'edit':
                return 2;
            default:
                return 3;
        }
    }

    formatMarkerAnchor(anchor) {
        switch (this.normalizeMarkerAnchor(anchor)) {
            case 'start':
                return this.t('markerAnchorStart');
            case 'advance':
                return this.t('markerAnchorAdvance');
            case 'exit':
                return this.t('markerAnchorExit');
            default:
                return '';
        }
    }

    formatMarkerKind(kind) {
        switch (this.normalizeMarkerKind(kind)) {
            case 'navigation':
                return this.t('markerKindNavigation');
            case 'narration':
                return this.t('markerKindNarration');
            case 'edit':
                return this.t('markerKindEdit');
            default:
                return '';
        }
    }

    getSceneCueMarkers(scene, kind = '') {
        const sceneId = asString(scene?.id, '');
        const normalizedKind = kind ? this.normalizeMarkerKind(kind) : '';
        return asArray(this.timelineMarkers)
            .filter((marker) => asString(marker?.sceneId, '') === sceneId)
            .filter((marker) => !normalizedKind || this.normalizeMarkerKind(marker?.kind) === normalizedKind)
            .sort((left, right) => {
                if (left.atMs !== right.atMs) {
                    return left.atMs - right.atMs;
                }

                if (this.getMarkerAnchorOrder(left.anchor) !== this.getMarkerAnchorOrder(right.anchor)) {
                    return this.getMarkerAnchorOrder(left.anchor) - this.getMarkerAnchorOrder(right.anchor);
                }

                return this.getMarkerKindOrder(left.kind) - this.getMarkerKindOrder(right.kind);
            });
    }

    buildNarrationCuePayload(scene) {
        const sceneStart = this.getSceneStartMs(scene);
        const cues = this.getSceneCueMarkers(scene, 'narration')
            .map((marker) => ({
                atMs: Math.max(0, Number(marker.atMs || 0) - sceneStart),
                text: asString(marker.label, '').trim()
            }))
            .filter((cue) => cue.text);

        if (cues.length === 0) {
            return null;
        }

        return {
            text: cues.map((cue) => cue.text).join(' '),
            cues
        };
    }

    resolveSubtitlePayload(scene) {
        const voiceover = this.voiceoverBySceneId?.get(scene?.id);
        const narration = this.buildNarrationCuePayload(scene);
        const voiceoverCues = asArray(voiceover?.cues)
            .filter((cue) => cue?.text)
            .map((cue) => ({
                atMs: Number.isFinite(Number(cue.atMs)) ? Number(cue.atMs) : 0,
                text: asString(cue.text, '')
            }))
            .filter((cue) => cue.text);
        const voiceoverText = asString(voiceover?.text, '').trim();

        if (voiceoverCues.length > 0) {
            return {
                text: voiceoverText || narration?.text || voiceoverCues.map((cue) => cue.text).join(' '),
                cues: voiceoverCues
            };
        }

        if (voiceoverText) {
            return narration?.cues?.length > 0 && this.subtitleMode === 'voiceover-placeholder'
                ? {
                    text: voiceoverText,
                    cues: narration.cues
                }
                : {
                    text: voiceoverText,
                    cues: []
                };
        }

        return narration;
    }

    resolveSceneMotion(scene) {
        const sceneKind = asString(scene?.kind, 'content');
        const defaults = defaultMotionForScene(sceneKind);
        const motion = scene?.motion && typeof scene.motion === 'object' ? scene.motion : {};
        const pick = (value, fallback) => normalizeMotionValue(value, '') || fallback;

        return {
            scene: pick(motion.scene, defaults.scene),
            heading: pick(motion.heading, defaults.heading),
            subtitle: pick(motion.subtitle, defaults.subtitle),
            content: pick(motion.content, defaults.content),
            media: pick(motion.media, defaults.media)
        };
    }

    resolveElementMotion(element, sceneMotion) {
        const explicit = normalizeMotionValue(element?.props?.animation, '');
        if (explicit) {
            return explicit;
        }

        switch (element?.type) {
            case 'heading':
                return sceneMotion.heading;
            case 'text':
                return sceneMotion.subtitle;
            case 'image':
            case 'video':
                return sceneMotion.media;
            case 'bulletList':
            case 'code':
            case 'quote':
            default:
                return sceneMotion.content;
        }
    }

    resolveSceneTransition(scene) {
        const sceneKind = asString(scene?.kind, 'content');
        const hasMedia = Array.isArray(scene?.mediaRefs) && scene.mediaRefs.length > 0;
        const defaults = defaultTransitionForScene(sceneKind, hasMedia);
        const transition = scene?.transition && typeof scene.transition === 'object' ? scene.transition : {};

        return {
            preset: normalizeSceneTransitionPreset(transition.preset || transition.enter || transition.type, defaults.preset),
            durationMs: normalizeSceneTransitionDuration(transition.durationMs, defaults.durationMs),
            enterMs: normalizeSceneTransitionDuration(transition.enterMs ?? transition.enterDurationMs ?? transition.durationMs, defaults.enterMs),
            holdMs: normalizeSceneTransitionHold(transition.holdMs ?? transition.holdDurationMs, defaults.holdMs ?? null),
            exitMs: normalizeSceneTransitionDuration(transition.exitMs ?? transition.exitDurationMs, defaults.exitMs),
            overlay: normalizeSceneTransitionOverlay(transition.overlay, defaults.overlay),
            contentDelayMs: normalizeSceneTransitionDelay(transition.contentDelayMs ?? transition.delayMs, defaults.contentDelayMs),
            motionDurationMs: normalizeSceneTransitionDuration(transition.motionDurationMs ?? transition.elementDurationMs, defaults.motionDurationMs),
            staggerStepMs: normalizeSceneTransitionStaggerStep(transition.staggerStepMs, defaults.staggerStepMs)
        };
    }

    resolveScenePhaseTiming(scene) {
        const transition = this.resolveSceneTransition(scene);
        const track = this.timelineTrackBySceneId?.get(scene?.id);
        const baseDuration = Number.isFinite(Number(track?.durationMs))
            ? Number(track.durationMs)
            : (Number.isFinite(Number(scene?.durationMs)) ? Number(scene.durationMs) : null);
        const enterMs = Number.isFinite(Number(transition?.enterMs))
            ? Number(transition.enterMs)
            : (Number.isFinite(Number(transition?.durationMs)) ? Number(transition.durationMs) : 0);
        const exitMs = Number.isFinite(Number(transition?.exitMs)) ? Number(transition.exitMs) : 0;
        const explicitHoldMs = Number.isFinite(Number(transition?.holdMs)) ? Number(transition.holdMs) : null;
        const minimumDuration = Math.max(0, enterMs + exitMs + (explicitHoldMs || 0));
        const totalMs = baseDuration === null
            ? minimumDuration
            : Math.max(baseDuration, minimumDuration);
        const holdMs = explicitHoldMs === null
            ? Math.max(totalMs - enterMs - exitMs, 0)
            : explicitHoldMs;
        const advanceMs = Math.max(0, totalMs - exitMs);

        return {
            totalMs,
            enterMs,
            holdMs,
            exitMs,
            advanceMs
        };
    }

    buildMotionAttributes(preset, order = 0, options = {}) {
        const normalized = normalizeMotionValue(preset, '');
        if (!normalized) {
            return '';
        }

        const timingParts = [`--motion-order:${order}`];
        if (options.delayMs !== undefined && options.delayMs !== null) {
            timingParts.push(`--motion-delay-base:${Math.max(0, Number(options.delayMs) || 0)}ms`);
        }
        if (options.durationMs !== undefined && options.durationMs !== null) {
            timingParts.push(`--motion-duration-override:${Math.max(180, Math.min(1800, Math.round(Number(options.durationMs) || 0)))}ms`);
        }
        if (options.staggerStepMs !== undefined && options.staggerStepMs !== null) {
            timingParts.push(`--motion-stagger-step-override:${Math.max(0, Math.min(600, Math.round(Number(options.staggerStepMs) || 0)))}ms`);
        }

        return ` data-motion="${escapeHtml(normalized)}" style="${timingParts.join(';')}"`;
    }

    buildSceneTransitionAttributes(transition) {
        const preset = normalizeSceneTransitionPreset(transition?.preset, '');
        if (!preset) {
            return '';
        }

        const durationMs = normalizeSceneTransitionDuration(transition?.durationMs, 620);
        const enterMs = normalizeSceneTransitionDuration(transition?.enterMs ?? transition?.durationMs, durationMs);
        const holdMs = normalizeSceneTransitionHold(transition?.holdMs, null);
        const exitMs = normalizeSceneTransitionDuration(transition?.exitMs, 220);
        const overlay = normalizeSceneTransitionOverlay(transition?.overlay, 'none') || 'none';
        const contentDelayMs = normalizeSceneTransitionDelay(transition?.contentDelayMs, 0);
        const motionDurationMs = normalizeSceneTransitionDuration(transition?.motionDurationMs, 720);
        const staggerStepMs = normalizeSceneTransitionStaggerStep(transition?.staggerStepMs, 110);

        return ` data-scene-transition="${escapeHtml(preset)}" data-scene-overlay="${escapeHtml(overlay)}" style="--scene-transition-duration:${durationMs}ms;--scene-enter-duration:${enterMs}ms;--scene-hold-duration:${holdMs === null ? 0 : holdMs}ms;--scene-exit-duration:${exitMs}ms;--scene-content-delay:${contentDelayMs}ms;--scene-motion-duration:${motionDurationMs}ms;--scene-motion-stagger-step:${staggerStepMs}ms"`;
    }

    renderPresentation() {
        const scenes = this.getOrderedScenes();
        const assetMap = this.buildAssetMap();
        this.voiceoverBySceneId = this.buildVoiceoverMap();
        this.timelineTrackBySceneId = this.buildTimelineTrackMap();
        this.audioTracks = this.buildAudioTracks(assetMap);
        this.timelineMarkers = this.buildTimelineMarkerList();

        this.elements.deck.innerHTML = scenes
            .map((scene, index) => this.renderScene(scene, index, assetMap))
            .join('');
        this.elements.navDots.innerHTML = scenes.map((scene, index) => `
            <button
                class="nav-dot${index === 0 ? ' active' : ''}"
                type="button"
                data-slide-index="${index}"
                aria-label="Go to slide ${index + 1}"
            ></button>
        `).join('');

        this.slides = Array.from(this.elements.deck.querySelectorAll('.runtime-slide'));
        this.navDots = Array.from(this.elements.navDots.querySelectorAll('.nav-dot'));
        this.totalSlides = this.slides.length;
        this.elements.totalSlides.textContent = String(this.totalSlides);
        this.setupNavDots();
        this.renderMarkerRail();
        this.scheduleBottomLayoutUpdate();
    }

    bindTimelineControls() {
        this.elements.audioToggle?.addEventListener('click', () => {
            this.toggleAudio();
        });
        this.elements.autoplayToggle?.addEventListener('click', () => {
            this.toggleAutoplay();
        });
        this.elements.subtitleToggle?.addEventListener('click', () => {
            this.toggleSubtitleMode();
        });
    }

    renderMarkerRail() {
        if (!this.elements.markerRail) {
            return;
        }

        if (!Array.isArray(this.timelineMarkers) || this.timelineMarkers.length === 0) {
            this.elements.markerRail.hidden = true;
            this.elements.markerRail.innerHTML = '';
            this.scheduleBottomLayoutUpdate();
            return;
        }

        this.elements.markerRail.hidden = false;
        this.elements.markerRail.innerHTML = this.timelineMarkers.map((marker) => `
            <button
                class="marker-chip${marker.sceneIndex === this.currentSlide ? ' is-active' : ''}"
                type="button"
                data-marker-slide="${marker.sceneIndex}"
                aria-label="Go to ${escapeHtml(marker.label)}"
            >
                ${escapeHtml(marker.label)}
            </button>
        `).join('');

        Array.from(this.elements.markerRail.querySelectorAll('[data-marker-slide]')).forEach((button) => {
            button.addEventListener('click', () => {
                const slideIndex = Number(button.dataset.markerSlide);
                if (Number.isInteger(slideIndex)) {
                    this.goTo(Math.max(0, Math.min(this.totalSlides - 1, slideIndex)));
                }
            });
        });

        this.scheduleBottomLayoutUpdate();
    }

    renderScene(scene, index, assetMap) {
        const elements = asArray(scene?.elements);
        const mediaElements = elements.filter((element) => ['image', 'video'].includes(element?.type));
        const textElements = elements.filter((element) => !['image', 'video'].includes(element?.type));
        const layout = mediaElements.length === 0
            ? 'text'
            : textElements.length === 0
                ? 'media'
                : 'mixed';
        const sceneKind = asString(scene?.kind, 'content');
        const sceneMotion = this.resolveSceneMotion(scene);
        const sceneTransition = this.resolveSceneTransition(scene);

        return `
            <section
                class="runtime-slide scene-kind-${escapeHtml(sceneKind)}"
                data-slide-index="${index}"
                data-scene-id="${escapeHtml(scene?.id || `scene_${index + 1}`)}"
                ${this.buildSceneTransitionAttributes(sceneTransition)}
            >
                <div class="scene-transition-stage">
                    <div class="scene-transition-wash" aria-hidden="true"></div>
                    <div class="scene-panel layout-${layout} motion-target"${this.buildMotionAttributes(sceneMotion.scene, 0, {
                        delayMs: 0,
                        durationMs: sceneTransition.motionDurationMs,
                        staggerStepMs: sceneTransition.staggerStepMs
                    })}>
                        ${textElements.length > 0 || mediaElements.length === 0
                            ? `<div class="scene-text">${this.renderTextColumn(scene, textElements, sceneMotion, sceneTransition)}</div>`
                            : ''}
                        ${mediaElements.length > 0
                            ? `<div class="scene-media">${mediaElements.map((element, mediaIndex) => this.renderMediaElement(element, assetMap, sceneMotion, sceneTransition, mediaIndex)).join('')}</div>`
                            : ''}
                    </div>
                </div>
            </section>
        `;
    }

    renderTextColumn(scene, elements, sceneMotion) {
        const rendered = [];
        const kind = asString(scene?.kind, 'content');
        let motionOrder = 1;

        if (scene?.title && !elements.some((element) => element?.type === 'heading')) {
            rendered.push(`
                <h1 class="scene-heading motion-target"${this.buildMotionAttributes(sceneMotion.heading, motionOrder++)}>
                    ${escapeHtml(scene.title)}
                </h1>
            `);
        }

        if (kind === 'end') {
            rendered.push(`
                <span class="scene-kicker motion-target"${this.buildMotionAttributes(sceneMotion.subtitle, motionOrder++)}>
                    Closing Scene
                </span>
            `);
        } else if (kind === 'title') {
            rendered.push(`
                <span class="scene-kicker motion-target"${this.buildMotionAttributes(sceneMotion.subtitle, motionOrder++)}>
                    Opening Scene
                </span>
            `);
        }

        elements.forEach((element) => {
            rendered.push(this.renderTextElement(element, sceneMotion, motionOrder));
            motionOrder += 1;
        });

        if (rendered.length === 0) {
            rendered.push('<p class="scene-empty motion-target" data-motion="fade">当前场景没有可显示的文本内容。</p>');
        }

        return rendered.join('');
    }

    renderTextElement(element, sceneMotion, sceneTransition, motionOrder) {
        const type = asString(element?.type, 'text');
        const content = element?.content;
        const preset = this.resolveElementMotion(element, sceneMotion);
        const motionAttrs = this.buildMotionAttributes(preset, motionOrder, {
            delayMs: sceneTransition?.contentDelayMs,
            durationMs: sceneTransition?.motionDurationMs,
            staggerStepMs: sceneTransition?.staggerStepMs
        });

        switch (type) {
            case 'heading':
                return `<h1 class="scene-heading motion-target"${motionAttrs}>${escapeHtml(content)}</h1>`;
            case 'text':
                return `<p class="motion-target"${motionAttrs}>${escapeHtml(content)}</p>`;
            case 'bulletList':
                return `
                    <ul class="scene-bullets motion-target"${motionAttrs}>
                        ${asArray(content).map((item, index) => `
                            <li class="${preset === 'stagger-up' ? 'motion-stagger-item' : ''}" style="--motion-order:${motionOrder + index + 1};--motion-delay-base:${Math.max(0, Number(sceneTransition?.contentDelayMs) || 0)}ms;--motion-duration-override:${Math.max(180, Math.min(1800, Math.round(Number(sceneTransition?.motionDurationMs) || 720)))}ms;--motion-stagger-step-override:${Math.max(0, Math.min(600, Math.round(Number(sceneTransition?.staggerStepMs) || 110)))}ms">
                                ${escapeHtml(item)}
                            </li>
                        `).join('')}
                    </ul>
                `;
            case 'code':
                return `<pre class="scene-code motion-target"${motionAttrs}><code>${escapeHtml(content)}</code></pre>`;
            case 'quote':
                return `<blockquote class="scene-quote motion-target"${motionAttrs}>${escapeHtml(content)}</blockquote>`;
            default:
                return `<p class="motion-target"${motionAttrs}>${escapeHtml(typeof content === 'string' ? content : JSON.stringify(content || ''))}</p>`;
        }
    }

    renderMediaElement(element, assetMap, sceneMotion, mediaIndex) {
        const asset = assetMap.get(element?.mediaAssetId);
        if (!asset) {
            return this.renderMediaPlaceholder('素材记录不存在或尚未注册。');
        }

        const url = this.resolveAssetUrl(asset);
        if (!url) {
            return this.renderMediaPlaceholder('素材地址为空，无法预览。');
        }

        const props = element?.props && typeof element.props === 'object' ? element.props : {};
        const meta = asset.meta && typeof asset.meta === 'object' ? asset.meta : {};
        const caption = asString(props.caption || meta.caption || element?.content, '');
        const alt = asString(props.alt || meta.alt || caption, '');
        const poster = this.resolvePosterUrl(props.poster || meta.poster);
        const motionAttrs = this.buildMotionAttributes(this.resolveElementMotion(element, sceneMotion), mediaIndex + 2);

        if (asset.type === 'video') {
            return `
                <figure class="scene-media-card motion-target"${motionAttrs}>
                    <video
                        src="${escapeHtml(url)}"
                        ${poster ? `poster="${escapeHtml(poster)}"` : ''}
                        ${props.autoplay ? 'autoplay' : ''}
                        ${props.loop ? 'loop' : ''}
                        muted
                        playsinline
                        preload="metadata"
                        controls
                        onerror="window.presentationRuntime.handleMediaError(this)"
                    ></video>
                    ${caption ? `<figcaption class="media-caption">${escapeHtml(caption)}</figcaption>` : ''}
                </figure>
            `;
        }

        return `
            <figure class="scene-media-card motion-target"${motionAttrs}>
                <img
                    src="${escapeHtml(url)}"
                    alt="${escapeHtml(alt)}"
                    loading="lazy"
                    onerror="window.presentationRuntime.handleMediaError(this)"
                />
                ${caption ? `<figcaption class="media-caption">${escapeHtml(caption)}</figcaption>` : ''}
            </figure>
        `;
    }

    renderMediaPlaceholder(message) {
        return `
            <div class="scene-media-card">
                <div class="media-placeholder">${escapeHtml(message)}</div>
            </div>
        `;
    }

    resolveAssetUrl(asset) {
        const source = asset?.source || {};
        if (source.url) {
            return source.url;
        }

        const rawPath = asString(source.path, '').trim();
        if (!rawPath) {
            return '';
        }

        if (rawPath.startsWith('/')) {
            return rawPath;
        }

        return `/assets/${rawPath.replace(/^\.?\//, '')}`;
    }

    resolvePosterUrl(poster) {
        const normalized = asString(poster, '').trim();
        if (!normalized) {
            return '';
        }

        if (/^https?:\/\//i.test(normalized) || normalized.startsWith('/')) {
            return normalized;
        }

        return `/assets/${normalized.replace(/^\.?\//, '')}`;
    }

    getMeasuredOverlayHeight(element) {
        if (!element || element.hidden) {
            return 0;
        }

        const rect = element.getBoundingClientRect();
        return Number.isFinite(rect.height) && rect.height > 0 ? rect.height : 0;
    }

    updateBottomLayout() {
        const root = document.documentElement;
        const baseBottom = window.matchMedia('(max-width: 720px)').matches ? 12 : 18;
        const gap = window.matchMedia('(max-width: 720px)').matches ? 10 : 12;
        const deckHeight = this.getMeasuredOverlayHeight(this.elements.deckChrome);
        const markerHeight = this.getMeasuredOverlayHeight(this.elements.markerRail);
        const editHeight = this.getMeasuredOverlayHeight(this.elements.editCueBar);
        const subtitleHeight = this.getMeasuredOverlayHeight(this.elements.subtitleBar);

        let cursor = baseBottom + deckHeight;
        const markerBottom = cursor + (markerHeight > 0 ? gap : 0);
        if (markerHeight > 0) {
            cursor = markerBottom + markerHeight;
        }

        const editBottom = cursor + (editHeight > 0 ? gap : 0);
        if (editHeight > 0) {
            cursor = editBottom + editHeight;
        }

        const subtitleBottom = cursor + (subtitleHeight > 0 ? gap : 0);

        root.style.setProperty('--runtime-bottom-base', `${baseBottom}px`);
        root.style.setProperty('--runtime-bottom-gap', `${gap}px`);
        root.style.setProperty('--deck-chrome-bottom', `${baseBottom}px`);
        root.style.setProperty('--marker-rail-bottom', `${markerBottom}px`);
        root.style.setProperty('--edit-cue-bottom', `${editBottom}px`);
        root.style.setProperty('--subtitle-bar-bottom', `${subtitleBottom}px`);
    }

    scheduleBottomLayoutUpdate() {
        if (this.bottomLayoutFrame) {
            window.cancelAnimationFrame(this.bottomLayoutFrame);
        }

        this.bottomLayoutFrame = window.requestAnimationFrame(() => {
            this.bottomLayoutFrame = null;
            this.updateBottomLayout();
        });
    }

    setupBottomLayoutObserver() {
        if (this.bottomLayoutObserver || !this.elements.shell) {
            return;
        }

        window.addEventListener('resize', this.handleBottomLayoutResize, { passive: true });

        if (typeof ResizeObserver === 'function') {
            this.bottomLayoutObserver = new ResizeObserver(() => {
                this.scheduleBottomLayoutUpdate();
            });

            [
                this.elements.deckChrome,
                this.elements.markerRail,
                this.elements.editCueBar,
                this.elements.subtitleBar
            ].filter(Boolean).forEach((element) => {
                this.bottomLayoutObserver.observe(element);
            });
        }

        this.scheduleBottomLayoutUpdate();
    }

    setupNavDots() {
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });
    }

    setupObserver() {
        if (this.slides.length === 0) {
            return;
        }

        const syncFromViewport = () => {
            const best = this.slides.reduce((currentBest, slide, index) => {
                const distance = Math.abs(slide.getBoundingClientRect().top);
                if (distance < currentBest.distance) {
                    return { index, distance };
                }

                return currentBest;
            }, {
                index: this.currentSlide,
                distance: Number.POSITIVE_INFINITY
            });

            if (best.index !== this.currentSlide) {
                this.currentSlide = best.index;
                this.syncUi(best.index);
            }
        };

        window.addEventListener('scroll', () => {
            window.cancelAnimationFrame(this.scrollFrame);
            this.scrollFrame = window.requestAnimationFrame(syncFromViewport);
        }, { passive: true });
    }

    setupKeyboard() {
        window.addEventListener('keydown', (event) => {
            if (this.shouldIgnoreKeyboardEvent(event)) {
                return;
            }

            if (String(event.key).toLowerCase() === 'p') {
                event.preventDefault();
                this.toggleAutoplay();
                return;
            }

            if (String(event.key).toLowerCase() === 'c') {
                event.preventDefault();
                this.toggleSubtitleMode();
                return;
            }

            if (String(event.key).toLowerCase() === 'm') {
                event.preventDefault();
                this.toggleAudio();
                return;
            }

            const action = this.mapKeyToAction(event.key);
            if (!action) {
                return;
            }

            event.preventDefault();
            this.runAction(action);
        });
    }

    setupTouchNav() {
        document.addEventListener('touchstart', (event) => {
            this.touchStartY = event.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (event) => {
            const deltaY = this.touchStartY - event.changedTouches[0].clientY;
            if (Math.abs(deltaY) < 50) {
                return;
            }

            if (deltaY > 0) {
                this.next();
            } else {
                this.prev();
            }
        }, { passive: true });
    }

    setupWheelNav() {
        window.addEventListener('wheel', (event) => {
            const now = Date.now();
            if (now < this.lockedUntil) {
                event.preventDefault();
                return;
            }

            this.wheelDelta += event.deltaY;
            window.clearTimeout(this.wheelResetTimer);
            this.wheelResetTimer = window.setTimeout(() => {
                this.wheelDelta = 0;
            }, 140);

            if (Math.abs(this.wheelDelta) < 10) {
                return;
            }

            event.preventDefault();
            this.lockedUntil = now + 520;
            const action = this.wheelDelta > 0 ? 'next' : 'prev';
            this.wheelDelta = 0;
            this.runAction(action);
        }, { passive: false });
    }

    setupMessageBridge() {
        window.addEventListener('message', (event) => {
            const data = event.data;
            if (!data || typeof data !== 'object') {
                return;
            }

            if (data.presentationId && data.presentationId !== this.presentationId) {
                return;
            }

            if (data.sessionId && this.sessionId && data.sessionId !== this.sessionId) {
                return;
            }

            if (data.type === 'presentation-runtime-probe') {
                if (this.presentation && this.slides.length > 0 && this.elements.shell?.hidden === false) {
                    this.notifyRuntimeReady();
                    return;
                }

                if (this.elements.error?.hidden === false) {
                    this.notifyRuntimeError(this.elements.errorMessage?.textContent || this.t('runtimeInitFailed'));
                }
                return;
            }

            if (data.type !== 'presentation-nav') {
                return;
            }

            if (data.action === 'focus') {
                this.focusPresentationSurface();
                return;
            }

            if (data.action === 'goTo') {
                const slideNumber = Number(data.slideNumber);
                if (Number.isInteger(slideNumber)) {
                    this.goTo(Math.max(0, Math.min(this.totalSlides - 1, slideNumber - 1)), false);
                }
                return;
            }

            this.runAction(data.action);
        });
    }

    shouldIgnoreKeyboardEvent(event) {
        const target = event.target;
        if (!target) {
            return false;
        }

        if (target.isContentEditable) {
            return true;
        }

        const tagName = String(target.tagName || '').toLowerCase();
        return ['input', 'textarea', 'select'].includes(tagName);
    }

    mapKeyToAction(key) {
        if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(key)) {
            return 'next';
        }

        if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(key)) {
            return 'prev';
        }

        if (key === 'Home') {
            return 'home';
        }

        if (key === 'End') {
            return 'end';
        }

        return null;
    }

    runAction(action) {
        switch (action) {
            case 'next':
                this.next();
                break;
            case 'prev':
                this.prev();
                break;
            case 'home':
                this.goTo(0);
                break;
            case 'end':
                this.goTo(this.totalSlides - 1);
                break;
            default:
                break;
        }
    }

    resolveInitialSlide() {
        const numeric = Number(window.location.hash.replace('#', ''));
        if (Number.isInteger(numeric) && numeric > 0) {
            return Math.max(0, Math.min(this.totalSlides - 1, numeric - 1));
        }

        return 0;
    }

    focusPresentationSurface() {
        document.body.tabIndex = -1;
        window.focus();
        if (typeof document.body.focus === 'function') {
            document.body.focus({ preventScroll: true });
        }
    }

    next() {
        this.goTo(Math.min(this.currentSlide + 1, this.totalSlides - 1));
    }

    prev() {
        this.goTo(Math.max(this.currentSlide - 1, 0));
    }

    goTo(index, smooth = true) {
        if (!this.slides[index]) {
            return;
        }

        this.clearAutoplayTimer();
        this.clearSubtitleTimer();
        this.clearAudioStartTimers();
        this.currentSlide = index;
        this.syncUi(index);
        this.slides[index].scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'start',
            inline: 'nearest'
        });
    }

    syncUi(index) {
        const progress = this.totalSlides <= 1 ? 100 : (index / (this.totalSlides - 1)) * 100;
        this.elements.progressBar.style.width = `${progress}%`;
        this.elements.currentSlideNum.textContent = String(index + 1);
        this.elements.totalSlides.textContent = String(this.totalSlides);

        this.slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('is-active', slideIndex === index);
            slide.classList.toggle('has-entered', slideIndex <= index);
        });

        this.navDots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === index);
            dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
        });

        this.updateTimelineUi(index);
        this.syncAddress(index);
    }

    updateTimelineUi(index) {
        const scene = this.getOrderedScenes()[index];
        if (!scene) {
            return;
        }

        const sceneTiming = this.resolveScenePhaseTiming(scene);
        const sceneDuration = sceneTiming.totalMs;
        const totalDuration = Number(this.presentation?.timeline?.totalDurationMs);

        if (this.elements.deckTiming) {
            this.elements.deckTiming.textContent = `${this.formatDuration(sceneDuration)} / ${this.formatDuration(totalDuration)}`;
        }

        this.updateMarkerRail(index);
        this.updateAudioStatus(index);
        this.syncAudioTracks(index);
        this.updateEditCue(scene);
        this.updateSubtitle(scene, sceneDuration);
        this.scheduleAutoplay(index, sceneTiming);
        this.scheduleBottomLayoutUpdate();
    }

    getSceneDurationMs(scene) {
        if (!scene) {
            return null;
        }

        return this.resolveScenePhaseTiming(scene).totalMs || null;
    }

    getSceneStartMs(scene) {
        if (!scene) {
            return 0;
        }

        const track = this.timelineTrackBySceneId?.get(scene?.id);
        if (Number.isFinite(Number(track?.startMs))) {
            return Number(track.startMs);
        }

        return 0;
    }

    ensureAudioElement(track) {
        if (!track?.id || !track?.source) {
            return null;
        }

        let audio = this.audioElements.get(track.id);
        if (audio) {
            return audio;
        }

        audio = new Audio(track.source);
        audio.preload = 'auto';
        audio.loop = track.loop === true;
        audio.volume = Math.max(0, Math.min(1, Number(track.gain) || 1));
        audio.dataset.trackId = track.id;
        audio.addEventListener('error', () => {
            track.status = 'failed';
            this.updateAudioStatus(this.currentSlide);
        });

        this.audioElements.set(track.id, audio);
        return audio;
    }

    clearAudioStartTimers() {
        this.audioStartTimers.forEach((timer) => window.clearTimeout(timer));
        this.audioStartTimers = [];
    }

    pauseAllAudio(reset = false) {
        this.audioElements.forEach((audio) => {
            audio.pause();
            if (reset) {
                try {
                    audio.currentTime = 0;
                } catch (error) {
                    // Ignore media seek failures during reset.
                }
            }
        });
    }

    async playAudioTrack(audio, track, offsetMs = 0) {
        if (!audio || !track || !this.audioEnabled) {
            return;
        }

        audio.loop = track.loop === true;
        audio.volume = Math.max(0, Math.min(1, Number(track.gain) || 1));

        const desiredTime = Math.max(0, Number(offsetMs) || 0) / 1000;
        try {
            if (Math.abs((audio.currentTime || 0) - desiredTime) > 0.35) {
                audio.currentTime = desiredTime;
            }
        } catch (error) {
            // Some browsers block seek before metadata; playback can still proceed.
        }

        try {
            await audio.play();
            track.status = 'playing';
        } catch (error) {
            track.status = 'blocked';
            this.audioEnabled = false;
            this.updateAudioButton();
        }

        this.updateAudioStatus(this.currentSlide);
    }

    syncAudioTracks(index) {
        this.clearAudioStartTimers();

        if (!Array.isArray(this.audioTracks) || this.audioTracks.length === 0) {
            this.pauseAllAudio(true);
            return;
        }

        const scene = this.getOrderedScenes()[index];
        if (!scene) {
            this.pauseAllAudio(true);
            return;
        }

        if (!this.audioEnabled) {
            this.pauseAllAudio(false);
            this.updateAudioStatus(index);
            return;
        }

        const sceneStart = this.getSceneStartMs(scene);
        const sceneDuration = this.getSceneDurationMs(scene);
        const sceneEnd = Number.isFinite(Number(sceneDuration))
            ? sceneStart + Number(sceneDuration)
            : Number.POSITIVE_INFINITY;

        this.audioTracks.forEach((track) => {
            const audio = this.ensureAudioElement(track);
            if (!audio) {
                return;
            }

            const trackStart = Number.isFinite(Number(track.startMs)) ? Number(track.startMs) : 0;
            const startsInsideScene = trackStart >= sceneStart && trackStart < sceneEnd;
            const startedBeforeScene = trackStart < sceneStart;

            if (startedBeforeScene) {
                const offsetMs = sceneStart - trackStart;
                this.playAudioTrack(audio, track, offsetMs);
                return;
            }

            if (startsInsideScene) {
                audio.pause();
                try {
                    audio.currentTime = 0;
                } catch (error) {
                    // Ignore media seek failures during resync.
                }

                const timer = window.setTimeout(() => {
                    this.playAudioTrack(audio, track, 0);
                }, Math.max(0, trackStart - sceneStart));
                this.audioStartTimers.push(timer);
                return;
            }

            track.status = track.status === 'failed' ? 'failed' : 'ready';
            audio.pause();
            try {
                audio.currentTime = 0;
            } catch (error) {
                // Ignore media seek failures during reset.
            }
        });

        this.updateAudioStatus(index);
    }

    updateSubtitle(scene, sceneDuration) {
        if (!scene) {
            this.elements.subtitleBar.hidden = true;
            this.elements.subtitleText.textContent = '';
            this.scheduleBottomLayoutUpdate();
            return;
        }

        const subtitlePayload = this.resolveSubtitlePayload(scene);
        if (this.subtitleMode === 'off') {
            this.elements.subtitleBar.hidden = true;
            this.elements.subtitleText.textContent = '';
            this.scheduleBottomLayoutUpdate();
            return;
        }

        if (!subtitlePayload || (!subtitlePayload.text && (!Array.isArray(subtitlePayload.cues) || subtitlePayload.cues.length === 0))) {
            this.elements.subtitleBar.hidden = true;
            this.elements.subtitleText.textContent = '';
            this.scheduleBottomLayoutUpdate();
            return;
        }

        this.elements.subtitleBar.hidden = false;
        if (this.subtitleMode === 'static') {
            const staticText = asString(subtitlePayload.text, '')
                || asArray(subtitlePayload.cues).map((cue) => asString(cue?.text, '')).filter(Boolean).join(' ');
            this.elements.subtitleText.textContent = staticText;
            this.scheduleBottomLayoutUpdate();
            return;
        }

        const cues = Array.isArray(subtitlePayload.cues)
            ? subtitlePayload.cues.filter((cue) => cue?.text)
            : [];

        if (cues.length === 0) {
            this.elements.subtitleText.textContent = subtitlePayload.text;
            this.scheduleBottomLayoutUpdate();
            return;
        }

        const [firstCue, ...restCues] = cues;
        const firstCueDelay = Number.isFinite(Number(firstCue?.atMs))
            ? Math.min(Number(sceneDuration || firstCue.atMs), Number(firstCue.atMs))
            : 0;

        if (firstCueDelay > 0) {
            this.elements.subtitleText.textContent = '';
            const firstTimer = window.setTimeout(() => {
                this.elements.subtitleText.textContent = firstCue.text;
            }, Math.max(0, firstCueDelay));
            this.subtitleTimers.push(firstTimer);
        } else {
            this.elements.subtitleText.textContent = firstCue.text;
        }

        restCues.forEach((cue) => {
            const delay = Number.isFinite(Number(cue.atMs))
                ? Math.min(Number(sceneDuration || cue.atMs), Number(cue.atMs))
                : 0;
            const timer = window.setTimeout(() => {
                this.elements.subtitleText.textContent = cue.text;
            }, Math.max(0, delay));
            this.subtitleTimers.push(timer);
        });

        this.scheduleBottomLayoutUpdate();
    }

    updateEditCue(scene) {
        if (!this.elements.editCueBar || !this.elements.editCueList) {
            return;
        }

        if (!scene) {
            this.elements.editCueBar.hidden = true;
            this.elements.editCueList.innerHTML = '';
            this.scheduleBottomLayoutUpdate();
            return;
        }

        const sceneStart = this.getSceneStartMs(scene);
        const editMarkers = this.getSceneCueMarkers(scene, 'edit');
        if (editMarkers.length === 0) {
            this.elements.editCueBar.hidden = true;
            this.elements.editCueList.innerHTML = '';
            this.scheduleBottomLayoutUpdate();
            return;
        }

        this.elements.editCueBar.hidden = false;
        this.elements.editCueList.innerHTML = editMarkers.map((marker) => {
            const relativeMs = Math.max(0, Number(marker.atMs || 0) - sceneStart);
            const anchorLabel = marker.anchor && marker.anchor !== 'start'
                ? `<span class="edit-cue-anchor">${escapeHtml(this.formatMarkerAnchor(marker.anchor))}</span>`
                : '';

            return `
                <span class="edit-cue-chip">
                    <span class="edit-cue-time">${escapeHtml(this.formatDuration(relativeMs))}</span>
                    <span class="edit-cue-label">${escapeHtml(marker.label)}</span>
                    ${anchorLabel}
                </span>
            `;
        }).join('');

        this.scheduleBottomLayoutUpdate();
    }

    scheduleAutoplay(index, sceneTiming) {
        const timing = sceneTiming && typeof sceneTiming === 'object'
            ? sceneTiming
            : { advanceMs: sceneTiming, totalMs: sceneTiming };
        const advanceMs = Number.isFinite(Number(timing?.advanceMs))
            ? Number(timing.advanceMs)
            : Number(timing?.totalMs);

        if (!this.autoplayEnabled || !Number.isFinite(Number(advanceMs)) || Number(advanceMs) <= 0) {
            return;
        }

        if (index >= this.totalSlides - 1) {
            return;
        }

        this.autoplayTimer = window.setTimeout(() => {
            this.next();
        }, Number(advanceMs));
    }

    clearAutoplayTimer() {
        window.clearTimeout(this.autoplayTimer);
        this.autoplayTimer = null;
    }

    clearSubtitleTimer() {
        this.subtitleTimers.forEach((timer) => window.clearTimeout(timer));
        this.subtitleTimers = [];
    }

    toggleAutoplay(forceValue) {
        this.autoplayEnabled = typeof forceValue === 'boolean'
            ? forceValue
            : !this.autoplayEnabled;
        this.updateAutoplayButton();
        this.clearAutoplayTimer();
        this.scheduleAutoplay(this.currentSlide, this.resolveScenePhaseTiming(this.getOrderedScenes()[this.currentSlide]));
    }

    updateAutoplayButton() {
        if (!this.elements.autoplayToggle) {
            return;
        }

        this.elements.autoplayToggle.textContent = this.autoplayEnabled ? 'Auto-play On' : 'Auto-play Off';
        this.elements.autoplayToggle.classList.toggle('is-active', this.autoplayEnabled);
    }

    toggleAudio(forceValue) {
        this.audioEnabled = typeof forceValue === 'boolean'
            ? forceValue
            : !this.audioEnabled;
        this.updateAudioButton();

        if (!this.audioEnabled) {
            this.clearAudioStartTimers();
            this.pauseAllAudio(false);
            this.updateAudioStatus(this.currentSlide);
            return;
        }

        this.syncAudioTracks(this.currentSlide);
    }

    updateAudioButton() {
        if (!this.elements.audioToggle) {
            return;
        }

        const hasAudio = Array.isArray(this.audioTracks) && this.audioTracks.length > 0;
        this.elements.audioToggle.hidden = !hasAudio;
        if (!hasAudio) {
            return;
        }

        this.elements.audioToggle.textContent = this.audioEnabled ? 'Audio On' : 'Audio Off';
        this.elements.audioToggle.classList.toggle('is-active', this.audioEnabled);
    }

    getNextSubtitleMode(currentMode) {
        switch (currentMode) {
            case 'off':
                return 'voiceover-placeholder';
            case 'static':
                return 'off';
            case 'voiceover-placeholder':
            default:
                return 'static';
        }
    }

    toggleSubtitleMode(forceValue) {
        this.subtitleMode = typeof forceValue === 'string'
            ? forceValue
            : this.getNextSubtitleMode(this.subtitleMode);
        this.updateSubtitleModeButton();
        this.clearSubtitleTimer();
        this.updateSubtitle(this.getOrderedScenes()[this.currentSlide], this.getSceneDurationMs(this.getOrderedScenes()[this.currentSlide]));
    }

    updateSubtitleModeButton() {
        if (!this.elements.subtitleToggle) {
            return;
        }

        const label = this.subtitleMode === 'off'
            ? 'Subtitles: Off'
            : this.subtitleMode === 'static'
                ? 'Subtitles: Static'
                : 'Subtitles: Voiceover';
        this.elements.subtitleToggle.textContent = label;
        this.elements.subtitleToggle.classList.toggle('is-active', this.subtitleMode !== 'off');
    }

    updateMarkerRail(index) {
        if (!this.elements.markerRail) {
            return;
        }

        Array.from(this.elements.markerRail.querySelectorAll('.marker-chip')).forEach((button) => {
            button.classList.toggle('is-active', Number(button.dataset.markerSlide) === index);
        });
    }

    updateAudioStatus(index) {
        if (!this.elements.deckAudioStatus) {
            return;
        }

        if (!Array.isArray(this.audioTracks) || this.audioTracks.length === 0) {
            this.elements.deckAudioStatus.hidden = true;
            this.elements.deckAudioStatus.textContent = 'No Audio';
            return;
        }

        const scene = this.getOrderedScenes()[index];
        const track = this.timelineTrackBySceneId?.get(scene?.id);
        const sceneStart = Number.isFinite(Number(track?.startMs)) ? Number(track.startMs) : 0;
        const sceneDuration = this.getSceneDurationMs(scene);
        const sceneEnd = Number.isFinite(Number(sceneDuration)) ? sceneStart + Number(sceneDuration) : Number.POSITIVE_INFINITY;
        const activeTracks = this.audioTracks.filter((audioTrack) => {
            if (audioTrack.status === 'playing') {
                return true;
            }

            return audioTrack.startMs >= sceneStart && audioTrack.startMs < sceneEnd;
        });
        const nextTrack = this.audioTracks.find((audioTrack) => audioTrack.startMs >= sceneStart);
        const label = activeTracks[0]?.label || nextTrack?.label || this.audioTracks[0]?.label || 'Audio Ready';

        this.elements.deckAudioStatus.hidden = false;
        if (!this.audioEnabled) {
            this.elements.deckAudioStatus.textContent = `Audio Ready: ${label}`;
            return;
        }

        this.elements.deckAudioStatus.textContent = activeTracks.length > 0
            ? `Audio: ${label}`
            : `Audio Queue: ${label}`;
    }

    syncAddress(index) {
        const slideNumber = index + 1;

        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'presentation-state',
                presentationId: this.presentationId,
                sessionId: this.sessionId,
                slide: slideNumber,
                totalSlides: this.totalSlides
            }, '*');
            return;
        }

        history.replaceState(null, '', `#${slideNumber}`);
    }

    showShell() {
        this.elements.loading.hidden = true;
        this.elements.error.hidden = true;
        this.elements.shell.hidden = false;
        document.title = `${this.presentation?.meta?.title || 'Presentation'} Runtime`;
        this.scheduleBottomLayoutUpdate();
    }

    showError(message) {
        this.clearAutoplayTimer();
        this.clearSubtitleTimer();
        this.clearAudioStartTimers();
        this.pauseAllAudio(false);
        this.elements.loading.hidden = true;
        this.elements.shell.hidden = true;
        this.elements.error.hidden = false;
        this.elements.errorMessage.textContent = message;
        document.title = 'Presentation Runtime Error';
    }

    notifyRuntimeReady() {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'presentation-runtime-ready',
                presentationId: this.presentationId,
                sessionId: this.sessionId,
                totalSlides: this.totalSlides
            }, '*');
        }
    }

    notifyRuntimeError(message) {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'presentation-runtime-error',
                presentationId: this.presentationId,
                sessionId: this.sessionId,
                message
            }, '*');
        }
    }

    handleMediaError(target) {
        const card = target?.closest?.('.scene-media-card');
        if (!card) {
            return;
        }

        card.innerHTML = '<div class="media-placeholder">素材加载失败，请检查链接或资源路径。</div>';
    }
    async init() {
        if (!this.presentationId) {
            this.showError(this.t('missingPresentationId'));
            this.notifyRuntimeError(this.t('missingPresentationId'));
            return;
        }

        try {
            const presentation = await this.fetchPresentation();
            this.presentation = presentation;
            this.applyTheme(presentation.theme?.presetId);
            this.renderPresentation(presentation);
            this.bindTimelineControls();
            this.setupKeyboard();
            this.setupTouchNav();
            this.setupWheelNav();
            this.setupMessageBridge();
            this.setupObserver();
            this.focusPresentationSurface();
            this.autoplayEnabled = this.resolveInitialAutoplay();
            this.subtitleMode = this.resolveInitialSubtitleMode();
            this.audioEnabled = this.resolveInitialAudioEnabled();
            this.updateAudioButton();
            this.updateAutoplayButton();
            this.updateSubtitleModeButton();
            this.goTo(this.resolveInitialSlide(), false);
            this.showShell();
            this.notifyRuntimeReady();
        } catch (error) {
            this.showError(error.message || this.t('runtimeInitFailed'));
            this.notifyRuntimeError(error.message || this.t('runtimeInitFailed'));
        }
    }

    async fetchPresentation() {
        const response = await fetch(`/api/presentations/${this.presentationId}/spec`, {
            cache: 'no-store'
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || this.t('readSpecFailed'));
        }

        if (!Array.isArray(data.scenes) || data.scenes.length === 0) {
            throw new Error(this.t('noScenes'));
        }

        return data;
    }

    buildTimelineMarkerList() {
        const scenes = this.getOrderedScenes();
        const sceneTimings = scenes.map((scene, index) => {
            const startMs = this.getSceneStartMs(scene);
            const phaseTiming = this.resolveScenePhaseTiming(scene);
            const totalMs = Number.isFinite(Number(phaseTiming?.totalMs)) ? Number(phaseTiming.totalMs) : 0;
            const advanceMs = Number.isFinite(Number(phaseTiming?.advanceMs)) ? Number(phaseTiming.advanceMs) : totalMs;

            return {
                sceneId: asString(scene?.id, ''),
                sceneIndex: index,
                startMs,
                advanceAtMs: startMs + Math.max(0, advanceMs),
                endMs: startMs + Math.max(0, totalMs)
            };
        });
        const sceneIndexById = new Map(sceneTimings.map((sceneTiming) => [sceneTiming.sceneId, sceneTiming.sceneIndex]));
        const inferMarkerAnchor = (marker, sceneTiming) => {
            const explicitAnchor = this.normalizeMarkerAnchor(marker?.anchor || marker?.phase);
            if (explicitAnchor) {
                return explicitAnchor;
            }

            const atMs = marker?.atMs !== null && marker?.atMs !== undefined && Number.isFinite(Number(marker?.atMs))
                ? Number(marker.atMs)
                : null;
            if (atMs === null || !sceneTiming) {
                return sceneTiming ? 'start' : '';
            }

            if (atMs === sceneTiming.startMs) {
                return 'start';
            }

            if (atMs === sceneTiming.advanceAtMs) {
                return 'advance';
            }

            if (atMs === sceneTiming.endMs) {
                return 'exit';
            }

            return '';
        };
        const inferMarkerKind = (marker) => {
            return this.normalizeMarkerKind(marker?.kind || marker?.type || marker?.use || marker?.role) || 'navigation';
        };
        const resolveMarkerAtMs = (marker, sceneTiming) => {
            if (marker?.atMs !== null && marker?.atMs !== undefined && Number.isFinite(Number(marker?.atMs))) {
                return Number(marker.atMs);
            }

            if (!sceneTiming) {
                return 0;
            }

            switch (inferMarkerAnchor(marker, sceneTiming)) {
                case 'advance':
                    return sceneTiming.advanceAtMs;
                case 'exit':
                    return sceneTiming.endMs;
                case 'start':
                default:
                    return sceneTiming.startMs;
            }
        };
        const findSceneTimingForMarker = (marker, fallbackIndex) => {
            const explicitSceneId = asString(marker?.sceneId, '');
            if (explicitSceneId) {
                const byId = sceneTimings.find((sceneTiming) => sceneTiming.sceneId === explicitSceneId);
                if (byId) {
                    return byId;
                }
            }

            if (marker?.sceneIndex !== null
                && marker?.sceneIndex !== undefined
                && Number.isInteger(Number(marker?.sceneIndex))) {
                const normalizedIndex = Math.max(0, Math.min(sceneTimings.length - 1, Number(marker.sceneIndex)));
                return sceneTimings[normalizedIndex] || null;
            }

            const atMs = marker?.atMs !== null && marker?.atMs !== undefined && Number.isFinite(Number(marker?.atMs))
                ? Number(marker.atMs)
                : null;
            if (atMs !== null) {
                const exactStart = sceneTimings.find((sceneTiming) => atMs === sceneTiming.startMs);
                if (exactStart) {
                    return exactStart;
                }

                const containing = sceneTimings.find((sceneTiming) => atMs >= sceneTiming.startMs && atMs < sceneTiming.endMs);
                if (containing) {
                    return containing;
                }

                const preceding = [...sceneTimings].reverse().find((sceneTiming) => atMs >= sceneTiming.startMs);
                if (preceding) {
                    return preceding;
                }
            }

            const normalizedFallback = Math.max(0, Math.min(sceneTimings.length - 1, fallbackIndex));
            return sceneTimings[normalizedFallback] || null;
        };
        const explicitMarkers = asArray(this.presentation?.timeline?.markers)
            .map((marker, index) => {
                const sceneTiming = findSceneTimingForMarker(marker, index);
                const sceneIndex = sceneTiming?.sceneIndex ?? sceneIndexById.get(marker?.sceneId);
                const kind = inferMarkerKind(marker);
                const anchor = inferMarkerAnchor(marker, sceneTiming);
                const atMs = resolveMarkerAtMs(marker, sceneTiming);
                return {
                    id: asString(marker?.id, `marker_${index + 1}`),
                    label: asString(marker?.label, `${this.t('marker')} ${index + 1}`),
                    sceneId: asString(marker?.sceneId, '') || sceneTiming?.sceneId || '',
                    sceneIndex: Number.isInteger(sceneIndex) ? sceneIndex : index,
                    kind,
                    anchor,
                    atMs,
                    advanceAtMs: sceneTiming?.advanceAtMs ?? atMs,
                    endMs: sceneTiming?.endMs ?? atMs
                };
            })
            .filter((marker) => Number.isInteger(marker.sceneIndex))
            .sort((left, right) => {
                if (left.atMs !== right.atMs) {
                    return left.atMs - right.atMs;
                }

                if (left.sceneIndex !== right.sceneIndex) {
                    return left.sceneIndex - right.sceneIndex;
                }

                if (this.getMarkerAnchorOrder(left.anchor) !== this.getMarkerAnchorOrder(right.anchor)) {
                    return this.getMarkerAnchorOrder(left.anchor) - this.getMarkerAnchorOrder(right.anchor);
                }

                return this.getMarkerKindOrder(left.kind) - this.getMarkerKindOrder(right.kind);
            });

        if (explicitMarkers.length > 0) {
            return explicitMarkers;
        }

        return scenes.map((scene, index) => ({
            id: `marker_scene_${index + 1}`,
            label: asString(scene?.title || scene?.subtitle, `${this.t('scene')} ${index + 1}`),
            sceneId: asString(scene?.id, ''),
            sceneIndex: index,
            kind: 'navigation',
            anchor: 'start',
            atMs: sceneTimings[index]?.startMs ?? 0,
            advanceAtMs: sceneTimings[index]?.advanceAtMs ?? (sceneTimings[index]?.startMs ?? 0),
            endMs: sceneTimings[index]?.endMs ?? (sceneTimings[index]?.startMs ?? 0)
        }));
    }

    renderPresentation() {
        const scenes = this.getOrderedScenes();
        const assetMap = this.buildAssetMap();
        this.voiceoverBySceneId = this.buildVoiceoverMap();
        this.timelineTrackBySceneId = this.buildTimelineTrackMap();
        this.audioTracks = this.buildAudioTracks(assetMap);
        this.timelineMarkers = this.buildTimelineMarkerList();

        this.elements.deck.innerHTML = scenes
            .map((scene, index) => this.renderScene(scene, index, assetMap))
            .join('');
        this.elements.navDots.innerHTML = scenes.map((scene, index) => `
            <button
                class="nav-dot${index === 0 ? ' active' : ''}"
                type="button"
                data-slide-index="${index}"
                aria-label="${escapeHtml(this.t('navToSlide', { index: index + 1 }))}"
            ></button>
        `).join('');

        this.slides = Array.from(this.elements.deck.querySelectorAll('.runtime-slide'));
        this.navDots = Array.from(this.elements.navDots.querySelectorAll('.nav-dot'));
        this.totalSlides = this.slides.length;
        this.elements.totalSlides.textContent = String(this.totalSlides);
        this.setupNavDots();
        this.renderMarkerRail();
    }

    renderMarkerRail() {
        if (!this.elements.markerRail) {
            return;
        }

        if (!Array.isArray(this.timelineMarkers) || this.timelineMarkers.length === 0) {
            this.elements.markerRail.hidden = true;
            this.elements.markerRail.innerHTML = '';
            return;
        }

        this.elements.markerRail.hidden = false;
        this.elements.markerRail.innerHTML = this.timelineMarkers.map((marker) => `
            <button
                class="marker-chip${marker.sceneIndex === this.currentSlide ? ' is-active' : ''}"
                type="button"
                data-marker-slide="${marker.sceneIndex}"
                data-marker-kind="${escapeHtml(marker.kind || '')}"
                data-marker-anchor="${escapeHtml(marker.anchor || '')}"
                data-marker-at="${Math.max(0, Number(marker.atMs) || 0)}"
                aria-label="${escapeHtml(this.t('navToMarker', { label: `${marker.label} (${this.formatDuration(marker.atMs)}${marker.anchor && marker.anchor !== 'start' ? ` · ${this.formatMarkerAnchor(marker.anchor)}` : ''}${marker.kind && marker.kind !== 'navigation' ? ` · ${this.formatMarkerKind(marker.kind)}` : ''})` }))}"
                title="${escapeHtml(`${marker.label} · ${this.formatDuration(marker.atMs)}${marker.anchor && marker.anchor !== 'start' ? ` · ${this.formatMarkerAnchor(marker.anchor)}` : ''}${marker.kind && marker.kind !== 'navigation' ? ` · ${this.formatMarkerKind(marker.kind)}` : ''}`)}"
            >
                <span class="marker-chip-time">${escapeHtml(this.formatDuration(marker.atMs))}</span>
                <span class="marker-chip-label">${escapeHtml(marker.label)}</span>
                ${marker.anchor && marker.anchor !== 'start' ? `<span class="marker-chip-anchor">${escapeHtml(this.formatMarkerAnchor(marker.anchor))}</span>` : ''}
                ${marker.kind && marker.kind !== 'navigation' ? `<span class="marker-chip-kind">${escapeHtml(this.formatMarkerKind(marker.kind))}</span>` : ''}
            </button>
        `).join('');

        Array.from(this.elements.markerRail.querySelectorAll('[data-marker-slide]')).forEach((button) => {
            button.addEventListener('click', () => {
                const slideIndex = Number(button.dataset.markerSlide);
                if (Number.isInteger(slideIndex)) {
                    this.goTo(Math.max(0, Math.min(this.totalSlides - 1, slideIndex)));
                }
            });
        });
    }

    renderTextColumn(scene, elements, sceneMotion, sceneTransition) {
        const rendered = [];
        const kind = asString(scene?.kind, 'content');
        let motionOrder = 1;

        if (scene?.title && !elements.some((element) => element?.type === 'heading')) {
            rendered.push(`
                <h1 class="scene-heading motion-target"${this.buildMotionAttributes(sceneMotion.heading, motionOrder++, {
                    delayMs: sceneTransition?.contentDelayMs,
                    durationMs: sceneTransition?.motionDurationMs,
                    staggerStepMs: sceneTransition?.staggerStepMs
                })}>
                    ${escapeHtml(scene.title)}
                </h1>
            `);
        }

        if (kind === 'end') {
            rendered.push(`
                <span class="scene-kicker motion-target"${this.buildMotionAttributes(sceneMotion.subtitle, motionOrder++, {
                    delayMs: sceneTransition?.contentDelayMs,
                    durationMs: sceneTransition?.motionDurationMs,
                    staggerStepMs: sceneTransition?.staggerStepMs
                })}>
                    ${this.t('closingScene')}
                </span>
            `);
        } else if (kind === 'title') {
            rendered.push(`
                <span class="scene-kicker motion-target"${this.buildMotionAttributes(sceneMotion.subtitle, motionOrder++, {
                    delayMs: sceneTransition?.contentDelayMs,
                    durationMs: sceneTransition?.motionDurationMs,
                    staggerStepMs: sceneTransition?.staggerStepMs
                })}>
                    ${this.t('openingScene')}
                </span>
            `);
        }

        elements.forEach((element) => {
            rendered.push(this.renderTextElement(element, sceneMotion, sceneTransition, motionOrder));
            motionOrder += 1;
        });

        if (rendered.length === 0) {
            rendered.push(`<p class="scene-empty motion-target" data-motion="fade">${escapeHtml(this.t('emptyScene'))}</p>`);
        }

        return rendered.join('');
    }

    renderMediaElement(element, assetMap, sceneMotion, sceneTransition, mediaIndex) {
        const asset = assetMap.get(element?.mediaAssetId);
        if (!asset) {
            return this.renderMediaPlaceholder(this.t('assetMissing'));
        }

        const url = this.resolveAssetUrl(asset);
        if (!url) {
            return this.renderMediaPlaceholder(this.t('assetUrlMissing'));
        }

        const props = element?.props && typeof element.props === 'object' ? element.props : {};
        const meta = asset.meta && typeof asset.meta === 'object' ? asset.meta : {};
        const caption = asString(props.caption || meta.caption || element?.content, '');
        const alt = asString(props.alt || meta.alt || caption, '');
        const poster = this.resolvePosterUrl(props.poster || meta.poster);
        const motionAttrs = this.buildMotionAttributes(this.resolveElementMotion(element, sceneMotion), mediaIndex + 2, {
            delayMs: sceneTransition?.contentDelayMs,
            durationMs: sceneTransition?.motionDurationMs,
            staggerStepMs: sceneTransition?.staggerStepMs
        });

        if (asset.type === 'video') {
            return `
                <figure class="scene-media-card motion-target"${motionAttrs}>
                    <video
                        src="${escapeHtml(url)}"
                        ${poster ? `poster="${escapeHtml(poster)}"` : ''}
                        ${props.autoplay ? 'autoplay' : ''}
                        ${props.loop ? 'loop' : ''}
                        muted
                        playsinline
                        preload="metadata"
                        controls
                        onerror="window.presentationRuntime.handleMediaError(this)"
                    ></video>
                    ${caption ? `<figcaption class="media-caption">${escapeHtml(caption)}</figcaption>` : ''}
                </figure>
            `;
        }

        return `
            <figure class="scene-media-card motion-target"${motionAttrs}>
                <img
                    src="${escapeHtml(url)}"
                    alt="${escapeHtml(alt)}"
                    loading="lazy"
                    onerror="window.presentationRuntime.handleMediaError(this)"
                />
                ${caption ? `<figcaption class="media-caption">${escapeHtml(caption)}</figcaption>` : ''}
            </figure>
        `;
    }

    renderMediaPlaceholder(message) {
        return `
            <div class="scene-media-card">
                <div class="media-placeholder">${escapeHtml(message)}</div>
            </div>
        `;
    }

    updateAutoplayButton() {
        if (!this.elements.autoplayToggle) {
            return;
        }

        this.elements.autoplayToggle.textContent = this.autoplayEnabled ? this.t('autoplayOn') : this.t('autoplayOff');
        this.elements.autoplayToggle.classList.toggle('is-active', this.autoplayEnabled);
    }

    updateAudioButton() {
        if (!this.elements.audioToggle) {
            return;
        }

        const hasAudio = Array.isArray(this.audioTracks) && this.audioTracks.length > 0;
        this.elements.audioToggle.hidden = !hasAudio;
        if (!hasAudio) {
            this.scheduleBottomLayoutUpdate();
            return;
        }

        this.elements.audioToggle.textContent = this.audioEnabled ? this.t('audioOn') : this.t('audioOff');
        this.elements.audioToggle.classList.toggle('is-active', this.audioEnabled);
        this.scheduleBottomLayoutUpdate();
    }

    updateSubtitleModeButton() {
        if (!this.elements.subtitleToggle) {
            return;
        }

        const label = this.subtitleMode === 'off'
            ? this.t('subtitlesOff')
            : this.subtitleMode === 'static'
                ? this.t('subtitlesStatic')
                : this.t('subtitlesVoiceover');
        this.elements.subtitleToggle.textContent = label;
        this.elements.subtitleToggle.classList.toggle('is-active', this.subtitleMode !== 'off');
        this.scheduleBottomLayoutUpdate();
    }

    updateAudioStatus(index) {
        if (!this.elements.deckAudioStatus) {
            return;
        }

        if (!Array.isArray(this.audioTracks) || this.audioTracks.length === 0) {
            this.elements.deckAudioStatus.hidden = true;
            this.elements.deckAudioStatus.textContent = this.t('noAudio');
            this.scheduleBottomLayoutUpdate();
            return;
        }

        const scene = this.getOrderedScenes()[index];
        const track = this.timelineTrackBySceneId?.get(scene?.id);
        const sceneStart = Number.isFinite(Number(track?.startMs)) ? Number(track.startMs) : 0;
        const sceneDuration = this.getSceneDurationMs(scene);
        const sceneEnd = Number.isFinite(Number(sceneDuration)) ? sceneStart + Number(sceneDuration) : Number.POSITIVE_INFINITY;
        const activeTracks = this.audioTracks.filter((audioTrack) => {
            if (audioTrack.status === 'playing') {
                return true;
            }

            return audioTrack.startMs >= sceneStart && audioTrack.startMs < sceneEnd;
        });
        const nextTrack = this.audioTracks.find((audioTrack) => audioTrack.startMs >= sceneStart);
        const label = activeTracks[0]?.label || nextTrack?.label || this.audioTracks[0]?.label || this.t('audioReadyFallback');

        this.elements.deckAudioStatus.hidden = false;
        if (!this.audioEnabled) {
            this.elements.deckAudioStatus.textContent = this.t('audioReady', { label });
            this.scheduleBottomLayoutUpdate();
            return;
        }

        this.elements.deckAudioStatus.textContent = activeTracks.length > 0
            ? this.t('audioPlaying', { label })
            : this.t('audioQueue', { label });
        this.scheduleBottomLayoutUpdate();
    }

    showShell() {
        this.elements.loading.hidden = true;
        this.elements.error.hidden = true;
        this.elements.shell.hidden = false;
        document.title = `${this.presentation?.meta?.title || 'Presentation'} Runtime`;
    }

    showError(message) {
        this.clearAutoplayTimer();
        this.clearSubtitleTimer();
        this.clearAudioStartTimers();
        this.pauseAllAudio(false);
        this.elements.loading.hidden = true;
        this.elements.shell.hidden = true;
        this.elements.error.hidden = false;
        this.elements.errorMessage.textContent = message;
        document.title = `${this.t('runtimeErrorTitle')} | Presentation Runtime`;
    }

    handleMediaError(target) {
        const card = target?.closest?.('.scene-media-card');
        if (!card) {
            return;
        }

        card.innerHTML = `<div class="media-placeholder">${escapeHtml(this.t('assetLoadFailed'))}</div>`;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.presentationRuntime = new PresentationRuntime();
});
