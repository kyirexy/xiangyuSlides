// ===========================================
// Frontend Slides App - Main JavaScript
// ===========================================

class FrontendSlidesApp {
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
        document.getElementById('generate-outline').addEventListener('click', () => this.generateOutline());

        // Wizard navigation
        document.getElementById('back-to-step1').addEventListener('click', () => this.goToStep(1));
        document.getElementById('back-to-step2').addEventListener('click', () => this.goToStep(2));
        document.getElementById('continue-to-style').addEventListener('click', () => this.goToStep(3));
        document.getElementById('generate-presentation').addEventListener('click', () => this.generatePresentation());

        // Style category filter
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterStyles(e.target.dataset.category));
        });

        // Result actions
        document.getElementById('download-html').addEventListener('click', () => this.downloadHTML());
        document.getElementById('open-in-editor').addEventListener('click', () => this.openInEditor());

        // Editor toolbar
        document.getElementById('new-slide').addEventListener('click', () => this.addNewSlide());
        document.getElementById('import-html').addEventListener('click', () => document.getElementById('file-input').click());
        document.getElementById('file-input').addEventListener('change', (e) => this.importHTML(e));
        document.getElementById('preview-mode').addEventListener('click', () => this.togglePreviewMode());
        document.getElementById('save-file').addEventListener('click', () => this.saveFile());
        document.getElementById('format-html').addEventListener('click', () => this.formatHTML());
        document.getElementById('prev-slide').addEventListener('click', () => this.prevSlide());
        document.getElementById('next-slide').addEventListener('click', () => this.nextSlide());

        // HTML editor input
        document.getElementById('html-editor').addEventListener('input', (e) => {
            this.updatePreview(e.target.value);
            this.parseSlides(e.target.value);
        });
    }

    // ===========================================
    // View Management
    // ===========================================

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

    // ===========================================
    // Wizard Logic
    // ===========================================

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
        this.wizardData.topic = document.getElementById('topic').value.trim();
        this.wizardData.content = document.getElementById('content').value.trim();

        if (!this.wizardData.topic) {
            this.showToast('请输入演示主题', 'error');
            return;
        }

        if (!this.wizardData.purpose || !this.wizardData.length) {
            this.showToast('请选择用途和长度', 'error');
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
            this.showToast('生成大纲失败: ' + error.message, 'error');
            console.error(error);
        }
    }

    showOutlineLoading() {
        const container = document.getElementById('outline-preview');
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

        if (!outline || !outline.slides) {
            container.innerHTML = '<p style="color: var(--accent-error);">生成失败，请重试</p>';
            return;
        }

        let html = `
            <h3 class="outline-title">${outline.title || '演示文稿'}</h3>
            <p class="outline-subtitle">${outline.subtitle || ''}</p>
        `;

        outline.slides.forEach((slide, index) => {
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
        document.querySelector(`[data-step="${step}"]`).style.display = 'block';
        this.currentStep = step;

        if (step === 3) {
            this.renderStyles();
        }
    }

    // ===========================================
    // Style Selection
    // ===========================================

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

    // ===========================================
    // Generate Presentation
    // ===========================================

    async generatePresentation() {
        if (!this.wizardData.style) {
            this.showToast('请选择一个风格', 'error');
            return;
        }

        this.wizardData.editing = document.getElementById('enable-editing').checked;

        const btn = document.getElementById('generate-presentation');
        btn.textContent = '生成中...';
        btn.disabled = true;

        try {
            const response = await fetch('/api/generate-html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    outline: this.wizardData.outline,
                    style: this.wizardData.style,
                    editing: this.wizardData.editing
                })
            });

            if (!response.ok) throw new Error('生成失败');

            const data = await response.json();
            this.wizardData.html = data.html;

            // Show preview
            const iframe = document.getElementById('presentation-preview');
            iframe.srcdoc = data.html;

            this.goToStep(4);
            this.showToast('演示文稿生成成功！', 'success');
        } catch (error) {
            this.showToast('生成演示文稿失败: ' + error.message, 'error');
            console.error(error);
        } finally {
            btn.textContent = '生成演示文稿';
            btn.disabled = false;
        }
    }

    // ===========================================
    // Result Actions
    // ===========================================

    downloadHTML() {
        const blob = new Blob([this.wizardData.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.wizardData.topic || 'presentation'}.html`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('文件已下载', 'success');
    }

    openInEditor() {
        this.switchView('editor');
        this.loadToEditor(this.wizardData.html);
    }

    // ===========================================
    // Editor Functions
    // ===========================================

    loadToEditor(html) {
        const editor = document.getElementById('html-editor');
        editor.value = this.formatHTMLString(html);
        this.updatePreview(html);
        this.parseSlides(html);
    }

    parseSlides(html) {
        const slideMatches = html.match(/<section[^>]*class="[^"]*slide[^"]*"[^>]*>/g) || [];
        const slideList = document.getElementById('slide-list');

        if (slideMatches.length > 0) {
            this.slides = slideMatches;
            slideList.innerHTML = slideMatches.map((_, i) => `
                <div class="slide-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
                    <div class="thumb-number">${i + 1}</div>
                    <div class="thumb-preview">Slide ${i + 1}</div>
                </div>
            `).join('');

            document.getElementById('total-slides').textContent = this.slides.length;

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
        document.getElementById('current-slide').textContent = index + 1;

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
        const html = editor.value;

        // Insert before closing body tag
        const newHtml = html.replace('</body>', newSlide + '\n</body>');
        editor.value = newHtml;
        this.updatePreview(newHtml);
        this.parseSlides(newHtml);
        this.showToast('新幻灯片已添加', 'success');
    }

    importHTML(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            this.loadToEditor(event.target.result);
            this.showToast('文件已导入', 'success');
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    togglePreviewMode() {
        const preview = document.getElementById('live-preview');
        if (preview.style.display === 'none') {
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    }

    updatePreview(html) {
        const preview = document.getElementById('live-preview');
        preview.srcdoc = html;
    }

    saveFile() {
        const html = document.getElementById('html-editor').value;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'presentation.html';
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('文件已保存', 'success');
    }

    formatHTML() {
        const editor = document.getElementById('html-editor');
        editor.value = this.formatHTMLString(editor.value);
        this.showToast('代码已格式化', 'success');
    }

    formatHTMLString(html) {
        // Simple HTML formatting
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

    // ===========================================
    // Utilities
    // ===========================================

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FrontendSlidesApp();
});
