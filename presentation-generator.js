const PptxGenJS = require('pptxgenjs');

const DEFAULT_STYLE_ID = 'bold-signal';
const SUPPORTED_TYPES = new Set(['title', 'content', 'features', 'quote', 'code', 'end']);

const STYLE_THEMES = {
    'bold-signal': {
        id: 'bold-signal',
        name: 'Bold Signal',
        background: '#0b1120',
        surface: '#111827',
        surfaceAlt: '#172033',
        border: 'rgba(148, 163, 184, 0.22)',
        text: '#f8fafc',
        muted: '#cbd5e1',
        accent: '#f97316',
        accentSoft: 'rgba(249, 115, 22, 0.18)',
        accentStrong: '#fb923c',
        hero: 'radial-gradient(circle at top left, rgba(249, 115, 22, 0.22), transparent 38%), linear-gradient(160deg, #0b1120 0%, #111827 100%)',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'electric-studio': {
        id: 'electric-studio',
        name: 'Electric Studio',
        background: '#0f172a',
        surface: '#111c33',
        surfaceAlt: '#18233d',
        border: 'rgba(96, 165, 250, 0.22)',
        text: '#eff6ff',
        muted: '#bfdbfe',
        accent: '#3b82f6',
        accentSoft: 'rgba(59, 130, 246, 0.18)',
        accentStrong: '#60a5fa',
        hero: 'radial-gradient(circle at top right, rgba(56, 189, 248, 0.18), transparent 32%), linear-gradient(150deg, #081224 0%, #10203f 100%)',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'creative-voltage': {
        id: 'creative-voltage',
        name: 'Creative Voltage',
        background: '#061826',
        surface: '#0d2740',
        surfaceAlt: '#123455',
        border: 'rgba(34, 211, 238, 0.2)',
        text: '#f0fdff',
        muted: '#bae6fd',
        accent: '#22d3ee',
        accentSoft: 'rgba(34, 211, 238, 0.18)',
        accentStrong: '#67e8f9',
        hero: 'radial-gradient(circle at 20% 10%, rgba(34, 211, 238, 0.2), transparent 28%), linear-gradient(180deg, #061826 0%, #0c2f4e 100%)',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'dark-botanical': {
        id: 'dark-botanical',
        name: 'Dark Botanical',
        background: '#111315',
        surface: '#1b201d',
        surfaceAlt: '#222925',
        border: 'rgba(187, 247, 208, 0.18)',
        text: '#f7fee7',
        muted: '#d9f99d',
        accent: '#84cc16',
        accentSoft: 'rgba(132, 204, 22, 0.16)',
        accentStrong: '#a3e635',
        hero: 'radial-gradient(circle at top, rgba(132, 204, 22, 0.14), transparent 32%), linear-gradient(160deg, #101313 0%, #1b201d 100%)',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'notebook-tabs': {
        id: 'notebook-tabs',
        name: 'Notebook Tabs',
        background: '#f7f4ec',
        surface: '#fffdfa',
        surfaceAlt: '#efe8da',
        border: 'rgba(161, 98, 7, 0.16)',
        text: '#1f2937',
        muted: '#6b7280',
        accent: '#ea580c',
        accentSoft: 'rgba(234, 88, 12, 0.12)',
        accentStrong: '#f97316',
        hero: 'linear-gradient(160deg, #f7f4ec 0%, #efe8da 100%)',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'pastel-geometry': {
        id: 'pastel-geometry',
        name: 'Pastel Geometry',
        background: '#edf6ff',
        surface: '#ffffff',
        surfaceAlt: '#dbeafe',
        border: 'rgba(59, 130, 246, 0.16)',
        text: '#172554',
        muted: '#475569',
        accent: '#7c3aed',
        accentSoft: 'rgba(124, 58, 237, 0.12)',
        accentStrong: '#8b5cf6',
        hero: 'linear-gradient(135deg, #edf6ff 0%, #ddd6fe 100%)',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'split-pastel': {
        id: 'split-pastel',
        name: 'Split Pastel',
        background: '#fff8f5',
        surface: '#ffffff',
        surfaceAlt: '#f5e7fb',
        border: 'rgba(236, 72, 153, 0.14)',
        text: '#3f2348',
        muted: '#6d4c74',
        accent: '#ec4899',
        accentSoft: 'rgba(236, 72, 153, 0.12)',
        accentStrong: '#f472b6',
        hero: 'linear-gradient(135deg, #fff1f2 0%, #f3e8ff 100%)',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'vintage-editorial': {
        id: 'vintage-editorial',
        name: 'Vintage Editorial',
        background: '#f5f1e8',
        surface: '#fffcf6',
        surfaceAlt: '#ede4d4',
        border: 'rgba(146, 64, 14, 0.14)',
        text: '#2f241d',
        muted: '#6b5b4d',
        accent: '#b45309',
        accentSoft: 'rgba(180, 83, 9, 0.12)',
        accentStrong: '#d97706',
        hero: 'linear-gradient(160deg, #f5f1e8 0%, #ede4d4 100%)',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'neon-cyber': {
        id: 'neon-cyber',
        name: 'Neon Cyber',
        background: '#09090f',
        surface: '#11111b',
        surfaceAlt: '#181827',
        border: 'rgba(45, 212, 191, 0.2)',
        text: '#ecfeff',
        muted: '#a5f3fc',
        accent: '#2dd4bf',
        accentSoft: 'rgba(45, 212, 191, 0.18)',
        accentStrong: '#5eead4',
        hero: 'radial-gradient(circle at top right, rgba(45, 212, 191, 0.18), transparent 34%), linear-gradient(180deg, #09090f 0%, #151528 100%)',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'terminal-green': {
        id: 'terminal-green',
        name: 'Terminal Green',
        background: '#0d1117',
        surface: '#11161d',
        surfaceAlt: '#161b22',
        border: 'rgba(34, 197, 94, 0.2)',
        text: '#dcfce7',
        muted: '#86efac',
        accent: '#22c55e',
        accentSoft: 'rgba(34, 197, 94, 0.16)',
        accentStrong: '#4ade80',
        hero: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
        displayFont: '"JetBrains Mono", monospace',
        bodyFont: '"JetBrains Mono", monospace',
        codeFont: '"JetBrains Mono", monospace'
    },
    'swiss-modern': {
        id: 'swiss-modern',
        name: 'Swiss Modern',
        background: '#ffffff',
        surface: '#ffffff',
        surfaceAlt: '#f4f4f5',
        border: 'rgba(15, 23, 42, 0.12)',
        text: '#0f172a',
        muted: '#475569',
        accent: '#ef4444',
        accentSoft: 'rgba(239, 68, 68, 0.12)',
        accentStrong: '#f87171',
        hero: 'linear-gradient(160deg, #ffffff 0%, #f4f4f5 100%)',
        displayFont: '"Clash Display", sans-serif',
        bodyFont: '"Satoshi", sans-serif',
        codeFont: '"JetBrains Mono", monospace'
    },
    'paper-ink': {
        id: 'paper-ink',
        name: 'Paper & Ink',
        background: '#f7f5ee',
        surface: '#fffdf7',
        surfaceAlt: '#ede9dd',
        border: 'rgba(87, 83, 78, 0.14)',
        text: '#26231f',
        muted: '#57534e',
        accent: '#8b5e34',
        accentSoft: 'rgba(139, 94, 52, 0.12)',
        accentStrong: '#a16207',
        hero: 'linear-gradient(160deg, #f7f5ee 0%, #ede9dd 100%)',
        displayFont: '"Clash Display", serif',
        bodyFont: '"Satoshi", serif',
        codeFont: '"JetBrains Mono", monospace'
    }
};

function getTheme(styleId) {
    return STYLE_THEMES[styleId] || STYLE_THEMES[DEFAULT_STYLE_ID];
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function sanitizeText(value, maxLength = 180) {
    const text = String(value || '')
        .replace(/\r/g, '\n')
        .replace(/\t/g, ' ')
        .replace(/\u00a0/g, ' ')
        .replace(/\s*\n\s*/g, '\n')
        .replace(/[ ]{2,}/g, ' ')
        .trim();

    if (!text) {
        return '';
    }

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength - 1).trimEnd()}...`;
}

function chunkArray(items, size) {
    const chunks = [];
    for (let index = 0; index < items.length; index += size) {
        chunks.push(items.slice(index, index + size));
    }
    return chunks;
}

function normalizeItems(rawContent, maxLength = 180) {
    if (Array.isArray(rawContent)) {
        return rawContent
            .map((item) => sanitizeText(item, maxLength))
            .filter(Boolean);
    }

    if (typeof rawContent === 'string') {
        return rawContent
            .split(/\n+/)
            .map((item) => sanitizeText(item, maxLength))
            .filter(Boolean);
    }

    if (rawContent && typeof rawContent === 'object') {
        return Object.values(rawContent)
            .map((item) => sanitizeText(item, maxLength))
            .filter(Boolean);
    }

    return [];
}

function inferSlideType(slide, index, total) {
    const rawType = String(slide?.type || '').trim().toLowerCase();
    if (SUPPORTED_TYPES.has(rawType)) {
        return rawType;
    }

    if (index === 0) {
        return 'title';
    }

    if (index === total - 1) {
        return 'end';
    }

    return 'content';
}

function buildNormalizedSlide(rawSlide, index, total, deckTitle) {
    const type = inferSlideType(rawSlide, index, total);
    const items = normalizeItems(
        rawSlide?.content || rawSlide?.items || rawSlide?.points || rawSlide?.bullets,
        type === 'code' ? 240 : 180
    );

    return {
        type,
        title: sanitizeText(rawSlide?.title || (type === 'title' ? deckTitle : `Slide ${index + 1}`), 90),
        subtitle: sanitizeText(rawSlide?.subtitle || '', 140),
        content: items
    };
}

function splitDenseSlide(slide) {
    const limits = {
        title: 3,
        content: 5,
        features: 4,
        quote: 2,
        code: 12,
        end: 4
    };

    const limit = limits[slide.type] || limits.content;
    if (slide.content.length <= limit) {
        return [slide];
    }

    return chunkArray(slide.content, limit).map((contentChunk, chunkIndex) => ({
        ...slide,
        title: chunkIndex === 0 ? slide.title : `${slide.title} (continued)`,
        content: contentChunk
    }));
}

function normalizeOutline(inputOutline = {}) {
    const fallbackTitle = sanitizeText(inputOutline.title || inputOutline.topic || 'Untitled presentation', 90);
    const fallbackSubtitle = sanitizeText(inputOutline.subtitle || '', 140);
    const rawSlides = Array.isArray(inputOutline.slides) ? inputOutline.slides : [];

    const normalizedSlides = rawSlides
        .map((slide, index) => buildNormalizedSlide(slide, index, rawSlides.length || 1, fallbackTitle))
        .flatMap((slide) => splitDenseSlide(slide))
        .filter((slide) => slide.title || slide.content.length > 0);

    if (normalizedSlides.length === 0) {
        normalizedSlides.push({
            type: 'title',
            title: fallbackTitle,
            subtitle: fallbackSubtitle,
            content: fallbackSubtitle ? [fallbackSubtitle] : []
        });
    }

    if (normalizedSlides[0].type !== 'title') {
        normalizedSlides.unshift({
            type: 'title',
            title: fallbackTitle,
            subtitle: fallbackSubtitle,
            content: fallbackSubtitle ? [fallbackSubtitle] : []
        });
    }

    return {
        title: fallbackTitle,
        subtitle: fallbackSubtitle,
        slides: normalizedSlides.map((slide, index, slides) => ({
            ...slide,
            type: inferSlideType(slide, index, slides.length),
            title: sanitizeText(slide.title || `Slide ${index + 1}`, 90),
            subtitle: sanitizeText(slide.subtitle || '', 140),
            content: normalizeItems(slide.content, slide.type === 'code' ? 240 : 180)
        }))
    };
}

function buildViewportBaseCss() {
    return `
html, body {
    width: 100%;
    max-width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-x: clip;
}

html {
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
}

.slide {
    width: 100%;
    max-width: 100%;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    position: relative;
}

.slide-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-height: 100%;
    overflow: hidden;
    padding: var(--slide-padding);
}

:root {
    --title-size: clamp(1.5rem, 5vw, 4rem);
    --h2-size: clamp(1.25rem, 3.5vw, 2.5rem);
    --h3-size: clamp(1rem, 2.5vw, 1.75rem);
    --body-size: clamp(0.78rem, 1.5vw, 1.12rem);
    --small-size: clamp(0.68rem, 1vw, 0.9rem);
    --slide-padding: clamp(1rem, 4vw, 4rem);
    --content-gap: clamp(0.6rem, 2vw, 2rem);
    --element-gap: clamp(0.35rem, 1vw, 1rem);
}

.card, .container, .content-box {
    max-width: min(90vw, 1000px);
    max-height: min(80vh, 700px);
}

.feature-list, .bullet-list {
    gap: clamp(0.4rem, 1vh, 1rem);
}

.feature-list li, .bullet-list li {
    font-size: var(--body-size);
    line-height: 1.45;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
    gap: clamp(0.5rem, 1.5vw, 1rem);
}

img, .image-container {
    max-width: 100%;
    max-height: min(50vh, 400px);
    object-fit: contain;
}

@media (max-height: 700px) {
    :root {
        --slide-padding: clamp(0.75rem, 3vw, 2rem);
        --content-gap: clamp(0.4rem, 1.5vw, 1rem);
        --title-size: clamp(1.25rem, 4.5vw, 2.5rem);
        --h2-size: clamp(1rem, 3vw, 1.75rem);
    }
}

@media (max-height: 600px) {
    :root {
        --slide-padding: clamp(0.5rem, 2.5vw, 1.5rem);
        --content-gap: clamp(0.3rem, 1vw, 0.75rem);
        --title-size: clamp(1.1rem, 4vw, 2rem);
        --body-size: clamp(0.7rem, 1.2vw, 0.95rem);
    }

    .nav-dots, .keyboard-hint, .decorative {
        display: none;
    }
}

@media (max-height: 500px) {
    :root {
        --slide-padding: clamp(0.4rem, 2vw, 1rem);
        --title-size: clamp(1rem, 3.5vw, 1.5rem);
        --h2-size: clamp(0.9rem, 2.5vw, 1.25rem);
        --body-size: clamp(0.65rem, 1vw, 0.85rem);
    }
}

@media (max-width: 600px) {
    :root {
        --title-size: clamp(1.25rem, 7vw, 2.5rem);
    }

    .grid {
        grid-template-columns: 1fr;
    }
}

@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.2s !important;
    }

    html {
        scroll-behavior: auto;
    }
}`;
}

function buildThemeCss(theme) {
    return `
:root {
    --bg-primary: ${theme.background};
    --bg-surface: ${theme.surface};
    --bg-surface-alt: ${theme.surfaceAlt};
    --border-soft: ${theme.border};
    --text-primary: ${theme.text};
    --text-secondary: ${theme.muted};
    --accent: ${theme.accent};
    --accent-soft: ${theme.accentSoft};
    --accent-strong: ${theme.accentStrong};
    --font-display: ${theme.displayFont};
    --font-body: ${theme.bodyFont};
    --font-code: ${theme.codeFont};
    --shadow-soft: 0 22px 60px rgba(15, 23, 42, 0.18);
    --shadow-card: 0 18px 48px rgba(15, 23, 42, 0.2);
    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --duration-normal: 0.55s;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-body);
    color: var(--text-primary);
    background: ${theme.hero};
    width: 100%;
    max-width: 100%;
    overflow-x: clip;
}

main {
    position: relative;
    width: 100%;
    max-width: 100%;
    overflow-x: clip;
}

.presentation-shell::before,
.presentation-shell::after {
    content: "";
    position: fixed;
    inset: auto;
    pointer-events: none;
    z-index: 0;
}

.presentation-shell::before {
    top: -16vh;
    right: -10vw;
    width: 42vw;
    height: 42vw;
    border-radius: 999px;
    background: radial-gradient(circle, ${theme.accentSoft}, transparent 68%);
    filter: blur(18px);
}

.presentation-shell::after {
    left: -10vw;
    bottom: -20vh;
    width: 36vw;
    height: 36vw;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%);
    filter: blur(18px);
}

.progress-rail {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    z-index: 30;
    background: rgba(255,255,255,0.06);
}

.progress-bar {
    width: 0;
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent-strong));
    box-shadow: 0 0 20px var(--accent-soft);
    transition: width 0.32s ease;
}

.nav-dots {
    position: fixed;
    right: clamp(12px, 2vw, 24px);
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 25;
}

.nav-dot {
    width: 12px;
    height: 12px;
    border-radius: 999px;
    border: 1px solid var(--border-soft);
    background: rgba(255,255,255,0.18);
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.nav-dot.active {
    transform: scale(1.15);
    background: var(--accent);
    border-color: transparent;
}

.deck-chrome {
    position: fixed;
    left: clamp(16px, 2vw, 28px);
    bottom: clamp(14px, 2vw, 24px);
    z-index: 24;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 999px;
    border: 1px solid var(--border-soft);
    background: color-mix(in srgb, var(--bg-surface) 74%, transparent);
    backdrop-filter: blur(16px);
    color: var(--text-secondary);
    font-size: var(--small-size);
}

.deck-counter {
    color: var(--text-primary);
    font-weight: 700;
}

.reveal {
    opacity: 0;
    transform: translateY(24px);
    transition:
        opacity var(--duration-normal) var(--ease-out-expo),
        transform var(--duration-normal) var(--ease-out-expo);
}

.slide.visible .reveal {
    opacity: 1;
    transform: translateY(0);
}

.slide.visible .reveal:nth-child(2) { transition-delay: 0.08s; }
.slide.visible .reveal:nth-child(3) { transition-delay: 0.16s; }
.slide.visible .reveal:nth-child(4) { transition-delay: 0.24s; }
.slide.visible .reveal:nth-child(5) { transition-delay: 0.32s; }
`;
}

function buildComponentCss() {
    return `
.slide {
    isolation: isolate;
}

.slide::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
        linear-gradient(135deg, rgba(255,255,255,0.02), transparent 38%),
        linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.06) 100%);
    pointer-events: none;
}

.slide-frame {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: var(--content-gap);
    width: min(1120px, 100%);
    max-width: 100%;
    margin: 0 auto;
}

.slide-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    color: var(--text-secondary);
    font-size: var(--small-size);
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.slide-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent);
    border: 1px solid transparent;
    font-weight: 700;
}

.slide-index {
    opacity: 0.9;
    font-variant-numeric: tabular-nums;
}

.hero-panel,
.content-panel,
.quote-card,
.closing-card {
    position: relative;
    overflow: hidden;
    border-radius: clamp(22px, 3vw, 34px);
    border: 1px solid var(--border-soft);
    background: color-mix(in srgb, var(--bg-surface) 92%, transparent);
    box-shadow: var(--shadow-card);
}

.hero-panel,
.content-panel,
.quote-card {
    padding: clamp(24px, 4vw, 42px);
}

.closing-card {
    padding: clamp(28px, 4vw, 52px);
    text-align: center;
}

.hero-panel::after,
.content-panel::after,
.quote-card::after,
.closing-card::after {
    content: "";
    position: absolute;
    inset: auto -10% -40% auto;
    width: min(48vw, 360px);
    height: min(48vw, 360px);
    border-radius: 999px;
    background: radial-gradient(circle, var(--accent-soft), transparent 70%);
    pointer-events: none;
}

.slide-kicker {
    margin-bottom: 16px;
    color: var(--accent);
    font-size: var(--small-size);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 700;
}

.slide-heading {
    font-family: var(--font-display);
    font-size: var(--title-size);
    line-height: 0.95;
    letter-spacing: -0.04em;
    max-width: 10ch;
}

.slide-subtitle {
    margin-top: 16px;
    font-size: clamp(1rem, 2vw, 1.35rem);
    line-height: 1.5;
    color: var(--text-secondary);
    max-width: 52ch;
}

.slide-summary {
    margin-top: 12px;
    color: var(--text-secondary);
    font-size: var(--body-size);
    max-width: 62ch;
    line-height: 1.6;
}

.title-pills,
.end-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 24px;
}

.title-pill,
.end-pill {
    padding: 10px 14px;
    border-radius: 999px;
    border: 1px solid var(--border-soft);
    background: color-mix(in srgb, var(--bg-surface-alt) 82%, transparent);
    color: var(--text-primary);
    font-size: var(--small-size);
}

.section-heading {
    font-family: var(--font-display);
    font-size: var(--h2-size);
    line-height: 1.05;
    letter-spacing: -0.03em;
    max-width: 16ch;
}

.section-copy {
    color: var(--text-secondary);
    max-width: 65ch;
    line-height: 1.55;
    font-size: var(--body-size);
}

.bullet-list {
    display: grid;
    gap: 14px;
    margin-top: 12px;
    padding-left: 0;
    list-style: none;
}

.bullet-list li {
    display: grid;
    grid-template-columns: 14px minmax(0, 1fr);
    gap: 14px;
    align-items: start;
    padding: 14px 16px;
    border-radius: 18px;
    border: 1px solid var(--border-soft);
    background: color-mix(in srgb, var(--bg-surface-alt) 76%, transparent);
}

.bullet-list li::before {
    content: "";
    width: 10px;
    height: 10px;
    margin-top: 0.45em;
    border-radius: 999px;
    background: linear-gradient(135deg, var(--accent), var(--accent-strong));
    box-shadow: 0 0 0 6px var(--accent-soft);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
    gap: 16px;
    margin-top: 18px;
}

.feature-card {
    min-height: 150px;
    padding: 18px;
    border-radius: 22px;
    border: 1px solid var(--border-soft);
    background: linear-gradient(160deg, color-mix(in srgb, var(--bg-surface-alt) 88%, transparent), color-mix(in srgb, var(--bg-surface) 92%, transparent));
    box-shadow: var(--shadow-soft);
}

.feature-card strong {
    display: block;
    margin-bottom: 10px;
    font-size: clamp(1rem, 1.4vw, 1.1rem);
}

.feature-card p {
    color: var(--text-secondary);
    font-size: var(--body-size);
    line-height: 1.55;
}

.quote-card blockquote {
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 4.2vw, 3.3rem);
    line-height: 1.05;
    letter-spacing: -0.03em;
    max-width: 16ch;
}

.quote-card cite {
    display: inline-block;
    margin-top: 20px;
    color: var(--text-secondary);
    font-style: normal;
    font-size: var(--body-size);
}

.code-block {
    margin-top: 18px;
    padding: 18px 20px;
    border-radius: 22px;
    border: 1px solid var(--border-soft);
    background: #0b1220;
    color: #e2e8f0;
    font-family: var(--font-code);
    font-size: clamp(0.72rem, 1.2vw, 0.95rem);
    line-height: 1.55;
    overflow: hidden;
    white-space: pre-wrap;
}

.closing-card .slide-heading {
    max-width: none;
    margin: 0 auto;
}

.closing-card .slide-subtitle,
.closing-card .slide-summary {
    max-width: 56ch;
    margin-left: auto;
    margin-right: auto;
}

@media (max-width: 720px) {
    .deck-chrome {
        left: 50%;
        transform: translateX(-50%);
        bottom: 12px;
    }

    .slide-topline {
        align-items: flex-start;
        flex-direction: column;
    }
}`;
}

function renderTitleSlide(slide, outline) {
    const pills = slide.content.slice(0, 3);
    return `
        <div class="slide-content">
            <div class="slide-frame">
                <div class="hero-panel reveal">
                    <div class="slide-kicker">${escapeHtml(outline.title)}</div>
                    <h1 class="slide-heading">${escapeHtml(slide.title)}</h1>
                    ${slide.subtitle ? `<p class="slide-subtitle">${escapeHtml(slide.subtitle)}</p>` : ''}
                    ${!slide.subtitle && outline.subtitle ? `<p class="slide-subtitle">${escapeHtml(outline.subtitle)}</p>` : ''}
                    ${pills.length ? `<div class="title-pills">${pills.map((item) => `<span class="title-pill">${escapeHtml(item)}</span>`).join('')}</div>` : ''}
                </div>
            </div>
        </div>`;
}

function renderContentSlide(slide) {
    return `
        <div class="slide-content">
            <div class="slide-frame">
                <div class="content-panel reveal">
                    <h2 class="section-heading">${escapeHtml(slide.title)}</h2>
                    ${slide.subtitle ? `<p class="slide-summary">${escapeHtml(slide.subtitle)}</p>` : ''}
                    <ul class="bullet-list">
                        ${slide.content.map((item) => `<li><span>${escapeHtml(item)}</span></li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>`;
}

function renderFeaturesSlide(slide) {
    return `
        <div class="slide-content">
            <div class="slide-frame">
                <div class="content-panel reveal">
                    <h2 class="section-heading">${escapeHtml(slide.title)}</h2>
                    ${slide.subtitle ? `<p class="slide-summary">${escapeHtml(slide.subtitle)}</p>` : ''}
                    <div class="feature-grid">
                        ${slide.content.map((item, index) => `
                            <article class="feature-card">
                                <strong>${String(index + 1).padStart(2, '0')}</strong>
                                <p>${escapeHtml(item)}</p>
                            </article>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>`;
}

function renderQuoteSlide(slide) {
    const quote = slide.content[0] || slide.title;
    const attribution = slide.content[1] || slide.subtitle;
    return `
        <div class="slide-content">
            <div class="slide-frame">
                <div class="quote-card reveal">
                    <div class="slide-kicker">Key message</div>
                    <blockquote>${escapeHtml(quote)}</blockquote>
                    ${attribution ? `<cite>${escapeHtml(attribution)}</cite>` : ''}
                </div>
            </div>
        </div>`;
}

function renderCodeSlide(slide) {
    return `
        <div class="slide-content">
            <div class="slide-frame">
                <div class="content-panel reveal">
                    <h2 class="section-heading">${escapeHtml(slide.title)}</h2>
                    ${slide.subtitle ? `<p class="slide-summary">${escapeHtml(slide.subtitle)}</p>` : ''}
                    <pre class="code-block">${escapeHtml(slide.content.join('\n'))}</pre>
                </div>
            </div>
        </div>`;
}

function renderEndSlide(slide, outline) {
    return `
        <div class="slide-content">
            <div class="slide-frame">
                <div class="closing-card reveal">
                    <div class="slide-kicker">${escapeHtml(outline.title)}</div>
                    <h2 class="slide-heading">${escapeHtml(slide.title)}</h2>
                    ${slide.subtitle ? `<p class="slide-subtitle">${escapeHtml(slide.subtitle)}</p>` : ''}
                    ${slide.content.length ? `<div class="end-pills">${slide.content.map((item) => `<span class="end-pill">${escapeHtml(item)}</span>`).join('')}</div>` : ''}
                </div>
            </div>
        </div>`;
}

function renderSlide(slide, index, total, outline) {
    let content = '';
    switch (slide.type) {
        case 'title':
            content = renderTitleSlide(slide, outline);
            break;
        case 'features':
            content = renderFeaturesSlide(slide);
            break;
        case 'quote':
            content = renderQuoteSlide(slide);
            break;
        case 'code':
            content = renderCodeSlide(slide);
            break;
        case 'end':
            content = renderEndSlide(slide, outline);
            break;
        default:
            content = renderContentSlide(slide);
            break;
    }

    return `
    <section class="slide ${escapeHtml(`${slide.type}-slide`)}" id="slide-${index + 1}" data-slide-index="${index}">
        <div class="slide-topline reveal">
            <span class="slide-tag">${escapeHtml(slide.type)}</span>
            <span class="slide-index">${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
        </div>
        ${content}
    </section>`;
}

function buildPresentationScript() {
    return `
class SlidePresentation {
    constructor() {
        this.slides = Array.from(document.querySelectorAll('.slide'));
        this.navDots = Array.from(document.querySelectorAll('.nav-dot'));
        this.progressBar = document.getElementById('progressBar');
        this.currentSlide = this.resolveInitialSlide();
        this.totalSlides = this.slides.length;
        this.lockedUntil = 0;
        this.touchStartY = 0;

        this.setupObserver();
        this.setupKeyboardNav();
        this.setupTouchNav();
        this.setupWheelNav();
        this.setupNavDots();
        this.syncUi(this.currentSlide);

        window.setTimeout(() => this.goTo(this.currentSlide, false), 40);
    }

    resolveInitialSlide() {
        const hash = window.location.hash.replace('#', '');
        const numeric = Number(hash);
        if (Number.isInteger(numeric) && numeric >= 1 && numeric <= this.slides.length) {
            return numeric - 1;
        }
        return 0;
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const index = Number(entry.target.dataset.slideIndex || 0);
                entry.target.classList.add('visible');
                this.currentSlide = index;
                this.syncUi(index);
            });
        }, { threshold: 0.55 });

        this.slides.forEach((slide) => observer.observe(slide));
    }

    setupKeyboardNav() {
        document.addEventListener('keydown', (event) => {
            if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
                event.preventDefault();
                this.next();
            }
            if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
                event.preventDefault();
                this.prev();
            }
            if (event.key === 'Home') {
                event.preventDefault();
                this.goTo(0);
            }
            if (event.key === 'End') {
                event.preventDefault();
                this.goTo(this.totalSlides - 1);
            }
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
            if (Math.abs(event.deltaY) < 18 || now < this.lockedUntil) {
                return;
            }

            event.preventDefault();
            this.lockedUntil = now + 700;

            if (event.deltaY > 0) {
                this.next();
            } else {
                this.prev();
            }
        }, { passive: false });
    }

    setupNavDots() {
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });
    }

    syncUi(index) {
        const progress = this.totalSlides <= 1 ? 100 : (index / (this.totalSlides - 1)) * 100;
        if (this.progressBar) {
            this.progressBar.style.width = progress + '%';
        }

        this.navDots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === index);
            dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
        });

        const currentSlideEl = document.getElementById('currentSlideNum');
        const totalSlidesEl = document.getElementById('totalSlides');
        if (currentSlideEl) currentSlideEl.textContent = String(index + 1);
        if (totalSlidesEl) totalSlidesEl.textContent = String(this.totalSlides);

        history.replaceState(null, '', '#' + String(index + 1));
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
        this.currentSlide = index;
        this.syncUi(index);
        this.slides[index].scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'start',
            inline: 'nearest'
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new SlidePresentation();
});`;
}

function renderPresentationHtml(outlineInput, styleId) {
    const outline = normalizeOutline(outlineInput);
    const theme = getTheme(styleId);
    const slidesHtml = outline.slides.map((slide, index, slides) => renderSlide(slide, index, slides.length, outline)).join('\n');
    const navDots = outline.slides.map((slide, index) => `
        <button class="nav-dot${index === 0 ? ' active' : ''}" type="button" aria-label="Go to slide ${index + 1}"></button>
    `).join('');

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(outline.title)}</title>
    <link rel="preconnect" href="https://api.fontshare.com">
    <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=clash-display@400,500,600,700&f[]=jet-brains-mono@400,500&display=swap">
    <style>
${buildViewportBaseCss()}
${buildThemeCss(theme)}
${buildComponentCss()}
    </style>
</head>
<body class="presentation-shell">
    <div class="progress-rail" aria-hidden="true">
        <div class="progress-bar" id="progressBar"></div>
    </div>
    <nav class="nav-dots" aria-label="Slide navigation">
${navDots}
    </nav>
    <div class="deck-chrome" aria-hidden="true">
        <span class="deck-counter"><span id="currentSlideNum">1</span> / <span id="totalSlides">${outline.slides.length}</span></span>
        <span class="keyboard-hint">Arrow keys or swipe</span>
    </div>
    <main>
${slidesHtml}
    </main>
    <script>
${buildPresentationScript()}
    </script>
</body>
</html>`;
}

function fillColorFromTheme(theme) {
    return theme.background.replace('#', '');
}

function accentColorFromTheme(theme) {
    return theme.accent.replace('#', '');
}

function textColorFromTheme(theme) {
    return theme.text.replace('#', '');
}

function mutedColorFromTheme(theme) {
    return theme.muted.replace('#', '');
}

function surfaceColorFromTheme(theme) {
    return theme.surface.replace('#', '');
}

function addBaseSlideChrome(slide, pptx, theme, index, total, deckTitle) {
    slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 13.333,
        h: 7.5,
        line: { color: fillColorFromTheme(theme), transparency: 100 },
        fill: { color: fillColorFromTheme(theme) }
    });

    slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 13.333,
        h: 0.12,
        line: { color: accentColorFromTheme(theme), transparency: 100 },
        fill: { color: accentColorFromTheme(theme) }
    });

    slide.addText(deckTitle, {
        x: 0.7,
        y: 0.3,
        w: 4.8,
        h: 0.24,
        fontFace: theme.bodyFont.replace(/"/g, ''),
        fontSize: 9,
        color: mutedColorFromTheme(theme),
        bold: true,
        charSpace: 1.2
    });

    slide.addText(`${index + 1} / ${total}`, {
        x: 11.7,
        y: 0.3,
        w: 0.9,
        h: 0.24,
        align: 'right',
        fontFace: theme.bodyFont.replace(/"/g, ''),
        fontSize: 9,
        color: mutedColorFromTheme(theme)
    });
}

function addTitleSlide(slide, pptx, theme, deckTitle, deckSubtitle, items) {
    slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: 1.0,
        w: 11.7,
        h: 5.4,
        rectRadius: 0.12,
        line: { color: accentColorFromTheme(theme), transparency: 80 },
        fill: { color: surfaceColorFromTheme(theme), transparency: 4 }
    });

    slide.addText(deckTitle, {
        x: 1.2,
        y: 1.45,
        w: 8.9,
        h: 1.7,
        fontFace: theme.displayFont.replace(/"/g, ''),
        fontSize: 24,
        bold: true,
        color: textColorFromTheme(theme),
        breakLine: false,
        fit: 'shrink'
    });

    const subtitle = deckSubtitle || items[0] || '';
    if (subtitle) {
        slide.addText(subtitle, {
            x: 1.2,
            y: 3.0,
            w: 8.5,
            h: 0.8,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 13,
            color: mutedColorFromTheme(theme),
            breakLine: false,
            fit: 'shrink'
        });
    }

    items.slice(0, 3).forEach((item, itemIndex) => {
        slide.addShape(pptx.ShapeType.roundRect, {
            x: 1.2 + (itemIndex * 2.95),
            y: 4.55,
            w: 2.6,
            h: 0.52,
            rectRadius: 0.08,
            line: { color: accentColorFromTheme(theme), transparency: 85 },
            fill: { color: accentColorFromTheme(theme), transparency: 86 }
        });

        slide.addText(item, {
            x: 1.35 + (itemIndex * 2.95),
            y: 4.7,
            w: 2.25,
            h: 0.2,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 10,
            color: textColorFromTheme(theme),
            bold: true,
            align: 'center',
            fit: 'shrink'
        });
    });
}

function addBulletSlide(slide, pptx, theme, title, subtitle, items) {
    slide.addText(title, {
        x: 0.9,
        y: 1.0,
        w: 5.4,
        h: 0.8,
        fontFace: theme.displayFont.replace(/"/g, ''),
        fontSize: 21,
        bold: true,
        color: textColorFromTheme(theme),
        fit: 'shrink'
    });

    if (subtitle) {
        slide.addText(subtitle, {
            x: 0.95,
            y: 1.72,
            w: 9.0,
            h: 0.42,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 11,
            color: mutedColorFromTheme(theme),
            fit: 'shrink'
        });
    }

    slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.9,
        y: 2.1,
        w: 11.5,
        h: 4.6,
        rectRadius: 0.08,
        line: { color: accentColorFromTheme(theme), transparency: 88 },
        fill: { color: surfaceColorFromTheme(theme), transparency: 4 }
    });

    const textRuns = items.map((item) => ({
        text: item,
        options: {
            bullet: { indent: 18 },
            breakLine: true
        }
    }));

    slide.addText(textRuns, {
        x: 1.25,
        y: 2.45,
        w: 10.5,
        h: 3.9,
        fontFace: theme.bodyFont.replace(/"/g, ''),
        fontSize: 16,
        color: textColorFromTheme(theme),
        breakLine: false,
        paraSpaceAfterPt: 10,
        valign: 'mid',
        fit: 'shrink'
    });
}

function addFeaturesSlide(slide, pptx, theme, title, subtitle, items) {
    slide.addText(title, {
        x: 0.9,
        y: 0.95,
        w: 6.4,
        h: 0.7,
        fontFace: theme.displayFont.replace(/"/g, ''),
        fontSize: 21,
        bold: true,
        color: textColorFromTheme(theme),
        fit: 'shrink'
    });

    if (subtitle) {
        slide.addText(subtitle, {
            x: 0.95,
            y: 1.65,
            w: 8.8,
            h: 0.36,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 11,
            color: mutedColorFromTheme(theme),
            fit: 'shrink'
        });
    }

    const positions = [
        { x: 0.95, y: 2.15 },
        { x: 6.75, y: 2.15 },
        { x: 0.95, y: 4.45 },
        { x: 6.75, y: 4.45 }
    ];

    items.slice(0, 4).forEach((item, index) => {
        const position = positions[index];
        slide.addShape(pptx.ShapeType.roundRect, {
            x: position.x,
            y: position.y,
            w: 5.55,
            h: 1.85,
            rectRadius: 0.08,
            line: { color: accentColorFromTheme(theme), transparency: 86 },
            fill: { color: surfaceColorFromTheme(theme), transparency: 4 }
        });

        slide.addText(String(index + 1).padStart(2, '0'), {
            x: position.x + 0.28,
            y: position.y + 0.22,
            w: 0.48,
            h: 0.22,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 9,
            color: accentColorFromTheme(theme),
            bold: true,
            align: 'center'
        });

        slide.addText(item, {
            x: position.x + 0.35,
            y: position.y + 0.62,
            w: 4.85,
            h: 0.95,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 15,
            color: textColorFromTheme(theme),
            valign: 'mid',
            fit: 'shrink'
        });
    });
}

function addQuoteSlide(slide, pptx, theme, title, subtitle, items) {
    slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.1,
        y: 1.25,
        w: 11.1,
        h: 4.9,
        rectRadius: 0.1,
        line: { color: accentColorFromTheme(theme), transparency: 84 },
        fill: { color: surfaceColorFromTheme(theme), transparency: 4 }
    });

    slide.addText(items[0] || title, {
        x: 1.55,
        y: 2.0,
        w: 9.8,
        h: 1.9,
        fontFace: theme.displayFont.replace(/"/g, ''),
        fontSize: 24,
        bold: true,
        color: textColorFromTheme(theme),
        align: 'center',
        valign: 'mid',
        fit: 'shrink'
    });

    const attribution = items[1] || subtitle || title;
    if (attribution) {
        slide.addText(attribution, {
            x: 3.6,
            y: 4.55,
            w: 6.0,
            h: 0.32,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 12,
            color: mutedColorFromTheme(theme),
            align: 'center',
            fit: 'shrink'
        });
    }
}

function addCodeSlide(slide, pptx, theme, title, subtitle, items) {
    slide.addText(title, {
        x: 0.9,
        y: 0.95,
        w: 5.2,
        h: 0.7,
        fontFace: theme.displayFont.replace(/"/g, ''),
        fontSize: 20,
        bold: true,
        color: textColorFromTheme(theme),
        fit: 'shrink'
    });

    if (subtitle) {
        slide.addText(subtitle, {
            x: 0.95,
            y: 1.62,
            w: 7.8,
            h: 0.32,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 11,
            color: mutedColorFromTheme(theme),
            fit: 'shrink'
        });
    }

    slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.95,
        y: 2.0,
        w: 11.45,
        h: 4.9,
        rectRadius: 0.08,
        line: { color: accentColorFromTheme(theme), transparency: 88 },
        fill: { color: '0B1220' }
    });

    slide.addText(items.join('\n'), {
        x: 1.25,
        y: 2.35,
        w: 10.8,
        h: 4.15,
        fontFace: theme.codeFont.replace(/"/g, ''),
        fontSize: 12,
        color: 'E2E8F0',
        valign: 'top',
        margin: 0.04,
        fit: 'shrink'
    });
}

function addEndSlide(slide, pptx, theme, deckTitle, subtitle, items) {
    slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.0,
        y: 1.2,
        w: 11.3,
        h: 5.1,
        rectRadius: 0.12,
        line: { color: accentColorFromTheme(theme), transparency: 80 },
        fill: { color: surfaceColorFromTheme(theme), transparency: 4 }
    });

    slide.addText(slide.title || 'Thank you', {
        x: 1.4,
        y: 2.0,
        w: 10.4,
        h: 1.0,
        fontFace: theme.displayFont.replace(/"/g, ''),
        fontSize: 24,
        bold: true,
        color: textColorFromTheme(theme),
        align: 'center',
        fit: 'shrink'
    });

    const copy = subtitle || deckTitle;
    if (copy) {
        slide.addText(copy, {
            x: 2.2,
            y: 3.05,
            w: 8.8,
            h: 0.4,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 12,
            color: mutedColorFromTheme(theme),
            align: 'center',
            fit: 'shrink'
        });
    }

    items.slice(0, 3).forEach((item, index) => {
        slide.addShape(pptx.ShapeType.roundRect, {
            x: 1.95 + (index * 3.15),
            y: 4.15,
            w: 2.75,
            h: 0.56,
            rectRadius: 0.08,
            line: { color: accentColorFromTheme(theme), transparency: 86 },
            fill: { color: accentColorFromTheme(theme), transparency: 88 }
        });

        slide.addText(item, {
            x: 2.1 + (index * 3.15),
            y: 4.32,
            w: 2.45,
            h: 0.18,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 10,
            color: textColorFromTheme(theme),
            align: 'center',
            fit: 'shrink'
        });
    });
}

function exportPresentationPptx(outlineInput, styleId) {
    const outline = normalizeOutline(outlineInput);
    const theme = getTheme(styleId);
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'Xiangyu Slides';
    pptx.company = 'Xiangyu Slides';
    pptx.subject = outline.title;
    pptx.title = outline.title;
    pptx.lang = 'zh-CN';
    pptx.theme = {
        headFontFace: theme.displayFont.replace(/"/g, ''),
        bodyFontFace: theme.bodyFont.replace(/"/g, ''),
        lang: 'zh-CN'
    };

    outline.slides.forEach((slideData, index) => {
        const slide = pptx.addSlide();
        addBaseSlideChrome(slide, pptx, theme, index, outline.slides.length, outline.title);

        switch (slideData.type) {
            case 'title':
                addTitleSlide(slide, pptx, theme, slideData.title, slideData.subtitle || outline.subtitle, slideData.content);
                break;
            case 'features':
                addFeaturesSlide(slide, pptx, theme, slideData.title, slideData.subtitle, slideData.content);
                break;
            case 'quote':
                addQuoteSlide(slide, pptx, theme, slideData.title, slideData.subtitle, slideData.content);
                break;
            case 'code':
                addCodeSlide(slide, pptx, theme, slideData.title, slideData.subtitle, slideData.content);
                break;
            case 'end':
                addEndSlide(slide, pptx, theme, outline.title, slideData.subtitle, slideData.content);
                break;
            default:
                addBulletSlide(slide, pptx, theme, slideData.title, slideData.subtitle, slideData.content);
                break;
        }
    });

    return pptx.write({ outputType: 'nodebuffer' });
}

module.exports = {
    normalizeOutline,
    renderPresentationHtml,
    exportPresentationPptx,
    getTheme
};
