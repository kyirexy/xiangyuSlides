const VIEWER_I18N = {
    'zh-CN': {
        pageTitle: '演示预览 - Xiangyu Slides',
        subtitle: 'Runtime 优先的预览工作区',
        shellKicker: 'Preview',
        invalidLinkTitle: '无效的演示链接',
        invalidLinkMessage: '当前链接里没有可用的演示 ID。',
        waitingRecord: '正在等待创建页把任务写入系统...',
        loadFailedTitle: '加载失败',
        loadFailedMessage: '读取演示记录失败。',
        generationFailedTitle: '生成失败',
        generationFailedMessage: '请返回创建页重新发起生成。',
        runtimeFailedTitle: '无法打开运行时预览',
        runtimeTimeout: '运行时加载超时，已回退到兼容 HTML 预览。',
        runtimeInitFailed: '运行时初始化失败。',
        runtimeNoFallback: '运行时初始化失败，而且没有可回退的 HTML 预览。',
        generatingTitle: '演示正在生成',
        preparing: '正在准备可预览内容...',
        fixedRoute: '访问地址已固定',
        copyLink: '复制链接',
        downloadHtml: '下载 HTML',
        downloadPptx: '下载 PPTX',
        openRawHtml: '打开原始 HTML',
        retry: '重新加载',
        copied: '链接已复制到剪贴板。',
        copyPrompt: '复制下面的链接',
        statusBuilding: '生成中',
        statusReady: '可预览',
        statusFallback: 'HTML 兼容预览',
        statusError: '错误',
        statusPreparing: '准备中',
        untitledDeck: '未命名演示',
        titleGeneratingSuffix: '生成中',
        buildSteps: [
            { index: 1, label: 'Outline Check', description: '检查结构与页数' },
            { index: 2, label: 'Theme Apply', description: '应用主题和视觉令牌' },
            { index: 3, label: 'Stable Render', description: '生成稳定的 HTML 预览' },
            { index: 4, label: 'Save Record', description: '保存预览和导出记录' },
            { index: 5, label: 'Ready', description: '独立链接和 PPTX 可用' }
        ]
    },
    en: {
        pageTitle: 'Presentation Preview - Xiangyu Slides',
        subtitle: 'Runtime-first preview workspace',
        shellKicker: 'Preview',
        invalidLinkTitle: 'Invalid presentation link',
        invalidLinkMessage: 'No usable presentation id was found in the current link.',
        waitingRecord: 'Waiting for the create page to register the build task...',
        loadFailedTitle: 'Load failed',
        loadFailedMessage: 'Failed to read the presentation record.',
        generationFailedTitle: 'Generation failed',
        generationFailedMessage: 'Go back to the create page and start a new build.',
        runtimeFailedTitle: 'Unable to open the runtime preview',
        runtimeTimeout: 'The runtime timed out and the viewer fell back to the compatible HTML preview.',
        runtimeInitFailed: 'The runtime failed to initialize.',
        runtimeNoFallback: 'The runtime failed to initialize and there is no HTML fallback available.',
        generatingTitle: 'Presentation is being generated',
        preparing: 'Preparing previewable output...',
        fixedRoute: 'Route locked',
        copyLink: 'Copy link',
        downloadHtml: 'Download HTML',
        downloadPptx: 'Download PPTX',
        openRawHtml: 'Open raw HTML',
        retry: 'Retry',
        copied: 'Link copied to clipboard.',
        copyPrompt: 'Copy the link below',
        statusBuilding: 'Building',
        statusReady: 'Ready',
        statusFallback: 'HTML fallback',
        statusError: 'Error',
        statusPreparing: 'Preparing',
        untitledDeck: 'Untitled presentation',
        titleGeneratingSuffix: 'Generating',
        buildSteps: [
            { index: 1, label: 'Outline Check', description: 'Validate structure and slide count' },
            { index: 2, label: 'Theme Apply', description: 'Apply theme and style tokens' },
            { index: 3, label: 'Stable Render', description: 'Generate a stable HTML preview' },
            { index: 4, label: 'Save Record', description: 'Persist preview and export metadata' },
            { index: 5, label: 'Ready', description: 'Standalone route and PPTX export available' }
        ]
    }
};

class PresentationViewer {
    constructor() {
        this.locale = this.resolveLocale();
        this.copy = VIEWER_I18N[this.locale] || VIEWER_I18N.en;
        this.presentationId = this.resolvePresentationId();
        this.record = null;
        this.pollTimer = null;
        this.renderMode = null;
        this.runtimeSessionId = null;
        this.runtimeReady = false;
        this.runtimeFallbackTimer = null;
        this.runtimeProbeTimer = null;
        this.runtimeProbeAttempts = 0;
        this.inputBridgeBound = false;

        this.elements = {
            toolbar: document.getElementById('toolbar'),
            toolbarTitle: document.getElementById('toolbarTitle'),
            toolbarSubtitle: document.getElementById('toolbarSubtitle'),
            toolbarId: document.getElementById('toolbarId'),
            toolbarStatus: document.getElementById('toolbarStatus'),
            copyLinkBtn: document.getElementById('copyLinkBtn'),
            downloadHtmlBtn: document.getElementById('downloadHtmlBtn'),
            downloadPptxBtn: document.getElementById('downloadPptxBtn'),
            openRawHtmlBtn: document.getElementById('openRawHtmlBtn'),
            loading: document.getElementById('loading'),
            loadingKicker: document.getElementById('loadingKicker'),
            loadingTitle: document.getElementById('loadingTitle'),
            loadingMessage: document.getElementById('loadingMessage'),
            loadingRoutePill: document.getElementById('loadingRoutePill'),
            loadingProgress: document.getElementById('loadingProgress'),
            loadingSteps: document.getElementById('loadingSteps'),
            loadingId: document.getElementById('loadingId'),
            error: document.getElementById('error'),
            errorTitle: document.getElementById('errorTitle'),
            errorMessage: document.getElementById('errorMessage'),
            retryLoadBtn: document.getElementById('retryLoadBtn'),
            frame: document.getElementById('preview-frame')
        };

        this.applyStaticCopy();
        this.bindActions();
        this.bindInputBridge();
        this.init();
    }

    resolveLocale() {
        if (window.XiangyuI18n?.resolveLocale) {
            return window.XiangyuI18n.resolveLocale();
        }

        const params = new URLSearchParams(window.location.search);
        const requested = String(params.get('lang') || '').trim().toLowerCase();
        const preferred = requested
            || String(document.documentElement.lang || '').trim().toLowerCase()
            || String(navigator.language || '').trim().toLowerCase();

        return preferred.startsWith('zh') ? 'zh-CN' : 'en';
    }

    t(key) {
        return this.copy[key] || key;
    }

    applyStaticCopy() {
        window.XiangyuI18n?.setPageLocale?.(this.locale);
        document.title = this.t('pageTitle');

        if (this.elements.loadingKicker) {
            this.elements.loadingKicker.textContent = this.t('shellKicker');
        }
        if (this.elements.toolbarSubtitle) {
            this.elements.toolbarSubtitle.textContent = this.t('subtitle');
        }
        if (this.elements.loadingRoutePill) {
            this.elements.loadingRoutePill.textContent = this.t('fixedRoute');
        }
        if (this.elements.copyLinkBtn) {
            this.elements.copyLinkBtn.textContent = this.t('copyLink');
        }
        if (this.elements.downloadHtmlBtn) {
            this.elements.downloadHtmlBtn.textContent = this.t('downloadHtml');
        }
        if (this.elements.downloadPptxBtn) {
            this.elements.downloadPptxBtn.textContent = this.t('downloadPptx');
        }
        if (this.elements.openRawHtmlBtn) {
            this.elements.openRawHtmlBtn.textContent = this.t('openRawHtml');
        }
        if (this.elements.retryLoadBtn) {
            this.elements.retryLoadBtn.textContent = this.t('retry');
        }
    }

    bindActions() {
        this.elements.copyLinkBtn?.addEventListener('click', () => this.copyLink());
        this.elements.downloadHtmlBtn?.addEventListener('click', () => this.downloadHtml());
        this.elements.downloadPptxBtn?.addEventListener('click', () => this.downloadPptx());
        this.elements.openRawHtmlBtn?.addEventListener('click', () => this.openRawHtml());
        this.elements.retryLoadBtn?.addEventListener('click', () => this.loadPresentation());
    }

    bindInputBridge() {
        if (this.inputBridgeBound) {
            return;
        }

        this.inputBridgeBound = true;

        window.addEventListener('message', (event) => {
            const data = event.data;
            if (!data || typeof data !== 'object') {
                return;
            }

            if (this.renderMode === 'runtime' && ['presentation-state', 'presentation-runtime-ready', 'presentation-runtime-error'].includes(data.type)) {
                if (!this.isActiveRuntimeSource(event.source)) {
                    return;
                }
            }

            if (data.presentationId && data.presentationId !== this.presentationId) {
                return;
            }

            if (data.sessionId && this.runtimeSessionId && data.sessionId !== this.runtimeSessionId) {
                return;
            }

            if (data.type === 'presentation-state') {
                this.updateLocationHash(data.slide);
                return;
            }

            if (data.type === 'presentation-runtime-ready') {
                this.handleRuntimeReady(data);
                return;
            }

            if (data.type === 'presentation-runtime-error') {
                this.handleRuntimeError(data.message);
            }
        });

        window.addEventListener('keydown', (event) => {
            if (!this.record || this.shouldIgnoreKeydown(event)) {
                return;
            }

            const action = this.mapKeyToAction(event.key);
            if (!action) {
                return;
            }

            event.preventDefault();
            this.sendPresentationCommand(action);
        });

        this.elements.frame?.addEventListener('load', () => {
            if (this.renderMode === 'legacy-html') {
                this.focusPresentation();
                this.syncSlideFromLocation();
                return;
            }

            if (this.renderMode === 'runtime') {
                this.probeRuntimeHandshake(true);
            }
        });

        this.elements.frame?.addEventListener('mouseenter', () => this.focusPresentation());
        this.elements.frame?.addEventListener('click', () => this.focusPresentation());
    }

    init() {
        if (!this.presentationId) {
            this.showError(this.t('invalidLinkTitle'), this.t('invalidLinkMessage'));
            return;
        }

        if (this.elements.loadingId) {
            this.elements.loadingId.textContent = this.presentationId;
        }

        this.loadPresentation();
    }

    resolvePresentationId() {
        const pathMatch = window.location.pathname.match(/\/presentations\/([^/?#]+)/);
        if (pathMatch?.[1]) {
            return decodeURIComponent(pathMatch[1]);
        }

        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async loadPresentation() {
        try {
            const response = await fetch(`/api/presentations/${this.presentationId}`, {
                cache: 'no-store'
            });

            if (response.status === 404) {
                this.showLoading({
                    progress: 4,
                    step: 1,
                    message: this.t('waitingRecord'),
                    title: this.t('generatingTitle')
                });
                this.schedulePoll();
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || this.t('loadFailedMessage'));
            }

            this.record = data;

            if (data.status === 'ready') {
                this.renderPresentation(data);
                return;
            }

            if (data.status === 'failed') {
                this.showError(this.t('generationFailedTitle'), data.error || data.message || this.t('generationFailedMessage'));
                return;
            }

            this.showLoading(data);
            this.schedulePoll();
        } catch (error) {
            this.showError(this.t('loadFailedTitle'), error.message || this.t('loadFailedMessage'));
        }
    }

    schedulePoll() {
        window.clearTimeout(this.pollTimer);
        this.pollTimer = window.setTimeout(() => this.loadPresentation(), 1200);
    }

    showLoading(data) {
        const progress = Math.max(0, Number(data.progress) || 0);
        const currentStep = Math.max(1, Number(data.step) || 1);
        const steps = this.copy.buildSteps;

        this.clearRuntimeFallbackTimer();
        this.setToolbarState('hidden');
        this.elements.loading.style.display = 'grid';
        this.elements.error.style.display = 'none';
        this.elements.frame.style.display = 'none';

        this.elements.loadingTitle.textContent = data.title || this.t('generatingTitle');
        this.elements.loadingMessage.textContent = data.message || this.t('preparing');
        this.elements.loadingProgress.style.width = `${progress}%`;
        this.elements.loadingSteps.innerHTML = steps.map((step) => {
            const className = step.index < currentStep
                ? 'completed'
                : step.index === currentStep
                    ? 'active'
                    : '';

            return `
                <div class="loading-step ${className}">
                    <span>${step.index}</span>
                    <div>
                        <strong>${step.label}</strong>
                        <small>${step.description}</small>
                    </div>
                </div>
            `;
        }).join('');

        document.title = `${data.title || this.t('untitledDeck')} ${this.t('titleGeneratingSuffix')} - Xiangyu Slides`;
    }

    renderPresentation(data) {
        window.clearTimeout(this.pollTimer);

        this.elements.loading.style.display = 'none';
        this.elements.error.style.display = 'none';
        this.elements.frame.style.display = 'block';
        this.setToolbarState('ready');

        this.elements.toolbarTitle.textContent = data.title || this.t('untitledDeck');
        this.elements.toolbarId.textContent = data.id;
        this.elements.toolbarStatus.textContent = this.t('statusPreparing');
        document.title = `${data.title || this.t('untitledDeck')} - Xiangyu Slides`;

        this.loadRuntimePreview();
    }

    setToolbarState(mode) {
        if (!this.elements.toolbar) {
            return;
        }

        this.elements.toolbar.style.display = mode === 'hidden' ? 'none' : 'flex';
    }

    isActiveRuntimeSource(sourceWindow) {
        const frameWindow = this.elements.frame?.contentWindow;
        if (!frameWindow || !sourceWindow) {
            return false;
        }

        return frameWindow === sourceWindow;
    }

    shouldIgnoreKeydown(event) {
        const target = event.target;
        if (!target) {
            return false;
        }

        if (target.isContentEditable) {
            return true;
        }

        const tagName = String(target.tagName || '').toLowerCase();
        if (['input', 'textarea', 'select'].includes(tagName)) {
            return true;
        }

        return Boolean(target.closest?.('.toolbar'));
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

    sendPresentationCommand(action) {
        const frameWindow = this.elements.frame?.contentWindow;
        if (!frameWindow) {
            return;
        }

        frameWindow.postMessage({
            type: 'presentation-nav',
            action
        }, '*');
    }

    sendGoToSlide(slideNumber) {
        const frameWindow = this.elements.frame?.contentWindow;
        if (!frameWindow) {
            return;
        }

        frameWindow.postMessage({
            type: 'presentation-nav',
            action: 'goTo',
            slideNumber
        }, '*');
    }

    focusPresentation() {
        const frame = this.elements.frame;
        if (!frame || frame.style.display === 'none') {
            return;
        }

        frame.focus();
        frame.contentWindow?.focus();
        frame.contentWindow?.postMessage({
            type: 'presentation-nav',
            action: 'focus'
        }, '*');
    }

    resolveRequestedSlide() {
        const numeric = Number(window.location.hash.replace('#', ''));
        if (Number.isInteger(numeric) && numeric > 0) {
            return numeric;
        }

        return null;
    }

    syncSlideFromLocation() {
        const slideNumber = this.resolveRequestedSlide();
        if (!slideNumber) {
            return;
        }

        this.sendGoToSlide(slideNumber);
    }

    updateLocationHash(slideNumber) {
        const numeric = Number(slideNumber);
        if (!Number.isInteger(numeric) || numeric < 1) {
            return;
        }

        const nextHash = `#${numeric}`;
        if (window.location.hash === nextHash) {
            return;
        }

        const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
        history.replaceState(history.state, '', nextUrl);
    }

    clearRuntimeProbeTimer() {
        window.clearTimeout(this.runtimeProbeTimer);
        this.runtimeProbeTimer = null;
    }

    clearRuntimeFallbackTimer() {
        window.clearTimeout(this.runtimeFallbackTimer);
        this.runtimeFallbackTimer = null;
        this.clearRuntimeProbeTimer();
    }

    startRuntimeFallbackTimer() {
        this.clearRuntimeFallbackTimer();
        const timeoutMs = this.record?.html ? 4200 : 5200;
        this.runtimeFallbackTimer = window.setTimeout(() => {
            if (this.runtimeReady) {
                return;
            }

            if (this.record?.html) {
                this.fallbackToLegacyHtml(this.t('runtimeTimeout'));
                return;
            }

            this.showError(this.t('runtimeFailedTitle'), this.t('runtimeNoFallback'));
        }, timeoutMs);
    }

    probeRuntimeHandshake(force = false) {
        if (this.renderMode !== 'runtime' || this.runtimeReady) {
            return;
        }

        const frameWindow = this.elements.frame?.contentWindow;
        if (!frameWindow) {
            return;
        }

        if (!force && this.runtimeProbeAttempts >= 8) {
            return;
        }

        this.runtimeProbeAttempts += 1;
        frameWindow.postMessage({
            type: 'presentation-runtime-probe',
            presentationId: this.presentationId,
            sessionId: this.runtimeSessionId
        }, '*');

        this.clearRuntimeProbeTimer();
        if (!this.runtimeReady && this.runtimeProbeAttempts < 8) {
            this.runtimeProbeTimer = window.setTimeout(() => this.probeRuntimeHandshake(false), 280);
        }
    }

    loadRuntimePreview() {
        this.runtimeReady = false;
        this.renderMode = 'runtime';
        this.runtimeSessionId = `runtime_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        this.runtimeProbeAttempts = 0;

        const runtimeParams = new URLSearchParams({
            id: this.presentationId,
            session: this.runtimeSessionId
        });

        if (this.locale === 'en') {
            runtimeParams.set('lang', 'en');
        }

        this.elements.frame.removeAttribute('srcdoc');
        this.elements.frame.src = `/presentation-runtime.html?${runtimeParams.toString()}`;
        this.startRuntimeFallbackTimer();
    }

    handleRuntimeReady(payload = {}) {
        if (this.renderMode !== 'runtime') {
            return;
        }

        if (payload.sessionId && this.runtimeSessionId && payload.sessionId !== this.runtimeSessionId) {
            return;
        }

        this.runtimeReady = true;
        this.clearRuntimeFallbackTimer();
        if (this.elements.toolbarStatus) {
            this.elements.toolbarStatus.textContent = this.t('statusReady');
        }
        this.focusPresentation();
        this.syncSlideFromLocation();
    }

    handleRuntimeError(message) {
        if (this.runtimeReady) {
            return;
        }

        this.fallbackToLegacyHtml(message || this.t('runtimeInitFailed'));
    }

    fallbackToLegacyHtml(message) {
        this.clearRuntimeFallbackTimer();

        if (this.record?.html) {
            this.renderMode = 'legacy-html';
            this.elements.frame.removeAttribute('src');
            this.elements.frame.srcdoc = this.record.html;
            if (this.elements.toolbarStatus) {
                this.elements.toolbarStatus.textContent = this.t('statusFallback');
            }
            this.focusPresentation();
            this.syncSlideFromLocation();
            return;
        }

        this.showError(this.t('runtimeFailedTitle'), message || this.t('runtimeNoFallback'));
    }

    showError(title, message) {
        window.clearTimeout(this.pollTimer);
        this.clearRuntimeFallbackTimer();
        this.setToolbarState('hidden');
        this.elements.loading.style.display = 'none';
        this.elements.frame.style.display = 'none';
        this.elements.error.style.display = 'grid';
        this.elements.errorTitle.textContent = title;
        this.elements.errorMessage.textContent = message;
        document.title = `${title} - Xiangyu Slides`;
    }

    async copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            window.alert(this.t('copied'));
        } catch (error) {
            window.prompt(this.t('copyPrompt'), window.location.href);
        }
    }

    downloadHtml() {
        if (!this.record?.html) {
            return;
        }

        const blob = new Blob([this.record.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.record.title || this.presentationId}.html`;
        link.click();
        URL.revokeObjectURL(url);
    }

    downloadPptx() {
        const pptxUrl = this.record?.pptxUrl || `/api/presentations/${this.presentationId}/export.pptx`;
        window.open(pptxUrl, '_blank', 'noopener');
    }

    openRawHtml() {
        window.open(`/api/presentations/${this.presentationId}/html`, '_blank', 'noopener');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.__xiangyuPresentationViewer = new PresentationViewer();
});
