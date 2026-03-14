class PresentationViewer {
    constructor() {
        this.presentationId = this.resolvePresentationId();
        this.pollTimer = null;
        this.record = null;

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
                    message: '正在等待创建页把任务写入服务器...'
                });
                this.schedulePoll();
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '读取演示稿失败');
            }

            this.record = data;

            if (data.status === 'ready' && data.html) {
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
        this.elements.frame.srcdoc = data.html;

        document.title = `${data.title || '演示稿'} - Xiangyu Slides`;
    }

    showError(title, message) {
        window.clearTimeout(this.pollTimer);

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

        return [
            { index: 1, label: '脚本校验', description: '确认内容结构' },
            { index: 2, label: '风格编排', description: '应用主题系统' },
            { index: 3, label: 'HTML 生成', description: '输出幻灯片页面' },
            { index: 4, label: '页面保存', description: '写入独立记录' },
            { index: 5, label: '独立打开', description: '准备访问页面' }
        ];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const viewer = new PresentationViewer();
    window.copyLink = () => viewer.copyLink();
    window.downloadHtml = () => viewer.downloadHtml();
    window.downloadPptx = () => viewer.downloadPptx();
    window.openRawHtml = () => viewer.openRawHtml();
    window.retryLoadPresentation = () => viewer.loadPresentation();
});
