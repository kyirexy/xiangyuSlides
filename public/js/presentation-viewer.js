class PresentationViewer {
    constructor() {
        this.presentationId = this.resolvePresentationId();
        this.pollTimer = null;
        this.record = null;
        this.inputBridgeBound = false;
        this.runtimeSessionId = null;
        this.runtimeReady = false;
        this.runtimeFallbackTimer = null;
        this.runtimeProbeTimer = null;
        this.runtimeProbeAttempts = 0;
        this.runtimeFrameLoaded = false;
        this.renderMode = null;

        this.elements = {
            loading: document.getElementById('loading'),
            loadingTitle: document.getElementById('loadingTitle'),
            loadingMessage: document.getElementById('loadingMessage'),
            loadingProgress: document.getElementById('loadingProgress'),
            loadingSteps: document.getElementById('loadingSteps'),
            loadingId: document.getElementById('loadingId'),
            toolbar: document.getElementById('toolbar'),
            toolbarTitle: document.getElementById('toolbarTitle'),
            toolbarId: document.getElementById('toolbarId'),
            frame: document.getElementById('preview-frame'),
            error: document.getElementById('error'),
            errorTitle: document.getElementById('errorTitle'),
            errorMessage: document.getElementById('errorMessage')
        };

        this.ensureToolbarActions();
        this.bindInputBridge();
        this.init();
    }

    ensureToolbarActions() {
        const actions = this.elements.toolbar?.querySelector('.toolbar-actions');
        if (!actions || actions.querySelector('[data-action="download-pptx"]')) {
            return;
        }

        const button = document.createElement('button');
        button.className = 'toolbar-btn';
        button.dataset.action = 'download-pptx';
        button.textContent = 'Download PPTX';
        button.addEventListener('click', () => this.downloadPptx());

        const primaryButton = actions.querySelector('.primary');
        if (primaryButton) {
            actions.insertBefore(button, primaryButton);
            return;
        }

        actions.appendChild(button);
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
                this.runtimeFrameLoaded = true;
                this.probeRuntimeHandshake(true);

                if (this.runtimeReady) {
                    this.focusPresentation();
                    this.syncSlideFromLocation();
                }
            }
        });

        this.elements.frame?.addEventListener('mouseenter', () => {
            this.focusPresentation();
        });

        this.elements.frame?.addEventListener('click', () => {
            this.focusPresentation();
        });
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

        const frameWindow = frame.contentWindow;
        if (!frameWindow) {
            return;
        }

        frameWindow.focus();
        frameWindow.postMessage({
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

    init() {
        if (!this.presentationId) {
            this.showError('无效的演示稿地址', '当前链接里没有可用的演示稿 ID。');
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
                    message: '正在等待创建页把任务写入服务端...'
                });
                this.schedulePoll();
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '读取演示稿失败');
            }

            this.record = data;

            if (data.status === 'ready') {
                this.renderPresentation(data);
                return;
            }

            if (data.status === 'failed') {
                this.showError('演示稿生成失败', data.error || data.message || '请回到创建页重新发起生成。');
                return;
            }

            this.showLoading(data);
            this.schedulePoll();
        } catch (error) {
            this.showError('加载失败', error.message);
        }
    }

    schedulePoll() {
        window.clearTimeout(this.pollTimer);
        this.pollTimer = window.setTimeout(() => this.loadPresentation(), 1200);
    }

    showLoading(data) {
        const steps = this.getBuildSteps();
        const currentStep = data.step || 1;
        const progress = Math.max(0, data.progress || 0);

        this.clearRuntimeFallbackTimer();
        this.elements.loading.style.display = 'flex';
        this.elements.error.style.display = 'none';
        this.elements.toolbar.style.display = 'none';
        this.elements.frame.style.display = 'none';

        this.elements.loadingTitle.textContent = data.title || '演示稿正在生成';
        this.elements.loadingMessage.textContent = data.message || '正在准备内容...';
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

        document.title = `${data.title || '演示稿'} 正在生成 - Xiangyu Slides`;
    }

    renderPresentation(data) {
        window.clearTimeout(this.pollTimer);

        this.elements.loading.style.display = 'none';
        this.elements.error.style.display = 'none';
        this.elements.toolbar.style.display = 'flex';
        this.elements.frame.style.display = 'block';

        this.elements.toolbarTitle.textContent = data.title || '未命名演示稿';
        this.elements.toolbarId.textContent = data.id;
        this.elements.frame.setAttribute('tabindex', '0');
        document.title = `${data.title || '演示稿'} - Xiangyu Slides`;

        this.loadRuntimePreview();
    }

    loadRuntimePreview() {
        this.runtimeReady = false;
        this.renderMode = 'runtime';
        this.runtimeSessionId = `runtime_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        this.clearRuntimeFallbackTimer();

        if (this.record?.html) {
            this.runtimeFallbackTimer = window.setTimeout(() => {
                if (!this.runtimeReady) {
                    this.fallbackToLegacyHtml('场景运行时加载超时，已回退到兼容 HTML 预览。');
                }
            }, 3200);
        }

        this.elements.frame.removeAttribute('srcdoc');
        this.elements.frame.src = `/presentation-runtime.html?id=${encodeURIComponent(this.presentationId)}&session=${encodeURIComponent(this.runtimeSessionId)}`;
    }

    handleRuntimeReady() {
        this.runtimeReady = true;
        this.clearRuntimeFallbackTimer();
        this.focusPresentation();
        this.syncSlideFromLocation();
    }

    handleRuntimeError(message) {
        if (this.runtimeReady) {
            return;
        }

        this.fallbackToLegacyHtml(message || '场景运行时初始化失败。');
    }

    fallbackToLegacyHtml(message) {
        this.clearRuntimeFallbackTimer();

        if (this.record?.html) {
            this.renderMode = 'legacy-html';
            this.elements.frame.removeAttribute('src');
            this.elements.frame.srcdoc = this.record.html;
            this.focusPresentation();
            this.syncSlideFromLocation();
            return;
        }

        this.showError('无法加载场景预览', message || '场景运行时初始化失败，且没有可回退的 HTML 预览。');
    }

    clearRuntimeFallbackTimer() {
        window.clearTimeout(this.runtimeFallbackTimer);
        this.runtimeFallbackTimer = null;
    }

    showError(title, message) {
        window.clearTimeout(this.pollTimer);
        this.clearRuntimeFallbackTimer();

        this.elements.loading.style.display = 'none';
        this.elements.toolbar.style.display = 'none';
        this.elements.frame.style.display = 'none';
        this.elements.error.style.display = 'flex';
        this.elements.errorTitle.textContent = title;
        this.elements.errorMessage.textContent = message;
        document.title = '加载失败 - Xiangyu Slides';
    }

    async copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            window.alert('链接已复制到剪贴板。');
        } catch (error) {
            window.prompt('复制下面的链接', window.location.href);
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

    loadRuntimePreview() {
        this.runtimeReady = false;
        this.renderMode = 'runtime';
        this.runtimeSessionId = `runtime_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        this.clearRuntimeFallbackTimer();

        const currentParams = new URLSearchParams(window.location.search);
        const requestedLang = currentParams.get('lang')
            || document.documentElement.lang
            || navigator.language
            || '';
        const runtimeParams = new URLSearchParams({
            id: this.presentationId,
            session: this.runtimeSessionId
        });

        if (requestedLang) {
            runtimeParams.set('lang', requestedLang);
        }

        if (this.record?.html) {
            this.runtimeFallbackTimer = window.setTimeout(() => {
                if (!this.runtimeReady) {
                    this.fallbackToLegacyHtml('场景运行时加载超时，已回退到兼容 HTML 预览。');
                }
            }, 3200);
        }

        this.elements.frame.removeAttribute('srcdoc');
        this.elements.frame.src = `/presentation-runtime.html?${runtimeParams.toString()}`;
    }

    openRawHtml() {
        window.open(`/api/presentations/${this.presentationId}/html`, '_blank', 'noopener');
    }

    getBuildSteps() {
        return [
            { index: 1, label: 'Outline Check', description: 'Normalize structure and slide count' },
            { index: 2, label: 'Theme Apply', description: 'Apply stable style tokens locally' },
            { index: 3, label: 'Stable Render', description: 'Render viewport-safe HTML slides' },
            { index: 4, label: 'Save Record', description: 'Persist preview and export metadata' },
            { index: 5, label: 'Ready', description: 'Independent URL and PPTX export available' }
        ];
    }
}

const VIEWER_I18N = {
    'zh-CN': {
        pageTitle: '演示稿预览 - Xiangyu Slides',
        untitledDeck: '未命名演示稿',
        invalidLinkTitle: '无效的演示稿地址',
        invalidLinkMessage: '当前链接里没有可用的演示稿 ID。',
        waitingRecord: '正在等待创建页开始生成任务...',
        loadFailed: '读取演示稿失败',
        generationFailed: '演示稿生成失败',
        generationFailedMessage: '请回到创建页重新发起生成。',
        loadingFailedTitle: '加载失败',
        runtimeTimeout: '场景运行时加载超时，已回退到兼容 HTML 预览。',
        runtimeInitFailed: '场景运行时初始化失败。',
        runtimeFallbackMissing: '场景运行时初始化失败，且没有可回退的 HTML 预览。',
        runtimeUnavailableTitle: '无法加载场景预览',
        openFailedTitle: '无法打开演示稿',
        openFailedMessage: '这份演示稿可能还没有生成成功，或者链接已经失效。',
        generatingTitle: '演示稿正在生成',
        preparingContent: '正在准备内容...',
        fixedRoute: '访问地址已固定',
        retry: '重新加载',
        copyLink: '复制链接',
        downloadHtml: '下载 HTML',
        downloadPptx: '下载 PPTX',
        openRawHtml: '打开原始 HTML',
        copied: '链接已复制到剪贴板。',
        copyPrompt: '复制下面的链接',
        titleGeneratingSuffix: '正在生成',
        buildSteps: [
            { index: 1, label: '脚本校验', description: '检查结构和页数' },
            { index: 2, label: '主题应用', description: '应用稳定主题与样式令牌' },
            { index: 3, label: '稳定渲染', description: '生成可预览的 HTML 幻灯片' },
            { index: 4, label: '保存记录', description: '持久化预览和导出元数据' },
            { index: 5, label: '生成完成', description: '独立链接与 PPTX 可用' }
        ]
    },
    en: {
        pageTitle: 'Presentation Preview - Xiangyu Slides',
        untitledDeck: 'Untitled Presentation',
        invalidLinkTitle: 'Invalid presentation URL',
        invalidLinkMessage: 'No usable presentation id was found in the current link.',
        waitingRecord: 'Waiting for the create page to register the generation task...',
        loadFailed: 'Failed to load the presentation',
        generationFailed: 'Presentation generation failed',
        generationFailedMessage: 'Go back to the create page and start a new build.',
        loadingFailedTitle: 'Load Failed',
        runtimeTimeout: 'The scene runtime timed out and the viewer fell back to the compatible HTML preview.',
        runtimeInitFailed: 'The scene runtime failed to initialize.',
        runtimeFallbackMissing: 'The scene runtime failed to initialize and there is no HTML fallback available.',
        runtimeUnavailableTitle: 'Unable to load the scene preview',
        openFailedTitle: 'Unable to open the presentation',
        openFailedMessage: 'This presentation may not be ready yet, or the link is no longer valid.',
        generatingTitle: 'Presentation is being generated',
        preparingContent: 'Preparing content...',
        fixedRoute: 'The access route is already fixed',
        retry: 'Retry',
        copyLink: 'Copy Link',
        downloadHtml: 'Download HTML',
        downloadPptx: 'Download PPTX',
        openRawHtml: 'Open Raw HTML',
        copied: 'Link copied to clipboard.',
        copyPrompt: 'Copy the link below',
        titleGeneratingSuffix: 'Generating',
        buildSteps: [
            { index: 1, label: 'Outline Check', description: 'Validate structure and slide count' },
            { index: 2, label: 'Theme Apply', description: 'Apply stable theme tokens locally' },
            { index: 3, label: 'Stable Render', description: 'Render viewport-safe HTML slides' },
            { index: 4, label: 'Save Record', description: 'Persist preview and export metadata' },
            { index: 5, label: 'Ready', description: 'Standalone URL and PPTX export available' }
        ]
    }
};

function resolveViewerLocale() {
    if (window.XiangyuI18n?.resolveLocale) {
        return window.XiangyuI18n.resolveLocale();
    }

    const params = new URLSearchParams(window.location.search);
    const requested = String(params.get('lang') || '').trim().toLowerCase();
    const preferred = requested
        || String(document.documentElement.lang || '').trim().toLowerCase()
        || String(navigator.language || navigator.userLanguage || '').trim().toLowerCase();

    return preferred.startsWith('zh') ? 'zh-CN' : 'en';
}

Object.assign(PresentationViewer.prototype, {
    t(key) {
        const copy = this.copy || VIEWER_I18N.en;
        return copy[key] || key;
    },

    ensureToolbarActions() {
        const actions = this.elements.toolbar?.querySelector('.toolbar-actions');
        if (!actions) {
            return;
        }

        let button = actions.querySelector('[data-action="download-pptx"]');
        if (!button) {
            button = document.createElement('button');
            button.className = 'toolbar-btn';
            button.dataset.action = 'download-pptx';
            button.addEventListener('click', () => this.downloadPptx());

            const primaryButton = actions.querySelector('.primary');
            if (primaryButton) {
                actions.insertBefore(button, primaryButton);
            } else {
                actions.appendChild(button);
            }
        }
    },

    applyStaticI18n() {
        document.title = this.t('pageTitle');

        const copyLinkBtn = document.getElementById('copyLinkBtn');
        const downloadHtmlBtn = document.getElementById('downloadHtmlBtn');
        const openRawHtmlBtn = document.getElementById('openRawHtmlBtn');
        const retryLoadBtn = document.getElementById('retryLoadBtn');
        const loadingRoutePill = document.getElementById('loadingRoutePill');
        const pptxBtn = this.elements.toolbar?.querySelector('[data-action="download-pptx"]');

        if (copyLinkBtn) {
            copyLinkBtn.textContent = this.t('copyLink');
        }
        if (downloadHtmlBtn) {
            downloadHtmlBtn.textContent = this.t('downloadHtml');
        }
        if (openRawHtmlBtn) {
            openRawHtmlBtn.textContent = this.t('openRawHtml');
        }
        if (retryLoadBtn) {
            retryLoadBtn.textContent = this.t('retry');
        }
        if (loadingRoutePill) {
            loadingRoutePill.textContent = this.t('fixedRoute');
        }
        if (pptxBtn) {
            pptxBtn.textContent = this.t('downloadPptx');
        }
    },

    init() {
        this.locale = resolveViewerLocale();
        this.copy = VIEWER_I18N[this.locale] || VIEWER_I18N.en;
        window.XiangyuI18n?.setPageLocale?.(this.locale);
        this.applyStaticI18n();

        if (!this.presentationId) {
            this.showError(this.t('invalidLinkTitle'), this.t('invalidLinkMessage'));
            return;
        }

        if (this.elements.loadingId) {
            this.elements.loadingId.textContent = this.presentationId;
        }

        this.loadPresentation();
    },

    async loadPresentation() {
        try {
            const response = await fetch(`/api/presentations/${this.presentationId}`, {
                cache: 'no-store'
            });

            if (response.status === 404) {
                this.showLoading({
                    progress: 4,
                    step: 1,
                    message: this.t('waitingRecord')
                });
                this.schedulePoll();
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || this.t('loadFailed'));
            }

            this.record = data;

            if (data.status === 'ready') {
                this.renderPresentation(data);
                return;
            }

            if (data.status === 'failed') {
                this.showError(this.t('generationFailed'), data.error || data.message || this.t('generationFailedMessage'));
                return;
            }

            this.showLoading(data);
            this.schedulePoll();
        } catch (error) {
            this.showError(this.t('loadingFailedTitle'), error.message);
        }
    },

    showLoading(data) {
        const steps = this.getBuildSteps();
        const currentStep = data.step || 1;
        const progress = Math.max(0, data.progress || 0);

        this.clearRuntimeFallbackTimer();
        this.elements.loading.style.display = 'flex';
        this.elements.error.style.display = 'none';
        this.elements.toolbar.style.display = 'none';
        this.elements.frame.style.display = 'none';

        this.elements.loadingTitle.textContent = data.title || this.t('generatingTitle');
        this.elements.loadingMessage.textContent = data.message || this.t('preparingContent');
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
    },

    renderPresentation(data) {
        window.clearTimeout(this.pollTimer);

        this.elements.loading.style.display = 'none';
        this.elements.error.style.display = 'none';
        this.elements.toolbar.style.display = 'flex';
        this.elements.frame.style.display = 'block';

        this.elements.toolbarTitle.textContent = data.title || this.t('untitledDeck');
        this.elements.toolbarId.textContent = data.id;
        this.elements.frame.setAttribute('tabindex', '0');
        document.title = `${data.title || this.t('untitledDeck')} - Xiangyu Slides`;

        this.loadRuntimePreview();
    },

    isActiveRuntimeSource(sourceWindow) {
        const frameWindow = this.elements.frame?.contentWindow;
        if (!frameWindow || !sourceWindow) {
            return false;
        }

        return frameWindow === sourceWindow;
    },

    clearRuntimeProbeTimer() {
        window.clearTimeout(this.runtimeProbeTimer);
        this.runtimeProbeTimer = null;
    },

    startRuntimeFallbackTimer() {
        const timeoutMs = this.record?.html ? 4200 : 5200;
        this.clearRuntimeFallbackTimer();
        this.runtimeFallbackTimer = window.setTimeout(() => {
            if (this.runtimeReady) {
                return;
            }

            if (this.record?.html) {
                this.fallbackToLegacyHtml(this.t('runtimeTimeout'));
                return;
            }

            this.showError(this.t('runtimeUnavailableTitle'), this.t('runtimeFallbackMissing'));
        }, timeoutMs);
    },

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
            this.runtimeProbeTimer = window.setTimeout(() => {
                this.probeRuntimeHandshake(false);
            }, 280);
        }
    },

    loadRuntimePreview() {
        this.runtimeReady = false;
        this.renderMode = 'runtime';
        this.runtimeSessionId = `runtime_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        this.runtimeProbeAttempts = 0;
        this.runtimeFrameLoaded = false;
        this.clearRuntimeFallbackTimer();

        const currentParams = new URLSearchParams(window.location.search);
        const requestedLang = currentParams.get('lang')
            || document.documentElement.lang
            || navigator.language
            || '';
        const runtimeParams = new URLSearchParams({
            id: this.presentationId,
            session: this.runtimeSessionId
        });

        if (requestedLang) {
            runtimeParams.set('lang', requestedLang);
        }

        this.elements.frame.removeAttribute('srcdoc');
        this.elements.frame.src = `/presentation-runtime.html?${runtimeParams.toString()}`;
        this.startRuntimeFallbackTimer();
    },

    handleRuntimeReady(payload = {}) {
        if (this.renderMode !== 'runtime') {
            return;
        }

        if (payload.sessionId && this.runtimeSessionId && payload.sessionId !== this.runtimeSessionId) {
            return;
        }

        this.runtimeReady = true;
        this.clearRuntimeFallbackTimer();
        this.focusPresentation();
        this.syncSlideFromLocation();
    },

    handleRuntimeError(message) {
        if (this.runtimeReady) {
            return;
        }

        this.fallbackToLegacyHtml(message || this.t('runtimeInitFailed'));
    },

    fallbackToLegacyHtml(message) {
        this.clearRuntimeFallbackTimer();

        if (this.record?.html) {
            this.renderMode = 'legacy-html';
            this.elements.frame.removeAttribute('src');
            this.elements.frame.srcdoc = this.record.html;
            this.focusPresentation();
            this.syncSlideFromLocation();
            return;
        }

        this.showError(this.t('runtimeUnavailableTitle'), message || this.t('runtimeFallbackMissing'));
    },

    clearRuntimeFallbackTimer() {
        window.clearTimeout(this.runtimeFallbackTimer);
        this.runtimeFallbackTimer = null;
        this.clearRuntimeProbeTimer();
    },

    showError(title, message) {
        window.clearTimeout(this.pollTimer);
        this.clearRuntimeFallbackTimer();

        this.elements.loading.style.display = 'none';
        this.elements.toolbar.style.display = 'none';
        this.elements.frame.style.display = 'none';
        this.elements.error.style.display = 'flex';
        this.elements.errorTitle.textContent = title;
        this.elements.errorMessage.textContent = message;
        document.title = `${this.t('loadingFailedTitle')} - Xiangyu Slides`;
    },

    async copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            window.alert(this.t('copied'));
        } catch (error) {
            window.prompt(this.t('copyPrompt'), window.location.href);
        }
    },

    getBuildSteps() {
        return this.copy?.buildSteps || VIEWER_I18N.en.buildSteps;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const viewer = new PresentationViewer();
    window.copyLink = () => viewer.copyLink();
    window.downloadHtml = () => viewer.downloadHtml();
    window.downloadPptx = () => viewer.downloadPptx();
    window.openRawHtml = () => viewer.openRawHtml();
    window.retryLoadPresentation = () => viewer.loadPresentation();
});
