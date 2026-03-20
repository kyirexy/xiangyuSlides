const STYLE_PRESETS = [
    { id: 'bold-signal', name: 'Bold Signal', vibe: 'Confident, bold, modern', category: 'dark' },
    { id: 'electric-studio', name: 'Electric Studio', vibe: 'Bold, clean, professional', category: 'dark' },
    { id: 'creative-voltage', name: 'Creative Voltage', vibe: 'Bold, creative, energetic', category: 'dark' },
    { id: 'dark-botanical', name: 'Dark Botanical', vibe: 'Elegant, sophisticated, artistic', category: 'dark' },
    { id: 'notebook-tabs', name: 'Notebook Tabs', vibe: 'Editorial, organized, elegant', category: 'light' },
    { id: 'pastel-geometry', name: 'Pastel Geometry', vibe: 'Friendly, organized, modern', category: 'light' },
    { id: 'split-pastel', name: 'Split Pastel', vibe: 'Playful, modern, friendly', category: 'light' },
    { id: 'vintage-editorial', name: 'Vintage Editorial', vibe: 'Witty, confident, editorial', category: 'light' },
    { id: 'neon-cyber', name: 'Neon Cyber', vibe: 'Futuristic, techy, confident', category: 'specialty' },
    { id: 'terminal-green', name: 'Terminal Green', vibe: 'Developer-focused, hacker', category: 'specialty' },
    { id: 'swiss-modern', name: 'Swiss Modern', vibe: 'Clean, precise, Bauhaus', category: 'specialty' },
    { id: 'paper-ink', name: 'Paper & Ink', vibe: 'Editorial, literary, thoughtful', category: 'specialty' }
];

const DEFAULT_STYLE_ID = 'bold-signal';
const VISUAL_FAMILY_BY_STYLE = {
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
const STYLES_BY_VISUAL_FAMILY = {
    showcase: ['bold-signal', 'electric-studio', 'creative-voltage', 'dark-botanical', 'neon-cyber'],
    editorial: ['notebook-tabs', 'vintage-editorial', 'paper-ink', 'split-pastel'],
    briefing: ['swiss-modern', 'pastel-geometry', 'electric-studio', 'terminal-green']
};

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

function getVisualFamilyForStyle(styleId) {
    return VISUAL_FAMILY_BY_STYLE[styleId] || VISUAL_FAMILY_BY_STYLE[DEFAULT_STYLE_ID] || 'showcase';
}

function getStylesForVisualFamily(visualFamily) {
    const family = String(visualFamily || '').trim().toLowerCase();
    const styles = STYLES_BY_VISUAL_FAMILY[family];
    return Array.isArray(styles) && styles.length > 0
        ? styles.slice()
        : STYLES_BY_VISUAL_FAMILY.showcase.slice();
}

function decorateStyleInfo(style) {
    if (!style) {
        return null;
    }

    return {
        ...style,
        visualFamily: getVisualFamilyForStyle(style.id)
    };
}

function getTheme(styleId) {
    return {
        ...(STYLE_THEMES[styleId] || STYLE_THEMES[DEFAULT_STYLE_ID]),
        visualFamily: getVisualFamilyForStyle(styleId)
    };
}
function getStyleInfo(styleId) {
    return decorateStyleInfo(STYLE_PRESETS.find((item) => item.id === styleId) || STYLE_PRESETS[0]);
}

function listStylePresets() {
    return STYLE_PRESETS.map((item) => decorateStyleInfo(item));
}

module.exports = {
    DEFAULT_STYLE_ID,
    STYLE_PRESETS,
    STYLE_THEMES,
    getStylesForVisualFamily,
    getStyleInfo,
    getTheme,
    getVisualFamilyForStyle,
    listStylePresets
};
