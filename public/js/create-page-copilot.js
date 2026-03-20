(function () {
    const STYLE_FALLBACKS = [
        { id: 'bold-signal', name: 'Bold Signal', visualFamily: 'showcase' },
        { id: 'electric-studio', name: 'Electric Studio', visualFamily: 'showcase' },
        { id: 'notebook-tabs', name: 'Notebook Tabs', visualFamily: 'editorial' },
        { id: 'paper-ink', name: 'Paper & Ink', visualFamily: 'editorial' },
        { id: 'swiss-modern', name: 'Swiss Modern', visualFamily: 'briefing' },
        { id: 'pastel-geometry', name: 'Pastel Geometry', visualFamily: 'briefing' }
    ];

    const COPILOT_I18N = {
        'zh-CN': {
            kicker: 'Copilot 快速生成',
            title: '一句话生成更完整的演示',
            description: '默认只说你想讲什么。Copilot 会自动补齐用途、篇幅、视觉方向、基础节奏、旁白占位和展示建议，把复杂参数都后移到生成后的高级编辑。',
            shellTitle: 'Create Studio',
            shellMode: 'Fast Mode',
            shellHint: 'Fast Mode 先出稿，生成后再进入 Advanced 微调。',
            flowBrief: '一句话 Brief',
            flowPlan: 'AI 规划',
            flowPreview: '实时预览',
            flowRefine: '高级编辑',
            threadTitle: '一句话 Brief',
            threadHint: '先定义目标和场景，AI 会把它扩成完整演示方案。',
            logTitle: 'AI 记录',
            logHint: '只保留关键规划、追问和生成回执。',
            settingsTitle: '轻量选项',
            settingsHint: '都可以不填，AI 会自动补齐。',
            deckLocaleLabel: '输出语言',
            outputIntentLabel: '输出目标',
            visualPreferenceLabel: '视觉倾向',
            inputPlaceholder: '例如：帮我做一个融资路演，偏 Apple 发布会风格，8 页左右，适合现场展示。',
            inputHint: '按 Enter 发送，Shift + Enter 换行',
            sendText: '开始生成',
            sendingText: '正在规划',
            advancedShow: '打开高级编辑',
            advancedHide: '隐藏高级编辑',
            welcome: '告诉我你要做什么样的演示。我会自动补齐用途、篇幅、视觉方向、节奏和基础旁白占位。',
            summaryTitle: '本次自动规划',
            summaryHint: '这些默认值由 Copilot 自动补齐，后面仍然可以在高级编辑里继续修改。',
            summaryTopic: '主题',
            summaryPurpose: '用途',
            summaryLength: '长度',
            summaryAudience: '受众',
            summaryVisual: '视觉',
            summaryIntent: '目标',
            summaryVoiceover: '旁白',
            building: 'Copilot 正在生成演示，请稍候…',
            buildReady: '演示已生成。你可以直接预览，也可以进入高级编辑继续微调。',
            buildFailed: 'Copilot 生成失败：{message}',
            noPrompt: '先输入一句需求描述。',
            advancedReady: '已切换到高级编辑。',
            switchStyleLabel: '快速切换视觉',
            switchStyleButton: '切换视觉',
            switchStyleHint: '会在保留当前结构内容的前提下，重新生成一版视觉表现。',
            openAdvancedEditing: '高级编辑',
            previewNow: '直接预览',
            resultWorkspaceLabel: '结果工作区',
            resultWorkspaceTitle: '演示已经就绪，可以直接预览或继续精修',
            resultWorkspaceHint: '先用这一区完成预览、切换视觉、导出和复制链接，再决定是否进入 Advanced。',
            resultMetaRoute: '访问地址',
            resultMetaStyle: '当前风格',
            resultMetaOutline: '结构摘要',
            resultMetaExports: '导出能力',
            resultMetaSlides: '页数',
            resultMetaUpdated: '更新时间',
            resultOpenHtml: '原始 HTML',
            resultCopyLink: '复制链接',
            resultDownloadHtml: '下载 HTML',
            resultDownloadPptx: '下载 PPTX',
            resultOutlineFallback: '暂未生成结构摘要',
            resultExportReady: 'HTML / PPTX 可用',
            resultAdvancedHint: '需要微调 scene、媒体、转场、旁白和时间轴时，再进入高级编辑。',
            clarifying: '还需要你补充一个方向。',
            buildLogPlanning: 'Copilot 已完成参数规划，开始生成完整演示。',
            buildStyleRequired: '请先等待 Copilot 完成规划。',
            stageLabel: '展示舞台',
            stageStatusIdle: '准备规划',
            stageStatusPlanned: '规划完成',
            stageStatusClarifying: '等待补充',
            stageStatusBuilding: '正在生成',
            stageStatusReady: '可直接预览',
            stageStatusError: '生成中断',
            stageDefaultHeadline: '先生成一版完整演示，再进入工作台精修',
            stageDefaultSubhead: 'Fast Mode 负责一键出稿，Advanced 负责生成后的精细控制。',
            stageMetricOneLabel: '模式',
            stageMetricTwoLabel: '体验',
            stageMetricThreeLabel: '编辑',
            stageMetricOneValue: 'Fast Mode 默认',
            stageMetricThreeValue: '生成后进入 Advanced',
            stageRoute: '/create · copilot · preview',
            stageStoryLabel: '结构预览',
            stageStoryboardLabel: '场景预览',
            stageSceneOneLabel: 'Scene 01',
            stageSceneTwoLabel: 'Scene 02',
            stageSceneThreeLabel: 'Scene 03',
            stageSceneOne: '开场定位',
            stageSceneTwo: '核心论点',
            stageSceneThree: '收尾行动',
            autofillTitle: 'AI 自动补齐',
            autofillHint: '默认自动补这些，不再让首屏变成参数墙。',
            autofillItems: [
                '用途与场景',
                '页数与节奏',
                '视觉家族',
                '基础转场与动效',
                '旁白占位与提示',
                '时间轴 starter'
            ],
            presetPitchTitle: '融资路演',
            presetPitchBody: '投资人 narrative / 强节奏 / 站台感',
            presetProductTitle: '产品演示',
            presetProductBody: '发布会表达 / 媒体优先 / 更有舞台感',
            presetTeachingTitle: '教学说明',
            presetTeachingBody: '结构清晰 / 讲解顺序明确 / 适合讲课',
            presetShowcaseTitle: '展示大片',
            presetShowcaseBody: '高视觉 / 更大标题 / 更强冲击感',
            deckLocaleZh: '中文默认',
            deckLocaleEn: 'English',
            outputIntentAuto: '自动',
            outputIntentShowcase: '展示型',
            outputIntentBriefing: '汇报型',
            outputIntentShortVideo: '短视频友好',
            visualAuto: '自动',
            visualShowcase: '电影感',
            visualEditorial: '编辑感',
            visualBriefing: '商务感',
            intentShowcase: '展示型',
            intentBriefing: '汇报型',
            intentShortVideo: '短视频友好',
            visualShowcaseLabel: '电影感',
            visualEditorialLabel: '编辑感',
            visualBriefingLabel: '商务感',
            purposeTeaching: '教学培训',
            purposePitch: '融资路演',
            purposeProduct: '产品发布',
            purposeMeeting: '会议汇报',
            purposeCompany: '公司介绍',
            purposeTech: '技术分享',
            purposePersonal: '个人介绍',
            purposeStory: '故事叙述',
            purposeMarketing: '营销推广',
            purposeEvent: '活动策划',
            lengthShort: '短',
            lengthMedium: '中',
            lengthLong: '长',
            copiedPreset: '已填入示例提示词，你可以继续改。',
            voiceoverPlaceholder: '自动占位'
        },
        en: {
            kicker: 'Copilot Fast Mode',
            title: 'Generate a stronger deck from one sentence',
            description: 'Start with what you want to say. Copilot fills purpose, length, visual direction, pacing, voiceover placeholders, and stage suggestions automatically, then moves the complexity behind Advanced editing.',
            shellTitle: 'Create Studio',
            shellMode: 'Fast Mode',
            shellHint: 'Fast Mode produces the first pass, then Advanced takes over for deeper refinement.',
            flowBrief: 'One-line Brief',
            flowPlan: 'AI Planning',
            flowPreview: 'Live Preview',
            flowRefine: 'Advanced Edit',
            threadTitle: 'One-line Brief',
            threadHint: 'Define the goal and scenario first. AI will expand it into a full presentation plan.',
            logTitle: 'AI Notes',
            logHint: 'Only key planning updates, clarifications, and build receipts stay here.',
            settingsTitle: 'Lightweight Options',
            settingsHint: 'Everything here is optional. AI will fill the rest.',
            deckLocaleLabel: 'Deck Language',
            outputIntentLabel: 'Output Intent',
            visualPreferenceLabel: 'Visual Preference',
            inputPlaceholder: 'For example: Build me an investor pitch with an Apple keynote feel, around 8 slides, ready for live presentation.',
            inputHint: 'Press Enter to send, Shift + Enter for a new line',
            sendText: 'Start Build',
            sendingText: 'Planning',
            advancedShow: 'Open Advanced Editing',
            advancedHide: 'Hide Advanced Editing',
            welcome: 'Tell me what kind of deck you need. I will auto-fill purpose, length, style direction, pacing, and base voiceover placeholders.',
            summaryTitle: 'Auto-Planned Brief',
            summaryHint: 'Copilot filled these defaults for you. You can still refine everything later in Advanced Editing.',
            summaryTopic: 'Topic',
            summaryPurpose: 'Purpose',
            summaryLength: 'Length',
            summaryAudience: 'Audience',
            summaryVisual: 'Visual',
            summaryIntent: 'Intent',
            summaryVoiceover: 'Voiceover',
            building: 'Copilot is generating the presentation…',
            buildReady: 'The deck is ready. Preview it now or continue in advanced editing.',
            buildFailed: 'Copilot build failed: {message}',
            noPrompt: 'Start with a one-sentence prompt.',
            advancedReady: 'Switched to advanced editing.',
            switchStyleLabel: 'Quick visual switch',
            switchStyleButton: 'Switch Visual',
            switchStyleHint: 'This creates a new visual pass from the current structure without losing the outline.',
            openAdvancedEditing: 'Advanced Edit',
            previewNow: 'Preview Now',
            resultWorkspaceLabel: 'Result Workspace',
            resultWorkspaceTitle: 'The deck is ready to preview, switch visuals, or refine',
            resultWorkspaceHint: 'Use this area for preview, visual switching, exports, and link sharing before moving into Advanced.',
            resultMetaRoute: 'Route',
            resultMetaStyle: 'Current Style',
            resultMetaOutline: 'Outline Summary',
            resultMetaExports: 'Exports',
            resultMetaSlides: 'Slides',
            resultMetaUpdated: 'Updated',
            resultOpenHtml: 'Open Raw HTML',
            resultCopyLink: 'Copy Link',
            resultDownloadHtml: 'Download HTML',
            resultDownloadPptx: 'Download PPTX',
            resultOutlineFallback: 'Outline summary is not available yet.',
            resultExportReady: 'HTML / PPTX ready',
            resultAdvancedHint: 'Open Advanced when you need deeper scene, media, transition, voiceover, or timeline editing.',
            clarifying: 'I need one more detail before building.',
            buildLogPlanning: 'Copilot finished planning the parameters and is generating the full deck.',
            buildStyleRequired: 'Wait for Copilot to finish planning first.',
            stageLabel: 'Presentation Stage',
            stageStatusIdle: 'Ready to plan',
            stageStatusPlanned: 'Plan ready',
            stageStatusClarifying: 'Need one clarification',
            stageStatusBuilding: 'Building now',
            stageStatusReady: 'Ready to preview',
            stageStatusError: 'Build interrupted',
            stageDefaultHeadline: 'Generate a strong first pass, then refine inside the workspace',
            stageDefaultSubhead: 'Fast Mode handles one-click generation while Advanced takes over for deeper editing.',
            stageMetricOneLabel: 'Mode',
            stageMetricTwoLabel: 'Experience',
            stageMetricThreeLabel: 'Editing',
            stageMetricOneValue: 'Fast Mode default',
            stageMetricThreeValue: 'Advanced after build',
            stageRoute: '/create · copilot · preview',
            stageStoryLabel: 'Story Flow',
            stageStoryboardLabel: 'Scene Preview',
            stageSceneOneLabel: 'Scene 01',
            stageSceneTwoLabel: 'Scene 02',
            stageSceneThreeLabel: 'Scene 03',
            stageSceneOne: 'Opening setup',
            stageSceneTwo: 'Key argument',
            stageSceneThree: 'Final call to action',
            autofillTitle: 'AI Autofill',
            autofillHint: 'These are filled automatically so the first screen no longer feels like a parameter wall.',
            autofillItems: [
                'Purpose and scenario',
                'Length and pacing',
                'Visual family',
                'Base transitions and motion',
                'Voiceover placeholders and cues',
                'Timeline starter'
            ],
            presetPitchTitle: 'Investor Pitch',
            presetPitchBody: 'Investor narrative / tighter tempo / stage-ready',
            presetProductTitle: 'Product Demo',
            presetProductBody: 'Keynote tone / media-first / stronger reveal',
            presetTeachingTitle: 'Teaching Deck',
            presetTeachingBody: 'Clear explanation flow / easy to present live',
            presetShowcaseTitle: 'Showcase Mode',
            presetShowcaseBody: 'Bigger hero / stronger visuals / more cinematic',
            deckLocaleZh: 'Chinese',
            deckLocaleEn: 'English',
            outputIntentAuto: 'Auto',
            outputIntentShowcase: 'Showcase',
            outputIntentBriefing: 'Briefing',
            outputIntentShortVideo: 'Short-video Friendly',
            visualAuto: 'Auto',
            visualShowcase: 'Cinematic',
            visualEditorial: 'Editorial',
            visualBriefing: 'Briefing',
            intentShowcase: 'Showcase',
            intentBriefing: 'Briefing',
            intentShortVideo: 'Short-video Friendly',
            visualShowcaseLabel: 'Cinematic',
            visualEditorialLabel: 'Editorial',
            visualBriefingLabel: 'Briefing',
            purposeTeaching: 'Teaching',
            purposePitch: 'Pitch',
            purposeProduct: 'Product',
            purposeMeeting: 'Meeting',
            purposeCompany: 'Company',
            purposeTech: 'Tech',
            purposePersonal: 'Personal',
            purposeStory: 'Story',
            purposeMarketing: 'Marketing',
            purposeEvent: 'Event',
            lengthShort: 'Short',
            lengthMedium: 'Medium',
            lengthLong: 'Long',
            copiedPreset: 'Starter prompt applied. You can keep editing it.',
            voiceoverPlaceholder: 'Auto placeholder'
        }
    };

    const PROMPT_PRESETS = {
        pitch: {
            'zh-CN': {
                prompt: '帮我做一个融资路演，偏 Apple 发布会风格，8 页左右，适合现场展示，重点突出问题、方案、增长与融资需求。',
                outputIntent: 'briefing',
                visualPreference: 'showcase'
            },
            en: {
                prompt: 'Build me an investor pitch with an Apple keynote feel, around 8 slides, optimized for a live presentation with a strong problem-solution-growth-fundraising arc.',
                outputIntent: 'briefing',
                visualPreference: 'showcase'
            }
        },
        product: {
            'zh-CN': {
                prompt: '帮我做一个产品演示，中文，适合现场展示，突出核心功能、使用场景、亮点和演示节奏，整体更有发布会感。',
                outputIntent: 'showcase',
                visualPreference: 'showcase'
            },
            en: {
                prompt: 'Create a product demo deck for a live presentation, with a keynote feel, stronger media moments, and a clear progression through features, use cases, and value.',
                outputIntent: 'showcase',
                visualPreference: 'showcase'
            }
        },
        teaching: {
            'zh-CN': {
                prompt: '帮我做一个教学说明型演示，结构清晰、讲解顺序明确，适合课堂或培训讲解，页面不要太花但要有现代感。',
                outputIntent: 'briefing',
                visualPreference: 'editorial'
            },
            en: {
                prompt: 'Create a teaching deck with a clear instructional flow, easy pacing for live explanation, and a modern but focused visual treatment.',
                outputIntent: 'briefing',
                visualPreference: 'editorial'
            }
        },
        showcase: {
            'zh-CN': {
                prompt: '帮我做一个更偏展示大片感的演示，标题更大、画面更开阔、适合上屏展示，可以带一点电影感和品牌感。',
                outputIntent: 'showcase',
                visualPreference: 'showcase'
            },
            en: {
                prompt: 'Create a deck that feels like a showcase piece: larger headlines, wider stage-like layouts, stronger visual drama, and a cinematic brand presentation feel.',
                outputIntent: 'showcase',
                visualPreference: 'showcase'
            }
        }
    };

    function interpolate(template, values) {
        return window.XiangyuI18n?.interpolate?.(template, values || {})
            || String(template || '').replace(/\{(\w+)\}/g, (_, key) => {
                const value = values?.[key];
                return value === undefined || value === null ? '' : String(value);
            });
    }

    function deepClone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function asArray(value) {
        return Array.isArray(value) ? value : [];
    }

    function normalizeLocale(value, fallback) {
        const normalized = String(value || fallback || 'zh-CN').trim().toLowerCase();
        return normalized.startsWith('zh') ? 'zh-CN' : 'en';
    }

    function buildStyleOptions(styles) {
        return asArray(styles).map((style) => ({
            id: style.id,
            name: style.name || style.id,
            visualFamily: style.visualFamily || 'showcase'
        }));
    }

    function createCopilotController(studio) {
        const locale = normalizeLocale(studio.locale, 'zh-CN');
        const copy = COPILOT_I18N[locale] || COPILOT_I18N.en;
        const state = {
            uiLocale: locale,
            deckLocale: normalizeLocale(locale),
            messages: [],
            clarificationCount: 0,
            lastDraftBrief: null,
            styleOptions: STYLE_FALLBACKS.slice(),
            isSubmitting: false
        };

        const elements = {
            shell: document.getElementById('fastModeShell'),
            advancedPanel: document.getElementById('advancedPanel'),
            thread: document.getElementById('copilotThread'),
            shellTitle: document.getElementById('copilotShellTitle'),
            shellMode: document.getElementById('copilotShellMode'),
            shellHint: document.getElementById('copilotShellHint'),
            flowBrief: document.getElementById('copilotFlowBrief'),
            flowPlan: document.getElementById('copilotFlowPlan'),
            flowPreview: document.getElementById('copilotFlowPreview'),
            flowRefine: document.getElementById('copilotFlowRefine'),
            input: document.getElementById('copilotInput'),
            sendButton: document.getElementById('copilotSendBtn'),
            sendText: document.getElementById('copilotSendText'),
            summary: document.getElementById('copilotSummary'),
            toggleAdvancedButton: document.getElementById('toggleAdvancedModeBtn'),
            deckLocaleSelect: document.getElementById('copilotDeckLocale'),
            outputIntentSelect: document.getElementById('copilotOutputIntent'),
            visualPreferenceSelect: document.getElementById('copilotVisualPreference'),
            kicker: document.getElementById('copilotKicker'),
            title: document.getElementById('copilotTitle'),
            description: document.getElementById('copilotDescription'),
            threadTitle: document.getElementById('copilotThreadTitle'),
            threadHint: document.getElementById('copilotThreadHint'),
            settingsTitle: document.getElementById('copilotSettingsTitle'),
            settingsHint: document.getElementById('copilotSettingsHint'),
            deckLocaleLabel: document.getElementById('copilotDeckLocaleLabel'),
            outputIntentLabel: document.getElementById('copilotOutputIntentLabel'),
            visualPreferenceLabel: document.getElementById('copilotVisualPreferenceLabel'),
            inputHint: document.getElementById('copilotInputHint'),
            stageLabel: document.getElementById('copilotStageLabel'),
            stageStatus: document.getElementById('copilotStageStatus'),
            stageRoute: document.getElementById('copilotStageRoute'),
            stageStoryLabel: document.getElementById('copilotStageStoryLabel'),
            stageStoryboardLabel: document.getElementById('copilotStageStoryboardLabel'),
            stageHeadline: document.getElementById('copilotStageHeadline'),
            stageSubhead: document.getElementById('copilotStageSubhead'),
            stageVisual: document.getElementById('copilotStageVisual'),
            stageIntent: document.getElementById('copilotStageIntent'),
            stageLocale: document.getElementById('copilotStageLocale'),
            stageSceneOneLabel: document.getElementById('copilotStageSceneOneLabel'),
            stageSceneTwoLabel: document.getElementById('copilotStageSceneTwoLabel'),
            stageSceneThreeLabel: document.getElementById('copilotStageSceneThreeLabel'),
            stageSceneOne: document.getElementById('copilotStageSceneOne'),
            stageSceneTwo: document.getElementById('copilotStageSceneTwo'),
            stageSceneThree: document.getElementById('copilotStageSceneThree'),
            stageMetricOneLabel: document.getElementById('copilotStageMetricOneLabel'),
            stageMetricOneValue: document.getElementById('copilotStageMetricOneValue'),
            stageMetricTwoLabel: document.getElementById('copilotStageMetricTwoLabel'),
            stageMetricTwoValue: document.getElementById('copilotStageMetricTwoValue'),
            stageMetricThreeLabel: document.getElementById('copilotStageMetricThreeLabel'),
            stageMetricThreeValue: document.getElementById('copilotStageMetricThreeValue'),
            autofillTitle: document.getElementById('copilotAutofillTitle'),
            autofillHint: document.getElementById('copilotAutofillHint'),
            autofillList: document.getElementById('copilotAutofillList'),
            presetPitch: document.getElementById('copilotPresetPitch'),
            presetProduct: document.getElementById('copilotPresetProduct'),
            presetTeaching: document.getElementById('copilotPresetTeaching'),
            presetShowcase: document.getElementById('copilotPresetShowcase')
        };

        function t(key, values) {
            return interpolate(copy[key] || key, values);
        }

        function purposeLabel(purpose) {
            const map = {
                teaching: t('purposeTeaching'),
                pitch: t('purposePitch'),
                product: t('purposeProduct'),
                meeting: t('purposeMeeting'),
                company: t('purposeCompany'),
                tech: t('purposeTech'),
                personal: t('purposePersonal'),
                story: t('purposeStory'),
                marketing: t('purposeMarketing'),
                event: t('purposeEvent')
            };
            return map[purpose] || purpose || '';
        }

        function lengthLabel(length) {
            const map = {
                short: t('lengthShort'),
                medium: t('lengthMedium'),
                long: t('lengthLong')
            };
            return map[length] || length || '';
        }

        function intentLabel(intent) {
            const map = {
                showcase: t('intentShowcase'),
                briefing: t('intentBriefing'),
                'short-video': t('intentShortVideo')
            };
            return map[intent] || intent || t('outputIntentShowcase');
        }

        function visualLabel(visualFamily) {
            const map = {
                showcase: t('visualShowcaseLabel'),
                editorial: t('visualEditorialLabel'),
                briefing: t('visualBriefingLabel')
            };
            return map[visualFamily] || visualFamily || t('visualShowcaseLabel');
        }

        function formatResultDate(value) {
            if (!value) {
                return '-';
            }

            const date = new Date(value);
            if (Number.isNaN(date.getTime())) {
                return value;
            }

            return new Intl.DateTimeFormat(state.locale === 'zh-CN' ? 'zh-CN' : 'en', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        }

        function setSelectorValue(container, value) {
            if (!container) {
                return;
            }

            container.querySelectorAll('[data-val]').forEach((button) => {
                button.classList.toggle('active', button.dataset.val === value);
            });
        }

        function renderPresetButtons() {
            [
                ['presetPitch', 'presetPitchTitle', 'presetPitchBody'],
                ['presetProduct', 'presetProductTitle', 'presetProductBody'],
                ['presetTeaching', 'presetTeachingTitle', 'presetTeachingBody'],
                ['presetShowcase', 'presetShowcaseTitle', 'presetShowcaseBody']
            ].forEach(([elementKey, titleKey, bodyKey]) => {
                const button = elements[elementKey];
                if (!button) {
                    return;
                }

                button.innerHTML = `
                    <strong>${studio.escapeHtml(t(titleKey))}</strong>
                    <span>${studio.escapeHtml(t(bodyKey))}</span>
                `;
            });
        }

        function renderStaticCopy() {
            if (elements.kicker) {
                elements.kicker.innerHTML = `<i class="ph ph-sparkle"></i>${studio.escapeHtml(t('kicker'))}`;
            }
            if (elements.shellTitle) elements.shellTitle.textContent = t('shellTitle');
            if (elements.shellMode) elements.shellMode.textContent = t('shellMode');
            if (elements.shellHint) elements.shellHint.textContent = t('shellHint');
            if (elements.flowBrief) elements.flowBrief.textContent = t('flowBrief');
            if (elements.flowPlan) elements.flowPlan.textContent = t('flowPlan');
            if (elements.flowPreview) elements.flowPreview.textContent = t('flowPreview');
            if (elements.flowRefine) elements.flowRefine.textContent = t('flowRefine');
            if (elements.title) elements.title.textContent = t('title');
            if (elements.description) elements.description.textContent = t('description');
            if (elements.threadTitle) elements.threadTitle.textContent = t('threadTitle');
            if (elements.threadHint) elements.threadHint.textContent = t('threadHint');
            if (elements.settingsTitle) elements.settingsTitle.textContent = t('settingsTitle');
            if (elements.settingsHint) elements.settingsHint.textContent = t('settingsHint');
            if (elements.deckLocaleLabel) elements.deckLocaleLabel.textContent = t('deckLocaleLabel');
            if (elements.outputIntentLabel) elements.outputIntentLabel.textContent = t('outputIntentLabel');
            if (elements.visualPreferenceLabel) elements.visualPreferenceLabel.textContent = t('visualPreferenceLabel');
            if (elements.input) elements.input.placeholder = t('inputPlaceholder');
            if (elements.inputHint) elements.inputHint.textContent = t('inputHint');
            if (elements.sendText) elements.sendText.textContent = t('sendText');

            if (elements.deckLocaleSelect) {
                const options = elements.deckLocaleSelect.options;
                if (options[0]) options[0].textContent = t('deckLocaleZh');
                if (options[1]) options[1].textContent = t('deckLocaleEn');
            }

            if (elements.outputIntentSelect) {
                const options = elements.outputIntentSelect.options;
                if (options[0]) options[0].textContent = t('outputIntentAuto');
                if (options[1]) options[1].textContent = t('outputIntentShowcase');
                if (options[2]) options[2].textContent = t('outputIntentBriefing');
                if (options[3]) options[3].textContent = t('outputIntentShortVideo');
            }

            if (elements.visualPreferenceSelect) {
                const options = elements.visualPreferenceSelect.options;
                if (options[0]) options[0].textContent = t('visualAuto');
                if (options[1]) options[1].textContent = t('visualShowcase');
                if (options[2]) options[2].textContent = t('visualEditorial');
                if (options[3]) options[3].textContent = t('visualBriefing');
            }

            if (elements.stageLabel) elements.stageLabel.textContent = t('stageLabel');
            if (elements.stageRoute) elements.stageRoute.textContent = t('stageRoute');
            if (elements.stageStoryLabel) elements.stageStoryLabel.textContent = t('stageStoryLabel');
            if (elements.stageStoryboardLabel) elements.stageStoryboardLabel.textContent = t('stageStoryboardLabel');
            if (elements.stageSceneOneLabel) elements.stageSceneOneLabel.textContent = t('stageSceneOneLabel');
            if (elements.stageSceneTwoLabel) elements.stageSceneTwoLabel.textContent = t('stageSceneTwoLabel');
            if (elements.stageSceneThreeLabel) elements.stageSceneThreeLabel.textContent = t('stageSceneThreeLabel');
            if (elements.stageMetricOneLabel) elements.stageMetricOneLabel.textContent = t('stageMetricOneLabel');
            if (elements.stageMetricTwoLabel) elements.stageMetricTwoLabel.textContent = t('stageMetricTwoLabel');
            if (elements.stageMetricThreeLabel) elements.stageMetricThreeLabel.textContent = t('stageMetricThreeLabel');
            if (elements.autofillTitle) elements.autofillTitle.textContent = t('autofillTitle');
            if (elements.autofillHint) elements.autofillHint.textContent = t('autofillHint');
            if (elements.autofillList) {
                elements.autofillList.innerHTML = copy.autofillItems
                    .map((item) => `<li>${studio.escapeHtml(item)}</li>`)
                    .join('');
            }
            if (elements.thread) {
                elements.thread.dataset.logLabel = `${t('logTitle')} · ${t('logHint')}`;
            }

            renderPresetButtons();
        }

        function renderStage(draftBrief, phase, message) {
            const selectedDeckLocale = normalizeLocale(elements.deckLocaleSelect?.value || state.deckLocale, state.deckLocale);
            const selectedIntent = elements.outputIntentSelect?.value || draftBrief?.outputIntent || 'showcase';
            const selectedVisual = elements.visualPreferenceSelect?.value || draftBrief?.visualFamily || 'showcase';
            const phaseKey = phase || 'idle';
            const flow = Array.isArray(draftBrief?.outlineHints?.flow) ? draftBrief.outlineHints.flow.filter(Boolean) : [];
            const statusMap = {
                idle: t('stageStatusIdle'),
                planned: t('stageStatusPlanned'),
                clarifying: t('stageStatusClarifying'),
                building: t('stageStatusBuilding'),
                ready: t('stageStatusReady'),
                error: t('stageStatusError')
            };

            if (elements.shell) {
                elements.shell.dataset.copilotState = phaseKey;
                elements.shell.dataset.copilotVisual = selectedVisual;
            }

            if (elements.stageStatus) elements.stageStatus.textContent = statusMap[phaseKey] || statusMap.idle;
            if (elements.stageHeadline) elements.stageHeadline.textContent = draftBrief?.topic || t('stageDefaultHeadline');
            if (elements.stageSubhead) elements.stageSubhead.textContent = message || t('stageDefaultSubhead');
            if (elements.stageVisual) elements.stageVisual.textContent = visualLabel(selectedVisual);
            if (elements.stageIntent) elements.stageIntent.textContent = intentLabel(selectedIntent);
            if (elements.stageLocale) {
                elements.stageLocale.textContent = selectedDeckLocale === 'zh-CN' ? t('deckLocaleZh') : t('deckLocaleEn');
            }
            if (elements.stageMetricOneValue) elements.stageMetricOneValue.textContent = t('stageMetricOneValue');
            if (elements.stageMetricTwoValue) {
                elements.stageMetricTwoValue.textContent = draftBrief
                    ? `${visualLabel(draftBrief.visualFamily)} / ${intentLabel(draftBrief.outputIntent)}`
                    : `${visualLabel(selectedVisual)} / ${intentLabel(selectedIntent)}`;
            }
            if (elements.stageMetricThreeValue) elements.stageMetricThreeValue.textContent = t('stageMetricThreeValue');
            if (elements.stageSceneOne) elements.stageSceneOne.textContent = flow[0] || t('stageSceneOne');
            if (elements.stageSceneTwo) elements.stageSceneTwo.textContent = flow[1] || t('stageSceneTwo');
            if (elements.stageSceneThree) elements.stageSceneThree.textContent = flow[2] || t('stageSceneThree');
        }

        function addThreadMessage(role, content) {
            if (!elements.thread || !content) {
                return;
            }

            const bubble = document.createElement('div');
            bubble.className = `copilot-msg ${role === 'user' ? 'user' : 'assistant'}`;
            bubble.textContent = content;
            elements.thread.appendChild(bubble);
            elements.thread.scrollTop = elements.thread.scrollHeight;
        }

        function setSubmitting(isSubmitting) {
            state.isSubmitting = Boolean(isSubmitting);
            if (elements.sendButton) elements.sendButton.disabled = state.isSubmitting;
            if (elements.input) elements.input.disabled = state.isSubmitting;
            if (elements.sendText) elements.sendText.textContent = state.isSubmitting ? t('sendingText') : t('sendText');

            [
                elements.presetPitch,
                elements.presetProduct,
                elements.presetTeaching,
                elements.presetShowcase,
                elements.deckLocaleSelect,
                elements.outputIntentSelect,
                elements.visualPreferenceSelect
            ].forEach((element) => {
                if (element) {
                    element.disabled = state.isSubmitting;
                }
            });
        }

        function setAdvancedVisible(isVisible, silent) {
            if (elements.advancedPanel) {
                elements.advancedPanel.hidden = !isVisible;
            }
            if (elements.toggleAdvancedButton) {
                elements.toggleAdvancedButton.textContent = isVisible ? t('advancedHide') : t('advancedShow');
            }
            if (!silent && isVisible) {
                studio.notify?.(t('advancedReady'));
            }
        }

        function applyDraftBriefToAdvancedState(draftBrief) {
            if (!draftBrief) {
                return;
            }

            state.lastDraftBrief = draftBrief;
            state.deckLocale = normalizeLocale(draftBrief.locale, state.deckLocale);

            if (elements.deckLocaleSelect) {
                elements.deckLocaleSelect.value = state.deckLocale;
            }

            studio.config.purpose = draftBrief.purpose || studio.config.purpose;
            studio.config.length = draftBrief.length || studio.config.length;
            studio.config.style = draftBrief.styleId || studio.config.style;

            setSelectorValue(studio.elements.purposeArea, studio.config.purpose);
            setSelectorValue(studio.elements.lengthArea, studio.config.length);
            setSelectorValue(studio.elements.styleArea, studio.config.style);

            if (studio.elements.textarea) {
                studio.elements.textarea.value = draftBrief.topic || studio.elements.textarea.value;
                if (studio.elements.sendButton) {
                    studio.elements.sendButton.disabled = !studio.elements.textarea.value.trim();
                }
            }
        }

        function hydrateOutlineFromRecord(record) {
            if (!record?.outline) {
                return;
            }

            const outline = deepClone(record.outline);
            studio.currentOutline = outline;
            studio.currentSlides = deepClone(outline.slides || []);
            studio.config.style = record.style?.id || state.lastDraftBrief?.styleId || studio.config.style;
            studio.syncCurrentSlidesToOutline?.();
        }

        function renderSummary(draftBrief) {
            if (!elements.summary) {
                return;
            }

            if (!draftBrief) {
                elements.summary.hidden = true;
                elements.summary.innerHTML = '';
                return;
            }

            const summaryPills = [
                `${t('summaryPurpose')} / ${purposeLabel(draftBrief.purpose)}`,
                `${t('summaryLength')} / ${lengthLabel(draftBrief.length)}`,
                `${t('summaryVisual')} / ${visualLabel(draftBrief.visualFamily)}`,
                `${t('summaryIntent')} / ${intentLabel(draftBrief.outputIntent)}`,
                `${t('summaryAudience')} / ${draftBrief.audience || '-'}`,
                `${t('summaryVoiceover')} / ${draftBrief.voiceoverMode || t('voiceoverPlaceholder')}`
            ];

            elements.summary.hidden = false;
            elements.summary.innerHTML = `
                <div class="copilot-summary-title">
                    <strong>${studio.escapeHtml(t('summaryTitle'))}</strong>
                </div>
                <p class="copilot-summary-copy">${studio.escapeHtml(t('summaryHint'))}</p>
                <div class="copilot-summary-pills">
                    ${summaryPills.map((pill) => `<span>${studio.escapeHtml(pill)}</span>`).join('')}
                </div>
                <div class="copilot-summary-copy"><strong>${studio.escapeHtml(t('summaryTopic'))}</strong> / ${studio.escapeHtml(draftBrief.topic || '')}</div>
            `;
        }

        function getBuildStyleOptions() {
            return state.styleOptions && state.styleOptions.length > 0
                ? state.styleOptions
                : STYLE_FALLBACKS.slice();
        }

        async function loadStyleOptions() {
            try {
                const response = await fetch('/api/styles', { cache: 'no-store' });
                const data = await response.json().catch(() => []);
                if (response.ok && Array.isArray(data) && data.length > 0) {
                    state.styleOptions = buildStyleOptions(data);
                }
            } catch (error) {
                state.styleOptions = STYLE_FALLBACKS.slice();
            }
        }

        function attachFastActionsToSuccessCard(record) {
            const resultCard = document.getElementById('copilotResultMount')
                || studio.elements.resultArea.querySelector('.result-card')
                || studio.elements.resultArea;
            if (!resultCard) {
                return;
            }

            document.getElementById('copilotResultPanel')?.remove();
            const legacySuccessPanel = document.getElementById('openReadyPresentationBtn')?.closest('.status-panel');
            legacySuccessPanel?.remove();
            const showAdvancedAction = elements.advancedPanel?.hidden !== false;

            const styleOptions = getBuildStyleOptions();
            const absoluteUrl = studio.presentationUrl ? `${window.location.origin}${studio.presentationUrl}` : '';
            const slideTitles = Array.isArray(record?.outline?.slides)
                ? record.outline.slides
                    .map((slide, index) => ({
                        index,
                        title: slide?.title || slide?.subtitle || `${t('stageSceneOneLabel').replace('01', String(index + 1).padStart(2, '0'))}`
                    }))
                    .slice(0, 4)
                : [];
            const slideCount = Array.isArray(record?.outline?.slides) ? record.outline.slides.length : 0;
            const styleName = record?.style?.name || studio.config.style || '-';
            const styleVibe = record?.style?.vibe || visualLabel(record?.style?.visualFamily);
            const panel = document.createElement('div');
            panel.className = 'copilot-result-panel';
            panel.id = 'copilotResultPanel';
            if (resultCard.id === 'copilotResultMount') {
                panel.classList.add('editor-mounted');
            }
            panel.innerHTML = `
                <div class="copilot-result-hero">
                    <div class="copilot-result-copy">
                        <span class="copilot-result-label">${studio.escapeHtml(t('resultWorkspaceLabel'))}</span>
                        <h3>${studio.escapeHtml(t('resultWorkspaceTitle'))}</h3>
                        <p>${studio.escapeHtml(t('resultWorkspaceHint'))}</p>
                    </div>
                    <div class="copilot-result-actions">
                        <button class="copilot-inline-btn primary" id="copilotPreviewBtn" type="button">${studio.escapeHtml(t('previewNow'))}</button>
                        ${showAdvancedAction ? `<button class="copilot-inline-btn" id="copilotAdvancedEditBtn" type="button">${studio.escapeHtml(t('openAdvancedEditing'))}</button>` : ''}
                    </div>
                </div>
                <div class="copilot-result-grid">
                    <div class="copilot-result-stack">
                        <article class="copilot-result-metric">
                            <span>${studio.escapeHtml(t('resultMetaRoute'))}</span>
                            <strong>${studio.escapeHtml(absoluteUrl || '-')}</strong>
                        </article>
                        <article class="copilot-result-metric">
                            <span>${studio.escapeHtml(t('resultMetaStyle'))}</span>
                            <strong>${studio.escapeHtml(styleName)}</strong>
                            <p>${studio.escapeHtml(styleVibe || '-')}</p>
                        </article>
                        <article class="copilot-result-metric">
                            <span>${studio.escapeHtml(t('resultMetaExports'))}</span>
                            <strong>${studio.escapeHtml(t('resultExportReady'))}</strong>
                            <p>${studio.escapeHtml(t('resultAdvancedHint'))}</p>
                        </article>
                    </div>
                    <div class="copilot-result-outline">
                        <div class="copilot-result-outline-head">
                            <strong>${studio.escapeHtml(t('resultMetaOutline'))}</strong>
                            <span>${studio.escapeHtml(`${t('resultMetaSlides')} · ${slideCount || '-'}`)}</span>
                        </div>
                        <div class="copilot-result-outline-list">
                            ${slideTitles.length > 0
                                ? slideTitles.map((slide) => `
                                    <article class="copilot-result-outline-item">
                                        <span>${studio.escapeHtml(String(slide.index + 1).padStart(2, '0'))}</span>
                                        <strong>${studio.escapeHtml(slide.title)}</strong>
                                    </article>
                                `).join('')
                                : `<p class="copilot-result-empty">${studio.escapeHtml(t('resultOutlineFallback'))}</p>`}
                        </div>
                    </div>
                </div>
                <div class="copilot-result-toolbar">
                    <div class="copilot-style-row">
                        <label for="copilotStyleSwitchSelect">${studio.escapeHtml(t('switchStyleLabel'))}</label>
                        <select id="copilotStyleSwitchSelect">
                            ${styleOptions.map((style) => `
                                <option value="${studio.escapeHtml(style.id)}" ${style.id === (record?.style?.id || studio.config.style) ? 'selected' : ''}>
                                    ${studio.escapeHtml(style.name)} / ${studio.escapeHtml(visualLabel(style.visualFamily))}
                                </option>
                            `).join('')}
                        </select>
                        <button class="copilot-inline-btn" id="copilotStyleSwitchBtn" type="button">${studio.escapeHtml(t('switchStyleButton'))}</button>
                    </div>
                    <div class="copilot-result-action-strip">
                        <button class="copilot-inline-btn" id="copilotCopyLinkBtn" type="button">${studio.escapeHtml(t('resultCopyLink'))}</button>
                        <button class="copilot-inline-btn" id="copilotRawHtmlBtn" type="button">${studio.escapeHtml(t('resultOpenHtml'))}</button>
                        <button class="copilot-inline-btn" id="copilotDownloadHtmlBtn" type="button">${studio.escapeHtml(t('resultDownloadHtml'))}</button>
                        <button class="copilot-inline-btn" id="copilotDownloadPptxBtn" type="button">${studio.escapeHtml(t('resultDownloadPptx'))}</button>
                    </div>
                </div>
                <p class="copilot-build-note">${studio.escapeHtml(t('switchStyleHint'))}</p>
                <div class="copilot-result-footer">
                    <span class="copilot-result-foot-pill">${studio.escapeHtml(`ID · ${studio.presentationId || '-'}`)}</span>
                    <span class="copilot-result-foot-pill">${studio.escapeHtml(`${t('resultMetaUpdated')} · ${formatResultDate(record?.updatedAt)}`)}</span>
                </div>
            `;
            resultCard.appendChild(panel);

            document.getElementById('copilotPreviewBtn')?.addEventListener('click', () => studio.openPresentationPage());
            document.getElementById('copilotAdvancedEditBtn')?.addEventListener('click', () => {
                setAdvancedVisible(true, true);
                if (studio.currentOutline && studio.currentSlides?.length > 0) {
                    studio.renderOutlineCard();
                    studio.elements.resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            document.getElementById('copilotCopyLinkBtn')?.addEventListener('click', () => studio.copyPresentationLink());
            document.getElementById('copilotRawHtmlBtn')?.addEventListener('click', () => {
                if (!studio.presentationId) {
                    return;
                }
                window.open(`/api/presentations/${studio.presentationId}/html`, '_blank', 'noopener');
            });
            document.getElementById('copilotDownloadHtmlBtn')?.addEventListener('click', () => studio.downloadHTML());
            document.getElementById('copilotDownloadPptxBtn')?.addEventListener('click', () => studio.downloadPPTX());
            document.getElementById('copilotStyleSwitchBtn')?.addEventListener('click', () => {
                const select = document.getElementById('copilotStyleSwitchSelect');
                const nextStyle = select?.value;
                if (!nextStyle) {
                    return;
                }

                if (!studio.currentOutline || studio.currentSlides.length === 0) {
                    studio.notify?.(t('buildStyleRequired'), 'error');
                    return;
                }

                studio.config.style = nextStyle;
                setSelectorValue(studio.elements.styleArea, nextStyle);
                studio.generatePresentation();
            });
        }

        function patchStudio() {
            const originalRenderSuccessCard = studio.renderSuccessCard.bind(studio);
            studio.renderSuccessCard = function patchedRenderSuccessCard(record) {
                hydrateOutlineFromRecord(record);
                originalRenderSuccessCard(record);
                attachFastActionsToSuccessCard(record);
                renderStage(state.lastDraftBrief, 'ready', t('buildReady'));
                addThreadMessage('assistant', t('buildReady'));
            };
        }

        async function buildFromDraftBrief(draftBrief) {
            if (!draftBrief) {
                return;
            }

            applyDraftBriefToAdvancedState(draftBrief);
            studio.isGenerating = true;
            studio.generatedHtml = null;
            studio.presentationId = null;
            studio.presentationUrl = null;
            studio.pptxUrl = null;
            studio.buildLog = [];
            studio.renderBuildCard({
                progress: 2,
                step: 1,
                message: t('building'),
                status: 'building'
            });
            studio.appendBuildLog(t('buildLogPlanning'));
            renderStage(draftBrief, 'building', t('building'));
            setSubmitting(true);

            try {
                const response = await fetch('/api/copilot/build/stream', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        draftBrief,
                        locale: draftBrief.locale
                    })
                });

                if (!response.ok) {
                    const errorPayload = await response.json().catch(() => ({}));
                    throw new Error(errorPayload.error || 'Copilot build failed');
                }

                await studio.consumeEventStream(response, (event) => {
                    studio.presentationId = event.presentationId || studio.presentationId;
                    studio.presentationUrl = studio.presentationId ? `/presentations/${studio.presentationId}` : studio.presentationUrl;
                    studio.pptxUrl = studio.presentationId ? `/api/presentations/${studio.presentationId}/export.pptx` : studio.pptxUrl;
                    studio.lastBuildState = event;
                    if (event.message) {
                        studio.appendBuildLog(event.message);
                    }
                    studio.renderBuildCard(event);
                    renderStage(draftBrief, event.status === 'ready' ? 'ready' : 'building', event.message || t('building'));
                });

                if (!studio.presentationId) {
                    throw new Error('Missing presentation id after build');
                }

                const record = await studio.fetchPresentationRecord(studio.presentationId);
                studio.renderSuccessCard(record);
            } catch (error) {
                renderStage(draftBrief, 'error', error.message);
                studio.renderErrorCard(t('buildFailed', { message: error.message }));
                studio.notify?.(t('buildFailed', { message: error.message }), 'error');
            } finally {
                studio.isGenerating = false;
                setSubmitting(false);
            }
        }

        async function submitPrompt() {
            const message = elements.input?.value?.trim();
            if (!message) {
                studio.notify?.(t('noPrompt'), 'error');
                return;
            }

            addThreadMessage('user', message);
            state.messages.push({ role: 'user', content: message });
            if (elements.input) {
                elements.input.value = '';
            }
            setSubmitting(true);

            try {
                const response = await fetch('/api/copilot/plan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: state.messages,
                        locale: elements.deckLocaleSelect?.value || state.deckLocale,
                        uiLocale: locale,
                        outputIntent: elements.outputIntentSelect?.value || '',
                        visualPreference: elements.visualPreferenceSelect?.value || '',
                        allowClarification: state.clarificationCount < 1
                    })
                });

                const data = await response.json().catch(() => ({}));
                if (!response.ok) {
                    throw new Error(data.error || 'Copilot planning failed');
                }

                if (data.assistantMessage) {
                    addThreadMessage('assistant', data.assistantMessage);
                    state.messages.push({ role: 'assistant', content: data.assistantMessage });
                } else if (data.clarification) {
                    addThreadMessage('assistant', data.clarification);
                    state.messages.push({ role: 'assistant', content: data.clarification });
                }

                if (data.draftBrief) {
                    applyDraftBriefToAdvancedState(data.draftBrief);
                    renderSummary(data.draftBrief);
                }

                if (data.readyToBuild) {
                    renderStage(data.draftBrief, 'planned', data.assistantMessage || '');
                    await buildFromDraftBrief(data.draftBrief);
                    return;
                }

                if (data.clarification) {
                    renderStage(data.draftBrief, 'clarifying', data.clarification);
                    state.clarificationCount += 1;
                }
            } catch (error) {
                renderStage(state.lastDraftBrief, 'error', error.message);
                studio.notify?.(error.message, 'error');
            } finally {
                setSubmitting(false);
                elements.input?.focus();
            }
        }

        function applyPromptPreset(presetKey) {
            const preset = PROMPT_PRESETS[presetKey]?.[locale] || PROMPT_PRESETS[presetKey]?.en;
            if (!preset || !elements.input) {
                return;
            }

            elements.input.value = preset.prompt;
            if (elements.outputIntentSelect && preset.outputIntent) {
                elements.outputIntentSelect.value = preset.outputIntent;
            }
            if (elements.visualPreferenceSelect && preset.visualPreference) {
                elements.visualPreferenceSelect.value = preset.visualPreference;
            }

            renderStage(state.lastDraftBrief, 'idle', t('copiedPreset'));
            elements.input.focus();
            elements.input.setSelectionRange(elements.input.value.length, elements.input.value.length);
            studio.notify?.(t('copiedPreset'));
        }

        function bind() {
            renderStaticCopy();
            renderSummary(null);
            patchStudio();
            document.body.dataset.createSurface = 'studio';
            renderStage(null, 'idle');
            addThreadMessage('assistant', t('welcome'));

            if (elements.deckLocaleSelect) {
                elements.deckLocaleSelect.value = state.deckLocale;
            }

            elements.sendButton?.addEventListener('click', () => submitPrompt());
            elements.input?.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    submitPrompt();
                }
            });
            elements.toggleAdvancedButton?.addEventListener('click', () => {
                setAdvancedVisible(elements.advancedPanel?.hidden !== false, true);
            });
            elements.deckLocaleSelect?.addEventListener('change', () => renderStage(state.lastDraftBrief, 'idle'));
            elements.outputIntentSelect?.addEventListener('change', () => renderStage(state.lastDraftBrief, 'idle'));
            elements.visualPreferenceSelect?.addEventListener('change', () => renderStage(state.lastDraftBrief, 'idle'));
            elements.presetPitch?.addEventListener('click', () => applyPromptPreset('pitch'));
            elements.presetProduct?.addEventListener('click', () => applyPromptPreset('product'));
            elements.presetTeaching?.addEventListener('click', () => applyPromptPreset('teaching'));
            elements.presetShowcase?.addEventListener('click', () => applyPromptPreset('showcase'));
        }

        return {
            async init() {
                await loadStyleOptions();
                setAdvancedVisible(false, true);
                bind();
            }
        };
    }

    document.addEventListener('DOMContentLoaded', async () => {
        const studio = window.createStudio;
        if (!studio) {
            return;
        }

        const controller = createCopilotController(studio);
        studio.copilot = controller;
        await controller.init();
    });
})();
