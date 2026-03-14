class CreateStudio {
    constructor() {
        this.config = {
            purpose: null,
            length: null,
            style: null
        };
        this.currentOutline = null;
        this.currentSlides = [];
        this.editingSlideIndex = null;
        this.generatedHtml = null;
        this.presentationId = null;
        this.presentationUrl = null;
        this.pptxUrl = null;
        this.isGenerating = false;
        this.previewWindow = null;
        this.buildLogs = [];
        this.lastBuildState = null;

        this.elements = {
            textarea: document.getElementById('userInput'),
            sendButton: document.getElementById('btnSend'),
            resultArea: document.getElementById('resultArea'),
            purposeArea: document.getElementById('purposeArea'),
            lengthArea: document.getElementById('lengthArea'),
            styleArea: document.getElementById('styleArea'),
            editModal: document.getElementById('editModal'),
            editPrompt: document.getElementById('slideEditPrompt'),
            editText: document.getElementById('slideEditText'),
            editJsonArea: document.getElementById('editJsonArea'),
            editLoading: document.getElementById('editLoading'),
            closeModal: document.getElementById('closeModal'),
            cancelEdit: document.getElementById('cancelEdit'),
            regenerateEdit: document.getElementById('regenerateEdit'),
            saveEdit: document.getElementById('saveEdit')
        };

        this.quickPrompts = {
            '教学培训': '帮我做一个 AI 发展教学演示 PPT，面向零基础学员，包含人工智能发展史、机器学习基础、深度学习核心原理、Transformer 应用、主流框架对比，以及 AI 在医疗、金融、教育和自动驾驶中的应用趋势。',
            '产品发布': '帮我做一个新产品发布会演示 PPT，用于面向投资者、媒体和客户正式发布一款创新产品，内容需要包含市场痛点、核心功能、技术优势、交互体验、竞品分析、定价策略、推广计划和路线图。',
            '融资演讲': '帮我做一个商业融资路演 PPT，用于向投资人展示项目并争取融资，内容包含项目简介、市场空间、团队背景、商业模式、竞争优势、财务预测、融资需求和资金用途。',
            '技术分享': '帮我做一个技术专题分享演示 PPT，用于向团队或技术社区讲解一项技术方案，内容包含技术背景、核心原理、系统架构、详细设计、性能优化、踩坑记录、代码示例和效果数据。',
            '年度报告': '帮我做一个企业年度总结演示 PPT，用于向员工、股东和合作伙伴汇报全年工作，内容包含经营回顾、核心业务指标、产品研发成果、技术与工程成就、市场拓展、团队建设、财务表现和下一年规划。'
        };

        this.init();
    }

    init() {
        this.bindComposer();
        this.bindSelectors();
        this.bindEditModal();

        window.quickGenerate = (type) => this.quickGenerate(type);
        window.editSlide = (index) => this.openEditModal(index);
    }

    bindComposer() {
        const { textarea, sendButton } = this.elements;
        if (!textarea || !sendButton) {
            return;
        }

        textarea.addEventListener('input', () => {
            this.resizeTextarea();
            sendButton.disabled = !textarea.value.trim();
        });

        sendButton.addEventListener('click', () => this.generateOutline());
        textarea.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.generateOutline();
            }
        });
    }

    bindSelectors() {
        const { purposeArea, lengthArea, styleArea } = this.elements;

        if (purposeArea) {
            purposeArea.addEventListener('click', (event) => {
                const button = event.target.closest('.quick-action');
                if (!button) {
                    return;
                }

                this.toggleSelection(purposeArea, button, 'active');
                this.config.purpose = button.classList.contains('active') ? button.dataset.val : null;
            });
        }

        if (lengthArea) {
            lengthArea.addEventListener('click', (event) => {
                const button = event.target.closest('.length-btn');
                if (!button) {
                    return;
                }

                this.toggleSelection(lengthArea, button, 'active');
                this.config.length = button.classList.contains('active') ? button.dataset.val : null;
            });
        }

        if (styleArea) {
            styleArea.addEventListener('click', (event) => {
                const card = event.target.closest('.style-preview-card');
                if (!card) {
                    return;
                }

                this.toggleSelection(styleArea, card, 'active');
                this.config.style = card.classList.contains('active') ? card.dataset.val : null;
            });
        }
    }

    bindEditModal() {
        const {
            editModal,
            closeModal,
            cancelEdit,
            regenerateEdit,
            saveEdit
        } = this.elements;

        if (editModal) {
            editModal.addEventListener('click', (event) => {
                if (event.target === editModal) {
                    this.closeEditModal();
                }
            });
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeEditModal());
        }

        if (cancelEdit) {
            cancelEdit.addEventListener('click', () => this.closeEditModal());
        }

        if (regenerateEdit) {
            regenerateEdit.addEventListener('click', () => this.regenerateSlide());
        }

        if (saveEdit) {
            saveEdit.addEventListener('click', () => this.saveEditedSlide());
        }
    }

    toggleSelection(container, activeElement, className) {
        if (activeElement.classList.contains(className)) {
            activeElement.classList.remove(className);
            return;
        }

        container.querySelectorAll(`.${className}`).forEach((item) => item.classList.remove(className));
        activeElement.classList.add(className);
    }

    resizeTextarea() {
        const { textarea } = this.elements;
        if (!textarea) {
            return;
        }

        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
    }

    async generateOutline() {
        const { textarea, sendButton, resultArea } = this.elements;
        const message = textarea ? textarea.value.trim() : '';

        if (!message) {
            return;
        }

        if (sendButton) {
            sendButton.disabled = true;
        }

        this.renderLoadingCard('正在生成脚本...');
        resultArea?.scrollIntoView({ behavior: 'smooth', block: 'start' });

        try {
            const response = await fetch('/api/generate-outline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    purpose: this.config.purpose || 'teaching',
                    length: this.config.length || 'medium',
                    topic: message,
                    content: ''
                })
            });

            const data = await response.json();

            if (data.clarification) {
                this.renderClarificationCard(data.message);
                return;
            }

            if (!response.ok || !data.slides) {
                throw new Error(data.error || '生成脚本失败');
            }

            this.currentOutline = data;
            this.currentSlides = data.slides.map((slide, index) => ({
                ...slide,
                index: index + 1
            }));
            this.generatedHtml = null;
            this.presentationId = null;
            this.presentationUrl = null;
            this.pptxUrl = null;
            this.renderOutlineCard();
        } catch (error) {
            this.renderErrorCard(`生成脚本失败：${error.message}`);
        } finally {
            if (sendButton) {
                sendButton.disabled = false;
                sendButton.disabled = !textarea?.value.trim();
            }
        }
    }

    renderLoadingCard(message) {
        this.elements.resultArea.innerHTML = `
            <div class="result-card">
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p>${this.escapeHtml(message)}</p>
                </div>
            </div>
        `;
    }

    renderClarificationCard(message) {
        this.elements.resultArea.innerHTML = `
            <div class="result-card">
                <div class="result-header">
                    <div class="result-title">
                        <i class="ph ph-chat-circle-dots"></i>
                        还需要一点信息
                    </div>
                </div>
                <div class="outline-content">
                    <p class="result-note">${this.escapeHtml(message)}</p>
                </div>
            </div>
        `;
    }

    renderOutlineCard() {
        const slideCount = this.currentSlides.length;

        this.elements.resultArea.innerHTML = `
            <div class="result-card">
                <div class="result-header">
                    <div>
                        <div class="result-title">
                            <i class="ph ph-list-checks"></i>
                            ${this.escapeHtml(this.currentOutline.title || '未命名脚本')}
                        </div>
                        <p class="result-subtitle">${this.escapeHtml(this.currentOutline.subtitle || '脚本已生成，下一步可以开始创建独立演示页面。')}</p>
                    </div>
                    <div class="result-btns">
                        <button class="result-btn primary" id="generatePresentationBtn">
                            <i class="ph ph-play"></i>
                            开始生成
                        </button>
                    </div>
                </div>
                <div class="result-meta">
                    <span class="meta-pill">${slideCount} 页脚本</span>
                    <span class="meta-pill">${this.escapeHtml(this.getLabel('purpose', this.config.purpose) || '默认用途')}</span>
                    <span class="meta-pill">${this.escapeHtml(this.getLabel('length', this.config.length) || '中等长度')}</span>
                    <span class="meta-pill">${this.escapeHtml(this.getStyleLabel(this.config.style) || '请选择风格')}</span>
                </div>
                <div class="outline-content">
                    ${this.currentSlides.map((slide, index) => `
                        <div class="outline-slide-item">
                            <div class="slide-num">${index + 1}</div>
                            <div class="slide-info">
                                <div class="slide-title">${this.escapeHtml(slide.title || `第 ${index + 1} 页`)}</div>
                                <div class="slide-desc">${this.escapeHtml(this.getSlideSummary(slide))}</div>
                            </div>
                            <button class="slide-edit-btn" data-edit-index="${index}" title="编辑这页脚本">
                                <i class="ph ph-pencil-simple"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const generateButton = document.getElementById('generatePresentationBtn');
        if (generateButton) {
            generateButton.addEventListener('click', () => this.generatePresentation());
        }

        this.elements.resultArea.querySelectorAll('[data-edit-index]').forEach((button) => {
            button.addEventListener('click', () => {
                this.openEditModal(Number(button.dataset.editIndex));
            });
        });
    }

    renderBuildCard(state = {}) {
        const currentStep = state.step || 1;
        const progress = Math.max(0, state.progress || 0);
        const isReady = state.status === 'ready';
        const isFailed = state.status === 'failed';
        const absoluteUrl = this.presentationUrl ? `${window.location.origin}${this.presentationUrl}` : '';

        this.elements.resultArea.innerHTML = `
            <div class="result-card build-card">
                <div class="result-header">
                    <div>
                        <div class="result-title">
                            <i class="ph ph-lightning"></i>
                            ${isFailed ? '生成失败' : isReady ? '生成完成' : '正在生成独立演示页面'}
                        </div>
                        <p class="result-subtitle">${this.escapeHtml(state.message || '正在准备任务...')}</p>
                    </div>
                    <div class="result-btns">
                        <span class="id-pill">${this.escapeHtml(this.presentationId || '--')}</span>
                    </div>
                </div>
                <div class="build-body">
                    <div class="build-overview">
                        <div class="build-progress-track">
                            <div class="build-progress-bar" style="width: ${progress}%"></div>
                        </div>
                        <div class="build-progress-row">
                            <span>当前进度</span>
                            <strong>${progress}%</strong>
                        </div>
                        <div class="build-steps">
                            ${this.getBuildSteps().map((step) => {
                                const className = step.index < currentStep
                                    ? 'completed'
                                    : step.index === currentStep
                                        ? 'active'
                                        : '';
                                return `
                                    <div class="build-step ${className}">
                                        <span class="build-step-index">${step.index}</span>
                                        <div>
                                            <strong>${step.label}</strong>
                                            <span>${step.description}</span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    <div class="build-sidebar">
                        <div class="status-panel">
                            <div class="status-panel-title">访问地址</div>
                            <a class="result-link" href="${this.escapeHtml(this.presentationUrl || '#')}" target="_blank" rel="noopener">
                                ${this.escapeHtml(absoluteUrl || '生成后会出现在这里')}
                            </a>
                            <div class="status-panel-actions">
                                <button class="result-btn" id="openPresentationBtn" ${this.presentationUrl ? '' : 'disabled'}>
                                    <i class="ph ph-arrow-square-out"></i>
                                    打开页面
                                </button>
                                <button class="result-btn" id="copyPresentationLinkBtn" ${this.presentationUrl ? '' : 'disabled'}>
                                    <i class="ph ph-link"></i>
                                    复制链接
                                </button>
                            </div>
                        </div>
                        <div class="status-panel">
                            <div class="status-panel-title">生成动态</div>
                            <div class="build-log">
                                ${this.buildLogs.map((item) => `
                                    <div class="build-log-item">
                                        <span>${this.escapeHtml(item.time)}</span>
                                        <strong>${this.escapeHtml(item.message)}</strong>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const openButton = document.getElementById('openPresentationBtn');
        const copyButton = document.getElementById('copyPresentationLinkBtn');

        if (openButton) {
            openButton.addEventListener('click', () => this.openPresentationPage());
        }

        if (copyButton) {
            copyButton.addEventListener('click', () => this.copyPresentationLink());
        }
    }

    renderSuccessCard(record) {
        this.generatedHtml = record.html;
        this.pptxUrl = record.pptxUrl || `/api/presentations/${this.presentationId}/export.pptx`;
        this.lastBuildState = {
            status: 'ready',
            progress: 100,
            step: 5,
            message: '演示稿已生成完成，可以直接在独立页面查看。'
        };
        this.appendBuildLog('演示稿已生成完成，可以直接在独立页面查看。');
        this.renderBuildCard(this.lastBuildState);

        const sidebar = this.elements.resultArea.querySelector('.build-sidebar');
        if (sidebar) {
            const successPanel = document.createElement('div');
            successPanel.className = 'status-panel';
            successPanel.innerHTML = `
                <div class="status-panel-title">可执行操作</div>
                <div class="status-panel-actions stacked">
                    <button class="result-btn primary" id="openReadyPresentationBtn">
                        <i class="ph ph-monitor-play"></i>
                        前往独立页面
                    </button>
                    <button class="result-btn" id="downloadPresentationBtn">
                        <i class="ph ph-download-simple"></i>
                        下载 HTML
                    </button>
                </div>
            `;
            sidebar.appendChild(successPanel);
            const actions = successPanel.querySelector('.status-panel-actions');
            if (actions) {
                actions.insertAdjacentHTML('beforeend', `
                    <button class="result-btn" id="downloadPptxBtn">
                        <i class="ph ph-file-arrow-down"></i>
                        Download PPTX
                    </button>
                `);
            }
        }

        document.getElementById('openReadyPresentationBtn')?.addEventListener('click', () => this.openPresentationPage());
        document.getElementById('downloadPresentationBtn')?.addEventListener('click', () => this.downloadHTML());
        document.getElementById('downloadPptxBtn')?.addEventListener('click', () => this.downloadPPTX());
    }

    renderErrorCard(message) {
        this.elements.resultArea.innerHTML = `
            <div class="result-card">
                <div class="error-msg">${this.escapeHtml(message)}</div>
            </div>
        `;
    }

    async generatePresentation() {
        if (!this.currentOutline || this.currentSlides.length === 0) {
            this.notify('请先生成脚本', 'error');
            return;
        }

        if (!this.config.style) {
            this.notify('请先选择一种风格', 'error');
            return;
        }

        if (this.isGenerating) {
            return;
        }

        this.isGenerating = true;
        this.generatedHtml = null;
        this.presentationId = `pres_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        this.presentationUrl = `/presentations/${this.presentationId}`;
        this.pptxUrl = `/api/presentations/${this.presentationId}/export.pptx`;
        this.buildLogs = [];
        this.lastBuildState = {
            progress: 2,
            step: 1,
            status: 'building',
            message: '已创建独立页面，正在启动生成任务...'
        };
        this.appendBuildLog(this.lastBuildState.message);
        this.renderBuildCard(this.lastBuildState);

        this.previewWindow = window.open(this.presentationUrl, '_blank', 'noopener');

        try {
            const response = await fetch('/api/presentations/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    presentationId: this.presentationId,
                    outline: {
                        title: this.currentOutline.title,
                        subtitle: this.currentOutline.subtitle,
                        slides: this.currentSlides
                    },
                    style: this.config.style,
                    editing: true
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || '创建演示稿失败');
            }

            await this.consumeEventStream(response, (event) => {
                this.lastBuildState = event;
                this.appendBuildLog(event.message);
                this.renderBuildCard(event);

                if (event.status === 'failed') {
                    throw new Error(event.error || event.message || '创建演示稿失败');
                }
            });

            if (!this.lastBuildState || this.lastBuildState.status !== 'ready') {
                throw new Error('服务端未返回完成状态');
            }

            const record = await this.fetchPresentationRecord(this.presentationId);
            this.renderSuccessCard(record);

            if (this.previewWindow && !this.previewWindow.closed) {
                this.previewWindow.focus();
            }

            this.notify('演示稿已生成，独立页面已可访问。');
        } catch (error) {
            this.lastBuildState = {
                status: 'failed',
                progress: this.lastBuildState?.progress || 0,
                step: this.lastBuildState?.step || 4,
                message: error.message
            };
            this.appendBuildLog(error.message);
            this.renderBuildCard(this.lastBuildState);
            this.notify(error.message, 'error');
        } finally {
            this.isGenerating = false;
        }
    }

    async consumeEventStream(response, onEvent) {
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('浏览器不支持流式响应');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

            let separatorIndex = buffer.indexOf('\n\n');
            while (separatorIndex !== -1) {
                const rawEvent = buffer.slice(0, separatorIndex).trim();
                buffer = buffer.slice(separatorIndex + 2);

                if (rawEvent) {
                    const payload = rawEvent
                        .split('\n')
                        .filter((line) => line.startsWith('data: '))
                        .map((line) => line.slice(6))
                        .join('');

                    if (payload) {
                        onEvent(JSON.parse(payload));
                    }
                }

                separatorIndex = buffer.indexOf('\n\n');
            }

            if (done) {
                break;
            }
        }
    }

    appendBuildLog(message) {
        if (!message) {
            return;
        }

        const lastLog = this.buildLogs[this.buildLogs.length - 1];
        if (lastLog?.message === message) {
            return;
        }

        this.buildLogs = [
            ...this.buildLogs,
            {
                time: new Date().toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }),
                message
            }
        ].slice(-6);
    }

    async fetchPresentationRecord(presentationId) {
        const response = await fetch(`/api/presentations/${presentationId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || '无法读取演示稿');
        }

        return data;
    }

    openPresentationPage() {
        if (!this.presentationUrl) {
            return;
        }

        const win = window.open(this.presentationUrl, '_blank', 'noopener');
        if (!win) {
            window.location.href = this.presentationUrl;
        }
    }

    async copyPresentationLink() {
        if (!this.presentationUrl) {
            return;
        }

        const absoluteUrl = `${window.location.origin}${this.presentationUrl}`;

        try {
            await navigator.clipboard.writeText(absoluteUrl);
            this.notify('访问链接已复制');
        } catch (error) {
            window.prompt('复制下面的链接', absoluteUrl);
        }
    }

    downloadHTML() {
        if (!this.generatedHtml) {
            this.notify('请先完成演示稿生成', 'error');
            return;
        }

        const blob = new Blob([this.generatedHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.currentOutline?.title || 'presentation'}.html`;
        link.click();
        URL.revokeObjectURL(url);
    }

    downloadPPTX() {
        if (!this.pptxUrl) {
            this.notify('PPTX export is not ready yet.', 'error');
            return;
        }

        window.open(this.pptxUrl, '_blank', 'noopener');
    }

    openEditModal(index) {
        if (!this.currentSlides[index] || !this.elements.editModal) {
            return;
        }

        this.editingSlideIndex = index;
        const slide = this.currentSlides[index];
        this.elements.editText.value = JSON.stringify({
            type: slide.type,
            title: slide.title,
            content: slide.content
        }, null, 2);
        this.elements.editPrompt.value = '';
        this.elements.editJsonArea.style.display = 'block';
        this.elements.editLoading.style.display = 'none';
        this.elements.regenerateEdit.disabled = false;
        this.elements.editModal.classList.add('active');
    }

    closeEditModal() {
        this.elements.editModal?.classList.remove('active');
    }

    async regenerateSlide() {
        const prompt = this.elements.editPrompt?.value.trim();
        if (!prompt) {
            this.notify('先描述你想怎么改这页脚本', 'error');
            return;
        }

        this.elements.editJsonArea.style.display = 'none';
        this.elements.editLoading.style.display = 'block';
        this.elements.regenerateEdit.disabled = true;

        try {
            const response = await fetch('/api/regenerate-slide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slide: this.currentSlides[this.editingSlideIndex],
                    outline: {
                        title: this.currentOutline?.title,
                        slides: this.currentSlides
                    },
                    prompt
                })
            });

            const data = await response.json();
            if (!response.ok || !data.slide) {
                throw new Error(data.error || 'AI 改写失败');
            }

            this.elements.editText.value = JSON.stringify(data.slide, null, 2);
            this.elements.editJsonArea.style.display = 'block';
        } catch (error) {
            this.notify(error.message, 'error');
            this.elements.editJsonArea.style.display = 'block';
        } finally {
            this.elements.editLoading.style.display = 'none';
            this.elements.regenerateEdit.disabled = false;
        }
    }

    saveEditedSlide() {
        try {
            const parsed = JSON.parse(this.elements.editText.value);
            const index = this.editingSlideIndex;
            this.currentSlides[index] = {
                ...this.currentSlides[index],
                ...parsed,
                index: index + 1
            };
            this.closeEditModal();
            this.renderOutlineCard();
            this.notify('脚本页已更新');
        } catch (error) {
            this.notify('JSON 格式不正确', 'error');
        }
    }

    quickGenerate(type) {
        const { textarea, sendButton } = this.elements;
        const prompt = this.quickPrompts[type] || type;

        if (!textarea) {
            return;
        }

        textarea.value = prompt;
        this.resizeTextarea();
        textarea.focus();

        if (sendButton) {
            sendButton.disabled = false;
        }
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
            { index: 1, label: '脚本校验', description: '检查大纲结构和页数' },
            { index: 2, label: '风格编排', description: '应用主题与视觉语言' },
            { index: 3, label: 'HTML 生成', description: '输出可播放幻灯片' },
            { index: 4, label: '页面保存', description: '写入服务端记录' },
            { index: 5, label: '独立打开', description: '生成专属访问地址' }
        ];
    }

    getSlideSummary(slide) {
        if (Array.isArray(slide.content)) {
            return slide.content.join(' · ');
        }

        if (Array.isArray(slide.items)) {
            return slide.items.join(' · ');
        }

        return slide.content || '等待补充内容';
    }

    getLabel(type, value) {
        const labels = {
            purpose: {
                teaching: '教学培训',
                pitch: '融资演讲',
                product: '产品发布',
                meeting: '会议汇报',
                company: '公司介绍',
                tech: '技术分享',
                personal: '个人简历',
                story: '故事讲解',
                marketing: '营销推广',
                event: '活动策划'
            },
            length: {
                short: '简短',
                medium: '中等',
                long: '完整'
            }
        };

        return labels[type]?.[value] || '';
    }

    getStyleLabel(value) {
        const card = document.querySelector(`.style-preview-card[data-val="${value}"] .style-preview-name`);
        return card?.textContent?.trim() || '';
    }

    notify(message, type = 'success') {
        if (typeof showToast === 'function') {
            showToast(message, type);
            return;
        }

        window.alert(message);
    }

    escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.createStudio = new CreateStudio();
});
