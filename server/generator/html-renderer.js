const { normalizeOutline } = require('./normalize-outline');
const { getTheme } = require('./theme-registry');

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
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
        this.wheelDelta = 0;
        this.wheelResetTimer = null;

        this.setupObserver();
        this.setupKeyboardNav();
        this.setupTouchNav();
        this.setupWheelNav();
        this.setupNavDots();
        this.setupMessageBridge();
        this.syncUi(this.currentSlide);

        window.setTimeout(() => this.goTo(this.currentSlide, false), 40);
        window.setTimeout(() => this.focusPresentationSurface(), 80);
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
            if (this.shouldIgnoreKeyboardEvent(event)) {
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

    setupNavDots() {
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });
    }

    setupMessageBridge() {
        window.addEventListener('message', (event) => {
            const data = event.data;
            if (!data || data.type !== 'presentation-nav') {
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

    focusPresentationSurface() {
        document.body.tabIndex = -1;
        window.focus();
        if (typeof document.body.focus === 'function') {
            document.body.focus({ preventScroll: true });
        }
    }

    syncAddress(index) {
        const slideNumber = index + 1;

        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'presentation-state',
                slide: slideNumber,
                totalSlides: this.totalSlides
            }, '*');
            return;
        }

        try {
            history.replaceState(null, '', '#' + String(slideNumber));
        } catch (error) {
            // about:srcdoc cannot mutate history URLs; ignore in embedded mode
        }
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
        this.syncAddress(index);
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
    window.presentationController = new SlidePresentation();
});`;
}

function renderHtmlFromOutline(outlineInput, styleId) {
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
module.exports = {
    renderHtmlFromOutline
};
