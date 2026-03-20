(function () {
    if (typeof CreateStudio === 'undefined') {
        return;
    }

    function workspaceCopy(locale) {
        if (locale === 'zh-CN') {
            return {
                idleEyebrow: '编辑工作区',
                idleTitle: '先整理脚本，再进入生成与精修',
                idleSubtitle: '左侧继续配置主题、长度与风格，右侧承接脚本总览、构建状态和结果卡片。',
                idleMainTitle: '从一句话开始，脚本会在这里展开',
                idleMainBody: '生成脚本后，你可以直接在这里组织 scene、调整顺序、进入 deck 级设置，再触发独立演示页面构建。',
                idleChecklist: ['先写一句主题描述', '生成 outline 脚本', '检查 scene 顺序和风格', '开始构建独立演示页面'],
                idleSideTitle: '这个区域会显示什么',
                idleSideItems: ['脚本结构总览', '构建进度与日志', '预览与导出动作'],
                idleTipsTitle: '建议工作流',
                idleTips: ['先用 Fast Mode 出第一稿', '需要精修时再展开 Advanced', '完成后从这里继续预览与导出'],
                planningEyebrow: '脚本生成中',
                planningTitle: '正在扩展脚本结构',
                planningSubtitle: '系统会先组织主题、段落和每一页的叙事顺序，然后再回到这里。',
                planningStateTitle: '当前状态',
                planningStateValue: 'AI 正在整理脚本',
                planningTipsTitle: '接下来会发生什么',
                planningTips: ['生成 outline 标题和副标题', '拆分每一页的 scene 内容', '回到编辑工作区进行确认'],
                clarifyEyebrow: '还需要一点信息',
                clarifyTitle: '补一条上下文，就能继续规划',
                clarifySubtitle: '这里只保留一次追问，不会把整个产品变成长对话。',
                clarifySideTitle: '回答建议',
                clarifySideItems: ['补充使用场景或受众', '说明更偏展示还是汇报', '一句话补充即可'],
                errorEyebrow: '工作区异常',
                errorTitle: '这次生成没有完成',
                errorSubtitle: '你可以直接修改输入、切换用途或风格，然后再次尝试。',
                errorSideTitle: '建议排查',
                errorSideItems: ['检查输入是否为空', '确认用途和长度是否合理', '网络恢复后重新生成']
            };
        }

        return {
            idleEyebrow: 'Editing Workspace',
            idleTitle: 'Shape the outline first, then move into build and refinement',
            idleSubtitle: 'Use the left side for setup and input. The right side holds the outline, build state, and result cards.',
            idleMainTitle: 'Start with one brief. The outline grows here.',
            idleMainBody: 'Once the outline is ready, this workspace becomes the place to organize scenes, adjust the deck, and launch the standalone build.',
            idleChecklist: ['Write a one-line brief', 'Generate the outline', 'Review scene order and style', 'Build the standalone presentation'],
            idleSideTitle: 'What this area will show',
            idleSideItems: ['Outline structure overview', 'Build progress and logs', 'Preview and export actions'],
            idleTipsTitle: 'Suggested flow',
            idleTips: ['Use Fast Mode for the first pass', 'Open Advanced only when you need deeper control', 'Return here for preview and exports after build'],
            planningEyebrow: 'Outline Planning',
            planningTitle: 'Turning the brief into a structured outline',
            planningSubtitle: 'The system is shaping the title, scenes, and narrative order before returning to the editor workspace.',
            planningStateTitle: 'Current state',
            planningStateValue: 'AI is drafting the outline',
            planningTipsTitle: 'What happens next',
            planningTips: ['Generate the outline title and subtitle', 'Break the deck into scene-level slides', 'Return here for review and refinement'],
            clarifyEyebrow: 'One quick clarification',
            clarifyTitle: 'Add one more detail and the plan can continue',
            clarifySubtitle: 'This is still a single-turn product flow, not an endless chat experience.',
            clarifySideTitle: 'Helpful answer',
            clarifySideItems: ['Add the usage context or audience', 'Say whether it is more showcase or briefing', 'One short line is enough'],
            errorEyebrow: 'Workspace Error',
            errorTitle: 'This generation attempt did not complete',
            errorSubtitle: 'Update the brief, switch purpose or style, then try the build again.',
            errorSideTitle: 'Recommended checks',
            errorSideItems: ['Make sure the brief is not empty', 'Check whether purpose and length still fit', 'Retry after the network recovers']
        };
    }

    function shell(studio, options) {
        const meta = Array.isArray(options.meta) && options.meta.length
            ? `<div class="editor-workspace-badges">${options.meta.filter(Boolean).map((item) => `<span class="editor-workspace-badge">${studio.escapeHtml(item)}</span>`).join('')}</div>`
            : '';

        return `
            <div class="editor-workspace-shell">
                <div class="editor-workspace-hero">
                    <div class="editor-workspace-copy">
                        <span class="editor-workspace-eyebrow">${studio.escapeHtml(options.eyebrow || '')}</span>
                        <h3 class="editor-workspace-title">${studio.escapeHtml(options.title || '')}</h3>
                        ${options.subtitle ? `<p class="editor-workspace-subtitle">${studio.escapeHtml(options.subtitle)}</p>` : ''}
                    </div>
                    ${meta}
                </div>
                <div class="editor-workspace-grid">
                    <div class="editor-workspace-main">${options.main || ''}</div>
                    <aside class="editor-workspace-side">${options.side || ''}</aside>
                </div>
            </div>
        `;
    }

    function section(studio, options = {}) {
        const eyebrow = options.eyebrow
            ? `<span class="editor-section-label">${studio.escapeHtml(options.eyebrow)}</span>`
            : '';
        const icon = options.icon
            ? `<i class="ph ${options.icon}"></i>`
            : '';
        const copy = options.copy
            ? `<p class="editor-section-copy">${studio.escapeHtml(options.copy)}</p>`
            : '';
        const actions = options.actions
            ? `<div class="editor-section-actions">${options.actions}</div>`
            : '';

        return `
            <section class="editor-section-card ${options.className || ''}">
                <div class="editor-section-head">
                    <div class="editor-section-heading">
                        ${eyebrow}
                        <div class="editor-section-title-row">${icon}<strong class="editor-section-title">${studio.escapeHtml(options.title || '')}</strong></div>
                        ${copy}
                    </div>
                    ${actions}
                </div>
                <div class="editor-section-body">${options.body || ''}</div>
            </section>
        `;
    }

    Object.assign(CreateStudio.prototype, {
        getEditorWorkspaceCopy() {
            return workspaceCopy(this.locale);
        },

        renderEditorWorkspaceShell(options) {
            return shell(this, options || {});
        },

        renderWorkspaceEmptyState() {
            if (!this.elements.resultArea) {
                return;
            }

            const copy = this.getEditorWorkspaceCopy();
            this.elements.resultArea.innerHTML = shell(this, {
                eyebrow: copy.idleEyebrow,
                title: copy.idleTitle,
                subtitle: copy.idleSubtitle,
                meta: [
                    this.getLabel('purpose', this.config.purpose) || this.t('defaultPurpose'),
                    this.getLabel('length', this.config.length) || this.t('defaultLength'),
                    this.getStyleLabel(this.config.style) || this.t('selectStyle')
                ],
                main: `
                    <div class="editor-panel-stack">
                        ${section(this, {
                            className: 'editor-empty-card',
                            eyebrow: this.locale === 'zh-CN' ? '工作区概览' : 'Workspace Overview',
                            title: copy.idleMainTitle,
                            copy: copy.idleMainBody,
                            icon: 'compass-tool',
                            body: `
                                <div class="editor-empty-state">
                                    <div class="editor-empty-icon"><i class="ph ph-compass-tool"></i></div>
                                    <div class="editor-empty-copy">
                                        <strong>${this.escapeHtml(copy.idleMainTitle)}</strong>
                                        <p>${this.escapeHtml(copy.idleMainBody)}</p>
                                    </div>
                                </div>
                            `
                        })}
                        ${section(this, {
                            className: 'editor-checklist-card',
                            eyebrow: this.locale === 'zh-CN' ? '建议流程' : 'Suggested Flow',
                            title: this.locale === 'zh-CN' ? '先产出第一版，再进入精修' : 'Start with a first pass, then refine',
                            copy: this.locale === 'zh-CN' ? 'Fast Mode 负责起稿，Advanced 负责组织 scene、调整 deck 和后续构建。' : 'Fast Mode creates the first pass. Advanced takes over for scene organization, deck adjustment, and follow-up build.',
                            icon: 'path',
                            body: `
                                <div class="editor-empty-checklist">
                                    ${copy.idleChecklist.map((item) => `<div class="editor-empty-check"><i class="ph ph-check-circle"></i><span>${this.escapeHtml(item)}</span></div>`).join('')}
                                </div>
                            `
                        })}
                    </div>
                `,
                side: `
                    ${section(this, {
                        className: 'editor-side-panel',
                        eyebrow: this.locale === 'zh-CN' ? '右侧区域' : 'Right Rail',
                        title: copy.idleSideTitle,
                        copy: this.locale === 'zh-CN' ? '这里会承接 outline、构建进度与结果动作。' : 'This area holds the outline, build progress, and result actions.',
                        icon: 'sidebar',
                        body: `<ul class="editor-side-list">${copy.idleSideItems.map((item) => `<li>${this.escapeHtml(item)}</li>`).join('')}</ul>`
                    })}
                    ${section(this, {
                        className: 'editor-side-panel',
                        eyebrow: this.locale === 'zh-CN' ? '开始前' : 'Before Build',
                        title: copy.idleTipsTitle,
                        copy: this.locale === 'zh-CN' ? '只有在需要更深控制时才展开 Advanced。' : 'Open Advanced only when you need deeper control.',
                        icon: 'list-checks',
                        body: `<ul class="editor-side-list">${copy.idleTips.map((item) => `<li>${this.escapeHtml(item)}</li>`).join('')}</ul>`
                    })}
                `
            });
        },

        renderLoadingCard(message) {
            const copy = this.getEditorWorkspaceCopy();
            this.elements.resultArea.innerHTML = shell(this, {
                eyebrow: copy.planningEyebrow,
                title: copy.planningTitle,
                subtitle: copy.planningSubtitle,
                meta: [
                    this.getLabel('purpose', this.config.purpose) || this.t('defaultPurpose'),
                    this.getLabel('length', this.config.length) || this.t('defaultLength')
                ],
                main: `
                    <div class="editor-panel-stack">
                        ${section(this, {
                            className: 'editor-state-card',
                            eyebrow: this.locale === 'zh-CN' ? 'AI 规划' : 'AI Planning',
                            title: copy.planningTitle,
                            copy: copy.planningSubtitle,
                            icon: 'sparkle',
                            body: `<div class="loading"><div class="loading-spinner"></div><p>${this.escapeHtml(message)}</p></div>`
                        })}
                    </div>
                `,
                side: `
                    ${section(this, {
                        className: 'editor-side-panel',
                        eyebrow: this.locale === 'zh-CN' ? '当前状态' : 'Current State',
                        title: copy.planningStateTitle,
                        copy: copy.planningStateValue,
                        icon: 'pulse',
                        body: `<div class="editor-side-kicker">${this.escapeHtml(copy.planningStateValue)}</div>`
                    })}
                    ${section(this, {
                        className: 'editor-side-panel',
                        eyebrow: this.locale === 'zh-CN' ? '接下来' : 'Next',
                        title: copy.planningTipsTitle,
                        copy: this.locale === 'zh-CN' ? '完成规划后会回到同一个工作区继续编辑。' : 'After planning, the editor returns to the same workspace for review.',
                        icon: 'list-checks',
                        body: `<ul class="editor-side-list">${copy.planningTips.map((item) => `<li>${this.escapeHtml(item)}</li>`).join('')}</ul>`
                    })}
                `
            });
        },

        renderClarificationCard(message) {
            const copy = this.getEditorWorkspaceCopy();
            this.elements.resultArea.innerHTML = shell(this, {
                eyebrow: copy.clarifyEyebrow,
                title: copy.clarifyTitle,
                subtitle: copy.clarifySubtitle,
                main: `
                    <div class="editor-panel-stack">
                        ${section(this, {
                            className: 'editor-state-card',
                            eyebrow: this.locale === 'zh-CN' ? '需要补充' : 'Need One Detail',
                            title: copy.clarifyTitle,
                            copy: copy.clarifySubtitle,
                            icon: 'chat-circle-dots',
                            body: `<div class="outline-content"><p class="result-note">${this.escapeHtml(message)}</p></div>`
                        })}
                    </div>
                `,
                side: `
                    ${section(this, {
                        className: 'editor-side-panel',
                        eyebrow: this.locale === 'zh-CN' ? '回答建议' : 'Response Tips',
                        title: copy.clarifySideTitle,
                        copy: this.locale === 'zh-CN' ? '补一行上下文就可以继续，不需要长对话。' : 'One short line is enough. No long conversation needed.',
                        icon: 'chat-teardrop-text',
                        body: `<ul class="editor-side-list">${copy.clarifySideItems.map((item) => `<li>${this.escapeHtml(item)}</li>`).join('')}</ul>`
                    })}
                `
            });
        },

        renderErrorCard(message) {
            const copy = this.getEditorWorkspaceCopy();
            this.elements.resultArea.innerHTML = shell(this, {
                eyebrow: copy.errorEyebrow,
                title: copy.errorTitle,
                subtitle: copy.errorSubtitle,
                main: `
                    <div class="editor-panel-stack">
                        ${section(this, {
                            className: 'editor-state-card editor-error-card',
                            eyebrow: this.locale === 'zh-CN' ? '需要重试' : 'Retry Needed',
                            title: copy.errorTitle,
                            copy: copy.errorSubtitle,
                            icon: 'warning-circle',
                            body: `<div class="error-msg">${this.escapeHtml(message)}</div>`
                        })}
                    </div>
                `,
                side: `
                    ${section(this, {
                        className: 'editor-side-panel',
                        eyebrow: this.locale === 'zh-CN' ? '排查' : 'Checks',
                        title: copy.errorSideTitle,
                        copy: this.locale === 'zh-CN' ? '先调整 brief 或用途，再重新开始构建。' : 'Adjust the brief or purpose first, then build again.',
                        icon: 'shield-warning',
                        body: `<ul class="editor-side-list">${copy.errorSideItems.map((item) => `<li>${this.escapeHtml(item)}</li>`).join('')}</ul>`
                    })}
                `
            });
        },

        renderBuildCard(state = {}) {
            const copy = this.getEditorWorkspaceCopy();
            const currentStep = state.step || 1;
            const progress = Math.max(0, state.progress || 0);
            const isReady = state.status === 'ready';
            const isFailed = state.status === 'failed';
            const absoluteUrl = this.presentationUrl ? `${window.location.origin}${this.presentationUrl}` : '';
            const buildTitle = isFailed
                ? (this.locale === 'zh-CN' ? '这次构建失败了' : 'This build failed')
                : isReady
                    ? (this.locale === 'zh-CN' ? '独立演示页面已经准备好' : 'The standalone presentation is ready')
                    : (this.locale === 'zh-CN' ? '正在生成独立演示页面' : 'Building the standalone presentation');
            const buildSubtitle = isFailed
                ? (this.locale === 'zh-CN' ? '你可以根据日志调整输入后重新构建。' : 'Use the logs below to adjust the outline and try again.')
                : isReady
                    ? (this.locale === 'zh-CN' ? '预览、导出和后续精修都会继续留在这个工作区里。' : 'Preview, export, and refinement all stay inside this workspace.')
                    : (this.locale === 'zh-CN' ? '构建过程中会持续更新阶段、日志和访问地址，不需要离开当前页面。' : 'Stage updates, logs, and the route stay visible here while the build is running.');

            this.elements.resultArea.innerHTML = shell(this, {
                eyebrow: this.locale === 'zh-CN' ? '构建工作区' : 'Build Workspace',
                title: buildTitle,
                subtitle: buildSubtitle,
                meta: [
                    `${copy.buildProgressLabel} ${progress}%`,
                    this.presentationId || '--',
                    this.getStyleLabel(this.config.style) || this.t('selectStyle')
                ],
                main: `
                    <div class="editor-panel-stack">
                        ${section(this, {
                            className: 'editor-build-card',
                            eyebrow: this.locale === 'zh-CN' ? '构建进度' : 'Build Progress',
                            title: buildTitle,
                            copy: state.message || buildSubtitle,
                            icon: 'lightning',
                            actions: `<span class="id-pill">${this.escapeHtml(this.presentationId || '--')}</span>`,
                            body: `
                                <div class="build-body editor-build-main">
                                    <div class="build-overview">
                                        <div class="build-progress-track">
                                            <div class="build-progress-bar" style="width: ${progress}%"></div>
                                        </div>
                                        <div class="build-progress-row">
                                            <span>${this.escapeHtml(copy.buildProgressLabel)}</span>
                                            <strong>${progress}%</strong>
                                        </div>
                                        <div class="build-steps">
                                            ${this.getBuildSteps().map((step) => {
                                                const className = step.index < currentStep ? 'completed' : step.index === currentStep ? 'active' : '';
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
                                </div>
                            `
                        })}
                    </div>
                `,
                side: `
                    <div class="build-sidebar">
                        ${section(this, {
                            className: 'editor-side-panel editor-route-panel',
                            eyebrow: this.locale === 'zh-CN' ? '访问入口' : 'Route Access',
                            title: copy.buildRouteTitle,
                            copy: this.locale === 'zh-CN' ? '构建完成后会优先打开这个独立访问地址。' : 'This standalone route becomes the main entry after build.',
                            icon: 'link',
                            body: `
                                <a class="result-link editor-route-link" href="${this.escapeHtml(this.presentationUrl || '#')}" target="_blank" rel="noopener">
                                    ${this.escapeHtml(absoluteUrl || '--')}
                                </a>
                                <div class="status-panel-actions">
                                    <button class="result-btn" id="openPresentationBtn" ${this.presentationUrl ? '' : 'disabled'}>
                                        <i class="ph ph-arrow-square-out"></i>
                                        ${this.escapeHtml(copy.buildOpenPage)}
                                    </button>
                                    <button class="result-btn" id="copyPresentationLinkBtn" ${this.presentationUrl ? '' : 'disabled'}>
                                        <i class="ph ph-link"></i>
                                        ${this.escapeHtml(copy.buildCopyLink)}
                                    </button>
                                </div>
                            `
                        })}
                        ${section(this, {
                            className: 'editor-side-panel',
                            eyebrow: this.locale === 'zh-CN' ? '日志' : 'Logs',
                            title: copy.buildLogTitle,
                            copy: this.locale === 'zh-CN' ? '这里保留构建阶段、报错和 ready 回执。' : 'Build stages, failures, and ready receipts stay here.',
                            icon: 'receipt',
                            body: `
                                <div class="build-log">
                                    ${this.buildLogs.length
                                        ? this.buildLogs.map((item) => `
                                            <div class="build-log-item">
                                                <span>${this.escapeHtml(item.time)}</span>
                                                <strong>${this.escapeHtml(item.message)}</strong>
                                            </div>
                                        `).join('')
                                        : `<div class="build-log-empty">${this.escapeHtml(copy.buildLogEmpty)}</div>`}
                                </div>
                            `
                        })}
                    </div>
                `
            });

            document.getElementById('openPresentationBtn')?.addEventListener('click', () => this.openPresentationPage());
            document.getElementById('copyPresentationLinkBtn')?.addEventListener('click', () => this.copyPresentationLink());
        },

        renderSuccessCard(record) {
            const readyMessage = this.t('presentationReady');
            const slideCount = Array.isArray(record?.outline?.slides)
                ? record.outline.slides.length
                : this.currentSlides.length;
            const absoluteUrl = this.presentationUrl ? `${window.location.origin}${this.presentationUrl}` : '';
            const styleName = record?.style?.name || this.getStyleLabel(this.config.style) || this.t('selectStyle');

            this.generatedHtml = record?.html || this.generatedHtml;
            this.pptxUrl = record?.pptxUrl || `/api/presentations/${this.presentationId}/export.pptx`;
            this.lastBuildState = {
                status: 'ready',
                progress: 100,
                step: 5,
                message: readyMessage
            };

            if (!this.buildLogs.length || this.buildLogs[this.buildLogs.length - 1]?.message !== readyMessage) {
                this.appendBuildLog(readyMessage);
            }

            this.elements.resultArea.innerHTML = shell(this, {
                eyebrow: this.locale === 'zh-CN' ? '结果工作区' : 'Result Workspace',
                title: this.locale === 'zh-CN'
                    ? '演示已生成，可以直接预览或继续精修'
                    : 'The presentation is ready to preview or refine',
                subtitle: this.locale === 'zh-CN'
                    ? '右侧工作区现在同时承载访问入口、构建日志和结果卡片，不再拆成多套成功界面。'
                    : 'Route access, build logs, and the result card now stay in a single workspace instead of separate success panels.',
                meta: [
                    this.presentationId || '--',
                    styleName,
                    this.t('slideCount', { count: slideCount || 0 })
                ],
                main: `
                    <div class="editor-panel-stack">
                        ${section(this, {
                            className: 'editor-success-card',
                            eyebrow: this.locale === 'zh-CN' ? '生成完成' : 'Build Ready',
                            title: readyMessage,
                            copy: this.locale === 'zh-CN'
                                ? '你可以先在这里预览、导出或切换视觉，再决定是否进入更深层的 Advanced 微调。'
                                : 'Preview, export, or switch visuals here first, then move deeper into Advanced refinement if needed.',
                            icon: 'seal-check',
                            actions: '<span class="editor-ready-chip">100%</span>',
                            body: `
                                <div class="editor-success-summary">
                                    <div class="editor-stat">
                                        <span>${this.escapeHtml(this.locale === 'zh-CN' ? '结构页数' : 'Outline slides')}</span>
                                        <strong>${slideCount || 0}</strong>
                                    </div>
                                    <div class="editor-stat">
                                        <span>${this.escapeHtml(this.locale === 'zh-CN' ? '当前风格' : 'Current style')}</span>
                                        <strong>${this.escapeHtml(styleName)}</strong>
                                    </div>
                                    <div class="editor-stat">
                                        <span>${this.escapeHtml(this.locale === 'zh-CN' ? '访问状态' : 'Route status')}</span>
                                        <strong>${this.escapeHtml(this.presentationUrl ? (this.locale === 'zh-CN' ? '已可访问' : 'Ready') : '--')}</strong>
                                    </div>
                                </div>
                            `
                        })}
                        ${section(this, {
                            className: 'editor-preview-bridge-card',
                            eyebrow: this.locale === 'zh-CN' ? '结果卡' : 'Result Bridge',
                            title: this.locale === 'zh-CN' ? '在这里继续预览、切换视觉和进入精修' : 'Continue with preview, visual switch, and refinement here',
                            copy: this.locale === 'zh-CN' ? 'Fast Mode 的结果卡会直接挂进这个工作区，不再单独漂浮在别处。' : 'The Fast Mode result card now mounts directly inside this workspace instead of floating elsewhere.',
                            icon: 'presentation-chart',
                            body: `<div id="copilotResultMount" class="editor-result-mount"></div>`
                        })}
                    </div>
                `,
                side: `
                    ${section(this, {
                        className: 'editor-side-panel editor-route-panel',
                        eyebrow: this.locale === 'zh-CN' ? '访问与导出' : 'Preview and Export',
                        title: this.locale === 'zh-CN' ? '访问与导出' : 'Route and export',
                        copy: this.locale === 'zh-CN' ? '预览、复制链接和导出入口都固定留在这里。' : 'Preview, link copy, and export actions stay pinned here.',
                        icon: 'rocket',
                        body: `
                            <a class="result-link editor-route-link" href="${this.escapeHtml(this.presentationUrl || '#')}" target="_blank" rel="noopener">
                                ${this.escapeHtml(absoluteUrl || '--')}
                            </a>
                            <div class="editor-side-actions">
                                <button class="result-btn primary" id="editorOpenPresentationBtn" ${this.presentationUrl ? '' : 'disabled'}>
                                    <i class="ph ph-monitor-play"></i>
                                    ${this.escapeHtml(this.locale === 'zh-CN' ? '打开预览页' : 'Open Preview')}
                                </button>
                                <button class="result-btn" id="editorCopyPresentationLinkBtn" ${this.presentationUrl ? '' : 'disabled'}>
                                    <i class="ph ph-link"></i>
                                    ${this.escapeHtml(this.locale === 'zh-CN' ? '复制链接' : 'Copy Link')}
                                </button>
                                <button class="result-btn" id="editorDownloadHtmlBtn">
                                    <i class="ph ph-download-simple"></i>
                                    ${this.escapeHtml(this.locale === 'zh-CN' ? '下载 HTML' : 'Download HTML')}
                                </button>
                                <button class="result-btn" id="editorDownloadPptxBtn">
                                    <i class="ph ph-file-arrow-down"></i>
                                    ${this.escapeHtml(this.locale === 'zh-CN' ? '下载 PPTX' : 'Download PPTX')}
                                </button>
                            </div>
                        `
                    })}
                    ${section(this, {
                        className: 'editor-side-panel',
                        eyebrow: this.locale === 'zh-CN' ? '构建日志' : 'Build Log',
                        title: this.locale === 'zh-CN' ? '最近构建回执' : 'Recent build receipts',
                        copy: this.locale === 'zh-CN' ? '这里会保留 ready 回执和关键构建记录。' : 'Ready receipts and build milestones stay visible here.',
                        icon: 'scroll',
                        body: `
                            <div class="build-log">
                                ${this.buildLogs.length
                                    ? this.buildLogs.map((item) => `
                                        <div class="build-log-item">
                                            <span>${this.escapeHtml(item.time)}</span>
                                            <strong>${this.escapeHtml(item.message)}</strong>
                                        </div>
                                    `).join('')
                                    : `<div class="build-log-empty">${this.escapeHtml(this.locale === 'zh-CN' ? '构建日志会在这里持续更新。' : 'Build updates will stay here.')}</div>`}
                            </div>
                        `
                    })}
                `
            });

            document.getElementById('editorOpenPresentationBtn')?.addEventListener('click', () => this.openPresentationPage());
            document.getElementById('editorCopyPresentationLinkBtn')?.addEventListener('click', () => this.copyPresentationLink());
            document.getElementById('editorDownloadHtmlBtn')?.addEventListener('click', () => this.downloadHTML());
            document.getElementById('editorDownloadPptxBtn')?.addEventListener('click', () => this.downloadPPTX());
        },

        renderOutlineCard() {
            const copy = this.getEditorWorkspaceCopy();
            const slideCount = this.currentSlides.length;
            const deckTimelinePills = this.getDeckTimelinePills();
            const activeScenePackLabel = this.getScenePackTemplateLabel(this.scenePackTemplate);

            this.elements.resultArea.innerHTML = shell(this, {
                eyebrow: this.locale === 'zh-CN' ? '脚本工作区' : 'Outline Workspace',
                title: this.locale === 'zh-CN' ? '先排好 scene，再进入构建' : 'Organize the scenes before you build',
                subtitle: this.locale === 'zh-CN'
                    ? '这里聚合 scene 结构、插入模板、scene pack 和 deck 设置，适合在真正构建前完成内容整理。'
                    : 'This is where scene structure, insert templates, scene packs, and deck settings come together before the standalone build.',
                meta: [
                    this.t('slideCount', { count: slideCount }),
                    this.getLabel('purpose', this.config.purpose) || this.t('defaultPurpose'),
                    this.getLabel('length', this.config.length) || this.t('defaultLength'),
                    this.getStyleLabel(this.config.style) || this.t('selectStyle')
                ],
                main: `
                    <div class="result-card editor-section-card editor-outline-card">
                        <div class="result-header">
                            <div>
                                <div class="result-title"><i class="ph ph-list-checks"></i>${this.escapeHtml(this.currentOutline?.title || this.t('untitledOutline'))}</div>
                                <p class="result-subtitle">${this.escapeHtml(this.currentOutline?.subtitle || this.t('outlineReadySubtitle'))}</p>
                            </div>
                            <div class="result-btns">
                                <label class="result-select-group" for="outlineInsertTemplateSelect">
                                    <span>${this.escapeHtml(this.t('sceneTemplateText'))}</span>
                                    <select id="outlineInsertTemplateSelect">
                                        ${this.buildSelectOptions(this.getSlideTypeOptions().map((option) => ({ ...option, selected: option.value === this.insertTemplate })))}
                                    </select>
                                </label>
                                <label class="result-select-group" for="outlineScenePackSelect">
                                    <span>${this.escapeHtml(this.t('scenePackTemplateText'))}</span>
                                    <select id="outlineScenePackSelect">
                                        ${this.buildSelectOptions(this.getScenePackOptions().map((option) => ({ ...option, selected: option.value === this.scenePackTemplate })))}
                                    </select>
                                </label>
                                <button class="result-btn" id="addSlideBtn"><i class="ph ph-plus"></i>${this.t('addSlide')}</button>
                                <button class="result-btn" id="addScenePackBtn"><i class="ph ph-stack"></i>${this.t('addScenePack')}</button>
                                <button class="result-btn" id="editDeckSettingsBtn"><i class="ph ph-sliders-horizontal"></i>${this.t('deckSettings')}</button>
                                <button class="result-btn primary" id="generatePresentationBtn"><i class="ph ph-play"></i>${this.t('generatePresentation')}</button>
                            </div>
                        </div>
                        <div class="result-meta">
                            <span class="meta-pill">${this.escapeHtml(this.t('slideCount', { count: slideCount }))}</span>
                            <span class="meta-pill">${this.escapeHtml(this.getLabel('purpose', this.config.purpose) || this.t('defaultPurpose'))}</span>
                            <span class="meta-pill">${this.escapeHtml(this.getLabel('length', this.config.length) || this.t('defaultLength'))}</span>
                            <span class="meta-pill">${this.escapeHtml(this.getStyleLabel(this.config.style) || this.t('selectStyle'))}</span>
                            <span class="meta-pill meta-pill-accent">${this.escapeHtml(this.t('scenePackActiveLabel', { pack: activeScenePackLabel }))}</span>
                            ${deckTimelinePills.map((pill) => `<span class="meta-pill">${this.escapeHtml(pill)}</span>`).join('')}
                        </div>
                        <div class="outline-content">
                            ${this.currentSlides.map((slide, index) => `
                                <div class="outline-slide-item ${this.isRecentlyInsertedSlide(index) ? 'recently-inserted' : ''}">
                                    <div class="slide-num">${index + 1}</div>
                                    <div class="slide-info">
                                        <div class="slide-title">
                                            <span>${this.escapeHtml(slide.title || this.t('slideTitle', { index: index + 1 }))}</span>
                                            ${this.isRecentlyInsertedSlide(index) ? `<span class="slide-badge">${this.escapeHtml(this.getRecentInsertionBadgeLabel(index))}</span>` : ''}
                                        </div>
                                        <div class="slide-desc">${this.escapeHtml(this.getSlideSummary(slide))}</div>
                                    </div>
                                    <div class="slide-actions">
                                        <button class="slide-action-btn" data-move-up-index="${index}" title="${this.escapeHtml(this.t('slideActionMoveUp'))}" aria-label="${this.escapeHtml(this.t('slideActionMoveUp'))}" ${index === 0 ? 'disabled' : ''}><i class="ph ph-arrow-up"></i></button>
                                        <button class="slide-action-btn" data-move-down-index="${index}" title="${this.escapeHtml(this.t('slideActionMoveDown'))}" aria-label="${this.escapeHtml(this.t('slideActionMoveDown'))}" ${index === slideCount - 1 ? 'disabled' : ''}><i class="ph ph-arrow-down"></i></button>
                                        <button class="slide-action-btn" data-insert-index="${index}" title="${this.escapeHtml(this.t('slideActionInsertAfter'))}" aria-label="${this.escapeHtml(this.t('slideActionInsertAfter'))}"><i class="ph ph-plus"></i></button>
                                        <button class="slide-action-btn" data-insert-pack-index="${index}" title="${this.escapeHtml(this.t('slideActionInsertPackAfter'))}" aria-label="${this.escapeHtml(this.t('slideActionInsertPackAfter'))}"><i class="ph ph-stack"></i></button>
                                        <button class="slide-action-btn" data-duplicate-index="${index}" title="${this.escapeHtml(this.t('slideActionDuplicate'))}" aria-label="${this.escapeHtml(this.t('slideActionDuplicate'))}"><i class="ph ph-copy"></i></button>
                                        <button class="slide-edit-btn" data-edit-index="${index}" title="${this.escapeHtml(this.t('editSlideTitle'))}" aria-label="${this.escapeHtml(this.t('editSlideTitle'))}"><i class="ph ph-pencil-simple"></i></button>
                                        <button class="slide-action-btn warn" data-remove-index="${index}" title="${this.escapeHtml(this.t('slideActionRemove'))}" aria-label="${this.escapeHtml(this.t('slideActionRemove'))}" ${slideCount <= 1 ? 'disabled' : ''}><i class="ph ph-trash"></i></button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `,
                side: `
                    ${section(this, {
                        className: 'editor-side-panel',
                        eyebrow: this.locale === 'zh-CN' ? '当前摘要' : 'Snapshot',
                        title: this.locale === 'zh-CN' ? '当前摘要' : 'Current snapshot',
                        copy: this.locale === 'zh-CN' ? '用途、长度、风格和 deck 级时间线会一起展示在这里。' : 'Purpose, deck length, style, and deck-level timeline stay visible here.',
                        icon: 'gauge',
                        body: `
                            <div class="editor-stat-grid">
                                <div class="editor-stat"><span>${this.escapeHtml(copy.statSlides)}</span><strong>${slideCount}</strong></div>
                                <div class="editor-stat"><span>${this.escapeHtml(copy.statPurpose)}</span><strong>${this.escapeHtml(this.getLabel('purpose', this.config.purpose) || this.t('defaultPurpose'))}</strong></div>
                                <div class="editor-stat"><span>${this.escapeHtml(copy.statLength)}</span><strong>${this.escapeHtml(this.getLabel('length', this.config.length) || this.t('defaultLength'))}</strong></div>
                                <div class="editor-stat"><span>${this.escapeHtml(copy.statStyle)}</span><strong>${this.escapeHtml(this.getStyleLabel(this.config.style) || this.t('selectStyle'))}</strong></div>
                            </div>
                            ${deckTimelinePills.length ? `<div class="editor-side-tags">${deckTimelinePills.map((pill) => `<span class="editor-side-tag">${this.escapeHtml(pill)}</span>`).join('')}</div>` : ''}
                        `
                    })}
                    ${section(this, {
                        className: 'editor-side-panel',
                        eyebrow: this.locale === 'zh-CN' ? '下一步' : 'Next Steps',
                        title: this.locale === 'zh-CN' ? '继续整理后再构建' : 'Refine before build',
                        copy: this.locale === 'zh-CN' ? '先把 scene 顺序、摘要和 pack 处理好，再进入独立页面构建。' : 'Review scene order, summaries, and packs before launching the standalone build.',
                        icon: 'arrows-clockwise',
                        body: `
                            <ul class="editor-side-list">
                                ${(this.locale === 'zh-CN'
                                    ? ['检查脚本顺序和每页摘要', '按需插入 scene pack 或单页模板', '准备好后开始构建独立演示页面']
                                    : ['Review slide order and summaries', 'Insert slide templates or scene packs if needed', 'Start the standalone build when the structure looks right']
                                ).map((item) => `<li>${this.escapeHtml(item)}</li>`).join('')}
                            </ul>
                        `
                    })}
                `
            });

            const templateSelect = document.getElementById('outlineInsertTemplateSelect');
            if (templateSelect) {
                templateSelect.value = this.insertTemplate;
                templateSelect.addEventListener('change', () => {
                    this.setInsertTemplate(templateSelect.value);
                });
            }

            const scenePackSelect = document.getElementById('outlineScenePackSelect');
            if (scenePackSelect) {
                scenePackSelect.value = this.scenePackTemplate;
                scenePackSelect.addEventListener('change', () => {
                    this.setScenePackTemplate(scenePackSelect.value);
                });
            }

            document.getElementById('addSlideBtn')?.addEventListener('click', () => this.insertSlideAt(this.currentSlides.length, this.insertTemplate, 'slideInserted'));
            document.getElementById('addScenePackBtn')?.addEventListener('click', () => this.insertScenePackAt(this.currentSlides.length, this.scenePackTemplate, 'scenePackInserted'));
            document.getElementById('editDeckSettingsBtn')?.addEventListener('click', () => this.openDeckSettingsModal());
            document.getElementById('generatePresentationBtn')?.addEventListener('click', () => this.generatePresentation());

            this.elements.resultArea.querySelectorAll('[data-edit-index]').forEach((button) => {
                button.addEventListener('click', () => this.openEditModal(Number(button.dataset.editIndex)));
            });
            this.elements.resultArea.querySelectorAll('[data-duplicate-index]').forEach((button) => {
                button.addEventListener('click', () => this.duplicateSlide(Number(button.dataset.duplicateIndex)));
            });
            this.elements.resultArea.querySelectorAll('[data-insert-index]').forEach((button) => {
                button.addEventListener('click', () => {
                    const index = Number(button.dataset.insertIndex);
                    this.insertSlideAt((Number.isInteger(index) ? index : 0) + 1, this.insertTemplate, 'slideInserted');
                });
            });
            this.elements.resultArea.querySelectorAll('[data-insert-pack-index]').forEach((button) => {
                button.addEventListener('click', () => {
                    const index = Number(button.dataset.insertPackIndex);
                    this.insertScenePackAt((Number.isInteger(index) ? index : 0) + 1, this.scenePackTemplate, 'scenePackInserted');
                });
            });
            this.elements.resultArea.querySelectorAll('[data-move-up-index]').forEach((button) => {
                button.addEventListener('click', () => this.moveSlide(Number(button.dataset.moveUpIndex), 'up'));
            });
            this.elements.resultArea.querySelectorAll('[data-move-down-index]').forEach((button) => {
                button.addEventListener('click', () => this.moveSlide(Number(button.dataset.moveDownIndex), 'down'));
            });
            this.elements.resultArea.querySelectorAll('[data-remove-index]').forEach((button) => {
                button.addEventListener('click', () => this.removeSlide(Number(button.dataset.removeIndex)));
            });
        }
    });
})();
