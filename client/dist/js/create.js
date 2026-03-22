// ==================== 创建页 JavaScript ====================

class CreatePage {
    constructor() {
        this.currentView = 'create';
        this.currentStep = 1;
        this.wizardData = {
            purpose: null,
            length: null,
            topic: '',
            content: '',
            outline: null,
            style: null,
            editing: false,
            html: ''
        };
        this.styles = [];
        this.slides = [];
        this.currentSlideIndex = 0;

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadStyles();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
        });

        // Wizard step 1 - Option buttons
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleOptionSelect(e));
        });

        // Generate outline
        const generateOutlineBtn = document.getElementById('generate-outline');
        if (generateOutlineBtn) {
            generateOutlineBtn.addEventListener('click', () => this.generateOutline());
        }

        // Wizard navigation
        const backToStep1 = document.getElementById('back-to-step1');
        if (backToStep1) backToStep1.addEventListener('click', () => this.goToStep(1));

        const backToStep2 = document.getElementById('back-to-step2');
        if (backToStep2) backToStep2.addEventListener('click', () => this.goToStep(2));

        const continueToStyle = document.getElementById('continue-to-style');
        if (continueToStyle) continueToStyle.addEventListener('click', () => this.goToStep(3));

        const generatePresentation = document.getElementById('generate-presentation');
        if (generatePresentation) {
            generatePresentation.addEventListener('click', () => this.generatePresentation());
        }

        // Style category filter
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterStyles(e.target.dataset.category));
        });

        // Result actions
        const downloadHtml = document.getElementById('download-html');
        if (downloadHtml) downloadHtml.addEventListener('click', () => this.downloadHTML());

        const openInEditor = document.getElementById('open-in-editor');
        if (openInEditor) openInEditor.addEventListener('click', () => this.openInEditor());

        // Editor toolbar
        const newSlide = document.getElementById('new-slide');
        if (newSlide) newSlide.addEventListener('click', () => this.addNewSlide());

        const importHtml = document.getElementById('import-html');
        if (importHtml) importHtml.addEventListener('click', () => document.getElementById('file-input').click());

        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.addEventListener('change', (e) => this.importHTML(e));

        const previewMode = document.getElementById('preview-mode');
        if (previewMode) previewMode.addEventListener('click', () => this.togglePreviewMode());

        const saveFile = document.getElementById('save-file');
        if (saveFile) saveFile.addEventListener('click', () => this.saveFile());

        const formatHtml = document.getElementById('format-html');
        if (formatHtml) formatHtml.addEventListener('click', () => this.formatHTML());

        const prevSlide = document.getElementById('prev-slide');
        if (prevSlide) prevSlide.addEventListener('click', () => this.prevSlide());

        const nextSlide = document.getElementById('next-slide');
        if (nextSlide) nextSlide.addEventListener('click', () => this.nextSlide());

        // HTML editor input
        const htmlEditor = document.getElementById('html-editor');
        if (htmlEditor) {
            htmlEditor.addEventListener('input', (e) => {
                this.updatePreview(e.target.value);
                this.parseSlides(e.target.value);
            });
        }
    }

    // ==================== View Management ====================

    switchView(view) {
        this.currentView = view;

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        document.querySelectorAll('.view').forEach(v => {
            v.classList.toggle('active', v.id === `${view}-view`);
        });

        if (view === 'editor' && this.wizardData.html) {
            this.loadToEditor(this.wizardData.html);
        }
    }

    // ==================== Wizard Logic ====================

    handleOptionSelect(e) {
        const btn = e.target.closest('.option-btn');
        if (!btn) return;

        const group = btn.closest('.form-group');
        group.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        const value = btn.dataset.value;
        const label = btn.querySelector('.option-label')?.textContent;

        if (group.querySelector('label').textContent.includes('用途')) {
            this.wizardData.purpose = value;
        } else if (group.querySelector('label').textContent.includes('长度')) {
            this.wizardData.length = value;
        }
    }

    async generateOutline() {
        const topicEl = document.getElementById('topic');
        const contentEl = document.getElementById('content');

        this.wizardData.topic = topicEl ? topicEl.value.trim() : '';
        this.wizardData.content = contentEl ? contentEl.value.trim() : '';

        if (!this.wizardData.topic) {
            showToast('请输入演示主题', 'error');
            return;
        }

        if (!this.wizardData.purpose || !this.wizardData.length) {
            showToast('请选择用途和长度', 'error');
            return;
        }

        this.goToStep(2);
        this.showOutlineLoading();

        try {
            const response = await fetch('/api/generate-outline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    purpose: this.wizardData.purpose,
                    length: this.wizardData.length,
                    topic: this.wizardData.topic,
                    content: this.wizardData.content
                })
            });

            if (!response.ok) throw new Error('生成失败');

            this.wizardData.outline = await response.json();
            this.renderOutline();
        } catch (error) {
            showToast('生成大纲失败: ' + error.message, 'error');
            console.error(error);
        }
    }

    showOutlineLoading() {
        const container = document.getElementById('outline-preview');
        if (!container) return;

        container.innerHTML = `
            <div class="outline-loading">
                <div class="spinner"></div>
                <p>正在生成大纲...</p>
            </div>
        `;
    }

    renderOutline() {
        const container = document.getElementById('outline-preview');
        const outline = this.wizardData.outline;

        if (!container || !outline || !outline.slides) {
            if (container) container.innerHTML = '<p style="color: var(--accent-error);">生成失败，请重试</p>';
            return;
        }

        let html = `
            <h3 class="outline-title">${outline.title || '演示文稿'}</h3>
            <p class="outline-subtitle">${outline.subtitle || ''}</p>
        `;

        outline.slides.forEach((slide) => {
            const content = Array.isArray(slide.content) ? slide.content.join(', ') :
                           Array.isArray(slide.items) ? slide.items.join(', ') : '';
            html += `
                <div class="outline-slide">
                    <span class="slide-type">${slide.type}</span>
                    <div class="slide-info">
                        <h4>${slide.title}</h4>
                        <p>${content}</p>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    goToStep(step) {
        document.querySelectorAll('.wizard-step').forEach(s => s.style.display = 'none');
        const stepEl = document.querySelector(`[data-step="${step}"]`);
        if (stepEl) stepEl.style.display = 'block';
        this.currentStep = step;

        if (step === 3) {
            this.renderStyles();
        }
    }

    // ==================== Style Selection ====================

    async loadStyles() {
        try {
            const response = await fetch('/api/styles');
            this.styles = await response.json();
        } catch (error) {
            console.error('Failed to load styles:', error);
        }
    }

    renderStyles() {
        const grid = document.getElementById('style-grid');
        if (!grid) return;

        const category = document.querySelector('.category-btn.active')?.dataset.category || 'all';
        const filtered = category === 'all' ? this.styles : this.styles.filter(s => s.category === category);

        grid.innerHTML = filtered.map(style => `
            <div class="style-card ${this.wizardData.style === style.id ? 'selected' : ''}" data-style="${style.id}">
                <div class="style-card-header">
                    <span class="style-name">${style.name}</span>
                    <span class="style-badge">${style.category}</span>
                </div>
                <p class="style-vibe">${style.vibe}</p>
                <div class="style-preview preview-${style.id.replace(/-/g, '')}"></div>
            </div>
        `).join('');

        // Add click handlers
        grid.querySelectorAll('.style-card').forEach(card => {
            card.addEventListener('click', () => {
                grid.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.wizardData.style = card.dataset.style;
            });
        });
    }

    filterStyles(category) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        this.renderStyles();
    }

        // ==================== 生成进度展示 ====================

    showGeneratingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'generating-overlay';
        overlay.innerHTML = `
            <div class="generating-modal">
                <div class="generating-header">
                    <div class="generating-icon">
                        <i class="ph ph-spinner spinner"></i>
                    </div>
                    <h3>正在生成演示文稿</h3>
                </div>
                <div class="generating-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="gen-progress-bar" style="width: 0%"></div>
                    </div>
                    <span class="progress-text" id="gen-progress-text">准备中...</span>
                </div>
                <div class="generating-steps">
                    <div class="gen-step" id="gen-step-1">
                        <i class="ph ph-circle"></i>
                        <span>分析主题</span>
                    </div>
                    <div class="gen-step" id="gen-step-2">
                        <i class="ph ph-circle"></i>
                        <span>生成大纲</span>
                    </div>
                    <div class="gen-step" id="gen-step-3">
                        <i class="ph ph-circle"></i>
                        <span>设计样式</span>
                    </div>
                    <div class="gen-step" id="gen-step-4">
                        <i class="ph ph-circle"></i>
                        <span>渲染内容</span>
                    </div>
                    <div class="gen-step" id="gen-step-5">
                        <i class="ph ph-circle"></i>
                        <span>完成</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const style = document.createElement('style');
        style.id = 'generating-style';
        style.textContent = `
            #generating-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 10000; backdrop-filter: blur(8px); }
            .generating-modal { background: var(--bg-card, #fff); border-radius: 20px; padding: 40px; max-width: 450px; width: 90%; text-align: center; }
            .generating-header { margin-bottom: 30px; }
            .generating-icon { width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #0ea5e9, #6366f1); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
            .generating-icon i { font-size: 40px; color: white; }
            .generating-icon .spinner { animation: spin 1s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .generating-header h3 { font-size: 1.5rem; font-weight: 700; margin: 0; }
            .generating-progress { margin-bottom: 30px; }
            .progress-bar-container { height: 8px; background: var(--bg-secondary); border-radius: 4px; overflow: hidden; margin-bottom: 12px; }
            .progress-bar { height: 100%; background: linear-gradient(90deg, #0ea5e9, #6366f1, #8b5cf6); border-radius: 4px; transition: width 0.5s ease; }
            .progress-text { font-size: 0.95rem; color: var(--text-secondary); }
            .generating-steps { display: flex; justify-content: space-between; gap: 8px; }
            .gen-step { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; opacity: 0.4; transition: all 0.3s ease; }
            .gen-step.active { opacity: 1; }
            .gen-step.completed i { color: #22c55e; }
            .gen-step.active i { color: #0ea5e9; animation: pulse 1s infinite; }
            .gen-step i { font-size: 1.2rem; color: var(--text-tertiary); }
            .gen-step span { font-size: 0.75rem; color: var(--text-secondary); }
            @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        `;
        document.head.appendChild(style);
    }

    updateGeneratingProgress(progress, message, step) {
        const progressBar = document.getElementById('gen-progress-bar');
        const progressText = document.getElementById('gen-progress-text');
        if (progressBar) progressBar.style.width = progress + '%';
        if (progressText) progressText.textContent = message;
        for (let i = 1; i <= 5; i++) {
            const stepEl = document.getElementById('gen-step-' + i);
            if (stepEl) {
                stepEl.classList.remove('active', 'completed');
                if (i < step) {
                    stepEl.classList.add('completed');
                    stepEl.querySelector('i').className = 'ph ph-check-circle';
                } else if (i === step) {
                    stepEl.classList.add('active');
                }
            }
        }
    }

    hideGeneratingOverlay() {
        const overlay = document.getElementById('generating-overlay');
        if (overlay) overlay.remove();
        const style = document.getElementById('generating-style');
        if (style) style.remove();
    }


// ==================== Generate Presentation ====================

    async generatePresentation() {
        if (!this.wizardData.style) {
            showToast('请选择一个风格', 'error');
            return;
        }

        const enableEditing = document.getElementById('enable-editing');
        this.wizardData.editing = enableEditing ? enableEditing.checked : false;

        const btn = document.getElementById('generate-presentation');
        if (btn) {
            btn.textContent = '生成中...';
            btn.disabled = true;
        }

        try {
            const response = await fetch('/api/generate/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    outline: this.wizardData.outline,
                    style: this.wizardData.style,
                    editing: this.wizardData.editing
                })
            });

            if (!response.ok) throw new Error('生成失败');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');




                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.progress === -1) {
                                throw new Error(data.message);
                            }

                            let step = 1;
                            if (data.progress >= 15 && data.progress < 45) step = 2;
                            else if (data.progress >= 45 && data.progress < 55) step = 2;
                            else if (data.progress >= 55 && data.progress < 65) step = 3;
                            else if (data.progress >= 65 && data.progress < 85) step = 4;
                            else if (data.progress >= 85) step = 5;

                            this.updateGeneratingProgress(data.progress, data.message, step);

                            if (data.html) {
                                this.wizardData.html = data.html;
                                if (data.outline) this.wizardData.outline = data.outline;
                            }
                        } catch (e) {
                            console.error('Parse error:', e);
                        }
                    }
                }
            }

this.updateGeneratingProgress(100, '生成完成！', 5);            await new Promise(resolve => setTimeout(resolve, 500));            this.hideGeneratingOverlay();            // 检查生成的HTML是否存在            if (!this.wizardData.html) {                showToast('生成失败：没有HTML内容', 'error');                return;            }            // 生成唯一的演示文稿ID            const presentationId = 'pres_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);            // 尝试存储到 localStorage            try {                localStorage.setItem(presentationId, this.wizardData.html);            } catch (e) {                console.error('localStorage存储失败:', e);                showToast('存储失败，演示文稿可能过大', 'error');                return;            }            // 打开新窗口            const newWindow = window.open('/preview.html?id=' + presentationId, '_blank');            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {                // 如果新窗口打开失败，可能是被阻止，尝试直接在当前页面跳转                window.location.href = '/preview.html?id=' + presentationId;            } else {                showToast('演示文稿已在新窗口打开！', 'success');            }
        } catch (error) {
            showToast('生成演示文稿失败: ' + error.message, 'error');
            console.error(error);
        } finally {
            if (btn) {
                btn.textContent = '生成演示文稿';
                btn.disabled = false;
            }
        }
    }

    // ==================== Result Actions ====================

    downloadHTML() {
        const blob = new Blob([this.wizardData.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.wizardData.topic || 'presentation'}.html`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('文件已下载', 'success');
    }

    openInEditor() {
        this.switchView('editor');
        this.loadToEditor(this.wizardData.html);
    }

    // ==================== Editor Functions ====================

    loadToEditor(html) {
        const editor = document.getElementById('html-editor');
        if (!editor) return;

        editor.value = this.formatHTMLString(html);
        this.updatePreview(html);
        this.parseSlides(html);
    }

    parseSlides(html) {
        const slideMatches = html.match(/<section[^>]*class="[^"]*slide[^"]*"[^>]*>/g) || [];
        const slideList = document.getElementById('slide-list');
        if (!slideList) return;

        if (slideMatches.length > 0) {
            this.slides = slideMatches;
            slideList.innerHTML = slideMatches.map((_, i) => `
                <div class="slide-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
                    <div class="thumb-number">${i + 1}</div>
                    <div class="thumb-preview">Slide ${i + 1}</div>
                </div>
            `).join('');

            const totalSlides = document.getElementById('total-slides');
            if (totalSlides) totalSlides.textContent = this.slides.length;

            slideList.querySelectorAll('.slide-thumb').forEach(thumb => {
                thumb.addEventListener('click', () => {
                    const index = parseInt(thumb.dataset.index);
                    this.goToSlide(index);
                });
            });
        }
    }

    goToSlide(index) {
        this.currentSlideIndex = index;
        const currentSlide = document.getElementById('current-slide');
        if (currentSlide) currentSlide.textContent = index + 1;

        document.querySelectorAll('.slide-thumb').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    addNewSlide() {
        const newSlide = `
    <section class="slide">
      <div class="slide-content">
        <h2>新幻灯片</h2>
        <ul class="bullet-list">
          <li>添加你的内容</li>
        </ul>
      </div>
    </section>`;

        const editor = document.getElementById('html-editor');
        if (!editor) return;

        const html = editor.value;
        const newHtml = html.replace('</body>', newSlide + '\n</body>');
        editor.value = newHtml;
        this.updatePreview(newHtml);
        this.parseSlides(newHtml);
        showToast('新幻灯片已添加', 'success');
    }

    importHTML(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            this.loadToEditor(event.target.result);
            showToast('文件已导入', 'success');
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    togglePreviewMode() {
        const preview = document.getElementById('live-preview');
        if (!preview) return;

        if (preview.style.display === 'none') {
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    }

    updatePreview(html) {
        const preview = document.getElementById('live-preview');
        if (preview) preview.srcdoc = html;
    }

    saveFile() {
        const editor = document.getElementById('html-editor');
        if (!editor) return;

        const html = editor.value;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'presentation.html';
        a.click();
        URL.revokeObjectURL(url);
        showToast('文件已保存', 'success');
    }

    formatHTML() {
        const editor = document.getElementById('html-editor');
        if (!editor) return;

        editor.value = this.formatHTMLString(editor.value);
        showToast('代码已格式化', 'success');
    }

    formatHTMLString(html) {
        let formatted = '';
        let indent = 0;
        const indentStr = '  ';

        html = html.replace(/>\s+</g, '><');

        html.split(/>\s*</).forEach(tag => {
            if (!tag.trim()) return;

            if (tag.match(/^<\/\w/)) {
                indent--;
            }

            formatted += indentStr.repeat(Math.max(0, indent)) + '<' + tag + '>\n';

            if (tag.match(/^<\w[^>]*[^\/]>/) && !tag.match(/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i)) {
                indent++;
            }
        });

        return formatted;
    }

    prevSlide() {
        if (this.currentSlideIndex > 0) {
            this.goToSlide(this.currentSlideIndex - 1);
        }
    }

    nextSlide() {
        if (this.currentSlideIndex < this.slides.length - 1) {
            this.goToSlide(this.currentSlideIndex + 1);
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.createPage = new CreatePage();
});
