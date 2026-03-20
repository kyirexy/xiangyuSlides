const CREATE_PAGE_I18N = {
    'zh-CN': {
        untitledOutline: '未命名脚本',
        outlineReadySubtitle: '脚本已生成，下一步可以开始创建独立演示页面。',
        generatePresentation: '开始生成',
        deckSettings: 'Deck 设置',
        slideCount: '{count} 页脚本',
        defaultPurpose: '默认用途',
        defaultLength: '中等长度',
        selectStyle: '请选择风格',
        slideTitle: '第 {index} 页',
        editSlideTitle: '编辑这页脚本',
        editDeckTitle: '编辑 Deck 设置',
        aiRewriteLabel: '让 AI 改写这页脚本',
        aiRewritePlaceholder: '例如：把这一页改成更适合 CEO 汇报的表达，增加 3 个量化结果。',
        jsonSlideLabel: '或者直接编辑当前页 JSON',
        jsonDeckLabel: '直接编辑 Deck JSON（title / subtitle / timeline / sceneVoiceover）',
        aiLoading: 'AI 正在改写这页脚本...',
        cancel: '取消',
        rewriteWithAi: 'AI 重写',
        saveSlide: '保存脚本',
        saveDeck: '保存设置',
        describeRewrite: '先描述你想怎么改这页脚本。',
        slideUpdated: '脚本页已更新',
        deckUpdated: 'Deck 设置已更新',
        invalidJson: 'JSON 格式不正确。',
        pptxNotReady: 'PPTX 导出还未就绪。',
        motion: '动画',
        transition: '转场',
        transitionEnter: '入场',
        transitionHold: '停留',
        transitionExit: '退场',
        duration: '时长',
        voiceover: '旁白',
        image: '图片',
        video: '视频',
        slideMotionTitle: '动效预设',
        slideMotionHint: '优先在这里调整场景和元素动效，下面的原始 JSON 仍然作为最终兜底入口。',
        slideMotionSceneText: '场景动效',
        slideMotionHeadingText: '标题动效',
        slideMotionSubtitleText: '副标题动效',
        slideMotionContentText: '内容动效',
        slideMotionMediaText: '媒体动效',
        slideTransitionTitle: '场景转场',
        slideTransitionHint: '直接调整转场节奏、遮罩和元素时序，不必手写每个字段。',
        slideTransitionPresetText: '转场预设',
        slideTransitionOverlayText: '遮罩层',
        slideTransitionDurationText: '转场时长（ms）',
        slideTransitionContentDelayText: '内容延迟（ms）',
        slideTransitionMotionDurationText: '元素动画时长（ms）',
        slideTransitionStaggerText: '交错间隔（ms）',
        slideMotionPresetAuto: '自动',
        slideMotionPresetFade: '淡入',
        slideMotionPresetFadeUp: '上浮淡入',
        slideMotionPresetSlideLeft: '左滑进入',
        slideMotionPresetSlideRight: '右滑进入',
        slideMotionPresetZoomIn: '缩放进入',
        slideMotionPresetStaggerUp: '阶梯上浮',
        slideTransitionPresetAuto: '自动',
        slideTransitionPresetCrossfade: '交叉淡入',
        slideTransitionPresetLiftFade: '抬升淡入',
        slideTransitionPresetPushLeft: '向左推进',
        slideTransitionPresetPushRight: '向右推进',
        slideTransitionPresetZoomFade: '缩放淡入',
        slideTransitionOverlayAuto: '自动',
        slideTransitionOverlayNone: '无',
        slideTransitionOverlayAccent: '强调色',
        slideTransitionOverlayDark: '深色',
        slideTransitionOverlayLight: '浅色',
        slideMediaTitle: '媒体',
        slideMediaHint: '在这里配置图片或视频字段，让 preview runtime 直接渲染媒体，而不只依赖手写 JSON。',
        slideMediaTypeText: '媒体类型',
        slideMediaSourceText: '媒体地址',
        slideMediaMimeTypeText: 'MIME 类型',
        slideMediaPosterText: '封面图',
        slideMediaAltText: '替代文本',
        slideMediaCaptionText: '说明文案',
        slideMediaAutoplayText: '自动播放',
        slideMediaLoopText: '循环播放',
        slideMediaTypeNone: '无',
        slideMediaTypeImage: '图片',
        slideMediaTypeVideo: '视频',
        slideMediaSourcePlaceholder: '例如：https://example.com/media.mp4',
        slideMediaMimeTypePlaceholder: '例如：video/mp4',
        slideMediaPosterPlaceholder: '例如：https://example.com/poster.jpg',
        slideMediaAltPlaceholder: '为无障碍提供的媒体描述',
        slideMediaCaptionPlaceholder: '可选说明文案',
        slideTimingTitle: '时长与旁白',
        slideTimingHint: '直接配置单页时长和旁白占位，让 runtime 时间轴可编辑，而不是只靠原始 JSON。',
        slideDurationText: '页面时长（ms）',
        slideVoiceoverLanguageText: '旁白语言',
        slideVoiceoverTextLabel: '旁白文本',
        slideVoiceoverTextPlaceholder: '例如：先概括这页目标，再把关键句拆成 cue。',
        slideVoiceoverCueTitle: '旁白 Cue',
        slideVoiceoverCueHint: '为当前页面添加字幕 cue，不必切回 deck 级编辑。',
        slideVoiceoverCueAtText: 'Cue 时间（ms）',
        slideVoiceoverCueTextText: 'Cue 文本',
        slideVoiceoverCueTextPlaceholder: '例如：旁白第一句',
        slideVoiceoverCueAdd: '添加 Cue',
        slideVoiceoverCueApply: '应用 Cue',
        slideVoiceoverCueRemove: '删除 Cue',
        slideVoiceoverCueEmpty: '这页还没有 cue。先写旁白文本或添加一句 cue。',
        timelineEnabled: 'Timeline 开',
        timelineDisabled: 'Timeline 关',
        markersCount: '标记 {count}',
        audioTracksCount: '音轨 {count}',
        voiceoverScenesCount: '旁白 {count}',
        subtitleModeLabel: '字幕 {mode}',
        subtitleModeVoiceover: '旁白占位',
        subtitleModeStatic: '静态',
        subtitleModeOff: '关闭',
        autoplayEnabledPill: '自动播放 开',
        autoplayDisabledPill: '自动播放 关',
        deckTimelineTitle: 'Timeline 设置',
        deckTimelineHint: '先用可见控件调整播放标记，再按需微调下方 JSON。',
        deckTimelineEnabledText: '启用 Timeline',
        deckTimelineAutoplayText: '自动播放',
        deckSubtitleModeText: '字幕模式',
        deckTimelineStarterText: 'Timeline Starter',
        deckTimelineStarterApply: '应用 Starter',
        deckTimelineStarterReset: '重置 Starter',
        deckTimelineStarterApplied: '已应用 {template} starter，生成 {markers} 个标记与 {voiceover} 条旁白',
        deckTimelineStarterResetDone: '已移除 {markers} 个 starter 标记与 {voiceover} 条 starter 旁白',
        deckTimelineStarterSummary: '当前 Timeline Starter',
        deckTimelineStarterSummaryTemplate: '模板 {template}',
        deckTimelineStarterSummaryPurpose: '用途 {purpose}',
        deckTimelineStarterSummaryGeneratedAt: '生成于 {time}',
        deckTimelineStarterSummaryMarkers: '标记',
        deckTimelineStarterSummaryVoiceover: '旁白',
        deckTimelineStarterEmpty: '还没有 timeline starter。先选择模板并应用。',
        deckTimelineStarterOpening: '开场',
        deckTimelineStarterProof: '论证',
        deckTimelineStarterClosing: '收尾',
        deckTimelineStarterFullFlow: '完整流程',
        deckMarkerEditorTitle: 'Marker 编辑',
        deckMarkerEditorHint: '用这个面板快速添加导航、旁白或编辑提示标记。',
        deckMarkerLabelText: '标记名称',
        deckMarkerSceneText: '所属场景',
        deckMarkerKindText: '标记类型',
        deckMarkerAnchorText: '锚点',
        deckMarkerAdd: '添加标记',
        deckMarkerGenerateNav: '生成导航',
        deckMarkerClearGenerated: '清理生成项',
        deckMarkerApply: '应用修改',
        deckMarkerRemove: '删除标记',
        deckMarkersGenerated: '已生成 {count} 个导航标记',
        deckMarkersCleared: '已清理 {count} 个生成标记',
        deckMarkerEmpty: '还没有 marker。先添加一个导航、旁白或编辑提示标记。',
        deckMarkerPlaceholder: '例如：Narration Cue',
        deckMarkerSceneOption: '场景 {index}',
        deckMarkerKindNavigation: '导航',
        deckMarkerKindNarration: '旁白',
        deckMarkerKindEdit: '编辑提示',
        deckMarkerAnchorStart: '起点',
        deckMarkerAnchorAdvance: '推进',
        deckMarkerAnchorExit: '退场',
        deckAudioEditorTitle: '音轨编辑',
        deckAudioEditorHint: '先在这里配置本地或远程音轨，再让 preview runtime 直接预览音频时间轴。',
        deckAudioLabelText: '音轨名称',
        deckAudioSourceText: '音频地址',
        deckAudioStartText: '开始时间（ms）',
        deckAudioGainText: '音量（0-1）',
        deckAudioAutoplayText: '自动播放',
        deckAudioLoopText: '循环播放',
        deckAudioAdd: '添加音轨',
        deckAudioApply: '应用音轨',
        deckAudioDuplicate: '复制音轨',
        deckAudioRemove: '删除音轨',
        deckAudioEmpty: '还没有 audio track。先添加一条背景音或旁白音轨。',
        deckAudioLabelPlaceholder: '例如：Ambient Bed',
        deckAudioSourcePlaceholder: '例如：https://example.com/audio.mp3',
        deckAudioMissingSource: '请先填写音频地址。',
        deckAudioMetaStart: '开始 {time}',
        deckAudioMetaAutoplay: '自动播放',
        deckAudioMetaLoop: '循环',
        deckVoiceoverEditorTitle: '旁白与字幕 Cue',
        deckVoiceoverEditorHint: '按场景维护旁白文本和 cue，preview runtime 会直接消费这些 placeholder。',
        deckVoiceoverSceneText: '旁白场景',
        deckVoiceoverLanguageText: '语言',
        deckVoiceoverTextLabel: '旁白文本',
        deckVoiceoverTextPlaceholder: '例如：先说明场景目标，再逐句拆成 cue。',
        deckVoiceoverGenerateMarkers: '生成旁白标记',
        deckVoiceoverGenerate: '生成旁白',
        deckVoiceoverClearGenerated: '清理生成项',
        deckVoiceoverCopyPrev: '复制上一场景旁白',
        deckVoiceoverCopyNext: '复制下一场景旁白',
        deckVoiceoverCopied: '已复制上一场景旁白',
        deckVoiceoverCopiedNext: '已复制下一场景旁白',
        deckVoiceoverCopyPrevMissing: '上一场景还没有可复制的旁白',
        deckVoiceoverCopyNextMissing: '下一场景还没有可复制的旁白',
        deckNarrationMarkersGenerated: '已生成 {count} 个旁白标记',
        deckVoiceoverGenerated: '已生成 {count} 条场景旁白',
        deckVoiceoverCleared: '已清理 {count} 条生成旁白',
        deckCueAtText: 'Cue 时间（ms）',
        deckCueTextText: 'Cue 文本',
        deckCueTextPlaceholder: '例如：Narration line 1',
        deckCueAdd: '添加 Cue',
        deckCueGenerate: '生成 Cue 组',
        deckCueGenerated: '已生成 {count} 条 Cue',
        deckCueAppend: '追加 Cue 组',
        deckCueAppended: '已追加 {count} 条 Cue',
        deckCueGenerateMissingVoiceover: '请先填写旁白文本',
        deckCueAppendNoNew: '没有新的 Cue 可追加',
        deckCueApply: '应用 Cue',
        deckCueDuplicate: '复制 Cue',
        deckCueDuplicated: '已复制当前 Cue',
        deckCueRetime: '重排 Cue 时间',
        deckCueRetimed: '已重排 {count} 条 Cue 时间',
        deckCueRetimeEmpty: '当前场景还没有 Cue 可重排',
        deckCueRemove: '删除 Cue',
        deckCueEmpty: '当前场景还没有 cue。先写旁白文本或添加一句 cue。',
        deckCueMissingText: '请先填写 cue 文本。',
        deckVoiceoverLanguageZh: '中文',
        deckVoiceoverLanguageEn: '英文',
        deckCueMetaAt: '时间 {time}',
        waitingContent: '等待补充内容',
        buildProgress: '当前进度',
        accessUrl: '访问地址',
        openPage: '打开页面',
        copyLink: '复制链接',
        buildLog: '生成动态',
        availableActions: '可执行操作',
        openStandalone: '前往独立页面',
        downloadHtml: '下载 HTML',
        downloadPptx: '下载 PPTX',
        presentationReady: '演示稿已生成完成，可以直接在独立页面查看。',
        buildSteps: [
            { index: 1, label: 'Outline 校验', description: '检查结构和页数' },
            { index: 2, label: '主题应用', description: '应用稳定主题与样式令牌' },
            { index: 3, label: '稳定渲染', description: '生成可预览的 HTML 幻灯片' },
            { index: 4, label: '保存记录', description: '持久化预览和导出元数据' },
            { index: 5, label: '生成完成', description: '独立链接与 PPTX 可用' }
        ],
        purposeLabels: {
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
        lengthLabels: {
            short: '简短',
            medium: '中等',
            long: '完整'
        }
    },
    en: {
        untitledOutline: 'Untitled outline',
        outlineReadySubtitle: 'The outline is ready. Next you can build the standalone presentation.',
        generatePresentation: 'Generate Presentation',
        deckSettings: 'Deck Settings',
        slideCount: '{count} slides',
        defaultPurpose: 'Default purpose',
        defaultLength: 'Medium length',
        selectStyle: 'Choose a style',
        slideTitle: 'Slide {index}',
        editSlideTitle: 'Edit Slide JSON',
        editDeckTitle: 'Edit Deck Settings',
        aiRewriteLabel: 'Ask AI to rewrite this slide',
        aiRewritePlaceholder: 'Example: rewrite this slide for an executive update and add 3 quantified outcomes.',
        jsonSlideLabel: 'Or edit the current slide JSON directly',
        jsonDeckLabel: 'Edit deck JSON directly (title / subtitle / timeline / sceneVoiceover)',
        aiLoading: 'AI is rewriting this slide...',
        cancel: 'Cancel',
        rewriteWithAi: 'Rewrite with AI',
        saveSlide: 'Save Slide',
        saveDeck: 'Save Settings',
        describeRewrite: 'Describe how you want this slide rewritten first.',
        slideUpdated: 'Slide updated.',
        deckUpdated: 'Deck settings updated.',
        invalidJson: 'Invalid JSON format.',
        pptxNotReady: 'PPTX export is not ready yet.',
        motion: 'Motion',
        transition: 'Transition',
        transitionEnter: 'Enter',
        transitionHold: 'Hold',
        transitionExit: 'Exit',
        duration: 'Duration',
        voiceover: 'Voiceover',
        image: 'Image',
        video: 'Video',
        slideMotionTitle: 'Motion Presets',
        slideMotionHint: 'Adjust scene and element motion here while the raw JSON stays available as the final fallback.',
        slideMotionSceneText: 'Scene Motion',
        slideMotionHeadingText: 'Heading Motion',
        slideMotionSubtitleText: 'Subtitle Motion',
        slideMotionContentText: 'Content Motion',
        slideMotionMediaText: 'Media Motion',
        slideTransitionTitle: 'Scene Transition',
        slideTransitionHint: 'Control scene transition rhythm, overlay, and element timing without hand-editing every field.',
        slideTransitionPresetText: 'Transition Preset',
        slideTransitionOverlayText: 'Overlay',
        slideTransitionDurationText: 'Duration (ms)',
        slideTransitionContentDelayText: 'Content Delay (ms)',
        slideTransitionMotionDurationText: 'Motion Duration (ms)',
        slideTransitionStaggerText: 'Stagger Step (ms)',
        slideMotionPresetAuto: 'Auto',
        slideMotionPresetFade: 'Fade',
        slideMotionPresetFadeUp: 'Fade Up',
        slideMotionPresetSlideLeft: 'Slide Left',
        slideMotionPresetSlideRight: 'Slide Right',
        slideMotionPresetZoomIn: 'Zoom In',
        slideMotionPresetStaggerUp: 'Stagger Up',
        slideTransitionPresetAuto: 'Auto',
        slideTransitionPresetCrossfade: 'Crossfade',
        slideTransitionPresetLiftFade: 'Lift Fade',
        slideTransitionPresetPushLeft: 'Push Left',
        slideTransitionPresetPushRight: 'Push Right',
        slideTransitionPresetZoomFade: 'Zoom Fade',
        slideTransitionOverlayAuto: 'Auto',
        slideTransitionOverlayNone: 'None',
        slideTransitionOverlayAccent: 'Accent',
        slideTransitionOverlayDark: 'Dark',
        slideTransitionOverlayLight: 'Light',
        slideMediaTitle: 'Media',
        slideMediaHint: 'Configure image or video fields here so the preview runtime can render slide media without relying on raw JSON only.',
        slideMediaTypeText: 'Media Type',
        slideMediaSourceText: 'Media Source',
        slideMediaMimeTypeText: 'MIME Type',
        slideMediaPosterText: 'Poster',
        slideMediaAltText: 'Alt Text',
        slideMediaCaptionText: 'Caption',
        slideMediaAutoplayText: 'Autoplay',
        slideMediaLoopText: 'Loop',
        slideMediaTypeNone: 'None',
        slideMediaTypeImage: 'Image',
        slideMediaTypeVideo: 'Video',
        slideMediaSourcePlaceholder: 'Example: https://example.com/media.mp4',
        slideMediaMimeTypePlaceholder: 'Example: video/mp4',
        slideMediaPosterPlaceholder: 'Example: https://example.com/poster.jpg',
        slideMediaAltPlaceholder: 'Describe the media for accessibility',
        slideMediaCaptionPlaceholder: 'Optional caption',
        slideTimingTitle: 'Timing & Voiceover',
        slideTimingHint: 'Adjust slide duration and voiceover placeholders here so the runtime timeline stays editable without relying on raw JSON only.',
        slideDurationText: 'Slide Duration (ms)',
        slideVoiceoverLanguageText: 'Voiceover Language',
        slideVoiceoverTextLabel: 'Voiceover Text',
        slideVoiceoverTextPlaceholder: 'Example: summarize the slide goal first, then split key lines into cues.',
        slideVoiceoverCueTitle: 'Voiceover Cues',
        slideVoiceoverCueHint: 'Add subtitle cue offsets for the current slide without switching to deck-wide editing.',
        slideVoiceoverCueAtText: 'Cue Offset (ms)',
        slideVoiceoverCueTextText: 'Cue Text',
        slideVoiceoverCueTextPlaceholder: 'Example: line one of the narration',
        slideVoiceoverCueAdd: 'Add Cue',
        slideVoiceoverCueApply: 'Apply Cue',
        slideVoiceoverCueRemove: 'Remove Cue',
        slideVoiceoverCueEmpty: 'No cues for this slide yet. Write voiceover text or add a cue first.',
        timelineEnabled: 'Timeline On',
        timelineDisabled: 'Timeline Off',
        markersCount: 'Markers {count}',
        audioTracksCount: 'Audio {count}',
        voiceoverScenesCount: 'Voiceover {count}',
        subtitleModeLabel: 'Subtitles {mode}',
        subtitleModeVoiceover: 'Voiceover',
        subtitleModeStatic: 'Static',
        subtitleModeOff: 'Off',
    autoplayEnabledPill: 'Auto-play On',
    autoplayDisabledPill: 'Auto-play Off',
    deckTimelineTitle: 'Timeline Settings',
    deckTimelineHint: 'Adjust deck playback flags here before fine-tuning the raw JSON below.',
    deckTimelineEnabledText: 'Timeline enabled',
    deckTimelineAutoplayText: 'Auto-play',
    deckSubtitleModeText: 'Subtitle Mode',
    deckTimelineStarterText: 'Timeline Starter',
    deckTimelineStarterApply: 'Apply Starter',
    deckTimelineStarterReset: 'Reset Starter',
    deckTimelineStarterApplied: 'Applied the {template} starter and generated {markers} markers plus {voiceover} voiceovers.',
    deckTimelineStarterResetDone: 'Removed {markers} starter markers and {voiceover} starter voiceovers.',
    deckTimelineStarterSummary: 'Timeline Starter Active',
    deckTimelineStarterSummaryTemplate: 'Template {template}',
    deckTimelineStarterSummaryPurpose: 'Purpose {purpose}',
    deckTimelineStarterSummaryGeneratedAt: 'Generated {time}',
    deckTimelineStarterSummaryMarkers: 'Markers',
    deckTimelineStarterSummaryVoiceover: 'Voiceover',
    deckTimelineStarterEmpty: 'No timeline starter applied yet. Choose a template and apply it.',
    deckTimelineStarterOpening: 'Opening',
    deckTimelineStarterProof: 'Proof',
    deckTimelineStarterClosing: 'Closing',
    deckTimelineStarterFullFlow: 'Full Flow',
    deckMarkerEditorTitle: 'Marker Editor',
        deckMarkerEditorHint: 'Quickly add navigation, narration, or edit cues without hand-writing every marker.',
        deckMarkerLabelText: 'Label',
        deckMarkerSceneText: 'Scene',
        deckMarkerKindText: 'Kind',
    deckMarkerAnchorText: 'Anchor',
    deckMarkerAdd: 'Add Marker',
    deckMarkerGenerateNav: 'Generate Nav',
    deckMarkerClearGenerated: 'Clear Generated',
    deckMarkerApply: 'Apply Selection',
    deckMarkerRemove: 'Remove',
    deckMarkersGenerated: 'Generated {count} navigation markers.',
    deckMarkersCleared: 'Cleared {count} generated markers.',
        deckMarkerEmpty: 'No markers yet. Add a navigation, narration, or edit cue marker first.',
        deckMarkerPlaceholder: 'Example: Narration Cue',
        deckMarkerSceneOption: 'Scene {index}',
        deckMarkerKindNavigation: 'Navigation',
        deckMarkerKindNarration: 'Narration',
        deckMarkerKindEdit: 'Edit',
        deckMarkerAnchorStart: 'Start',
        deckMarkerAnchorAdvance: 'Advance',
        deckMarkerAnchorExit: 'Exit',
        deckAudioEditorTitle: 'Audio Tracks',
        deckAudioEditorHint: 'Configure local or remote tracks here so the preview runtime can play the deck timeline directly.',
        deckAudioLabelText: 'Label',
        deckAudioSourceText: 'Audio Source',
        deckAudioStartText: 'Start Offset (ms)',
        deckAudioGainText: 'Gain (0-1)',
        deckAudioAutoplayText: 'Autoplay',
        deckAudioLoopText: 'Loop',
        deckAudioAdd: 'Add Audio',
        deckAudioApply: 'Apply Audio',
        deckAudioDuplicate: 'Duplicate Audio',
        deckAudioRemove: 'Remove Audio',
        deckAudioEmpty: 'No audio tracks yet. Add a bed, sting, or voice track first.',
        deckAudioLabelPlaceholder: 'Example: Ambient Bed',
        deckAudioSourcePlaceholder: 'Example: https://example.com/audio.mp3',
        deckAudioMissingSource: 'Enter an audio source URL first.',
        deckAudioMetaStart: 'Start {time}',
        deckAudioMetaAutoplay: 'Autoplay',
        deckAudioMetaLoop: 'Loop',
        deckVoiceoverEditorTitle: 'Voiceover & Subtitle Cues',
        deckVoiceoverEditorHint: 'Maintain scene-level voiceover text and cues here so the preview runtime can consume the placeholders directly.',
        deckVoiceoverSceneText: 'Voiceover Scene',
        deckVoiceoverLanguageText: 'Language',
    deckVoiceoverTextLabel: 'Voiceover Text',
    deckVoiceoverTextPlaceholder: 'Example: explain the scene goal first, then split it into cues.',
        deckVoiceoverGenerateMarkers: 'Generate Markers',
        deckVoiceoverGenerate: 'Generate Voiceover',
        deckVoiceoverClearGenerated: 'Clear Generated',
        deckVoiceoverCopyPrev: 'Copy Previous Voiceover',
        deckVoiceoverCopyNext: 'Copy Next Voiceover',
        deckVoiceoverCopied: 'Copied the previous scene voiceover.',
        deckVoiceoverCopiedNext: 'Copied the next scene voiceover.',
        deckVoiceoverCopyPrevMissing: 'No previous scene voiceover to copy.',
        deckVoiceoverCopyNextMissing: 'No next scene voiceover to copy.',
        deckNarrationMarkersGenerated: 'Generated {count} narration markers.',
        deckVoiceoverGenerated: 'Generated {count} scene voiceovers.',
        deckVoiceoverCleared: 'Cleared {count} generated voiceovers.',
        deckCueAtText: 'Cue Offset (ms)',
        deckCueTextText: 'Cue Text',
        deckCueTextPlaceholder: 'Example: Narration line 1',
        deckCueAdd: 'Add Cue',
        deckCueGenerate: 'Generate Cue Set',
        deckCueGenerated: 'Generated {count} cues.',
        deckCueAppend: 'Append Cue Set',
        deckCueAppended: 'Appended {count} cues.',
        deckCueGenerateMissingVoiceover: 'Write voiceover text first.',
        deckCueAppendNoNew: 'No new cues to append.',
        deckCueApply: 'Apply Cue',
        deckCueDuplicate: 'Duplicate Cue',
        deckCueDuplicated: 'Duplicated the selected cue.',
        deckCueRetime: 'Re-time Cues',
        deckCueRetimed: 'Re-timed {count} cues.',
        deckCueRetimeEmpty: 'No cues to re-time for this scene.',
        deckCueRemove: 'Remove Cue',
        deckCueEmpty: 'No cues for this scene yet. Write voiceover text or add a cue first.',
        deckCueMissingText: 'Enter cue text first.',
        deckVoiceoverLanguageZh: 'Chinese',
        deckVoiceoverLanguageEn: 'English',
        deckCueMetaAt: 'At {time}',
        waitingContent: 'Waiting for content',
        buildProgress: 'Progress',
        accessUrl: 'URL',
        openPage: 'Open',
        copyLink: 'Copy Link',
        buildLog: 'Build Log',
        availableActions: 'Actions',
        openStandalone: 'Open Standalone View',
        downloadHtml: 'Download HTML',
        downloadPptx: 'Download PPTX',
        presentationReady: 'Presentation is ready and can be viewed in the standalone page.',
        buildSteps: [
            { index: 1, label: 'Outline Check', description: 'Validate structure and slide count' },
            { index: 2, label: 'Theme Apply', description: 'Apply stable theme tokens locally' },
            { index: 3, label: 'Stable Render', description: 'Render viewport-safe HTML slides' },
            { index: 4, label: 'Save Record', description: 'Persist preview and export metadata' },
            { index: 5, label: 'Ready', description: 'Standalone URL and PPTX export available' }
        ],
        purposeLabels: {
            teaching: 'Teaching',
            pitch: 'Pitch',
            product: 'Product Launch',
            meeting: 'Meeting',
            company: 'Company Intro',
            tech: 'Tech Sharing',
            personal: 'Personal Deck',
            story: 'Storytelling',
            marketing: 'Marketing',
            event: 'Event Plan'
        },
        lengthLabels: {
            short: 'Short',
            medium: 'Medium',
            long: 'Long'
        }
    }
};

Object.assign(CREATE_PAGE_I18N['zh-CN'], {
    slideStructureTitle: '单页结构',
    slideStructureHint: '先用可视控件调整页面类型、标题和内容行，再按需微调原始 JSON。',
    slideTypeText: '页面类型',
    slideTitleText: '标题',
    slideSubtitleText: '副标题',
    slideContentText: '内容行',
    slideTitlePlaceholder: '例如：这一页的标题',
    slideSubtitlePlaceholder: '可选的副标题或引导语',
    slideContentPlaceholder: '每行写一条内容或一个要点。',
    slideTypeTitleOption: '封面',
    slideTypeContentOption: '内容',
    slideTypeFeaturesOption: '要点',
    slideTypeQuoteOption: '引言',
    slideTypeCodeOption: '代码',
    slideTypeEndOption: '结尾',
    slideStructureShapeLabel: '内容形态：{shape}',
    slideStructureLayoutLabel: '预览布局：{layout}',
    slideShapeTitle: '开场标题',
    slideShapeContent: '项目列表',
    slideShapeFeatures: '要点列表',
    slideShapeQuote: '引言 + 署名',
    slideShapeCode: '代码块',
    slideShapeEnd: '收尾信息',
    slideLayoutText: '纯文本',
    slideLayoutMixed: '图文混排',
    slideLayoutMedia: '媒体主视觉',
    slideStructureHelperTitle: '封面页会突出标题和副标题，内容行会作为补充 opening 文案显示。',
    slideStructureHelperContent: '内容页会把每一行内容渲染成 bullet list，适合讲述核心论点。',
    slideStructureHelperFeatures: '要点页会按 feature bullets 呈现，适合逐条列出能力、优势或结论。',
    slideStructureHelperQuote: '引言页会优先把第一行内容渲染成 quote，副标题或第二行内容会作为署名。',
    slideStructureHelperCode: '代码页会保留每一行代码并渲染成 code block，适合 API、命令或示例片段。',
    slideStructureHelperEnd: '结尾页适合 CTA、致谢或下一步行动，内容行会作为收尾信息展示。',
    slideContentPlaceholderTitle: '每行写一句 opening 文案或补充说明。',
    slideContentPlaceholderList: '每行写一条内容或一个要点。',
    slideContentPlaceholderQuote: '第一行写引言，第二行可写署名或出处。',
    slideContentPlaceholderCode: '每行写一段代码，runtime 会保留顺序。',
    slideContentPlaceholderEnd: '每行写一个 CTA、致谢或收尾信息。'
    ,
    slideActionDuplicate: '复制页面',
    slideActionInsertAfter: '在后面插入页面',
    slideActionInsertPackAfter: '在后面插入场景组合',
    slideActionMoveUp: '上移页面',
    slideActionMoveDown: '下移页面',
    slideActionRemove: '删除页面',
    addSlide: '新增页面',
    sceneTemplateText: '场景模板',
    scenePackTemplateText: '场景组合',
    addScenePack: '新增组合',
    scenePackInserted: '已插入 {count} 页组合',
    scenePackActiveLabel: '组合 {pack}',
    recentlyInsertedPackBadge: '组合',
    recentlyInsertedSlideBadge: '新页',
    scenePackStarterOption: '开场组合',
    scenePackProofOption: '论证组合',
    scenePackCloseOption: '收尾组合',
    slideStarterTitleScene: '开场页 {index}',
    slideStarterContentScene: '内容页 {index}',
    slideStarterFeaturesScene: '要点页 {index}',
    slideStarterQuoteScene: '引言页 {index}',
    slideStarterCodeScene: '代码页 {index}',
    slideStarterEndScene: '收尾页 {index}',
    slideStarterTitleLine: '在这里写一句开场文案。',
    slideStarterContentLine1: '第一条核心观点',
    slideStarterContentLine2: '第二条支撑信息',
    slideStarterContentLine3: '第三条补充说明',
    slideStarterFeaturesLine1: '要点一：功能或优势',
    slideStarterFeaturesLine2: '要点二：数据或证据',
    slideStarterFeaturesLine3: '要点三：结论或行动',
    slideStarterQuoteLine: '在这里写一句引用或观点。',
    slideStarterQuoteSource: '署名 / 来源',
    slideStarterCodeLine1: 'const result = await runDemo();',
    slideStarterCodeLine2: 'console.log(result);',
    slideStarterEndLine1: '谢谢观看',
    slideStarterEndLine2: '下一步 / CTA',
    slideInserted: '页面已插入',
    slideDuplicated: '页面已复制',
    slideMovedUp: '页面已上移',
    slideMovedDown: '页面已下移',
    slideRemoved: '页面已删除',
    slideRemoveLastBlocked: '至少保留一页脚本，不能删除最后一页。'
});

Object.assign(CREATE_PAGE_I18N.en, {
    slideStructureTitle: 'Slide Structure',
    slideStructureHint: 'Adjust the slide type, headline hierarchy, and content lines here before fine-tuning the raw JSON.',
    slideTypeText: 'Slide Type',
    slideTitleText: 'Title',
    slideSubtitleText: 'Subtitle',
    slideContentText: 'Content Lines',
    slideTitlePlaceholder: 'Example: this slide headline',
    slideSubtitlePlaceholder: 'Optional subtitle or kicker',
    slideContentPlaceholder: 'Write one bullet or line per row.',
    slideTypeTitleOption: 'Title',
    slideTypeContentOption: 'Content',
    slideTypeFeaturesOption: 'Features',
    slideTypeQuoteOption: 'Quote',
    slideTypeCodeOption: 'Code',
    slideTypeEndOption: 'End',
    slideStructureShapeLabel: 'Content Shape: {shape}',
    slideStructureLayoutLabel: 'Runtime Layout: {layout}',
    slideShapeTitle: 'Opening Title',
    slideShapeContent: 'Bullet List',
    slideShapeFeatures: 'Feature Points',
    slideShapeQuote: 'Quote + Attribution',
    slideShapeCode: 'Code Block',
    slideShapeEnd: 'Closing Copy',
    slideLayoutText: 'Text Only',
    slideLayoutMixed: 'Mixed Media',
    slideLayoutMedia: 'Media Focus',
    slideStructureHelperTitle: 'Title slides emphasize the headline and subtitle, while content lines act as supporting opening copy.',
    slideStructureHelperContent: 'Content slides render each content line as a bullet item in the runtime.',
    slideStructureHelperFeatures: 'Feature slides turn each line into a focused point, good for capabilities, advantages, or takeaways.',
    slideStructureHelperQuote: 'Quote slides render the first content line as the quote body, while the subtitle or second line becomes attribution.',
    slideStructureHelperCode: 'Code slides preserve each line and render them as a code block for snippets, commands, or API examples.',
    slideStructureHelperEnd: 'End slides work best for CTA, thanks, or next-step messaging, with content lines used as closing copy.',
    slideContentPlaceholderTitle: 'Write one opening line or supporting statement per row.',
    slideContentPlaceholderList: 'Write one bullet or line per row.',
    slideContentPlaceholderQuote: 'Use the first line for the quote and the second line for attribution.',
    slideContentPlaceholderCode: 'Write one code line per row. The runtime will preserve ordering.',
    slideContentPlaceholderEnd: 'Write one CTA, thank-you note, or closing line per row.',
    slideActionDuplicate: 'Duplicate Slide',
    slideActionInsertAfter: 'Insert After',
    slideActionInsertPackAfter: 'Insert Pack After',
    slideActionMoveUp: 'Move Slide Up',
    slideActionMoveDown: 'Move Slide Down',
    slideActionRemove: 'Remove Slide',
    addSlide: 'Add Slide',
    sceneTemplateText: 'Scene Template',
    scenePackTemplateText: 'Scene Pack',
    addScenePack: 'Add Pack',
    scenePackInserted: 'Inserted {count} starter scenes.',
    scenePackActiveLabel: 'Pack {pack}',
    recentlyInsertedPackBadge: 'Pack',
    recentlyInsertedSlideBadge: 'New',
    scenePackStarterOption: 'Opening Pack',
    scenePackProofOption: 'Proof Pack',
    scenePackCloseOption: 'Closing Pack',
    slideStarterTitleScene: 'Opening Scene {index}',
    slideStarterContentScene: 'Content Scene {index}',
    slideStarterFeaturesScene: 'Feature Scene {index}',
    slideStarterQuoteScene: 'Quote Scene {index}',
    slideStarterCodeScene: 'Code Scene {index}',
    slideStarterEndScene: 'Closing Scene {index}',
    slideStarterTitleLine: 'Add one opening line here.',
    slideStarterContentLine1: 'First core point',
    slideStarterContentLine2: 'Second supporting detail',
    slideStarterContentLine3: 'Third supporting note',
    slideStarterFeaturesLine1: 'Feature one: capability or advantage',
    slideStarterFeaturesLine2: 'Feature two: proof or metric',
    slideStarterFeaturesLine3: 'Feature three: takeaway or action',
    slideStarterQuoteLine: 'Add the quote or key statement here.',
    slideStarterQuoteSource: 'Speaker / Source',
    slideStarterCodeLine1: 'const result = await runDemo();',
    slideStarterCodeLine2: 'console.log(result);',
    slideStarterEndLine1: 'Thank you',
    slideStarterEndLine2: 'Next step / CTA',
    slideInserted: 'Slide inserted.',
    slideDuplicated: 'Slide duplicated.',
    slideMovedUp: 'Slide moved up.',
    slideMovedDown: 'Slide moved down.',
    slideRemoved: 'Slide removed.',
    slideRemoveLastBlocked: 'Keep at least one slide in the outline.'
});

Object.assign(CREATE_PAGE_I18N['zh-CN'], {
    deckMarkerGenerateEdit: '生成编辑提示',
    deckMarkerGenerateSuite: '生成标记组',
    deckEditMarkersGenerated: '已生成 {count} 个编辑标记',
    deckMarkerSuiteGenerated: '已生成 {count} 个标记组项目',
    deckAudioTemplateText: '音轨模板',
    deckAudioTemplateApply: '应用模板',
    deckAudioTemplateApplied: '已应用 {template} 音轨模板',
    deckAudioTemplateAmbientBed: '环境氛围',
    deckAudioTemplateNarrationTrack: '旁白轨道',
    deckAudioTemplateIntroSting: '开场提示音',
    deckAudioTemplateLoopBed: '循环氛围',
    deckEditCueMedia: '检查媒体节奏',
    deckEditCueCode: '检查代码讲解',
    deckEditCueTransition: '检查转场节奏',
    deckEditCueMotion: '检查动效节奏'
});

Object.assign(CREATE_PAGE_I18N.en, {
    deckMarkerGenerateEdit: 'Generate Edit Cues',
    deckMarkerGenerateSuite: 'Generate Marker Suite',
    deckEditMarkersGenerated: 'Generated {count} edit markers.',
    deckMarkerSuiteGenerated: 'Generated {count} marker suite items.',
    deckAudioTemplateText: 'Audio Template',
    deckAudioTemplateApply: 'Apply Template',
    deckAudioTemplateApplied: 'Applied the {template} audio template.',
    deckAudioTemplateAmbientBed: 'Ambient Bed',
    deckAudioTemplateNarrationTrack: 'Narration Track',
    deckAudioTemplateIntroSting: 'Intro Sting',
    deckAudioTemplateLoopBed: 'Looping Bed',
    deckEditCueMedia: 'Check media timing',
    deckEditCueCode: 'Review code narration',
    deckEditCueTransition: 'Check transition beat',
    deckEditCueMotion: 'Check motion beat'
});

Object.assign(CREATE_PAGE_I18N['zh-CN'], {
    deckAudioTemplatePrefilled: '已用 {template} 预填音轨表单',
    deckAudioTemplateAppliedSelected: '已将 {template} 应用于当前音轨',
    deckAudioDuplicateSuffix: '副本',
    deckAudioDuplicated: '已复制当前音轨'
});

Object.assign(CREATE_PAGE_I18N.en, {
    deckAudioTemplatePrefilled: 'Prefilled the audio form with the {template} template.',
    deckAudioTemplateAppliedSelected: 'Applied the {template} template to the selected audio track.',
    deckAudioDuplicateSuffix: 'Copy',
    deckAudioDuplicated: 'Duplicated the selected audio track.'
});

function resolvePageLocale() {
    if (window.XiangyuI18n?.resolveLocale) {
        return window.XiangyuI18n.resolveLocale();
    }

    const params = new URLSearchParams(window.location.search);
    const requested = String(params.get('lang') || '').trim().toLowerCase();
    const preferred = requested || String(navigator.language || navigator.userLanguage || '').trim().toLowerCase() || String(document.documentElement.lang || '').trim().toLowerCase();
    return preferred.startsWith('zh') ? 'zh-CN' : 'en';
}

function interpolate(template, values = {}) {
    if (window.XiangyuI18n?.interpolate) {
        return window.XiangyuI18n.interpolate(template, values);
    }

    return String(template || '').replace(/\{(\w+)\}/g, (_, key) => {
        const value = values[key];
        return value === undefined || value === null ? '' : String(value);
    });
}

const PURPOSE_STARTER_PROFILES = window.XiangyuCreatePresets?.PURPOSE_STARTER_PROFILES || {
    'zh-CN': {},
    en: {}
};
const CREATE_PAGE_AUTHORING = window.XiangyuCreateAuthoring || {
    normalizeScenePackTemplate(value) {
        const normalized = String(value || '').trim().toLowerCase();
        return ['starter-flow', 'proof-flow', 'close-flow'].includes(normalized) ? normalized : 'starter-flow';
    },
    getScenePackTemplateKeys() {
        return ['starter-flow', 'proof-flow', 'close-flow'];
    },
    getScenePackBlueprint(template, purposeKey) {
        const normalizedTemplate = this.normalizeScenePackTemplate(template);
        const normalizedPurpose = String(purposeKey || '').trim().toLowerCase();

        if (normalizedTemplate === 'starter-flow') {
            if (normalizedPurpose === 'story') {
                return ['title', 'content', 'quote'];
            }

            if (normalizedPurpose === 'personal') {
                return ['title', 'content', 'end'];
            }

            return ['title', 'content', 'features'];
        }

        if (normalizedTemplate === 'proof-flow') {
            if (normalizedPurpose === 'tech') {
                return ['content', 'code', 'features'];
            }

            if (normalizedPurpose === 'product') {
                return ['features', 'content', 'quote'];
            }

            return ['content', 'features', 'quote'];
        }

        if (normalizedPurpose === 'story') {
            return ['content', 'quote', 'end'];
        }

        return ['content', 'end'];
    }
};

const CREATE_PAGE_DECK_AUTHORING = window.XiangyuCreateDeckAuthoring;
if (!CREATE_PAGE_DECK_AUTHORING) {
    throw new Error('create-page-deck-authoring.js must be loaded before create-page.js');
}
const CREATE_PAGE_DECK_GENERATORS = window.XiangyuCreateDeckGenerators;
if (!CREATE_PAGE_DECK_GENERATORS) {
    throw new Error('create-page-deck-generators.js must be loaded before create-page.js');
}
const CREATE_PAGE_DECK_AUDIO_PRESETS = window.XiangyuCreateDeckAudioPresets;
if (!CREATE_PAGE_DECK_AUDIO_PRESETS) {
    throw new Error('create-page-deck-audio-presets.js must be loaded before create-page.js');
}
const CREATE_PAGE_DECK_AUDIO_FLOW = window.XiangyuCreateDeckAudioFlow;
if (!CREATE_PAGE_DECK_AUDIO_FLOW) {
    throw new Error('create-page-deck-audio-flow.js must be loaded before create-page.js');
}
const CREATE_PAGE_DECK_VOICEOVER_FLOW = window.XiangyuCreateDeckVoiceoverFlow;
if (!CREATE_PAGE_DECK_VOICEOVER_FLOW) {
    throw new Error('create-page-deck-voiceover-flow.js must be loaded before create-page.js');
}
const CREATE_PAGE_DECK_STARTERS = window.XiangyuCreateDeckStarters;
if (!CREATE_PAGE_DECK_STARTERS) {
    throw new Error('create-page-deck-starters.js must be loaded before create-page.js');
}
const CREATE_PAGE_DECK_RENDERING = window.XiangyuCreateDeckRendering;
if (!CREATE_PAGE_DECK_RENDERING) {
    throw new Error('create-page-deck-rendering.js must be loaded before create-page.js');
}
const CREATE_PAGE_DECK_STATE = window.XiangyuCreateDeckState;
if (!CREATE_PAGE_DECK_STATE) {
    throw new Error('create-page-deck-state.js must be loaded before create-page.js');
}
const CREATE_PAGE_DECK_FORMS = window.XiangyuCreateDeckForms;
if (!CREATE_PAGE_DECK_FORMS) {
    throw new Error('create-page-deck-forms.js must be loaded before create-page.js');
}
const CREATE_PAGE_DECK_SYNC = window.XiangyuCreateDeckSync;
if (!CREATE_PAGE_DECK_SYNC) {
    throw new Error('create-page-deck-sync.js must be loaded before create-page.js');
}
const CREATE_PAGE_DECK_UI = window.XiangyuCreateDeckUi;
if (!CREATE_PAGE_DECK_UI) {
    throw new Error('create-page-deck-ui.js must be loaded before create-page.js');
}
const CREATE_PAGE_DECK_BINDINGS = window.XiangyuCreateDeckBindings;
if (!CREATE_PAGE_DECK_BINDINGS) {
    throw new Error('create-page-deck-bindings.js must be loaded before create-page.js');
}
const CREATE_PAGE_DECK_ACTIONS = window.XiangyuCreateDeckActions;
if (!CREATE_PAGE_DECK_ACTIONS) {
    throw new Error('create-page-deck-actions.js must be loaded before create-page.js');
}

const SUPPORTED_SLIDE_MOTION_PRESETS = new Set([
    'fade',
    'fade-up',
    'slide-left',
    'slide-right',
    'zoom-in',
    'stagger-up'
]);

const SUPPORTED_SLIDE_TRANSITION_PRESETS = new Set([
    'crossfade',
    'lift-fade',
    'push-left',
    'push-right',
    'zoom-fade'
]);

const SUPPORTED_SLIDE_TRANSITION_OVERLAYS = new Set([
    'none',
    'accent',
    'dark',
    'light'
]);

const SUPPORTED_SLIDE_TYPES = new Set([
    'title',
    'content',
    'features',
    'quote',
    'code',
    'end'
]);

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
        this.selectedSlideCueIndex = null;
        this.selectedDeckMarkerIndex = null;
        this.selectedDeckAudioIndex = null;
        this.selectedDeckVoiceoverSceneIndex = 0;
        this.selectedDeckCueIndex = null;
        this.modalMode = 'slide';
        this.generatedHtml = null;
        this.presentationId = null;
        this.presentationUrl = null;
        this.pptxUrl = null;
        this.isGenerating = false;
        this.previewWindow = null;
        this.buildLogs = [];
        this.lastBuildState = null;
        this.insertTemplate = 'content';
        this.scenePackTemplate = 'starter-flow';
        this.deckTimelineStarterTemplate = 'full-flow';
        this.deckAudioTemplateKey = 'ambient-bed';
        this.recentlyInsertedRange = null;
        this.locale = resolvePageLocale();
        this.copy = CREATE_PAGE_I18N[this.locale] || CREATE_PAGE_I18N.en;

        this.elements = {
            textarea: document.getElementById('userInput'),
            sendButton: document.getElementById('btnSend'),
            resultArea: document.getElementById('resultArea'),
            purposeArea: document.getElementById('purposeArea'),
            lengthArea: document.getElementById('lengthArea'),
            styleArea: document.getElementById('styleArea'),
            editModal: document.getElementById('editModal'),
            editModalTitle: document.getElementById('editModalTitle'),
            editPromptArea: document.getElementById('editPromptArea'),
            editPromptLabel: document.getElementById('editPromptLabel'),
            editPrompt: document.getElementById('slideEditPrompt'),
            editText: document.getElementById('slideEditText'),
            slideTooling: document.getElementById('slideTooling'),
            slideStructureTitle: document.getElementById('slideStructureTitle'),
            slideStructureHint: document.getElementById('slideStructureHint'),
            slideTypeText: document.getElementById('slideTypeText'),
            slideTypeSelect: document.getElementById('slideTypeSelect'),
            slideTitleText: document.getElementById('slideTitleText'),
            slideTitleInput: document.getElementById('slideTitleInput'),
            slideSubtitleText: document.getElementById('slideSubtitleText'),
            slideSubtitleInput: document.getElementById('slideSubtitleInput'),
            slideContentText: document.getElementById('slideContentText'),
            slideContentInput: document.getElementById('slideContentInput'),
            slideContentShapePill: document.getElementById('slideContentShapePill'),
            slideRuntimeLayoutPill: document.getElementById('slideRuntimeLayoutPill'),
            slideStructureHelperText: document.getElementById('slideStructureHelperText'),
            slideMotionTitle: document.getElementById('slideMotionTitle'),
            slideMotionHint: document.getElementById('slideMotionHint'),
            slideMotionSceneText: document.getElementById('slideMotionSceneText'),
            slideMotionSceneSelect: document.getElementById('slideMotionSceneSelect'),
            slideMotionHeadingText: document.getElementById('slideMotionHeadingText'),
            slideMotionHeadingSelect: document.getElementById('slideMotionHeadingSelect'),
            slideMotionSubtitleText: document.getElementById('slideMotionSubtitleText'),
            slideMotionSubtitleSelect: document.getElementById('slideMotionSubtitleSelect'),
            slideMotionContentText: document.getElementById('slideMotionContentText'),
            slideMotionContentSelect: document.getElementById('slideMotionContentSelect'),
            slideMotionMediaText: document.getElementById('slideMotionMediaText'),
            slideMotionMediaSelect: document.getElementById('slideMotionMediaSelect'),
            slideTransitionTitle: document.getElementById('slideTransitionTitle'),
            slideTransitionHint: document.getElementById('slideTransitionHint'),
            slideTransitionPresetText: document.getElementById('slideTransitionPresetText'),
            slideTransitionPresetSelect: document.getElementById('slideTransitionPresetSelect'),
            slideTransitionOverlayText: document.getElementById('slideTransitionOverlayText'),
            slideTransitionOverlaySelect: document.getElementById('slideTransitionOverlaySelect'),
            slideTransitionDurationText: document.getElementById('slideTransitionDurationText'),
            slideTransitionDurationInput: document.getElementById('slideTransitionDurationInput'),
            slideTransitionContentDelayText: document.getElementById('slideTransitionContentDelayText'),
            slideTransitionContentDelayInput: document.getElementById('slideTransitionContentDelayInput'),
            slideTransitionMotionDurationText: document.getElementById('slideTransitionMotionDurationText'),
            slideTransitionMotionDurationInput: document.getElementById('slideTransitionMotionDurationInput'),
            slideTransitionStaggerText: document.getElementById('slideTransitionStaggerText'),
            slideTransitionStaggerInput: document.getElementById('slideTransitionStaggerInput'),
            slideTransitionEnterText: document.getElementById('slideTransitionEnterText'),
            slideTransitionEnterInput: document.getElementById('slideTransitionEnterInput'),
            slideTransitionHoldText: document.getElementById('slideTransitionHoldText'),
            slideTransitionHoldInput: document.getElementById('slideTransitionHoldInput'),
            slideTransitionExitText: document.getElementById('slideTransitionExitText'),
            slideTransitionExitInput: document.getElementById('slideTransitionExitInput'),
            slideMediaTitle: document.getElementById('slideMediaTitle'),
            slideMediaHint: document.getElementById('slideMediaHint'),
            slideMediaTypeText: document.getElementById('slideMediaTypeText'),
            slideMediaTypeSelect: document.getElementById('slideMediaTypeSelect'),
            slideMediaSourceText: document.getElementById('slideMediaSourceText'),
            slideMediaSourceInput: document.getElementById('slideMediaSourceInput'),
            slideMediaMimeTypeText: document.getElementById('slideMediaMimeTypeText'),
            slideMediaMimeTypeInput: document.getElementById('slideMediaMimeTypeInput'),
            slideMediaPosterText: document.getElementById('slideMediaPosterText'),
            slideMediaPosterInput: document.getElementById('slideMediaPosterInput'),
            slideMediaAltText: document.getElementById('slideMediaAltText'),
            slideMediaAltInput: document.getElementById('slideMediaAltInput'),
            slideMediaCaptionText: document.getElementById('slideMediaCaptionText'),
            slideMediaCaptionInput: document.getElementById('slideMediaCaptionInput'),
            slideMediaAutoplay: document.getElementById('slideMediaAutoplay'),
            slideMediaAutoplayText: document.getElementById('slideMediaAutoplayText'),
            slideMediaLoop: document.getElementById('slideMediaLoop'),
            slideMediaLoopText: document.getElementById('slideMediaLoopText'),
            slideTimingTitle: document.getElementById('slideTimingTitle'),
            slideTimingHint: document.getElementById('slideTimingHint'),
            slideDurationText: document.getElementById('slideDurationText'),
            slideDurationInput: document.getElementById('slideDurationInput'),
            slideVoiceoverLanguageText: document.getElementById('slideVoiceoverLanguageText'),
            slideVoiceoverLanguageSelect: document.getElementById('slideVoiceoverLanguageSelect'),
            slideVoiceoverTextLabel: document.getElementById('slideVoiceoverTextLabel'),
            slideVoiceoverTextInput: document.getElementById('slideVoiceoverTextInput'),
            slideVoiceoverCueTitle: document.getElementById('slideVoiceoverCueTitle'),
            slideVoiceoverCueHint: document.getElementById('slideVoiceoverCueHint'),
            slideVoiceoverCueAtText: document.getElementById('slideVoiceoverCueAtText'),
            slideVoiceoverCueAtInput: document.getElementById('slideVoiceoverCueAtInput'),
            slideVoiceoverCueTextText: document.getElementById('slideVoiceoverCueTextText'),
            slideVoiceoverCueTextInput: document.getElementById('slideVoiceoverCueTextInput'),
            slideVoiceoverCueAddBtn: document.getElementById('slideVoiceoverCueAddBtn'),
            slideVoiceoverCueApplyBtn: document.getElementById('slideVoiceoverCueApplyBtn'),
            slideVoiceoverCueRemoveBtn: document.getElementById('slideVoiceoverCueRemoveBtn'),
            slideVoiceoverCueList: document.getElementById('slideVoiceoverCueList'),
            deckTooling: document.getElementById('deckTooling'),
            deckTimelineTitle: document.getElementById('deckTimelineTitle'),
            deckTimelineHint: document.getElementById('deckTimelineHint'),
            deckTimelineEnabled: document.getElementById('deckTimelineEnabled'),
            deckTimelineEnabledText: document.getElementById('deckTimelineEnabledText'),
            deckTimelineAutoplay: document.getElementById('deckTimelineAutoplay'),
            deckTimelineAutoplayText: document.getElementById('deckTimelineAutoplayText'),
            deckSubtitleModeText: document.getElementById('deckSubtitleModeText'),
            deckSubtitleModeSelect: document.getElementById('deckSubtitleModeSelect'),
            deckTimelineStarterText: document.getElementById('deckTimelineStarterText'),
            deckTimelineStarterSelect: document.getElementById('deckTimelineStarterSelect'),
            deckTimelineStarterApplyBtn: document.getElementById('deckTimelineStarterApplyBtn'),
            deckTimelineStarterResetBtn: document.getElementById('deckTimelineStarterResetBtn'),
            deckTimelineStarterSummary: document.getElementById('deckTimelineStarterSummary'),
            deckMarkerEditorTitle: document.getElementById('deckMarkerEditorTitle'),
            deckMarkerEditorHint: document.getElementById('deckMarkerEditorHint'),
            deckMarkerLabelText: document.getElementById('deckMarkerLabelText'),
            deckMarkerLabelInput: document.getElementById('deckMarkerLabelInput'),
            deckMarkerSceneText: document.getElementById('deckMarkerSceneText'),
            deckMarkerSceneSelect: document.getElementById('deckMarkerSceneSelect'),
            deckMarkerKindText: document.getElementById('deckMarkerKindText'),
            deckMarkerKindSelect: document.getElementById('deckMarkerKindSelect'),
            deckMarkerAnchorText: document.getElementById('deckMarkerAnchorText'),
            deckMarkerAnchorSelect: document.getElementById('deckMarkerAnchorSelect'),
            deckMarkerAddBtn: document.getElementById('deckMarkerAddBtn'),
            deckMarkerGenerateBtn: document.getElementById('deckMarkerGenerateBtn'),
            deckMarkerGenerateEditBtn: document.getElementById('deckMarkerGenerateEditBtn'),
            deckMarkerGenerateSuiteBtn: document.getElementById('deckMarkerGenerateSuiteBtn'),
            deckMarkerClearGeneratedBtn: document.getElementById('deckMarkerClearGeneratedBtn'),
            deckMarkerApplyBtn: document.getElementById('deckMarkerApplyBtn'),
            deckMarkerRemoveBtn: document.getElementById('deckMarkerRemoveBtn'),
            deckMarkerList: document.getElementById('deckMarkerList'),
            deckAudioEditorTitle: document.getElementById('deckAudioEditorTitle'),
            deckAudioEditorHint: document.getElementById('deckAudioEditorHint'),
            deckAudioTemplateText: document.getElementById('deckAudioTemplateText'),
            deckAudioTemplateSelect: document.getElementById('deckAudioTemplateSelect'),
            deckAudioTemplateApplyBtn: document.getElementById('deckAudioTemplateApplyBtn'),
            deckAudioLabelText: document.getElementById('deckAudioLabelText'),
            deckAudioLabelInput: document.getElementById('deckAudioLabelInput'),
            deckAudioSourceText: document.getElementById('deckAudioSourceText'),
            deckAudioSourceInput: document.getElementById('deckAudioSourceInput'),
            deckAudioStartText: document.getElementById('deckAudioStartText'),
            deckAudioStartInput: document.getElementById('deckAudioStartInput'),
            deckAudioGainText: document.getElementById('deckAudioGainText'),
            deckAudioGainInput: document.getElementById('deckAudioGainInput'),
            deckAudioAutoplay: document.getElementById('deckAudioAutoplay'),
            deckAudioAutoplayText: document.getElementById('deckAudioAutoplayText'),
            deckAudioLoop: document.getElementById('deckAudioLoop'),
            deckAudioLoopText: document.getElementById('deckAudioLoopText'),
            deckAudioAddBtn: document.getElementById('deckAudioAddBtn'),
            deckAudioApplyBtn: document.getElementById('deckAudioApplyBtn'),
            deckAudioDuplicateBtn: document.getElementById('deckAudioDuplicateBtn'),
            deckAudioRemoveBtn: document.getElementById('deckAudioRemoveBtn'),
            deckAudioList: document.getElementById('deckAudioList'),
            deckVoiceoverEditorTitle: document.getElementById('deckVoiceoverEditorTitle'),
            deckVoiceoverEditorHint: document.getElementById('deckVoiceoverEditorHint'),
            deckVoiceoverSceneText: document.getElementById('deckVoiceoverSceneText'),
            deckVoiceoverSceneSelect: document.getElementById('deckVoiceoverSceneSelect'),
            deckVoiceoverLanguageText: document.getElementById('deckVoiceoverLanguageText'),
            deckVoiceoverLanguageSelect: document.getElementById('deckVoiceoverLanguageSelect'),
            deckVoiceoverTextLabel: document.getElementById('deckVoiceoverTextLabel'),
            deckVoiceoverTextInput: document.getElementById('deckVoiceoverTextInput'),
            deckVoiceoverCopyPrevBtn: document.getElementById('deckVoiceoverCopyPrevBtn'),
            deckVoiceoverCopyNextBtn: document.getElementById('deckVoiceoverCopyNextBtn'),
            deckVoiceoverGenerateMarkersBtn: document.getElementById('deckVoiceoverGenerateMarkersBtn'),
            deckVoiceoverGenerateBtn: document.getElementById('deckVoiceoverGenerateBtn'),
            deckVoiceoverClearGeneratedBtn: document.getElementById('deckVoiceoverClearGeneratedBtn'),
            deckCueAtText: document.getElementById('deckCueAtText'),
            deckCueAtInput: document.getElementById('deckCueAtInput'),
            deckCueTextText: document.getElementById('deckCueTextText'),
            deckCueTextInput: document.getElementById('deckCueTextInput'),
            deckCueAddBtn: document.getElementById('deckCueAddBtn'),
            deckCueGenerateBtn: document.getElementById('deckCueGenerateBtn'),
            deckCueAppendBtn: document.getElementById('deckCueAppendBtn'),
            deckCueApplyBtn: document.getElementById('deckCueApplyBtn'),
            deckCueDuplicateBtn: document.getElementById('deckCueDuplicateBtn'),
            deckCueRetimeBtn: document.getElementById('deckCueRetimeBtn'),
            deckCueRemoveBtn: document.getElementById('deckCueRemoveBtn'),
            deckCueList: document.getElementById('deckCueList'),
            editJsonArea: document.getElementById('editJsonArea'),
            editJsonLabel: document.getElementById('editJsonLabel'),
            editLoading: document.getElementById('editLoading'),
            editLoadingText: document.getElementById('editLoadingText'),
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
        document.documentElement.lang = this.locale;
        this.applyStaticI18n();
        this.bindComposer();
        this.bindSelectors();
        this.bindEditModal();
        this.renderWorkspaceEmptyState();

        window.quickGenerate = (type) => this.quickGenerate(type);
        window.editSlide = (index) => this.openEditModal(index);
    }

    t(key, values = {}) {
        return interpolate(this.copy?.[key] || key, values);
    }

    setButtonLabel(element, iconClass, label) {
        if (!element) {
            return;
        }

        if (iconClass) {
            element.innerHTML = `<i class="ph ph-${iconClass}"></i>${label}`;
            return;
        }

        element.textContent = label;
    }

    _legacyGetEditorWorkspaceCopy() {
        if (this.locale === 'zh-CN') {
            return {
                idleEyebrow: '编辑工作区',
                idleTitle: '先整理脚本，再进入生成与精修',
                idleSubtitle: '左侧继续配置主题、长度与风格，右侧承接脚本总览、构建状态和最终结果卡片。',
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
                errorSideItems: ['检查输入是否为空', '确认用途和长度是否合理', '网络恢复后重新生成'],
                outlineEyebrow: '脚本工作区',
                outlineTitle: '先排好 scene，再进入构建',
                outlineSubtitle: '这里聚合 scene 结构、插入模板、scene pack 和 deck 设置，适合在真正构建前完成内容整理。',
                outlineSideTitle: '当前摘要',
                outlineNextTitle: '下一步',
                outlineNextItems: ['检查脚本顺序和每页摘要', '按需插入 scene pack 或单页模板', '准备好后开始构建独立演示页面'],
                buildEyebrow: '构建工作区',
                buildTitleReady: '独立演示页面已经准备好',
                buildTitleRunning: '正在生成独立演示页面',
                buildTitleFailed: '这次构建失败了',
                buildSubtitleReady: '预览、导出和后续精修都会继续留在这个工作区里。',
                buildSubtitleRunning: '构建过程中会持续更新阶段、日志和访问地址，不需要离开当前页面。',
                buildSubtitleFailed: '你可以根据日志调整输入后重新构建。',
                buildRouteTitle: '访问地址',
                buildLogTitle: '生成日志',
                buildLogEmpty: '日志会在构建开始后持续更新。',
                buildOpenPage: '打开页面',
                buildCopyLink: '复制链接',
                buildProgressLabel: '当前进度'
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
            errorSideItems: ['Make sure the brief is not empty', 'Check whether purpose and length still fit', 'Retry after the network recovers'],
            outlineEyebrow: 'Outline Workspace',
            outlineTitle: 'Organize the scenes before you build',
            outlineSubtitle: 'This is where scene structure, insert templates, scene packs, and deck settings come together before the standalone build.',
            outlineSideTitle: 'Current snapshot',
            outlineNextTitle: 'Next steps',
            outlineNextItems: ['Review slide order and summaries', 'Insert slide templates or scene packs if needed', 'Start the standalone build when the structure looks right'],
            buildEyebrow: 'Build Workspace',
            buildTitleReady: 'The standalone presentation is ready',
            buildTitleRunning: 'Building the standalone presentation',
            buildTitleFailed: 'This build failed',
            buildSubtitleReady: 'Preview, export, and refinement all stay inside this workspace.',
            buildSubtitleRunning: 'Stage updates, logs, and the route stay visible here while the build is running.',
            buildSubtitleFailed: 'Use the logs below to adjust the outline and try again.',
            buildRouteTitle: 'Presentation URL',
            buildLogTitle: 'Build Log',
            buildLogEmpty: 'Logs will stream here after the build starts.',
            buildOpenPage: 'Open Page',
            buildCopyLink: 'Copy Link',
            buildProgressLabel: 'Progress'
        };
    }

    _legacyRenderEditorWorkspaceShell({ eyebrow = '', title = '', subtitle = '', meta = [], main = '', side = '' } = {}) {
        const metaMarkup = Array.isArray(meta) && meta.length > 0
            ? `
                <div class="editor-workspace-badges">
                    ${meta.filter(Boolean).map((item) => `<span class="editor-workspace-badge">${this.escapeHtml(item)}</span>`).join('')}
                </div>
            `
            : '';

        return `
            <div class="editor-workspace-shell">
                <div class="editor-workspace-hero">
                    <div class="editor-workspace-copy">
                        <span class="editor-workspace-eyebrow">${this.escapeHtml(eyebrow)}</span>
                        <h3 class="editor-workspace-title">${this.escapeHtml(title)}</h3>
                        ${subtitle ? `<p class="editor-workspace-subtitle">${this.escapeHtml(subtitle)}</p>` : ''}
                    </div>
                    ${metaMarkup}
                </div>
                <div class="editor-workspace-grid">
                    <div class="editor-workspace-main">${main}</div>
                    <aside class="editor-workspace-side">${side}</aside>
                </div>
            </div>
        `;
    }

    _legacyRenderWorkspaceEmptyState() {
        if (!this.elements.resultArea) {
            return;
        }

        const copy = this.getEditorWorkspaceCopy();

        this.elements.resultArea.innerHTML = this.renderEditorWorkspaceShell({
            eyebrow: copy.idleEyebrow,
            title: copy.idleTitle,
            subtitle: copy.idleSubtitle,
            meta: [
                this.getLabel('purpose', this.config.purpose) || this.t('defaultPurpose'),
                this.getLabel('length', this.config.length) || this.t('defaultLength'),
                this.getStyleLabel(this.config.style) || this.t('selectStyle')
            ],
            main: `
                <div class="result-card editor-empty-card">
                    <div class="editor-empty-state">
                        <div class="editor-empty-icon">
                            <i class="ph ph-compass-tool"></i>
                        </div>
                        <div class="editor-empty-copy">
                            <strong>${this.escapeHtml(copy.idleMainTitle)}</strong>
                            <p>${this.escapeHtml(copy.idleMainBody)}</p>
                        </div>
                    </div>
                    <div class="editor-empty-checklist">
                        ${copy.idleChecklist.map((item) => `
                            <div class="editor-empty-check">
                                <i class="ph ph-check-circle"></i>
                                <span>${this.escapeHtml(item)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `,
            side: `
                <div class="status-panel editor-side-panel">
                    <div class="status-panel-title">${this.escapeHtml(copy.idleSideTitle)}</div>
                    <ul class="editor-side-list">
                        ${copy.idleSideItems.map((item) => `<li>${this.escapeHtml(item)}</li>`).join('')}
                    </ul>
                </div>
                <div class="status-panel editor-side-panel">
                    <div class="status-panel-title">${this.escapeHtml(copy.idleTipsTitle)}</div>
                    <ul class="editor-side-list">
                        ${copy.idleTips.map((item) => `<li>${this.escapeHtml(item)}</li>`).join('')}
                    </ul>
                </div>
            `
        });
    }

    _legacyApplyStaticI18n() {
        this.elements.textarea?.setAttribute(
            'placeholder',
            this.locale === 'zh-CN'
                ? '描述你想创建的演示主题、目标听众和重点内容。'
                : 'Describe the presentation topic, target audience, and key points you want to cover.'
        );

        if (this.elements.cancelEdit) {
            this.elements.cancelEdit.textContent = this.t('cancel');
        }

        this.setButtonLabel(this.elements.regenerateEdit, 'sparkle', this.t('rewriteWithAi'));
        this.setButtonLabel(this.elements.saveEdit, '', this.t('saveSlide'));
        this.applyModalCopy('slide');
    }

    buildSelectOptions(options) {
        return options.map((option) => `
            <option value="${this.escapeHtml(option.value)}">${this.escapeHtml(option.label)}</option>
        `).join('');
    }

    getSlideTypeOptions() {
        return [
            { value: 'title', label: this.t('slideTypeTitleOption') },
            { value: 'content', label: this.t('slideTypeContentOption') },
            { value: 'features', label: this.t('slideTypeFeaturesOption') },
            { value: 'quote', label: this.t('slideTypeQuoteOption') },
            { value: 'code', label: this.t('slideTypeCodeOption') },
            { value: 'end', label: this.t('slideTypeEndOption') }
        ];
    }

    getScenePackOptions() {
        const optionKeyMap = {
            'starter-flow': 'scenePackStarterOption',
            'proof-flow': 'scenePackProofOption',
            'close-flow': 'scenePackCloseOption'
        };

        return CREATE_PAGE_AUTHORING.getScenePackTemplateKeys().map((value) => ({
            value,
            label: this.t(optionKeyMap[value] || 'scenePackStarterOption')
        }));
    }

    normalizeSlideType(value) {
        const normalized = String(value || '').trim().toLowerCase();
        if (!normalized) {
            return 'content';
        }

        if (normalized === 'feature') {
            return 'features';
        }

        if (normalized === 'text' || normalized === 'bullet' || normalized === 'bullets') {
            return 'content';
        }

        if (normalized === 'closing' || normalized === 'thanks') {
            return 'end';
        }

        return SUPPORTED_SLIDE_TYPES.has(normalized) ? normalized : 'content';
    }

    normalizeScenePackTemplate(value) {
        return CREATE_PAGE_AUTHORING.normalizeScenePackTemplate(value);
    }

    normalizeDeckTimelineStarterTemplate(value) {
        return CREATE_PAGE_DECK_STARTERS.normalizeStarterTemplate(value);
    }

    normalizeDeckAudioPresetKey(value) {
        return CREATE_PAGE_DECK_AUDIO_PRESETS.normalizeAudioPresetKey(value);
    }

    getDeckTimelineStarterOptions() {
        return CREATE_PAGE_DECK_STARTERS.getStarterTemplateKeys().map((value) => ({
            value,
            label: this.t(`deckTimelineStarter${value === 'full-flow' ? 'FullFlow' : value.charAt(0).toUpperCase() + value.slice(1)}`)
        }));
    }

    getDeckAudioTemplateOptions() {
        const keyMap = {
            'ambient-bed': 'deckAudioTemplateAmbientBed',
            'narration-track': 'deckAudioTemplateNarrationTrack',
            'intro-sting': 'deckAudioTemplateIntroSting',
            'loop-bed': 'deckAudioTemplateLoopBed'
        };

        return CREATE_PAGE_DECK_AUDIO_PRESETS.getAudioPresetKeys().map((value) => ({
            value,
            label: this.t(keyMap[value] || 'deckAudioTemplateAmbientBed')
        }));
    }

    getDeckAudioTemplateLabel(value = this.deckAudioTemplateKey) {
        const normalized = this.normalizeDeckAudioPresetKey(value);
        return this.getDeckAudioTemplateOptions().find((option) => option.value === normalized)?.label
            || this.t('deckAudioTemplateAmbientBed');
    }

    getDeckTimelineStarterLabel(value = this.deckTimelineStarterTemplate) {
        const normalized = this.normalizeDeckTimelineStarterTemplate(value);
        return this.getDeckTimelineStarterOptions().find((option) => option.value === normalized)?.label
            || this.t('deckTimelineStarterFullFlow');
    }

    getDeckTimelineStarterGeneratedState(timeline, sceneVoiceover) {
        return CREATE_PAGE_DECK_SYNC.getStarterGeneratedState(timeline, sceneVoiceover);
    }

    getPurposeLabel(value = this.getStarterPurposeKey()) {
        const normalized = String(value || '').trim().toLowerCase();
        return this.copy?.purposeLabels?.[normalized] || '';
    }

    formatDeckStarterGeneratedAt(value) {
        return CREATE_PAGE_DECK_SYNC.formatGeneratedAt(value, { locale: this.locale });
    }

    renderDeckStarterSummary(starterState) {
        return CREATE_PAGE_DECK_SYNC.renderStarterSummary({
            state: starterState,
            title: this.t('deckTimelineStarterSummary'),
            templateLabel: starterState.template
                ? this.t('deckTimelineStarterSummaryTemplate', {
                    template: this.getDeckTimelineStarterLabel(starterState.template)
                })
                : '',
            purposeLabel: starterState.purposeKey
                ? this.t('deckTimelineStarterSummaryPurpose', {
                    purpose: this.getPurposeLabel(starterState.purposeKey) || starterState.purposeKey
                })
                : '',
            generatedLabel: starterState.generatedAt
                ? this.t('deckTimelineStarterSummaryGeneratedAt', {
                    time: this.formatDeckStarterGeneratedAt(starterState.generatedAt)
                })
                : '',
            markersLabel: this.t('deckTimelineStarterSummaryMarkers'),
            voiceoverLabel: this.t('deckTimelineStarterSummaryVoiceover'),
            emptyMessage: this.t('deckTimelineStarterEmpty'),
            formatCountLabel: (label, count) => `${label} ${count}`,
            renderEmptyState: (message) => CREATE_PAGE_DECK_RENDERING.renderEmptyState(
                message,
                this.escapeHtml.bind(this)
            ),
            escapeHtml: this.escapeHtml.bind(this)
        });
    }

    getStarterPurposeKey() {
        const candidate = String(this.currentOutline?.purpose || this.config.purpose || '')
            .trim()
            .toLowerCase();

        return this.copy?.purposeLabels?.[candidate] ? candidate : '';
    }

    getPurposeStarterProfile() {
        const purposeKey = this.getStarterPurposeKey();
        if (!purposeKey) {
            return null;
        }

        const localeProfiles = PURPOSE_STARTER_PROFILES[this.locale] || PURPOSE_STARTER_PROFILES.en;
        return localeProfiles?.[purposeKey] || PURPOSE_STARTER_PROFILES.en?.[purposeKey] || null;
    }

    getStarterSceneTitle(type, ordinal, purposeKey = this.getStarterPurposeKey()) {
        const normalizedType = this.normalizeSlideType(type);
        const baseTitleKeyMap = {
            title: 'slideStarterTitleScene',
            content: 'slideStarterContentScene',
            features: 'slideStarterFeaturesScene',
            quote: 'slideStarterQuoteScene',
            code: 'slideStarterCodeScene',
            end: 'slideStarterEndScene'
        };
        const baseTitle = this.t(baseTitleKeyMap[normalizedType] || 'slideStarterContentScene', { index: ordinal });
        const purposeLabel = purposeKey ? this.getLabel('purpose', purposeKey) : '';

        return purposeLabel ? `${purposeLabel} · ${baseTitle}` : baseTitle;
    }

    getScenePackBlueprint(template = this.scenePackTemplate, purposeKey = this.getStarterPurposeKey()) {
        return CREATE_PAGE_AUTHORING.getScenePackBlueprint(template, purposeKey);
    }

    getScenePackTemplateLabel(template = this.scenePackTemplate) {
        const normalizedTemplate = this.normalizeScenePackTemplate(template);
        return this.getScenePackOptions().find((option) => option.value === normalizedTemplate)?.label
            || this.t('scenePackStarterOption');
    }

    markRecentlyInsertedRange(startIndex, count, kind = 'slide', template = '') {
        const normalizedCount = Math.max(0, Number(count) || 0);
        if (!normalizedCount) {
            this.recentlyInsertedRange = null;
            return;
        }

        const start = Math.max(0, Number(startIndex) || 0);
        this.recentlyInsertedRange = {
            start,
            end: start + normalizedCount - 1,
            kind,
            template: kind === 'pack' ? this.normalizeScenePackTemplate(template) : ''
        };
    }

    clearRecentlyInsertedRange() {
        this.recentlyInsertedRange = null;
    }

    isRecentlyInsertedSlide(index) {
        return Boolean(
            this.recentlyInsertedRange
            && Number.isFinite(Number(index))
            && Number(index) >= this.recentlyInsertedRange.start
            && Number(index) <= this.recentlyInsertedRange.end
        );
    }

    getRecentInsertionBadgeLabel(index) {
        if (!this.isRecentlyInsertedSlide(index)) {
            return '';
        }

        return this.recentlyInsertedRange?.kind === 'pack'
            ? this.t('recentlyInsertedPackBadge')
            : this.t('recentlyInsertedSlideBadge');
    }

    createEmptySlide(type, index = this.currentSlides.length) {
        const normalizedType = this.normalizeSlideType(type);
        const ordinal = Math.max(0, Number(index) || 0) + 1;
        const purposeKey = this.getStarterPurposeKey();
        const profile = this.getPurposeStarterProfile();

        switch (normalizedType) {
            case 'title':
                return {
                    type: 'title',
                    title: this.getStarterSceneTitle('title', ordinal, purposeKey),
                    subtitle: profile?.titleSubtitle || this.t('slideStarterTitleLine'),
                    content: []
                };
            case 'quote':
                return {
                    type: 'quote',
                    title: this.getStarterSceneTitle('quote', ordinal, purposeKey),
                    subtitle: profile?.quoteSource || this.t('slideStarterQuoteSource'),
                    content: [profile?.quote || this.t('slideStarterQuoteLine')]
                };
            case 'code':
                return {
                    type: 'code',
                    title: this.getStarterSceneTitle('code', ordinal, purposeKey),
                    subtitle: '',
                    content: profile?.code || [
                        this.t('slideStarterCodeLine1'),
                        this.t('slideStarterCodeLine2')
                    ]
                };
            case 'end':
                return {
                    type: 'end',
                    title: this.getStarterSceneTitle('end', ordinal, purposeKey),
                    subtitle: '',
                    content: profile?.end || [
                        this.t('slideStarterEndLine1'),
                        this.t('slideStarterEndLine2')
                    ]
                };
            case 'features':
                return {
                    type: 'features',
                    title: this.getStarterSceneTitle('features', ordinal, purposeKey),
                    subtitle: '',
                    content: profile?.features || [
                        this.t('slideStarterFeaturesLine1'),
                        this.t('slideStarterFeaturesLine2'),
                        this.t('slideStarterFeaturesLine3')
                    ]
                };
            case 'content':
            default:
                return {
                    type: 'content',
                    title: this.getStarterSceneTitle('content', ordinal, purposeKey),
                    subtitle: '',
                    content: profile?.content || [
                        this.t('slideStarterContentLine1'),
                        this.t('slideStarterContentLine2'),
                        this.t('slideStarterContentLine3')
                    ]
                };
        }
    }

    normalizeSlideText(value, maxLength = 220) {
        const text = String(value || '')
            .replace(/\r/g, '\n')
            .replace(/\s*\n\s*/g, ' ')
            .replace(/[ \t]{2,}/g, ' ')
            .trim();

        if (!text) {
            return '';
        }

        return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}...` : text;
    }

    normalizeSlideContentItems(value) {
        const rawItems = Array.isArray(value)
            ? value
            : (typeof value === 'string'
                ? value.split(/\r?\n+/)
                : (value && typeof value === 'object' ? Object.values(value) : []));

        return rawItems
            .map((item) => String(item || '').replace(/\r/g, '\n').trim())
            .flatMap((item) => item.split(/\r?\n+/))
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 24);
    }

    getSlideContentEditorValue(value) {
        return this.normalizeSlideContentItems(value).join('\n');
    }

    getSlideContentShapeLabel(type) {
        switch (this.normalizeSlideType(type)) {
            case 'title':
                return this.t('slideShapeTitle');
            case 'features':
                return this.t('slideShapeFeatures');
            case 'quote':
                return this.t('slideShapeQuote');
            case 'code':
                return this.t('slideShapeCode');
            case 'end':
                return this.t('slideShapeEnd');
            case 'content':
            default:
                return this.t('slideShapeContent');
        }
    }

    getSlideStructureHelperText(type) {
        switch (this.normalizeSlideType(type)) {
            case 'title':
                return this.t('slideStructureHelperTitle');
            case 'features':
                return this.t('slideStructureHelperFeatures');
            case 'quote':
                return this.t('slideStructureHelperQuote');
            case 'code':
                return this.t('slideStructureHelperCode');
            case 'end':
                return this.t('slideStructureHelperEnd');
            case 'content':
            default:
                return this.t('slideStructureHelperContent');
        }
    }

    getSlideContentPlaceholderForType(type) {
        switch (this.normalizeSlideType(type)) {
            case 'title':
                return this.t('slideContentPlaceholderTitle');
            case 'quote':
                return this.t('slideContentPlaceholderQuote');
            case 'code':
                return this.t('slideContentPlaceholderCode');
            case 'end':
                return this.t('slideContentPlaceholderEnd');
            case 'features':
            case 'content':
            default:
                return this.t('slideContentPlaceholderList');
        }
    }

    getSlideRuntimeLayoutLabel(draft = {}) {
        const media = this.normalizeSlideMediaConfig(draft?.media);
        const title = this.normalizeSlideText(draft?.title, 180);
        const subtitle = this.normalizeSlideText(draft?.subtitle, 220);
        const content = this.normalizeSlideContentItems(
            draft?.content ?? draft?.items ?? draft?.points ?? draft?.bullets
        );
        const hasText = Boolean(title || subtitle || content.length > 0);

        if (media && !hasText) {
            return this.t('slideLayoutMedia');
        }

        if (media) {
            return this.t('slideLayoutMixed');
        }

        return this.t('slideLayoutText');
    }

    updateSlideStructureAssist(draft = {}) {
        const type = this.normalizeSlideType(draft?.type);
        const shape = this.getSlideContentShapeLabel(type);
        const layout = this.getSlideRuntimeLayoutLabel(draft);
        const helperText = this.getSlideStructureHelperText(type);
        const contentPlaceholder = this.getSlideContentPlaceholderForType(type);

        if (this.elements.slideContentShapePill) {
            this.elements.slideContentShapePill.textContent = this.t('slideStructureShapeLabel', { shape });
        }

        if (this.elements.slideRuntimeLayoutPill) {
            this.elements.slideRuntimeLayoutPill.textContent = this.t('slideStructureLayoutLabel', { layout });
        }

        if (this.elements.slideStructureHelperText) {
            this.elements.slideStructureHelperText.textContent = helperText;
        }

        if (this.elements.slideContentInput) {
            this.elements.slideContentInput.placeholder = contentPlaceholder;
        }
    }

    getSlideMotionPresetOptions() {
        return [
            { value: '', label: this.t('slideMotionPresetAuto') },
            { value: 'fade', label: this.t('slideMotionPresetFade') },
            { value: 'fade-up', label: this.t('slideMotionPresetFadeUp') },
            { value: 'slide-left', label: this.t('slideMotionPresetSlideLeft') },
            { value: 'slide-right', label: this.t('slideMotionPresetSlideRight') },
            { value: 'zoom-in', label: this.t('slideMotionPresetZoomIn') },
            { value: 'stagger-up', label: this.t('slideMotionPresetStaggerUp') }
        ];
    }

    getSlideTransitionPresetOptions() {
        return [
            { value: '', label: this.t('slideTransitionPresetAuto') },
            { value: 'crossfade', label: this.t('slideTransitionPresetCrossfade') },
            { value: 'lift-fade', label: this.t('slideTransitionPresetLiftFade') },
            { value: 'push-left', label: this.t('slideTransitionPresetPushLeft') },
            { value: 'push-right', label: this.t('slideTransitionPresetPushRight') },
            { value: 'zoom-fade', label: this.t('slideTransitionPresetZoomFade') }
        ];
    }

    getSlideTransitionOverlayOptions() {
        return [
            { value: '', label: this.t('slideTransitionOverlayAuto') },
            { value: 'none', label: this.t('slideTransitionOverlayNone') },
            { value: 'accent', label: this.t('slideTransitionOverlayAccent') },
            { value: 'dark', label: this.t('slideTransitionOverlayDark') },
            { value: 'light', label: this.t('slideTransitionOverlayLight') }
        ];
    }

    normalizeSlideMotionPreset(value) {
        const normalized = String(value || '').trim().toLowerCase();
        if (!normalized) {
            return '';
        }

        if (normalized === 'slide-up') {
            return 'fade-up';
        }

        if (normalized === 'zoom') {
            return 'zoom-in';
        }

        if (normalized === 'stagger') {
            return 'stagger-up';
        }

        return SUPPORTED_SLIDE_MOTION_PRESETS.has(normalized) ? normalized : '';
    }

    normalizeSlideTransitionPreset(value) {
        const normalized = String(value || '').trim().toLowerCase();
        if (!normalized) {
            return '';
        }

        if (normalized === 'fade') {
            return 'crossfade';
        }

        if (normalized === 'slide-up') {
            return 'lift-fade';
        }

        if (normalized === 'zoom') {
            return 'zoom-fade';
        }

        return SUPPORTED_SLIDE_TRANSITION_PRESETS.has(normalized) ? normalized : '';
    }

    normalizeSlideTransitionOverlay(value) {
        const normalized = String(value || '').trim().toLowerCase();
        if (!normalized) {
            return '';
        }

        return SUPPORTED_SLIDE_TRANSITION_OVERLAYS.has(normalized) ? normalized : '';
    }

    normalizeSlideMediaType(value) {
        const normalized = String(value || '').trim().toLowerCase();
        if (normalized === 'image' || normalized === 'video') {
            return normalized;
        }

        return '';
    }

    normalizeSlideOptionalNumber(value, { min = 0, max = 120000 } = {}) {
        if (value === null || value === undefined || value === '') {
            return null;
        }

        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return null;
        }

        return Math.max(min, Math.min(max, Math.round(numeric)));
    }

    normalizeSlideAnimationConfig(animation) {
        const raw = animation && typeof animation === 'object'
            ? animation
            : (typeof animation === 'string' ? { scene: animation } : {});
        const normalized = {
            scene: this.normalizeSlideMotionPreset(raw.scene),
            heading: this.normalizeSlideMotionPreset(raw.heading),
            subtitle: this.normalizeSlideMotionPreset(raw.subtitle),
            content: this.normalizeSlideMotionPreset(raw.content),
            media: this.normalizeSlideMotionPreset(raw.media)
        };

        Object.keys(normalized).forEach((key) => {
            if (!normalized[key]) {
                delete normalized[key];
            }
        });

        return Object.keys(normalized).length > 0 ? normalized : null;
    }

    normalizeSlideTransitionConfig(transition) {
        const raw = transition && typeof transition === 'object'
            ? transition
            : (typeof transition === 'string' ? { preset: transition } : {});
        const normalized = {
            preset: this.normalizeSlideTransitionPreset(raw.preset || raw.type || raw.enter),
            overlay: this.normalizeSlideTransitionOverlay(raw.overlay),
            durationMs: this.normalizeSlideOptionalNumber(raw.durationMs, { max: 20000 }),
            contentDelayMs: this.normalizeSlideOptionalNumber(raw.contentDelayMs ?? raw.delayMs, { max: 10000 }),
            motionDurationMs: this.normalizeSlideOptionalNumber(raw.motionDurationMs ?? raw.elementDurationMs, { max: 20000 }),
            staggerStepMs: this.normalizeSlideOptionalNumber(raw.staggerStepMs, { max: 5000 }),
            enterMs: this.normalizeSlideOptionalNumber(raw.enterMs ?? raw.enterDurationMs, { max: 20000 }),
            holdMs: this.normalizeSlideOptionalNumber(raw.holdMs ?? raw.holdDurationMs, { max: 120000 }),
            exitMs: this.normalizeSlideOptionalNumber(raw.exitMs ?? raw.exitDurationMs, { max: 20000 })
        };

        Object.keys(normalized).forEach((key) => {
            if (normalized[key] === null || normalized[key] === '') {
                delete normalized[key];
            }
        });

        return Object.keys(normalized).length > 0 ? normalized : null;
    }

    normalizeSlideMediaConfig(media) {
        const raw = media && typeof media === 'object'
            ? media
            : (typeof media === 'string' ? { type: 'image', source: media } : {});
        const type = this.normalizeSlideMediaType(raw.type);
        const source = String(raw.source || raw.url || '').trim();

        if (!type || !source) {
            return null;
        }

        const normalized = {
            type,
            source
        };

        const mimeType = String(raw.mimeType || '').trim();
        const alt = String(raw.alt || '').trim();
        const caption = String(raw.caption || '').trim();
        const poster = String(raw.poster || '').trim();

        if (mimeType) {
            normalized.mimeType = mimeType;
        }

        if (alt) {
            normalized.alt = alt;
        }

        if (caption) {
            normalized.caption = caption;
        }

        if (type === 'video') {
            if (poster) {
                normalized.poster = poster;
            }

            if (raw.autoplay === true) {
                normalized.autoplay = true;
            }

            if (raw.loop === true) {
                normalized.loop = true;
            }
        }

        return normalized;
    }

    normalizeSlideCue(cue, index = 0) {
        if (!cue) {
            return null;
        }

        const rawCue = typeof cue === 'string'
            ? { text: cue, atMs: index * 1000 }
            : (typeof cue === 'object' ? cue : null);

        if (!rawCue) {
            return null;
        }

        const text = String(rawCue.text || '').trim();
        if (!text) {
            return null;
        }

        return {
            atMs: Number.isFinite(Number(rawCue.atMs)) ? Math.max(0, Math.round(Number(rawCue.atMs))) : 0,
            text
        };
    }

    normalizeSlideVoiceoverConfig(voiceover) {
        const raw = voiceover && typeof voiceover === 'object'
            ? voiceover
            : (typeof voiceover === 'string' ? { text: voiceover } : {});
        const text = String(raw.text || '').trim();
        const cues = Array.isArray(raw.cues)
            ? raw.cues
                .map((cue, index) => this.normalizeSlideCue(cue, index))
                .filter(Boolean)
                .sort((left, right) => left.atMs - right.atMs)
            : [];
        const fallbackLanguage = this.locale === 'zh-CN' ? 'zh-CN' : 'en';
        const language = String(raw.language || '').trim() || (text || cues.length > 0 ? fallbackLanguage : '');

        const normalized = {
            ...(raw && typeof raw === 'object' ? raw : {}),
            language,
            text,
            cues
        };

        if (!normalized.language) {
            delete normalized.language;
        }

        if (!normalized.text) {
            delete normalized.text;
        }

        if (normalized.cues.length === 0) {
            delete normalized.cues;
        }

        return normalized.text || normalized.cues || normalized.audioAssetId || normalized.estimatedDurationMs
            ? normalized
            : null;
    }

    getDefaultSlideVoiceover() {
        return {
            language: this.locale === 'zh-CN' ? 'zh-CN' : 'en',
            text: '',
            cues: []
        };
    }

    getDefaultSlideCue() {
        return {
            atMs: 0,
            text: ''
        };
    }

    buildSlideEditorPayload(slide = {}) {
        return {
            type: this.normalizeSlideType(slide.type),
            title: this.normalizeSlideText(slide.title, 180),
            subtitle: this.normalizeSlideText(slide.subtitle, 220),
            content: this.normalizeSlideContentItems(
                slide.content ?? slide.items ?? slide.points ?? slide.bullets
            ),
            media: this.normalizeSlideMediaConfig(slide.media),
            animation: this.normalizeSlideAnimationConfig(slide.animation),
            transition: this.normalizeSlideTransitionConfig(slide.transition),
            durationMs: slide.durationMs || null,
            voiceover: this.normalizeSlideVoiceoverConfig(slide.voiceover)
        };
    }

    getSlideDraftFromEditor(notifyOnError = false) {
        try {
            const rawValue = this.elements.editText?.value?.trim();
            const parsed = rawValue ? JSON.parse(rawValue) : {};
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        } catch (error) {
            if (notifyOnError) {
                this.notify(this.t('invalidJson'), 'error');
            }
            return null;
        }
    }

    writeSlideDraftToEditor(draft) {
        if (!this.elements.editText) {
            return;
        }

        this.elements.editText.value = JSON.stringify(draft, null, 2);
    }

    getSlideMotionFormValue() {
        return this.normalizeSlideAnimationConfig({
            scene: this.elements.slideMotionSceneSelect?.value || '',
            heading: this.elements.slideMotionHeadingSelect?.value || '',
            subtitle: this.elements.slideMotionSubtitleSelect?.value || '',
            content: this.elements.slideMotionContentSelect?.value || '',
            media: this.elements.slideMotionMediaSelect?.value || ''
        });
    }

    getSlideStructureFormValue() {
        return {
            type: this.normalizeSlideType(this.elements.slideTypeSelect?.value || 'content'),
            title: this.normalizeSlideText(this.elements.slideTitleInput?.value || '', 180),
            subtitle: this.normalizeSlideText(this.elements.slideSubtitleInput?.value || '', 220),
            content: this.normalizeSlideContentItems(this.elements.slideContentInput?.value || '')
        };
    }

    getSlideTransitionFormValue() {
        return this.normalizeSlideTransitionConfig({
            preset: this.elements.slideTransitionPresetSelect?.value || '',
            overlay: this.elements.slideTransitionOverlaySelect?.value || '',
            durationMs: this.elements.slideTransitionDurationInput?.value || '',
            contentDelayMs: this.elements.slideTransitionContentDelayInput?.value || '',
            motionDurationMs: this.elements.slideTransitionMotionDurationInput?.value || '',
            staggerStepMs: this.elements.slideTransitionStaggerInput?.value || '',
            enterMs: this.elements.slideTransitionEnterInput?.value || '',
            holdMs: this.elements.slideTransitionHoldInput?.value || '',
            exitMs: this.elements.slideTransitionExitInput?.value || ''
        });
    }

    getSlideMediaFormValue() {
        return this.normalizeSlideMediaConfig({
            type: this.elements.slideMediaTypeSelect?.value || '',
            source: this.elements.slideMediaSourceInput?.value || '',
            mimeType: this.elements.slideMediaMimeTypeInput?.value || '',
            alt: this.elements.slideMediaAltInput?.value || '',
            caption: this.elements.slideMediaCaptionInput?.value || '',
            poster: this.elements.slideMediaPosterInput?.value || '',
            autoplay: this.elements.slideMediaAutoplay?.checked === true,
            loop: this.elements.slideMediaLoop?.checked === true
        });
    }

    getSlideVoiceoverFormValue(baseVoiceover = null) {
        const base = baseVoiceover && typeof baseVoiceover === 'object' ? baseVoiceover : {};
        return this.normalizeSlideVoiceoverConfig({
            ...base,
            language: this.elements.slideVoiceoverLanguageSelect?.value || base.language,
            text: this.elements.slideVoiceoverTextInput?.value || '',
            cues: Array.isArray(base.cues) ? base.cues : []
        });
    }

    getSlideVoiceoverCueFormValue(notifyOnError = false) {
        const text = String(this.elements.slideVoiceoverCueTextInput?.value || '').trim();
        if (!text) {
            if (notifyOnError) {
                this.notify(this.t('deckCueMissingText'), 'error');
            }
            return null;
        }

        return this.normalizeSlideCue({
            atMs: Number(this.elements.slideVoiceoverCueAtInput?.value || 0),
            text
        }, this.selectedSlideCueIndex ?? 0);
    }

    applySlideToolingForm(draft) {
        const type = this.normalizeSlideType(draft?.type);
        const title = this.normalizeSlideText(draft?.title, 180);
        const subtitle = this.normalizeSlideText(draft?.subtitle, 220);
        const content = this.getSlideContentEditorValue(
            draft?.content ?? draft?.items ?? draft?.points ?? draft?.bullets
        );
        const animation = this.normalizeSlideAnimationConfig(draft?.animation);
        const transition = this.normalizeSlideTransitionConfig(draft?.transition);
        const media = this.normalizeSlideMediaConfig(draft?.media);
        const voiceover = this.normalizeSlideVoiceoverConfig(draft?.voiceover);

        if (this.elements.slideTypeSelect) {
            this.elements.slideTypeSelect.value = type;
        }

        if (this.elements.slideTitleInput) {
            this.elements.slideTitleInput.value = title;
        }

        if (this.elements.slideSubtitleInput) {
            this.elements.slideSubtitleInput.value = subtitle;
        }

        if (this.elements.slideContentInput) {
            this.elements.slideContentInput.value = content;
        }

        if (this.elements.slideMotionSceneSelect) {
            this.elements.slideMotionSceneSelect.value = animation?.scene || '';
        }

        if (this.elements.slideMotionHeadingSelect) {
            this.elements.slideMotionHeadingSelect.value = animation?.heading || '';
        }

        if (this.elements.slideMotionSubtitleSelect) {
            this.elements.slideMotionSubtitleSelect.value = animation?.subtitle || '';
        }

        if (this.elements.slideMotionContentSelect) {
            this.elements.slideMotionContentSelect.value = animation?.content || '';
        }

        if (this.elements.slideMotionMediaSelect) {
            this.elements.slideMotionMediaSelect.value = animation?.media || '';
        }

        if (this.elements.slideTransitionPresetSelect) {
            this.elements.slideTransitionPresetSelect.value = transition?.preset || '';
        }

        if (this.elements.slideTransitionOverlaySelect) {
            this.elements.slideTransitionOverlaySelect.value = transition?.overlay || '';
        }

        if (this.elements.slideTransitionDurationInput) {
            this.elements.slideTransitionDurationInput.value = transition?.durationMs ?? '';
        }

        if (this.elements.slideTransitionContentDelayInput) {
            this.elements.slideTransitionContentDelayInput.value = transition?.contentDelayMs ?? '';
        }

        if (this.elements.slideTransitionMotionDurationInput) {
            this.elements.slideTransitionMotionDurationInput.value = transition?.motionDurationMs ?? '';
        }

        if (this.elements.slideTransitionStaggerInput) {
            this.elements.slideTransitionStaggerInput.value = transition?.staggerStepMs ?? '';
        }

        if (this.elements.slideTransitionEnterInput) {
            this.elements.slideTransitionEnterInput.value = transition?.enterMs ?? '';
        }

        if (this.elements.slideTransitionHoldInput) {
            this.elements.slideTransitionHoldInput.value = transition?.holdMs ?? '';
        }

        if (this.elements.slideTransitionExitInput) {
            this.elements.slideTransitionExitInput.value = transition?.exitMs ?? '';
        }

        if (this.elements.slideMediaTypeSelect) {
            this.elements.slideMediaTypeSelect.value = media?.type || '';
        }

        if (this.elements.slideMediaSourceInput) {
            this.elements.slideMediaSourceInput.value = media?.source || '';
        }

        if (this.elements.slideMediaMimeTypeInput) {
            this.elements.slideMediaMimeTypeInput.value = media?.mimeType || '';
        }

        if (this.elements.slideMediaPosterInput) {
            this.elements.slideMediaPosterInput.value = media?.poster || '';
        }

        if (this.elements.slideMediaAltInput) {
            this.elements.slideMediaAltInput.value = media?.alt || '';
        }

        if (this.elements.slideMediaCaptionInput) {
            this.elements.slideMediaCaptionInput.value = media?.caption || '';
        }

        if (this.elements.slideMediaAutoplay) {
            this.elements.slideMediaAutoplay.checked = media?.autoplay === true;
        }

        if (this.elements.slideMediaLoop) {
            this.elements.slideMediaLoop.checked = media?.loop === true;
        }

        this.updateSlideMediaFieldState(media?.type || '');

        if (this.elements.slideDurationInput) {
            this.elements.slideDurationInput.value = draft?.durationMs ?? '';
        }

        if (this.elements.slideVoiceoverLanguageSelect) {
            this.elements.slideVoiceoverLanguageSelect.value = voiceover?.language || (this.locale === 'zh-CN' ? 'zh-CN' : 'en');
        }

        if (this.elements.slideVoiceoverTextInput) {
            this.elements.slideVoiceoverTextInput.value = voiceover?.text || '';
        }
    }

    syncSlideTooling() {
        if (this.modalMode !== 'slide' || !this.elements.slideTooling) {
            return;
        }

        const draft = this.getSlideDraftFromEditor(false);
        if (!draft) {
            if (this.elements.slideVoiceoverCueApplyBtn) {
                this.elements.slideVoiceoverCueApplyBtn.disabled = true;
            }

            if (this.elements.slideVoiceoverCueRemoveBtn) {
                this.elements.slideVoiceoverCueRemoveBtn.disabled = true;
            }

            if (this.elements.slideVoiceoverCueList) {
                this.elements.slideVoiceoverCueList.innerHTML = `<div class="deck-marker-empty">${this.escapeHtml(this.t('invalidJson'))}</div>`;
            }
            return;
        }

        this.applySlideToolingForm(draft);
        this.updateSlideStructureAssist(draft);

        const voiceover = this.normalizeSlideVoiceoverConfig(draft.voiceover) || this.getDefaultSlideVoiceover();
        const cues = Array.isArray(voiceover.cues) ? voiceover.cues : [];

        if (Number.isInteger(this.selectedSlideCueIndex) && this.selectedSlideCueIndex >= cues.length) {
            this.selectedSlideCueIndex = cues.length > 0 ? cues.length - 1 : null;
        }

        this.applySlideVoiceoverCueForm(
            Number.isInteger(this.selectedSlideCueIndex)
                ? cues[this.selectedSlideCueIndex]
                : null
        );

        if (this.elements.slideVoiceoverCueApplyBtn) {
            this.elements.slideVoiceoverCueApplyBtn.disabled = !Number.isInteger(this.selectedSlideCueIndex);
        }

        if (this.elements.slideVoiceoverCueRemoveBtn) {
            this.elements.slideVoiceoverCueRemoveBtn.disabled = !Number.isInteger(this.selectedSlideCueIndex);
        }

        if (this.elements.slideVoiceoverCueList) {
            if (cues.length === 0) {
                this.elements.slideVoiceoverCueList.innerHTML = `<div class="deck-marker-empty">${this.escapeHtml(this.t('slideVoiceoverCueEmpty'))}</div>`;
            } else {
                this.elements.slideVoiceoverCueList.innerHTML = cues.map((cue, index) => `
                    <button
                        type="button"
                        class="deck-cue-item${this.selectedSlideCueIndex === index ? ' active' : ''}"
                        data-slide-cue-index="${index}"
                    >
                        <strong>${this.escapeHtml(cue.text)}</strong>
                        <span class="deck-marker-meta">${this.escapeHtml(this.t('deckCueMetaAt', { time: this.formatDeckAudioTime(cue.atMs) }))}</span>
                    </button>
                `).join('');

                Array.from(this.elements.slideVoiceoverCueList.querySelectorAll('[data-slide-cue-index]')).forEach((button) => {
                    button.addEventListener('click', () => {
                        const index = Number(button.dataset.slideCueIndex);
                        this.setSelectedSlideCue(Number.isInteger(index) ? index : null);
                    });
                });
            }
        }
    }

    updateSlideDraftFromTooling() {
        if (this.modalMode !== 'slide') {
            return;
        }

        const draft = this.getSlideDraftFromEditor(false);
        if (!draft) {
            return;
        }

        const structure = this.getSlideStructureFormValue();
        const nextDraft = {
            ...draft,
            type: structure.type,
            title: structure.title,
            subtitle: structure.subtitle,
            content: structure.content,
            media: this.getSlideMediaFormValue(),
            animation: this.getSlideMotionFormValue(),
            transition: this.getSlideTransitionFormValue(),
            durationMs: this.normalizeSlideOptionalNumber(this.elements.slideDurationInput?.value || '', { min: 0, max: 120000 })
        };

        this.writeSlideDraftToEditor(nextDraft);
        this.updateSlideStructureAssist(nextDraft);
    }

    updateSlideMediaFieldState(typeValue) {
        const type = this.normalizeSlideMediaType(typeValue);
        const hasMedia = Boolean(type);
        const isVideo = type === 'video';

        [
            this.elements.slideMediaSourceInput,
            this.elements.slideMediaMimeTypeInput,
            this.elements.slideMediaAltInput,
            this.elements.slideMediaCaptionInput
        ].forEach((element) => {
            if (element) {
                element.disabled = !hasMedia;
            }
        });

        if (this.elements.slideMediaPosterInput) {
            this.elements.slideMediaPosterInput.disabled = !isVideo;
        }

        if (this.elements.slideMediaAutoplay) {
            this.elements.slideMediaAutoplay.disabled = !isVideo;
            if (!isVideo) {
                this.elements.slideMediaAutoplay.checked = false;
            }
        }

        if (this.elements.slideMediaLoop) {
            this.elements.slideMediaLoop.disabled = !isVideo;
            if (!isVideo) {
                this.elements.slideMediaLoop.checked = false;
            }
        }
    }

    setSelectedSlideCue(index) {
        this.selectedSlideCueIndex = Number.isInteger(index) ? index : null;
        this.syncSlideTooling();
    }

    applySlideVoiceoverCueForm(cue) {
        const normalized = this.normalizeSlideCue(cue, this.selectedSlideCueIndex ?? 0) || this.getDefaultSlideCue();

        if (this.elements.slideVoiceoverCueAtInput) {
            this.elements.slideVoiceoverCueAtInput.value = String(
                Number.isFinite(Number(normalized.atMs)) ? Math.max(0, Number(normalized.atMs)) : 0
            );
        }

        if (this.elements.slideVoiceoverCueTextInput) {
            this.elements.slideVoiceoverCueTextInput.value = normalized.text || '';
        }
    }

    updateSlideVoiceoverDraft({ sync = false } = {}) {
        if (this.modalMode !== 'slide') {
            return;
        }

        const draft = this.getSlideDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const nextVoiceover = this.getSlideVoiceoverFormValue(draft.voiceover);
        draft.voiceover = nextVoiceover;
        this.writeSlideDraftToEditor(draft);

        if (sync) {
            this.syncSlideTooling();
        }
    }

    addSlideVoiceoverCue() {
        const draft = this.getSlideDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const cue = this.getSlideVoiceoverCueFormValue(true);
        if (!cue) {
            return;
        }

        const existingVoiceover = this.normalizeSlideVoiceoverConfig(draft.voiceover) || this.getDefaultSlideVoiceover();
        const cues = Array.isArray(existingVoiceover.cues) ? [...existingVoiceover.cues, cue] : [cue];
        const nextVoiceover = this.normalizeSlideVoiceoverConfig({
            ...existingVoiceover,
            language: this.elements.slideVoiceoverLanguageSelect?.value || existingVoiceover.language,
            text: this.elements.slideVoiceoverTextInput?.value || existingVoiceover.text,
            cues
        }) || this.getDefaultSlideVoiceover();

        draft.voiceover = nextVoiceover;
        this.selectedSlideCueIndex = Array.isArray(nextVoiceover.cues)
            ? nextVoiceover.cues.findIndex((item) => item.atMs === cue.atMs && item.text === cue.text)
            : null;
        this.writeSlideDraftToEditor(draft);
        this.syncSlideTooling();
    }

    applySelectedSlideVoiceoverCue() {
        const draft = this.getSlideDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const cue = this.getSlideVoiceoverCueFormValue(true);
        if (!cue) {
            return;
        }

        const existingVoiceover = this.normalizeSlideVoiceoverConfig(draft.voiceover) || this.getDefaultSlideVoiceover();
        const cues = Array.isArray(existingVoiceover.cues) ? [...existingVoiceover.cues] : [];

        if (!Number.isInteger(this.selectedSlideCueIndex) || this.selectedSlideCueIndex < 0 || this.selectedSlideCueIndex >= cues.length) {
            cues.push(cue);
        } else {
            cues[this.selectedSlideCueIndex] = cue;
        }

        const nextVoiceover = this.normalizeSlideVoiceoverConfig({
            ...existingVoiceover,
            language: this.elements.slideVoiceoverLanguageSelect?.value || existingVoiceover.language,
            text: this.elements.slideVoiceoverTextInput?.value || existingVoiceover.text,
            cues
        }) || this.getDefaultSlideVoiceover();

        draft.voiceover = nextVoiceover;
        this.selectedSlideCueIndex = Array.isArray(nextVoiceover.cues)
            ? nextVoiceover.cues.findIndex((item) => item.atMs === cue.atMs && item.text === cue.text)
            : null;
        this.writeSlideDraftToEditor(draft);
        this.syncSlideTooling();
    }

    removeSelectedSlideVoiceoverCue() {
        if (!Number.isInteger(this.selectedSlideCueIndex)) {
            return;
        }

        const draft = this.getSlideDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const existingVoiceover = this.normalizeSlideVoiceoverConfig(draft.voiceover);
        if (!existingVoiceover || !Array.isArray(existingVoiceover.cues)) {
            return;
        }

        const cues = [...existingVoiceover.cues];
        cues.splice(this.selectedSlideCueIndex, 1);
        const nextVoiceover = this.normalizeSlideVoiceoverConfig({
            ...existingVoiceover,
            language: this.elements.slideVoiceoverLanguageSelect?.value || existingVoiceover.language,
            text: this.elements.slideVoiceoverTextInput?.value || existingVoiceover.text,
            cues
        });

        draft.voiceover = nextVoiceover;
        this.selectedSlideCueIndex = cues.length > 0
            ? Math.min(this.selectedSlideCueIndex, cues.length - 1)
            : null;
        this.writeSlideDraftToEditor(draft);
        this.syncSlideTooling();
    }

    sanitizeSlideDraftForSave(draft) {
        const nextDraft = {
            ...draft
        };
        const type = this.normalizeSlideType(draft.type);
        const title = this.normalizeSlideText(draft.title, 180);
        const subtitle = this.normalizeSlideText(draft.subtitle, 220);
        const content = this.normalizeSlideContentItems(
            draft.content ?? draft.items ?? draft.points ?? draft.bullets
        );
        const media = this.normalizeSlideMediaConfig(draft.media);
        const animation = this.normalizeSlideAnimationConfig(draft.animation);
        const transition = this.normalizeSlideTransitionConfig(draft.transition);
        const voiceover = this.normalizeSlideVoiceoverConfig(draft.voiceover);

        nextDraft.type = type;

        if (title) {
            nextDraft.title = title;
        } else {
            delete nextDraft.title;
        }

        if (subtitle) {
            nextDraft.subtitle = subtitle;
        } else {
            delete nextDraft.subtitle;
        }

        if (content.length > 0) {
            nextDraft.content = content;
        } else {
            delete nextDraft.content;
        }

        delete nextDraft.items;
        delete nextDraft.points;
        delete nextDraft.bullets;

        if (media) {
            nextDraft.media = media;
        } else {
            delete nextDraft.media;
        }

        if (animation) {
            nextDraft.animation = animation;
        } else {
            delete nextDraft.animation;
        }

        if (transition) {
            nextDraft.transition = transition;
        } else {
            delete nextDraft.transition;
        }

        if (voiceover) {
            nextDraft.voiceover = voiceover;
        } else {
            delete nextDraft.voiceover;
        }

        const durationMs = this.normalizeSlideOptionalNumber(draft.durationMs, { min: 0, max: 120000 });
        if (durationMs && durationMs > 0) {
            nextDraft.durationMs = durationMs;
        } else {
            delete nextDraft.durationMs;
        }

        return nextDraft;
    }

    applyModalCopy(mode) {
        const isDeckMode = mode === 'deck';
        this.modalMode = isDeckMode ? 'deck' : 'slide';

        if (this.elements.editModalTitle) {
            this.elements.editModalTitle.innerHTML = isDeckMode
                ? `<i class="ph ph-sliders-horizontal"></i> ${this.t('editDeckTitle')}`
                : `<i class="ph ph-pencil-simple"></i> ${this.t('editSlideTitle')}`;
        }

        if (this.elements.editPromptArea) {
            this.elements.editPromptArea.style.display = isDeckMode ? 'none' : 'block';
        }

        if (this.elements.deckTooling) {
            this.elements.deckTooling.hidden = !isDeckMode;
        }

        if (this.elements.slideTooling) {
            this.elements.slideTooling.hidden = isDeckMode;
        }

        if (this.elements.editPromptLabel) {
            this.elements.editPromptLabel.innerHTML = `<i class="ph ph-sparkle"></i> ${this.t('aiRewriteLabel')}`;
        }

        if (this.elements.editPrompt) {
            this.elements.editPrompt.placeholder = this.t('aiRewritePlaceholder');
        }

        if (this.elements.slideStructureTitle) {
            this.elements.slideStructureTitle.textContent = this.t('slideStructureTitle');
        }

        if (this.elements.slideStructureHint) {
            this.elements.slideStructureHint.textContent = this.t('slideStructureHint');
        }

        if (this.elements.slideTypeText) {
            this.elements.slideTypeText.textContent = this.t('slideTypeText');
        }

        if (this.elements.slideTypeSelect) {
            this.elements.slideTypeSelect.innerHTML = this.buildSelectOptions(this.getSlideTypeOptions());
        }

        if (this.elements.slideTitleText) {
            this.elements.slideTitleText.textContent = this.t('slideTitleText');
        }

        if (this.elements.slideTitleInput) {
            this.elements.slideTitleInput.placeholder = this.t('slideTitlePlaceholder');
        }

        if (this.elements.slideSubtitleText) {
            this.elements.slideSubtitleText.textContent = this.t('slideSubtitleText');
        }

        if (this.elements.slideSubtitleInput) {
            this.elements.slideSubtitleInput.placeholder = this.t('slideSubtitlePlaceholder');
        }

        if (this.elements.slideContentText) {
            this.elements.slideContentText.textContent = this.t('slideContentText');
        }

        if (this.elements.slideContentInput) {
            this.elements.slideContentInput.placeholder = this.t('slideContentPlaceholder');
        }

        this.updateSlideStructureAssist(this.getSlideDraftFromEditor(false) || {});

        if (this.elements.slideMotionTitle) {
            this.elements.slideMotionTitle.textContent = this.t('slideMotionTitle');
        }

        if (this.elements.slideMotionHint) {
            this.elements.slideMotionHint.textContent = this.t('slideMotionHint');
        }

        if (this.elements.slideMotionSceneText) {
            this.elements.slideMotionSceneText.textContent = this.t('slideMotionSceneText');
        }

        if (this.elements.slideMotionHeadingText) {
            this.elements.slideMotionHeadingText.textContent = this.t('slideMotionHeadingText');
        }

        if (this.elements.slideMotionSubtitleText) {
            this.elements.slideMotionSubtitleText.textContent = this.t('slideMotionSubtitleText');
        }

        if (this.elements.slideMotionContentText) {
            this.elements.slideMotionContentText.textContent = this.t('slideMotionContentText');
        }

        if (this.elements.slideMotionMediaText) {
            this.elements.slideMotionMediaText.textContent = this.t('slideMotionMediaText');
        }

        const motionOptions = this.buildSelectOptions(this.getSlideMotionPresetOptions());
        if (this.elements.slideMotionSceneSelect) {
            this.elements.slideMotionSceneSelect.innerHTML = motionOptions;
        }

        if (this.elements.slideMotionHeadingSelect) {
            this.elements.slideMotionHeadingSelect.innerHTML = motionOptions;
        }

        if (this.elements.slideMotionSubtitleSelect) {
            this.elements.slideMotionSubtitleSelect.innerHTML = motionOptions;
        }

        if (this.elements.slideMotionContentSelect) {
            this.elements.slideMotionContentSelect.innerHTML = motionOptions;
        }

        if (this.elements.slideMotionMediaSelect) {
            this.elements.slideMotionMediaSelect.innerHTML = motionOptions;
        }

        if (this.elements.slideTransitionTitle) {
            this.elements.slideTransitionTitle.textContent = this.t('slideTransitionTitle');
        }

        if (this.elements.slideTransitionHint) {
            this.elements.slideTransitionHint.textContent = this.t('slideTransitionHint');
        }

        if (this.elements.slideTransitionPresetText) {
            this.elements.slideTransitionPresetText.textContent = this.t('slideTransitionPresetText');
        }

        if (this.elements.slideTransitionPresetSelect) {
            this.elements.slideTransitionPresetSelect.innerHTML = this.buildSelectOptions(this.getSlideTransitionPresetOptions());
        }

        if (this.elements.slideTransitionOverlayText) {
            this.elements.slideTransitionOverlayText.textContent = this.t('slideTransitionOverlayText');
        }

        if (this.elements.slideTransitionOverlaySelect) {
            this.elements.slideTransitionOverlaySelect.innerHTML = this.buildSelectOptions(this.getSlideTransitionOverlayOptions());
        }

        if (this.elements.slideTransitionDurationText) {
            this.elements.slideTransitionDurationText.textContent = this.t('slideTransitionDurationText');
        }

        if (this.elements.slideTransitionContentDelayText) {
            this.elements.slideTransitionContentDelayText.textContent = this.t('slideTransitionContentDelayText');
        }

        if (this.elements.slideTransitionMotionDurationText) {
            this.elements.slideTransitionMotionDurationText.textContent = this.t('slideTransitionMotionDurationText');
        }

        if (this.elements.slideTransitionStaggerText) {
            this.elements.slideTransitionStaggerText.textContent = this.t('slideTransitionStaggerText');
        }

        if (this.elements.slideTransitionEnterText) {
            this.elements.slideTransitionEnterText.textContent = `${this.t('transitionEnter')} (ms)`;
        }

        if (this.elements.slideTransitionHoldText) {
            this.elements.slideTransitionHoldText.textContent = `${this.t('transitionHold')} (ms)`;
        }

        if (this.elements.slideTransitionExitText) {
            this.elements.slideTransitionExitText.textContent = `${this.t('transitionExit')} (ms)`;
        }

        if (this.elements.slideMediaTitle) {
            this.elements.slideMediaTitle.textContent = this.t('slideMediaTitle');
        }

        if (this.elements.slideMediaHint) {
            this.elements.slideMediaHint.textContent = this.t('slideMediaHint');
        }

        if (this.elements.slideMediaTypeText) {
            this.elements.slideMediaTypeText.textContent = this.t('slideMediaTypeText');
        }

        if (this.elements.slideMediaTypeSelect) {
            this.elements.slideMediaTypeSelect.innerHTML = this.buildSelectOptions([
                { value: '', label: this.t('slideMediaTypeNone') },
                { value: 'image', label: this.t('slideMediaTypeImage') },
                { value: 'video', label: this.t('slideMediaTypeVideo') }
            ]);
        }

        if (this.elements.slideMediaSourceText) {
            this.elements.slideMediaSourceText.textContent = this.t('slideMediaSourceText');
        }

        if (this.elements.slideMediaSourceInput) {
            this.elements.slideMediaSourceInput.placeholder = this.t('slideMediaSourcePlaceholder');
        }

        if (this.elements.slideMediaMimeTypeText) {
            this.elements.slideMediaMimeTypeText.textContent = this.t('slideMediaMimeTypeText');
        }

        if (this.elements.slideMediaMimeTypeInput) {
            this.elements.slideMediaMimeTypeInput.placeholder = this.t('slideMediaMimeTypePlaceholder');
        }

        if (this.elements.slideMediaPosterText) {
            this.elements.slideMediaPosterText.textContent = this.t('slideMediaPosterText');
        }

        if (this.elements.slideMediaPosterInput) {
            this.elements.slideMediaPosterInput.placeholder = this.t('slideMediaPosterPlaceholder');
        }

        if (this.elements.slideMediaAltText) {
            this.elements.slideMediaAltText.textContent = this.t('slideMediaAltText');
        }

        if (this.elements.slideMediaAltInput) {
            this.elements.slideMediaAltInput.placeholder = this.t('slideMediaAltPlaceholder');
        }

        if (this.elements.slideMediaCaptionText) {
            this.elements.slideMediaCaptionText.textContent = this.t('slideMediaCaptionText');
        }

        if (this.elements.slideMediaCaptionInput) {
            this.elements.slideMediaCaptionInput.placeholder = this.t('slideMediaCaptionPlaceholder');
        }

        if (this.elements.slideMediaAutoplayText) {
            this.elements.slideMediaAutoplayText.textContent = this.t('slideMediaAutoplayText');
        }

        if (this.elements.slideMediaLoopText) {
            this.elements.slideMediaLoopText.textContent = this.t('slideMediaLoopText');
        }

        if (this.elements.slideTimingTitle) {
            this.elements.slideTimingTitle.textContent = this.t('slideTimingTitle');
        }

        if (this.elements.slideTimingHint) {
            this.elements.slideTimingHint.textContent = this.t('slideTimingHint');
        }

        if (this.elements.slideDurationText) {
            this.elements.slideDurationText.textContent = this.t('slideDurationText');
        }

        if (this.elements.slideVoiceoverLanguageText) {
            this.elements.slideVoiceoverLanguageText.textContent = this.t('slideVoiceoverLanguageText');
        }

        if (this.elements.slideVoiceoverLanguageSelect) {
            this.elements.slideVoiceoverLanguageSelect.innerHTML = `
                <option value="zh-CN">${this.t('deckVoiceoverLanguageZh')}</option>
                <option value="en">${this.t('deckVoiceoverLanguageEn')}</option>
            `;
        }

        if (this.elements.slideVoiceoverTextLabel) {
            this.elements.slideVoiceoverTextLabel.textContent = this.t('slideVoiceoverTextLabel');
        }

        if (this.elements.slideVoiceoverTextInput) {
            this.elements.slideVoiceoverTextInput.placeholder = this.t('slideVoiceoverTextPlaceholder');
        }

        if (this.elements.slideVoiceoverCueTitle) {
            this.elements.slideVoiceoverCueTitle.textContent = this.t('slideVoiceoverCueTitle');
        }

        if (this.elements.slideVoiceoverCueHint) {
            this.elements.slideVoiceoverCueHint.textContent = this.t('slideVoiceoverCueHint');
        }

        if (this.elements.slideVoiceoverCueAtText) {
            this.elements.slideVoiceoverCueAtText.textContent = this.t('slideVoiceoverCueAtText');
        }

        if (this.elements.slideVoiceoverCueTextText) {
            this.elements.slideVoiceoverCueTextText.textContent = this.t('slideVoiceoverCueTextText');
        }

        if (this.elements.slideVoiceoverCueTextInput) {
            this.elements.slideVoiceoverCueTextInput.placeholder = this.t('slideVoiceoverCueTextPlaceholder');
        }

        this.setButtonLabel(this.elements.slideVoiceoverCueAddBtn, 'plus', this.t('slideVoiceoverCueAdd'));
        this.setButtonLabel(this.elements.slideVoiceoverCueApplyBtn, 'check', this.t('slideVoiceoverCueApply'));
        this.setButtonLabel(this.elements.slideVoiceoverCueRemoveBtn, 'trash', this.t('slideVoiceoverCueRemove'));

        if (this.elements.deckTimelineTitle) {
            this.elements.deckTimelineTitle.textContent = this.t('deckTimelineTitle');
        }

        if (this.elements.deckTimelineHint) {
            this.elements.deckTimelineHint.textContent = this.t('deckTimelineHint');
        }

        if (this.elements.deckTimelineEnabledText) {
            this.elements.deckTimelineEnabledText.textContent = this.t('deckTimelineEnabledText');
        }

        if (this.elements.deckTimelineAutoplayText) {
            this.elements.deckTimelineAutoplayText.textContent = this.t('deckTimelineAutoplayText');
        }

        if (this.elements.deckSubtitleModeText) {
            this.elements.deckSubtitleModeText.textContent = this.t('deckSubtitleModeText');
        }

        if (this.elements.deckSubtitleModeSelect) {
            this.elements.deckSubtitleModeSelect.innerHTML = `
                <option value="voiceover-placeholder">${this.t('subtitleModeVoiceover')}</option>
                <option value="static">${this.t('subtitleModeStatic')}</option>
                <option value="off">${this.t('subtitleModeOff')}</option>
            `;
        }

        if (this.elements.deckTimelineStarterText) {
            this.elements.deckTimelineStarterText.textContent = this.t('deckTimelineStarterText');
        }

        if (this.elements.deckTimelineStarterSelect) {
            this.elements.deckTimelineStarterSelect.innerHTML = this.getDeckTimelineStarterOptions()
                .map((option) => `<option value="${this.escapeHtml(option.value)}">${this.escapeHtml(option.label)}</option>`)
                .join('');
            this.elements.deckTimelineStarterSelect.value = this.deckTimelineStarterTemplate;
        }

        this.setButtonLabel(this.elements.deckTimelineStarterApplyBtn, 'magic-wand', this.t('deckTimelineStarterApply'));
        this.setButtonLabel(this.elements.deckTimelineStarterResetBtn, 'arrow-counter-clockwise', this.t('deckTimelineStarterReset'));

        if (this.elements.deckMarkerEditorTitle) {
            this.elements.deckMarkerEditorTitle.textContent = this.t('deckMarkerEditorTitle');
        }

        if (this.elements.deckMarkerEditorHint) {
            this.elements.deckMarkerEditorHint.textContent = this.t('deckMarkerEditorHint');
        }

        if (this.elements.deckMarkerLabelText) {
            this.elements.deckMarkerLabelText.textContent = this.t('deckMarkerLabelText');
        }

        if (this.elements.deckMarkerLabelInput) {
            this.elements.deckMarkerLabelInput.placeholder = this.t('deckMarkerPlaceholder');
        }

        if (this.elements.deckMarkerSceneText) {
            this.elements.deckMarkerSceneText.textContent = this.t('deckMarkerSceneText');
        }

        if (this.elements.deckMarkerKindText) {
            this.elements.deckMarkerKindText.textContent = this.t('deckMarkerKindText');
        }

        if (this.elements.deckMarkerKindSelect) {
            this.elements.deckMarkerKindSelect.innerHTML = `
                <option value="navigation">${this.t('deckMarkerKindNavigation')}</option>
                <option value="narration">${this.t('deckMarkerKindNarration')}</option>
                <option value="edit">${this.t('deckMarkerKindEdit')}</option>
            `;
        }

        if (this.elements.deckMarkerAnchorText) {
            this.elements.deckMarkerAnchorText.textContent = this.t('deckMarkerAnchorText');
        }

        if (this.elements.deckMarkerAnchorSelect) {
            this.elements.deckMarkerAnchorSelect.innerHTML = `
                <option value="start">${this.t('deckMarkerAnchorStart')}</option>
                <option value="advance">${this.t('deckMarkerAnchorAdvance')}</option>
                <option value="exit">${this.t('deckMarkerAnchorExit')}</option>
            `;
        }

        this.setButtonLabel(this.elements.deckMarkerAddBtn, 'plus', this.t('deckMarkerAdd'));
        this.setButtonLabel(this.elements.deckMarkerGenerateBtn, 'navigation-arrow', this.t('deckMarkerGenerateNav'));
        this.setButtonLabel(this.elements.deckMarkerGenerateEditBtn, 'pencil-line', this.t('deckMarkerGenerateEdit'));
        this.setButtonLabel(this.elements.deckMarkerGenerateSuiteBtn, 'stack', this.t('deckMarkerGenerateSuite'));
        this.setButtonLabel(this.elements.deckMarkerClearGeneratedBtn, 'broom', this.t('deckMarkerClearGenerated'));
        this.setButtonLabel(this.elements.deckMarkerApplyBtn, 'check', this.t('deckMarkerApply'));
        this.setButtonLabel(this.elements.deckMarkerRemoveBtn, 'trash', this.t('deckMarkerRemove'));

        if (this.elements.deckAudioEditorTitle) {
            this.elements.deckAudioEditorTitle.textContent = this.t('deckAudioEditorTitle');
        }

        if (this.elements.deckAudioEditorHint) {
            this.elements.deckAudioEditorHint.textContent = this.t('deckAudioEditorHint');
        }

        if (this.elements.deckAudioTemplateText) {
            this.elements.deckAudioTemplateText.textContent = this.t('deckAudioTemplateText');
        }

        if (this.elements.deckAudioTemplateSelect) {
            this.elements.deckAudioTemplateSelect.innerHTML = this.getDeckAudioTemplateOptions()
                .map((option) => `<option value="${this.escapeHtml(option.value)}">${this.escapeHtml(option.label)}</option>`)
                .join('');
            this.elements.deckAudioTemplateSelect.value = this.normalizeDeckAudioPresetKey(this.deckAudioTemplateKey);
        }

        if (this.elements.deckAudioLabelText) {
            this.elements.deckAudioLabelText.textContent = this.t('deckAudioLabelText');
        }

        if (this.elements.deckAudioLabelInput) {
            this.elements.deckAudioLabelInput.placeholder = this.t('deckAudioLabelPlaceholder');
        }

        if (this.elements.deckAudioSourceText) {
            this.elements.deckAudioSourceText.textContent = this.t('deckAudioSourceText');
        }

        if (this.elements.deckAudioSourceInput) {
            this.elements.deckAudioSourceInput.placeholder = this.t('deckAudioSourcePlaceholder');
        }

        if (this.elements.deckAudioStartText) {
            this.elements.deckAudioStartText.textContent = this.t('deckAudioStartText');
        }

        if (this.elements.deckAudioGainText) {
            this.elements.deckAudioGainText.textContent = this.t('deckAudioGainText');
        }

        if (this.elements.deckAudioAutoplayText) {
            this.elements.deckAudioAutoplayText.textContent = this.t('deckAudioAutoplayText');
        }

        if (this.elements.deckAudioLoopText) {
            this.elements.deckAudioLoopText.textContent = this.t('deckAudioLoopText');
        }

        this.setButtonLabel(this.elements.deckAudioTemplateApplyBtn, 'waveform', this.t('deckAudioTemplateApply'));
        this.setButtonLabel(this.elements.deckAudioAddBtn, 'plus', this.t('deckAudioAdd'));
        this.setButtonLabel(this.elements.deckAudioApplyBtn, 'check', this.t('deckAudioApply'));
        this.setButtonLabel(this.elements.deckAudioDuplicateBtn, 'copy', this.t('deckAudioDuplicate'));
        this.setButtonLabel(this.elements.deckAudioRemoveBtn, 'trash', this.t('deckAudioRemove'));

        if (this.elements.deckVoiceoverEditorTitle) {
            this.elements.deckVoiceoverEditorTitle.textContent = this.t('deckVoiceoverEditorTitle');
        }

        if (this.elements.deckVoiceoverEditorHint) {
            this.elements.deckVoiceoverEditorHint.textContent = this.t('deckVoiceoverEditorHint');
        }

        if (this.elements.deckVoiceoverSceneText) {
            this.elements.deckVoiceoverSceneText.textContent = this.t('deckVoiceoverSceneText');
        }

        if (this.elements.deckVoiceoverLanguageText) {
            this.elements.deckVoiceoverLanguageText.textContent = this.t('deckVoiceoverLanguageText');
        }

        if (this.elements.deckVoiceoverLanguageSelect) {
            this.elements.deckVoiceoverLanguageSelect.innerHTML = `
                <option value="zh-CN">${this.t('deckVoiceoverLanguageZh')}</option>
                <option value="en">${this.t('deckVoiceoverLanguageEn')}</option>
            `;
        }

        if (this.elements.deckVoiceoverTextLabel) {
            this.elements.deckVoiceoverTextLabel.textContent = this.t('deckVoiceoverTextLabel');
        }

        if (this.elements.deckVoiceoverTextInput) {
            this.elements.deckVoiceoverTextInput.placeholder = this.t('deckVoiceoverTextPlaceholder');
        }

        this.setButtonLabel(this.elements.deckVoiceoverCopyPrevBtn, 'copy', this.t('deckVoiceoverCopyPrev'));
        this.setButtonLabel(this.elements.deckVoiceoverCopyNextBtn, 'copy', this.t('deckVoiceoverCopyNext'));
        this.setButtonLabel(this.elements.deckVoiceoverGenerateMarkersBtn, 'chat-circle-text', this.t('deckVoiceoverGenerateMarkers'));
        this.setButtonLabel(this.elements.deckVoiceoverGenerateBtn, 'waveform', this.t('deckVoiceoverGenerate'));
        this.setButtonLabel(this.elements.deckVoiceoverClearGeneratedBtn, 'broom', this.t('deckVoiceoverClearGenerated'));

        if (this.elements.deckCueAtText) {
            this.elements.deckCueAtText.textContent = this.t('deckCueAtText');
        }

        if (this.elements.deckCueTextText) {
            this.elements.deckCueTextText.textContent = this.t('deckCueTextText');
        }

        if (this.elements.deckCueTextInput) {
            this.elements.deckCueTextInput.placeholder = this.t('deckCueTextPlaceholder');
        }

        this.setButtonLabel(this.elements.deckCueAddBtn, 'plus', this.t('deckCueAdd'));
        this.setButtonLabel(this.elements.deckCueGenerateBtn, 'text-align-left', this.t('deckCueGenerate'));
        this.setButtonLabel(this.elements.deckCueAppendBtn, 'text-indent', this.t('deckCueAppend'));
        this.setButtonLabel(this.elements.deckCueApplyBtn, 'check', this.t('deckCueApply'));
        this.setButtonLabel(this.elements.deckCueDuplicateBtn, 'copy', this.t('deckCueDuplicate'));
        this.setButtonLabel(this.elements.deckCueRetimeBtn, 'timer', this.t('deckCueRetime'));
        this.setButtonLabel(this.elements.deckCueRemoveBtn, 'trash', this.t('deckCueRemove'));

        if (this.elements.editJsonLabel) {
            this.elements.editJsonLabel.innerHTML = `<i class="ph ph-code"></i> ${this.t(isDeckMode ? 'jsonDeckLabel' : 'jsonSlideLabel')}`;
        }

        if (this.elements.editLoadingText) {
            this.elements.editLoadingText.textContent = this.t('aiLoading');
        }

        if (this.elements.regenerateEdit) {
            this.elements.regenerateEdit.hidden = isDeckMode;
            this.elements.regenerateEdit.disabled = false;
        }

        this.setButtonLabel(this.elements.saveEdit, '', this.t(isDeckMode ? 'saveDeck' : 'saveSlide'));
    }

    buildDeckSettingsPayload() {
        return {
            title: this.currentOutline?.title || '',
            subtitle: this.currentOutline?.subtitle || '',
            timeline: this.normalizeDeckTimeline(this.currentOutline?.timeline),
            sceneVoiceover: this.buildDeckVoiceoverPayload()
        };
    }

    buildDeckVoiceoverPayload() {
        return this.currentSlides
            .map((slide, index) => this.normalizeDeckSceneVoiceover({
                sceneIndex: index,
                ...(slide?.voiceover && typeof slide.voiceover === 'object' ? slide.voiceover : {})
            }, index))
            .filter(Boolean);
    }

    normalizeDeckMarkerKind(value) {
        return CREATE_PAGE_DECK_AUTHORING.normalizeMarkerKind(value);
    }

    normalizeDeckMarkerAnchor(value) {
        return CREATE_PAGE_DECK_AUTHORING.normalizeMarkerAnchor(value);
    }

    normalizeDeckMarker(marker, index) {
        return CREATE_PAGE_DECK_AUTHORING.normalizeMarker(marker, index);
    }

    normalizeDeckAudioTrack(track, index) {
        return CREATE_PAGE_DECK_AUTHORING.normalizeAudioTrack(track, index);
    }

    normalizeDeckCue(cue, index) {
        return CREATE_PAGE_DECK_AUTHORING.normalizeCue(cue, index);
    }

    normalizeDeckSceneVoiceover(entry, index) {
        return CREATE_PAGE_DECK_AUTHORING.normalizeSceneVoiceover(entry, index, { locale: this.locale });
    }

    normalizeDeckSceneVoiceoverList(entries) {
        return CREATE_PAGE_DECK_AUTHORING.normalizeSceneVoiceoverList(entries, { locale: this.locale });
    }

    normalizeDeckTimeline(timeline) {
        const normalized = CREATE_PAGE_DECK_AUTHORING.normalizeTimeline(timeline, { locale: this.locale });
        return {
            enabled: normalized.enabled,
            autoplay: normalized.autoplay,
            subtitleMode: normalized.subtitleMode,
            markers: normalized.markers,
            audioTracks: normalized.audioTracks
        };
    }

    getSubtitleModeLabel(mode) {
        switch (String(mode || '').trim().toLowerCase()) {
            case 'static':
                return this.t('subtitleModeStatic');
            case 'off':
                return this.t('subtitleModeOff');
            case 'voiceover-placeholder':
            default:
                return this.t('subtitleModeVoiceover');
        }
    }

    getDeckTimelinePills() {
        const timeline = this.normalizeDeckTimeline(this.currentOutline?.timeline);
        const voiceoverCount = this.buildDeckVoiceoverPayload().length;
        return [
            timeline.enabled ? this.t('timelineEnabled') : this.t('timelineDisabled'),
            this.t('markersCount', { count: timeline.markers.length }),
            this.t('audioTracksCount', { count: timeline.audioTracks.length }),
            this.t('voiceoverScenesCount', { count: voiceoverCount }),
            this.t('subtitleModeLabel', { mode: this.getSubtitleModeLabel(timeline.subtitleMode) }),
            timeline.autoplay ? this.t('autoplayEnabledPill') : this.t('autoplayDisabledPill')
        ];
    }

    cloneSlideData(slide) {
        if (typeof structuredClone === 'function') {
            return structuredClone(slide);
        }

        return JSON.parse(JSON.stringify(slide || {}));
    }

    syncCurrentSlidesToOutline() {
        this.currentSlides = Array.isArray(this.currentSlides)
            ? this.currentSlides.map((slide, index) => ({
                ...slide,
                index: index + 1
            }))
            : [];

        if (this.currentOutline && typeof this.currentOutline === 'object') {
            this.currentOutline.slides = this.currentSlides;
        }
    }

    remapTimelineMarkers(transformMarker) {
        if (!this.currentOutline?.timeline || typeof this.currentOutline.timeline !== 'object') {
            return;
        }

        const timeline = this.normalizeDeckTimeline(this.currentOutline.timeline);
        const nextMarkers = timeline.markers
            .map((marker, index) => transformMarker(marker, index))
            .filter(Boolean)
            .map((marker, index) => this.normalizeDeckMarker(marker, index))
            .filter(Boolean);

        this.currentOutline.timeline = {
            ...timeline,
            markers: nextMarkers
        };
    }

    setInsertTemplate(value) {
        this.insertTemplate = this.normalizeSlideType(value);
    }

    setScenePackTemplate(value) {
        this.scenePackTemplate = this.normalizeScenePackTemplate(value);
    }

    insertSlideAt(insertIndex, type = this.insertTemplate, noticeKey = 'slideInserted') {
        const boundedIndex = Math.max(0, Math.min(this.currentSlides.length, Number(insertIndex) || 0));
        const nextSlides = [...this.currentSlides];
        nextSlides.splice(boundedIndex, 0, this.createEmptySlide(type, boundedIndex));
        this.currentSlides = nextSlides;

        this.remapTimelineMarkers((marker) => {
            const sceneIndex = Number.isFinite(Number(marker?.sceneIndex))
                ? Math.max(0, Math.round(Number(marker.sceneIndex)))
                : 0;

            return {
                ...marker,
                sceneIndex: sceneIndex >= boundedIndex ? sceneIndex + 1 : sceneIndex
            };
        });

        this.markRecentlyInsertedRange(boundedIndex, 1, 'slide');
        this.syncCurrentSlidesToOutline();
        this.renderOutlineCard();
        this.notify(this.t(noticeKey));
    }

    insertScenePackAt(insertIndex, template = this.scenePackTemplate, noticeKey = 'scenePackInserted') {
        const boundedIndex = Math.max(0, Math.min(this.currentSlides.length, Number(insertIndex) || 0));
        const blueprint = this.getScenePackBlueprint(template);
        if (!Array.isArray(blueprint) || blueprint.length === 0) {
            return;
        }

        const nextSlides = [...this.currentSlides];
        const starterSlides = blueprint.map((slideType, offset) => this.createEmptySlide(slideType, boundedIndex + offset));
        nextSlides.splice(boundedIndex, 0, ...starterSlides);
        this.currentSlides = nextSlides;

        this.remapTimelineMarkers((marker) => {
            const sceneIndex = Number.isFinite(Number(marker?.sceneIndex))
                ? Math.max(0, Math.round(Number(marker.sceneIndex)))
                : 0;

            return {
                ...marker,
                sceneIndex: sceneIndex >= boundedIndex ? sceneIndex + starterSlides.length : sceneIndex
            };
        });

        this.markRecentlyInsertedRange(boundedIndex, starterSlides.length, 'pack', template);
        this.syncCurrentSlidesToOutline();
        this.renderOutlineCard();
        this.notify(this.t(noticeKey, { count: starterSlides.length }));
    }

    duplicateSlide(index) {
        if (!this.currentSlides[index]) {
            return;
        }

        const nextSlides = [...this.currentSlides];
        nextSlides.splice(index + 1, 0, this.cloneSlideData(this.currentSlides[index]));
        this.currentSlides = nextSlides;
        this.remapTimelineMarkers((marker) => {
            const sceneIndex = Number.isFinite(Number(marker?.sceneIndex))
                ? Math.max(0, Math.round(Number(marker.sceneIndex)))
                : 0;

            return {
                ...marker,
                sceneIndex: sceneIndex > index ? sceneIndex + 1 : sceneIndex
            };
        });
        this.clearRecentlyInsertedRange();
        this.syncCurrentSlidesToOutline();
        this.renderOutlineCard();
        this.notify(this.t('slideDuplicated'));
    }

    moveSlide(index, direction) {
        const delta = direction === 'up' ? -1 : 1;
        const targetIndex = index + delta;
        if (!this.currentSlides[index] || targetIndex < 0 || targetIndex >= this.currentSlides.length) {
            return;
        }

        const nextSlides = [...this.currentSlides];
        const [movedSlide] = nextSlides.splice(index, 1);
        nextSlides.splice(targetIndex, 0, movedSlide);
        this.currentSlides = nextSlides;

        this.remapTimelineMarkers((marker) => {
            const sceneIndex = Number.isFinite(Number(marker?.sceneIndex))
                ? Math.max(0, Math.round(Number(marker.sceneIndex)))
                : 0;

            if (sceneIndex === index) {
                return {
                    ...marker,
                    sceneIndex: targetIndex
                };
            }

            if (sceneIndex === targetIndex) {
                return {
                    ...marker,
                    sceneIndex: index
                };
            }

            return marker;
        });

        this.clearRecentlyInsertedRange();
        this.syncCurrentSlidesToOutline();
        this.renderOutlineCard();
        this.notify(this.t(direction === 'up' ? 'slideMovedUp' : 'slideMovedDown'));
    }

    removeSlide(index) {
        if (!this.currentSlides[index]) {
            return;
        }

        if (this.currentSlides.length <= 1) {
            this.notify(this.t('slideRemoveLastBlocked'), 'error');
            return;
        }

        const nextSlides = [...this.currentSlides];
        nextSlides.splice(index, 1);
        this.currentSlides = nextSlides;
        this.remapTimelineMarkers((marker) => {
            const sceneIndex = Number.isFinite(Number(marker?.sceneIndex))
                ? Math.max(0, Math.round(Number(marker.sceneIndex)))
                : 0;

            if (sceneIndex === index) {
                return null;
            }

            return {
                ...marker,
                sceneIndex: sceneIndex > index ? sceneIndex - 1 : sceneIndex
            };
        });
        this.clearRecentlyInsertedRange();
        this.syncCurrentSlidesToOutline();
        this.renderOutlineCard();
        this.notify(this.t('slideRemoved'));
    }

    getDeckDraftFromEditor(notifyOnError = false) {
        try {
            const rawValue = this.elements.editText?.value?.trim();
            const parsed = rawValue ? JSON.parse(rawValue) : {};
            const current = this.currentOutline || {};
            return {
                ...(parsed && typeof parsed === 'object' ? parsed : {}),
                title: Object.prototype.hasOwnProperty.call(parsed || {}, 'title')
                    ? String(parsed.title || '')
                    : String(current.title || ''),
                subtitle: Object.prototype.hasOwnProperty.call(parsed || {}, 'subtitle')
                    ? String(parsed.subtitle || '')
                    : String(current.subtitle || ''),
                timeline: this.normalizeDeckTimeline(
                    Object.prototype.hasOwnProperty.call(parsed || {}, 'timeline')
                        ? parsed.timeline
                        : current.timeline
                ),
                sceneVoiceover: this.normalizeDeckSceneVoiceoverList(
                    Object.prototype.hasOwnProperty.call(parsed || {}, 'sceneVoiceover')
                        ? parsed.sceneVoiceover
                        : this.buildDeckVoiceoverPayload()
                )
            };
        } catch (error) {
            if (notifyOnError) {
                this.notify(this.t('invalidJson'), 'error');
            }
            return null;
        }
    }

    writeDeckDraftToEditor(draft) {
        if (!this.elements.editText) {
            return;
        }

        this.elements.editText.value = JSON.stringify(draft, null, 2);
    }

    getMarkerSceneLabel(index) {
        const slide = this.currentSlides[index];
        const title = slide?.title || this.t('deckMarkerSceneOption', { index: index + 1 });
        return `${this.t('deckMarkerSceneOption', { index: index + 1 })} · ${title}`;
    }

    getDefaultDeckMarker() {
        return CREATE_PAGE_DECK_AUTHORING.getDefaultMarker();
    }

    getDefaultDeckAudioTrack() {
        return CREATE_PAGE_DECK_AUTHORING.getDefaultAudioTrack();
    }

    getDefaultDeckVoiceover(sceneIndex = 0) {
        return CREATE_PAGE_DECK_AUTHORING.getDefaultVoiceover(sceneIndex, { locale: this.locale });
    }

    getAdjacentDeckVoiceoverEntry(entries, sceneIndex, direction = 'prev') {
        return CREATE_PAGE_DECK_VOICEOVER_FLOW.findAdjacentVoiceoverEntry(
            this.normalizeDeckSceneVoiceoverList(entries),
            sceneIndex,
            direction
        );
    }

    getDeckMarkerFormValue() {
        return CREATE_PAGE_DECK_FORMS.readMarkerForm(this.elements, {
            normalizeMarker: (marker, index) => this.normalizeDeckMarker(marker, index),
            selectedIndex: this.selectedDeckMarkerIndex ?? 0
        }) || this.getDefaultDeckMarker();
    }

    applyDeckMarkerForm(marker) {
        CREATE_PAGE_DECK_FORMS.applyMarkerForm(this.elements, marker, {
            normalizeMarker: (input, index) => this.normalizeDeckMarker(input, index),
            selectedIndex: this.selectedDeckMarkerIndex ?? 0,
            getDefaultMarker: () => this.getDefaultDeckMarker()
        });
    }

    getDeckAudioFormValue(notifyOnError = false) {
        return CREATE_PAGE_DECK_FORMS.readAudioForm(this.elements, {
            normalizeAudioTrack: (track, index) => this.normalizeDeckAudioTrack(track, index),
            notify: (message, type) => this.notify(message, type),
            notifyOnError,
            missingSourceMessage: this.t('deckAudioMissingSource'),
            selectedIndex: this.selectedDeckAudioIndex ?? 0
        });
    }

    applyDeckAudioForm(track) {
        CREATE_PAGE_DECK_FORMS.applyAudioForm(this.elements, track, {
            normalizeAudioTrack: (input, index) => this.normalizeDeckAudioTrack(input, index),
            selectedIndex: this.selectedDeckAudioIndex ?? 0,
            getDefaultAudioTrack: () => this.getDefaultDeckAudioTrack()
        });
    }

    applyDeckAudioTemplate() {
        const template = this.normalizeDeckAudioPresetKey(
            this.elements.deckAudioTemplateSelect?.value || this.deckAudioTemplateKey
        );
        this.deckAudioTemplateKey = template;
        const draft = this.getDeckDraftFromEditor(false);
        const timeline = draft ? this.normalizeDeckTimeline(draft.timeline) : this.normalizeDeckTimeline(null);
        const selectedTrack = Number.isInteger(this.selectedDeckAudioIndex)
            ? timeline.audioTracks[this.selectedDeckAudioIndex]
            : null;
        const formTrack = this.normalizeDeckAudioTrack({
            label: this.elements.deckAudioLabelInput?.value,
            source: this.elements.deckAudioSourceInput?.value,
            startMs: this.elements.deckAudioStartInput?.value,
            gain: this.elements.deckAudioGainInput?.value,
            autoplay: this.elements.deckAudioAutoplay?.checked === true,
            loop: this.elements.deckAudioLoop?.checked === true
        }, this.selectedDeckAudioIndex ?? 0);
        const activeTrack = selectedTrack || formTrack || this.getDefaultDeckAudioTrack();

        const nextTrack = CREATE_PAGE_DECK_AUDIO_FLOW.buildTemplateTrack({
            template,
            locale: this.locale,
            purposeLabel: this.getPurposeLabel() || '',
            selectedTrack,
            formTrack,
            formSource: this.elements.deckAudioSourceInput?.value || '',
            defaultTrack: this.getDefaultDeckAudioTrack(),
            applyAudioPresetToTrack: (track, presetKey, options) => CREATE_PAGE_DECK_AUDIO_PRESETS.applyAudioPresetToTrack(
                track,
                presetKey,
                options
            )
        });

        if (draft && Number.isInteger(this.selectedDeckAudioIndex)) {
            const result = CREATE_PAGE_DECK_ACTIONS.upsertAudioTrack(
                draft,
                this.normalizeDeckAudioTrack(nextTrack, this.selectedDeckAudioIndex) || nextTrack,
                this.selectedDeckAudioIndex,
                (input) => this.normalizeDeckTimeline(input)
            );
            this.selectedDeckAudioIndex = result.selectedDeckAudioIndex;
            this.writeDeckDraftToEditor(result.draft);
            this.syncDeckTooling(false);
            this.notify(this.t('deckAudioTemplateAppliedSelected', {
                template: this.getDeckAudioTemplateLabel(template)
            }));
            return;
        }

        this.applyDeckAudioForm(nextTrack);
        this.notify(this.t('deckAudioTemplatePrefilled', {
            template: this.getDeckAudioTemplateLabel(template)
        }));
    }

    duplicateSelectedDeckAudioTrack() {
        if (!Number.isInteger(this.selectedDeckAudioIndex)) {
            return;
        }

        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const result = CREATE_PAGE_DECK_ACTIONS.duplicateAudioTrack(
            draft,
            this.selectedDeckAudioIndex,
            (track, _selectedIndex, audioTracks) => CREATE_PAGE_DECK_AUDIO_FLOW.buildDuplicatedTrack({
                track,
                audioTracks,
                locale: this.locale,
                duplicateLabel: this.t('deckAudioDuplicateSuffix'),
                fallbackLabel: 'Audio Track',
                nextIndex: audioTracks.length,
                buildDuplicateAudioTrack: (input, options) => CREATE_PAGE_DECK_AUDIO_PRESETS.buildDuplicateAudioTrack(
                    input,
                    options
                ),
                normalizeAudioTrack: (input, index) => this.normalizeDeckAudioTrack(
                    input,
                    index
                )
            }),
            (timeline) => this.normalizeDeckTimeline(timeline)
        );

        this.selectedDeckAudioIndex = result.selectedDeckAudioIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckAudioDuplicated'));
    }

    getSelectedDeckVoiceoverSceneIndex() {
        return CREATE_PAGE_DECK_FORMS.readSelectedVoiceoverSceneIndex(
            this.elements,
            this.selectedDeckVoiceoverSceneIndex
        );
    }

    getDeckVoiceoverEntryFromForm(existingEntry = null) {
        return CREATE_PAGE_DECK_FORMS.readVoiceoverEntryForm(this.elements, existingEntry, {
            normalizeSceneVoiceover: (entry, index) => this.normalizeDeckSceneVoiceover(entry, index),
            selectedSceneIndex: this.getSelectedDeckVoiceoverSceneIndex()
        });
    }

    applyDeckVoiceoverForm(entry) {
        CREATE_PAGE_DECK_FORMS.applyVoiceoverForm(this.elements, entry, {
            normalizeSceneVoiceover: (input, index) => this.normalizeDeckSceneVoiceover(input, index),
            getDefaultVoiceover: (sceneIndex) => this.getDefaultDeckVoiceover(sceneIndex),
            selectedSceneIndex: this.selectedDeckVoiceoverSceneIndex,
            locale: this.locale
        });
    }

    getDeckCueFormValue(notifyOnError = false) {
        return CREATE_PAGE_DECK_FORMS.readCueForm(this.elements, {
            normalizeCue: (cue, index) => this.normalizeDeckCue(cue, index),
            notify: (message, type) => this.notify(message, type),
            notifyOnError,
            missingTextMessage: this.t('deckCueMissingText'),
            selectedIndex: this.selectedDeckCueIndex ?? 0
        });
    }

    applyDeckCueForm(cue) {
        CREATE_PAGE_DECK_FORMS.applyCueForm(this.elements, cue, {
            normalizeCue: (input, index) => this.normalizeDeckCue(input, index),
            selectedIndex: this.selectedDeckCueIndex ?? 0
        });
    }

    setSelectedDeckMarker(index) {
        this.selectedDeckMarkerIndex = Number.isInteger(index) ? index : null;
        this.syncDeckTooling(false);
    }

    setSelectedDeckAudioTrack(index) {
        this.selectedDeckAudioIndex = Number.isInteger(index) ? index : null;
        this.syncDeckTooling(false);
    }

    setSelectedDeckVoiceoverScene(index) {
        this.selectedDeckVoiceoverSceneIndex = Number.isInteger(index) ? index : 0;
        this.selectedDeckCueIndex = null;
        this.syncDeckTooling(false);
    }

    setSelectedDeckCue(index) {
        this.selectedDeckCueIndex = Number.isInteger(index) ? index : null;
        this.syncDeckTooling(false);
    }

    updateDeckTimelineSetting(patch) {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const result = CREATE_PAGE_DECK_ACTIONS.updateTimelineSetting(
            draft,
            patch,
            (timeline) => this.normalizeDeckTimeline(timeline)
        );
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
    }

    addDeckMarker() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const marker = this.getDeckMarkerFormValue();
        const result = CREATE_PAGE_DECK_ACTIONS.appendMarker(
            draft,
            marker,
            (timeline) => this.normalizeDeckTimeline(timeline)
        );
        this.selectedDeckMarkerIndex = result.selectedDeckMarkerIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
    }

    buildDeckNavigationMarkers() {
        return CREATE_PAGE_DECK_GENERATORS
            .buildNavigationMarkers(this.currentSlides, {
                getLabel: (slide, index) => this.normalizeSlideText(slide?.title, 80) || this.t('slideTitle', { index: index + 1 })
            })
            .map((marker, index) => this.normalizeDeckMarker(marker, index))
            .filter(Boolean);
    }

    buildDeckEditMarkers() {
        return CREATE_PAGE_DECK_GENERATORS
            .buildEditMarkers(this.currentSlides, {
                locale: this.locale,
                getLabel: (slide, index, reason) => {
                    const fallback = this.t('deckMarkerSceneOption', { index: index + 1 });
                    const title = this.normalizeSlideText(slide?.title, 80) || fallback;
                    const reasonLabel = {
                        media: this.t('deckEditCueMedia'),
                        code: this.t('deckEditCueCode'),
                        transition: this.t('deckEditCueTransition'),
                        motion: this.t('deckEditCueMotion')
                    }[reason] || this.t('deckMarkerKindEdit');

                    return `${reasonLabel} 路 ${title}`;
                }
            })
            .map((marker, index) => this.normalizeDeckMarker(marker, index))
            .filter(Boolean);
    }

    buildDeckNarrationMarkers(entries) {
        return CREATE_PAGE_DECK_GENERATORS
            .buildNarrationMarkers(entries, this.currentSlides, {
                locale: this.locale,
                getLabel: (entry, slide, sceneIndex) => {
                    const fallback = this.t('deckMarkerSceneOption', { index: sceneIndex + 1 });
                    const title = this.normalizeSlideText(slide?.title, 80) || fallback;
                    const cueText = Array.isArray(entry?.cues) && entry.cues[0]?.text
                        ? this.normalizeSlideText(entry.cues[0].text, 48)
                        : '';

                    return cueText
                        ? `${title} 路 ${cueText}`
                        : title;
                }
            })
            .map((marker, index) => this.normalizeDeckMarker(marker, index))
            .filter(Boolean);
    }

    generateDeckNavigationMarkers() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const navigationMarkers = this.buildDeckNavigationMarkers();
        const result = CREATE_PAGE_DECK_ACTIONS.replaceMarkerKinds(
            draft,
            'navigation',
            navigationMarkers,
            (timeline) => this.normalizeDeckTimeline(timeline)
        );
        this.selectedDeckMarkerIndex = result.selectedDeckMarkerIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckMarkersGenerated', { count: navigationMarkers.length }));
    }

    generateDeckEditMarkers() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const timeline = this.normalizeDeckTimeline(draft.timeline);
        const preservedMarkers = timeline.markers.filter((marker) => marker.kind !== 'edit');
        const editMarkers = CREATE_PAGE_DECK_GENERATORS
            .buildEditMarkers(this.currentSlides, {
                locale: this.locale,
                getLabel: (slide, index, reason) => {
                    const fallback = this.t('deckMarkerSceneOption', { index: index + 1 });
                    const title = this.normalizeSlideText(slide?.title, 80) || fallback;
                    const reasonLabel = {
                        media: this.t('deckEditCueMedia'),
                        code: this.t('deckEditCueCode'),
                        transition: this.t('deckEditCueTransition'),
                        motion: this.t('deckEditCueMotion')
                    }[reason] || this.t('deckMarkerKindEdit');

                    return `${reasonLabel} · ${title}`;
                }
            })
            .map((marker, index) => this.normalizeDeckMarker(marker, index))
            .filter(Boolean);

        draft.timeline = {
            ...timeline,
            markers: [...preservedMarkers, ...editMarkers]
        };
        this.selectedDeckMarkerIndex = editMarkers.length > 0
            ? preservedMarkers.length
            : null;
        this.writeDeckDraftToEditor(draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckEditMarkersGenerated', { count: editMarkers.length }));
    }

    generateDeckMarkerSuite() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const existingEntries = this.normalizeDeckSceneVoiceoverList(draft.sceneVoiceover);
        const suiteMarkers = [
            ...this.buildDeckNavigationMarkers(),
            ...this.buildDeckEditMarkers(),
            ...this.buildDeckNarrationMarkers(existingEntries)
        ];
        const result = CREATE_PAGE_DECK_ACTIONS.replaceMarkerKinds(
            draft,
            ['navigation', 'edit', 'narration'],
            suiteMarkers,
            (timeline) => this.normalizeDeckTimeline(timeline)
        );

        this.selectedDeckMarkerIndex = result.selectedDeckMarkerIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckMarkerSuiteGenerated', { count: suiteMarkers.length }));
    }

    clearGeneratedDeckMarkers() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const result = CREATE_PAGE_DECK_ACTIONS.clearGeneratedMarkers(
            draft,
            (timeline) => this.normalizeDeckTimeline(timeline)
        );
        this.selectedDeckMarkerIndex = result.selectedDeckMarkerIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckMarkersCleared', { count: result.clearedCount }));
    }

    generateDeckVoiceoverPlaceholders() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const existingEntries = this.normalizeDeckSceneVoiceoverList(draft.sceneVoiceover);
        const generated = CREATE_PAGE_DECK_GENERATORS.mergeGeneratedVoiceoverEntries(
            this.currentSlides,
            existingEntries,
            { locale: this.locale }
        );

        const result = CREATE_PAGE_DECK_ACTIONS.replaceVoiceoverEntries(
            draft,
            this.normalizeDeckSceneVoiceoverList(generated.entries)
        );
        if (!Number.isInteger(this.selectedDeckVoiceoverSceneIndex) || this.selectedDeckVoiceoverSceneIndex < 0) {
            this.selectedDeckVoiceoverSceneIndex = 0;
        }
        this.selectedDeckCueIndex = null;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckVoiceoverGenerated', { count: generated.generatedCount }));
    }

    clearGeneratedDeckVoiceover() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const result = CREATE_PAGE_DECK_ACTIONS.clearGeneratedVoiceover(
            draft,
            (entries) => this.normalizeDeckSceneVoiceoverList(entries)
        );
        this.selectedDeckCueIndex = result.selectedDeckCueIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckVoiceoverCleared', { count: result.clearedCount }));
    }

    applyDeckTimelineStarter() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const existingEntries = this.normalizeDeckSceneVoiceoverList(draft.sceneVoiceover);
        const template = this.normalizeDeckTimelineStarterTemplate(this.deckTimelineStarterTemplate);
        const starter = CREATE_PAGE_DECK_STARTERS.buildTimelineStarter({
            slides: this.currentSlides,
            purposeKey: this.getStarterPurposeKey(),
            locale: this.locale,
            template,
            existingEntries
        });
        starter.timeline.markers = starter.timeline.markers
            .map((marker, index) => this.normalizeDeckMarker(marker, index))
            .filter(Boolean);
        starter.sceneVoiceover = this.normalizeDeckSceneVoiceoverList(starter.sceneVoiceover);
        const result = CREATE_PAGE_DECK_ACTIONS.applyTimelineStarter(draft, starter, {
            normalizeTimeline: (timeline) => this.normalizeDeckTimeline(timeline),
            normalizeSceneVoiceoverList: (entries) => this.normalizeDeckSceneVoiceoverList(entries),
            selectedDeckVoiceoverSceneIndex: this.selectedDeckVoiceoverSceneIndex
        });

        this.selectedDeckMarkerIndex = result.selectedDeckMarkerIndex;
        this.selectedDeckVoiceoverSceneIndex = result.selectedDeckVoiceoverSceneIndex;
        this.selectedDeckCueIndex = result.selectedDeckCueIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckTimelineStarterApplied', {
            template: this.getDeckTimelineStarterLabel(template),
            markers: starter.timeline.markers.length,
            voiceover: starter.sceneVoiceover.length
        }));
    }

    resetDeckTimelineStarter() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const timeline = this.normalizeDeckTimeline(draft.timeline);
        const sceneVoiceover = this.normalizeDeckSceneVoiceoverList(draft.sceneVoiceover);
        const starterState = this.getDeckTimelineStarterGeneratedState(timeline, sceneVoiceover);
        const result = CREATE_PAGE_DECK_ACTIONS.resetTimelineStarter(draft, {
            normalizeTimeline: (input) => this.normalizeDeckTimeline(input),
            normalizeSceneVoiceoverList: (entries) => this.normalizeDeckSceneVoiceoverList(entries)
        });

        this.selectedDeckMarkerIndex = result.selectedDeckMarkerIndex;
        this.selectedDeckCueIndex = result.selectedDeckCueIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckTimelineStarterResetDone', {
            markers: starterState.markerCount,
            voiceover: starterState.voiceoverCount
        }));
    }

    generateDeckNarrationMarkers() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const existingEntries = this.normalizeDeckSceneVoiceoverList(draft.sceneVoiceover);
        const narrationMarkers = this.buildDeckNarrationMarkers(existingEntries);
        const result = CREATE_PAGE_DECK_ACTIONS.replaceMarkerKinds(
            draft,
            'narration',
            narrationMarkers,
            (timeline) => this.normalizeDeckTimeline(timeline)
        );
        this.selectedDeckMarkerIndex = result.selectedDeckMarkerIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckNarrationMarkersGenerated', { count: narrationMarkers.length }));
    }

    applySelectedDeckMarker() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const marker = this.getDeckMarkerFormValue();
        const result = CREATE_PAGE_DECK_ACTIONS.upsertMarker(
            draft,
            marker,
            this.selectedDeckMarkerIndex,
            (timeline) => this.normalizeDeckTimeline(timeline)
        );
        this.selectedDeckMarkerIndex = result.selectedDeckMarkerIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
    }

    removeSelectedDeckMarker() {
        if (!Number.isInteger(this.selectedDeckMarkerIndex)) {
            return;
        }

        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const result = CREATE_PAGE_DECK_ACTIONS.removeMarker(
            draft,
            this.selectedDeckMarkerIndex,
            (timeline) => this.normalizeDeckTimeline(timeline)
        );
        this.selectedDeckMarkerIndex = result.selectedDeckMarkerIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
    }

    addDeckAudioTrack() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const track = this.getDeckAudioFormValue(true);
        if (!track) {
            return;
        }

        const result = CREATE_PAGE_DECK_ACTIONS.addAudioTrack(
            draft,
            track,
            (timeline) => this.normalizeDeckTimeline(timeline)
        );
        this.selectedDeckAudioIndex = result.selectedDeckAudioIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
    }

    applySelectedDeckAudioTrack() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const track = this.getDeckAudioFormValue(true);
        if (!track) {
            return;
        }

        const result = CREATE_PAGE_DECK_ACTIONS.upsertAudioTrack(
            draft,
            track,
            this.selectedDeckAudioIndex,
            (timeline) => this.normalizeDeckTimeline(timeline)
        );
        this.selectedDeckAudioIndex = result.selectedDeckAudioIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
    }

    removeSelectedDeckAudioTrack() {
        if (!Number.isInteger(this.selectedDeckAudioIndex)) {
            return;
        }

        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const result = CREATE_PAGE_DECK_ACTIONS.removeAudioTrack(
            draft,
            this.selectedDeckAudioIndex,
            (timeline) => this.normalizeDeckTimeline(timeline)
        );
        this.selectedDeckAudioIndex = result.selectedDeckAudioIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
    }

    updateDeckVoiceoverSceneDraft({ sync = false } = {}) {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const sceneIndex = this.getSelectedDeckVoiceoverSceneIndex();
        const existingEntries = this.normalizeDeckSceneVoiceoverList(draft.sceneVoiceover);
        const existingEntry = existingEntries.find((entry) => entry.sceneIndex === sceneIndex) || null;
        const nextEntry = this.getDeckVoiceoverEntryFromForm(existingEntry);
        const result = CREATE_PAGE_DECK_ACTIONS.upsertVoiceoverScene(
            draft,
            sceneIndex,
            nextEntry,
            (entries) => this.normalizeDeckSceneVoiceoverList(entries)
        );
        this.writeDeckDraftToEditor(result.draft);

        if (sync) {
            this.syncDeckTooling(false);
        }
    }

    copyPreviousDeckVoiceoverScene() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const sceneIndex = this.getSelectedDeckVoiceoverSceneIndex();
        const existingEntries = this.normalizeDeckSceneVoiceoverList(draft.sceneVoiceover);
        const previousEntry = this.getAdjacentDeckVoiceoverEntry(existingEntries, sceneIndex, 'prev');

        if (!previousEntry) {
            this.notify(this.t('deckVoiceoverCopyPrevMissing'), 'error');
            return;
        }

        const nextEntry = CREATE_PAGE_DECK_VOICEOVER_FLOW.buildCopiedVoiceoverEntry(previousEntry, sceneIndex, {
            normalizeSceneVoiceover: (entry, index) => this.normalizeDeckSceneVoiceover(entry, index)
        });
        const result = CREATE_PAGE_DECK_ACTIONS.upsertVoiceoverScene(
            draft,
            sceneIndex,
            nextEntry,
            (entries) => this.normalizeDeckSceneVoiceoverList(entries)
        );

        this.selectedDeckCueIndex = null;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckVoiceoverCopied'));
    }

    copyNextDeckVoiceoverScene() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const sceneIndex = this.getSelectedDeckVoiceoverSceneIndex();
        const existingEntries = this.normalizeDeckSceneVoiceoverList(draft.sceneVoiceover);
        const nextSourceEntry = this.getAdjacentDeckVoiceoverEntry(existingEntries, sceneIndex, 'next');

        if (!nextSourceEntry) {
            this.notify(this.t('deckVoiceoverCopyNextMissing'), 'error');
            return;
        }

        const nextEntry = CREATE_PAGE_DECK_VOICEOVER_FLOW.buildCopiedVoiceoverEntry(nextSourceEntry, sceneIndex, {
            normalizeSceneVoiceover: (entry, index) => this.normalizeDeckSceneVoiceover(entry, index)
        });
        const result = CREATE_PAGE_DECK_ACTIONS.upsertVoiceoverScene(
            draft,
            sceneIndex,
            nextEntry,
            (entries) => this.normalizeDeckSceneVoiceoverList(entries)
        );

        this.selectedDeckCueIndex = null;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckVoiceoverCopiedNext'));
    }

    getDeckCueSceneContext(draft) {
        return CREATE_PAGE_DECK_VOICEOVER_FLOW.buildCueSceneContext({
            sceneIndex: this.getSelectedDeckVoiceoverSceneIndex(),
            sceneVoiceover: draft?.sceneVoiceover,
            slideDurationMs: this.currentSlides?.[this.getSelectedDeckVoiceoverSceneIndex()]?.durationMs || 0,
            normalizeSceneVoiceoverList: (entries) => this.normalizeDeckSceneVoiceoverList(entries),
            readVoiceoverEntryFromForm: (existingEntry) => this.getDeckVoiceoverEntryFromForm(existingEntry)
        });
    }

    buildDeckCueSetFromVoiceoverText(voiceoverText, slideDurationMs) {
        return CREATE_PAGE_DECK_VOICEOVER_FLOW.buildCueSetFromText(voiceoverText, {
            durationMs: slideDurationMs,
            normalizeCue: (cue, index) => this.normalizeDeckCue(cue, index)
        });
    }

    generateDeckCueSet() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const {
            sceneIndex,
            voiceoverText,
            slideDurationMs
        } = this.getDeckCueSceneContext(draft);

        if (!voiceoverText) {
            this.notify(this.t('deckCueGenerateMissingVoiceover'), 'error');
            return;
        }

        const generatedCues = this.buildDeckCueSetFromVoiceoverText(voiceoverText, slideDurationMs);

        const result = CREATE_PAGE_DECK_ACTIONS.replaceSceneCues(draft, sceneIndex, generatedCues, {
            normalizeSceneVoiceoverList: (entries) => this.normalizeDeckSceneVoiceoverList(entries),
            normalizeSceneVoiceover: (entry, index) => this.normalizeDeckSceneVoiceover(entry, index),
            getDefaultVoiceover: (index) => this.getDefaultDeckVoiceover(index),
            language: this.elements.deckVoiceoverLanguageSelect?.value,
            text: voiceoverText
        });

        this.selectedDeckCueIndex = result.selectedDeckCueIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckCueGenerated', { count: generatedCues.length }));
    }

    appendDeckCueSet() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const {
            sceneIndex,
            existingEntry,
            voiceoverText,
            slideDurationMs
        } = this.getDeckCueSceneContext(draft);

        if (!voiceoverText) {
            this.notify(this.t('deckCueGenerateMissingVoiceover'), 'error');
            return;
        }

        const generatedCues = this.buildDeckCueSetFromVoiceoverText(voiceoverText, slideDurationMs);
        const mergedCues = CREATE_PAGE_DECK_VOICEOVER_FLOW.appendCueSet(
            existingEntry?.cues || [],
            generatedCues,
            {
                stepMs: slideDurationMs > 0 && generatedCues.length > 0
                    ? Math.max(600, Math.floor(slideDurationMs / Math.max(generatedCues.length, 1)))
                    : 1200,
                normalizeCue: (cue, index) => this.normalizeDeckCue(cue, index)
            }
        );
        const appendedCount = Math.max(0, mergedCues.length - (Array.isArray(existingEntry?.cues) ? existingEntry.cues.length : 0));

        if (appendedCount === 0) {
            this.notify(this.t('deckCueAppendNoNew'));
            return;
        }

        const result = CREATE_PAGE_DECK_ACTIONS.replaceSceneCues(draft, sceneIndex, mergedCues, {
            normalizeSceneVoiceoverList: (entries) => this.normalizeDeckSceneVoiceoverList(entries),
            normalizeSceneVoiceover: (entry, index) => this.normalizeDeckSceneVoiceover(entry, index),
            getDefaultVoiceover: (index) => this.getDefaultDeckVoiceover(index),
            language: this.elements.deckVoiceoverLanguageSelect?.value,
            text: voiceoverText
        });

        this.selectedDeckCueIndex = result.selectedDeckCueIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckCueAppended', { count: appendedCount }));
    }

    retimeDeckCues() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const {
            sceneIndex,
            existingEntry,
            voiceoverText,
            slideDurationMs
        } = this.getDeckCueSceneContext(draft);
        const existingCues = Array.isArray(existingEntry?.cues) ? existingEntry.cues : [];

        if (existingCues.length === 0) {
            this.notify(this.t('deckCueRetimeEmpty'), 'error');
            return;
        }

        const retimedCues = CREATE_PAGE_DECK_VOICEOVER_FLOW.retimeCueSet(existingCues, {
            durationMs: slideDurationMs,
            normalizeCue: (cue, index) => this.normalizeDeckCue(cue, index)
        });

        const result = CREATE_PAGE_DECK_ACTIONS.replaceSceneCues(draft, sceneIndex, retimedCues, {
            normalizeSceneVoiceoverList: (entries) => this.normalizeDeckSceneVoiceoverList(entries),
            normalizeSceneVoiceover: (entry, index) => this.normalizeDeckSceneVoiceover(entry, index),
            getDefaultVoiceover: (index) => this.getDefaultDeckVoiceover(index),
            language: this.elements.deckVoiceoverLanguageSelect?.value,
            text: voiceoverText || this.elements.deckVoiceoverTextInput?.value || existingEntry?.text || ''
        });

        this.selectedDeckCueIndex = result.selectedDeckCueIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckCueRetimed', { count: retimedCues.length }));
    }

    addDeckCue() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const cue = this.getDeckCueFormValue(true);
        if (!cue) {
            return;
        }

        const sceneIndex = this.getSelectedDeckVoiceoverSceneIndex();
        const result = CREATE_PAGE_DECK_ACTIONS.upsertCue(draft, sceneIndex, cue, null, {
            normalizeSceneVoiceoverList: (entries) => this.normalizeDeckSceneVoiceoverList(entries),
            normalizeSceneVoiceover: (entry, index) => this.normalizeDeckSceneVoiceover(entry, index),
            getDefaultVoiceover: (index) => this.getDefaultDeckVoiceover(index),
            language: this.elements.deckVoiceoverLanguageSelect?.value,
            text: this.elements.deckVoiceoverTextInput?.value
        });
        this.selectedDeckCueIndex = result.selectedDeckCueIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
    }

    applySelectedDeckCue() {
        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const cue = this.getDeckCueFormValue(true);
        if (!cue) {
            return;
        }

        const sceneIndex = this.getSelectedDeckVoiceoverSceneIndex();
        const result = CREATE_PAGE_DECK_ACTIONS.upsertCue(draft, sceneIndex, cue, this.selectedDeckCueIndex, {
            normalizeSceneVoiceoverList: (entries) => this.normalizeDeckSceneVoiceoverList(entries),
            normalizeSceneVoiceover: (entry, index) => this.normalizeDeckSceneVoiceover(entry, index),
            getDefaultVoiceover: (index) => this.getDefaultDeckVoiceover(index),
            language: this.elements.deckVoiceoverLanguageSelect?.value,
            text: this.elements.deckVoiceoverTextInput?.value
        });
        this.selectedDeckCueIndex = result.selectedDeckCueIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
    }

    duplicateSelectedDeckCue() {
        if (!Number.isInteger(this.selectedDeckCueIndex)) {
            return;
        }

        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const sceneIndex = this.getSelectedDeckVoiceoverSceneIndex();
        const existingEntries = this.normalizeDeckSceneVoiceoverList(draft.sceneVoiceover);
        const activeEntry = existingEntries.find((entry) => entry.sceneIndex === sceneIndex) || null;
        const activeCue = Array.isArray(activeEntry?.cues)
            ? activeEntry.cues[this.selectedDeckCueIndex]
            : null;

        if (!activeCue) {
            return;
        }

        const duplicatedCue = CREATE_PAGE_DECK_VOICEOVER_FLOW.buildDuplicatedCue(activeCue, {
            selectedIndex: Array.isArray(activeEntry?.cues) ? activeEntry.cues.length : 0,
            normalizeCue: (cue, index) => this.normalizeDeckCue(cue, index)
        });

        if (!duplicatedCue) {
            return;
        }

        const result = CREATE_PAGE_DECK_ACTIONS.upsertCue(draft, sceneIndex, duplicatedCue, null, {
            normalizeSceneVoiceoverList: (entries) => this.normalizeDeckSceneVoiceoverList(entries),
            normalizeSceneVoiceover: (entry, index) => this.normalizeDeckSceneVoiceover(entry, index),
            getDefaultVoiceover: (index) => this.getDefaultDeckVoiceover(index),
            language: this.elements.deckVoiceoverLanguageSelect?.value,
            text: this.elements.deckVoiceoverTextInput?.value
        });
        this.selectedDeckCueIndex = result.selectedDeckCueIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
        this.notify(this.t('deckCueDuplicated'));
    }

    removeSelectedDeckCue() {
        if (!Number.isInteger(this.selectedDeckCueIndex)) {
            return;
        }

        const draft = this.getDeckDraftFromEditor(true);
        if (!draft) {
            return;
        }

        const sceneIndex = this.getSelectedDeckVoiceoverSceneIndex();
        const result = CREATE_PAGE_DECK_ACTIONS.removeCue(draft, sceneIndex, this.selectedDeckCueIndex, {
            normalizeSceneVoiceoverList: (entries) => this.normalizeDeckSceneVoiceoverList(entries),
            normalizeSceneVoiceover: (entry, index) => this.normalizeDeckSceneVoiceover(entry, index),
            language: this.elements.deckVoiceoverLanguageSelect?.value,
            text: this.elements.deckVoiceoverTextInput?.value
        });
        this.selectedDeckCueIndex = result.selectedDeckCueIndex;
        this.writeDeckDraftToEditor(result.draft);
        this.syncDeckTooling(false);
    }

    formatDeckAudioTime(ms) {
        const numeric = Number.isFinite(Number(ms)) ? Math.max(0, Number(ms)) : 0;
        if (numeric % 1000 === 0) {
            return `${numeric / 1000}s`;
        }

        return `${(numeric / 1000).toFixed(1)}s`;
    }

    syncDeckTooling(resetSelection = false) {
        if (this.modalMode !== 'deck' || !this.elements.deckTooling) {
            return;
        }

        const draft = this.getDeckDraftFromEditor(false);
        if (!draft) {
            CREATE_PAGE_DECK_UI.applyInvalidState({
                message: this.t('invalidJson'),
                buttons: [
                    this.elements.deckMarkerApplyBtn,
                    this.elements.deckMarkerRemoveBtn,
                    this.elements.deckMarkerGenerateEditBtn,
                    this.elements.deckMarkerGenerateSuiteBtn,
                    this.elements.deckMarkerClearGeneratedBtn,
                    this.elements.deckAudioTemplateApplyBtn,
                    this.elements.deckAudioApplyBtn,
                    this.elements.deckAudioDuplicateBtn,
                    this.elements.deckAudioRemoveBtn,
                    this.elements.deckCueApplyBtn,
                    this.elements.deckCueDuplicateBtn,
                    this.elements.deckCueRemoveBtn,
                    this.elements.deckVoiceoverCopyPrevBtn,
                    this.elements.deckVoiceoverCopyNextBtn,
                    this.elements.deckVoiceoverClearGeneratedBtn,
                    this.elements.deckCueGenerateBtn,
                    this.elements.deckCueAppendBtn,
                    this.elements.deckCueRetimeBtn,
                    this.elements.deckTimelineStarterResetBtn
                ],
                containers: [
                    this.elements.deckMarkerList,
                    this.elements.deckAudioList,
                    this.elements.deckCueList,
                    this.elements.deckTimelineStarterSummary
                ],
                renderEmptyState: (message) => CREATE_PAGE_DECK_RENDERING.renderEmptyState(
                    message,
                    this.escapeHtml.bind(this)
                )
            });
            return;
        }

        const timeline = this.normalizeDeckTimeline(draft.timeline);
        const sceneVoiceover = this.normalizeDeckSceneVoiceoverList(draft.sceneVoiceover);
        const sceneCount = Math.max(1, this.currentSlides.length || 1);
        const starterState = this.getDeckTimelineStarterGeneratedState(timeline, sceneVoiceover);

        if (this.elements.deckTimelineEnabled) {
            this.elements.deckTimelineEnabled.checked = timeline.enabled !== false;
        }

        if (this.elements.deckTimelineAutoplay) {
            this.elements.deckTimelineAutoplay.checked = timeline.autoplay === true;
        }

        if (this.elements.deckSubtitleModeSelect) {
            this.elements.deckSubtitleModeSelect.value = timeline.subtitleMode || 'voiceover-placeholder';
        }

        if (this.elements.deckTimelineStarterSelect) {
            this.elements.deckTimelineStarterSelect.value = this.normalizeDeckTimelineStarterTemplate(this.deckTimelineStarterTemplate);
        }

        if (this.elements.deckAudioTemplateSelect) {
            this.elements.deckAudioTemplateSelect.value = this.normalizeDeckAudioPresetKey(this.deckAudioTemplateKey);
        }

        if (this.elements.deckTimelineStarterSummary) {
            this.elements.deckTimelineStarterSummary.innerHTML = this.renderDeckStarterSummary(starterState);
        }

        CREATE_PAGE_DECK_UI.renderSceneOptions(
            this.elements.deckMarkerSceneSelect,
            sceneCount,
            (index) => this.getMarkerSceneLabel(index),
            this.escapeHtml.bind(this)
        );

        CREATE_PAGE_DECK_UI.renderSceneOptions(
            this.elements.deckVoiceoverSceneSelect,
            sceneCount,
            (index) => this.getMarkerSceneLabel(index),
            this.escapeHtml.bind(this)
        );

        const resolvedDeckSelection = CREATE_PAGE_DECK_STATE.resolveSelectionState({
            resetSelection,
            timeline,
            sceneVoiceover,
            sceneCount,
            selectedDeckMarkerIndex: this.selectedDeckMarkerIndex,
            selectedDeckAudioIndex: this.selectedDeckAudioIndex,
            selectedDeckVoiceoverSceneIndex: this.selectedDeckVoiceoverSceneIndex,
            selectedDeckCueIndex: this.selectedDeckCueIndex,
            createDefaultVoiceover: (sceneIndex) => this.getDefaultDeckVoiceover(sceneIndex)
        });

        this.selectedDeckMarkerIndex = resolvedDeckSelection.selectedDeckMarkerIndex;
        this.selectedDeckAudioIndex = resolvedDeckSelection.selectedDeckAudioIndex;
        this.selectedDeckVoiceoverSceneIndex = resolvedDeckSelection.selectedDeckVoiceoverSceneIndex;
        this.selectedDeckCueIndex = resolvedDeckSelection.selectedDeckCueIndex;

        const activeMarker = Number.isInteger(this.selectedDeckMarkerIndex)
            ? timeline.markers[this.selectedDeckMarkerIndex]
            : this.getDefaultDeckMarker();
        this.applyDeckMarkerForm(activeMarker);

        if (this.elements.deckMarkerApplyBtn) {
            this.elements.deckMarkerApplyBtn.disabled = !Number.isInteger(this.selectedDeckMarkerIndex);
        }

        if (this.elements.deckMarkerRemoveBtn) {
            this.elements.deckMarkerRemoveBtn.disabled = !Number.isInteger(this.selectedDeckMarkerIndex);
        }

        if (this.elements.deckMarkerClearGeneratedBtn) {
            this.elements.deckMarkerClearGeneratedBtn.disabled = !timeline.markers.some((marker) => marker.generated === true);
        }

        if (this.elements.deckMarkerGenerateEditBtn) {
            this.elements.deckMarkerGenerateEditBtn.disabled = this.currentSlides.length === 0;
        }

        if (this.elements.deckMarkerGenerateSuiteBtn) {
            this.elements.deckMarkerGenerateSuiteBtn.disabled = this.currentSlides.length === 0;
        }

        const activeAudioTrack = Number.isInteger(this.selectedDeckAudioIndex)
            ? timeline.audioTracks[this.selectedDeckAudioIndex]
            : this.getDefaultDeckAudioTrack();
        this.applyDeckAudioForm(activeAudioTrack);

        if (this.elements.deckAudioApplyBtn) {
            this.elements.deckAudioApplyBtn.disabled = !Number.isInteger(this.selectedDeckAudioIndex);
        }

        if (this.elements.deckAudioRemoveBtn) {
            this.elements.deckAudioRemoveBtn.disabled = !Number.isInteger(this.selectedDeckAudioIndex);
        }

        if (this.elements.deckAudioDuplicateBtn) {
            this.elements.deckAudioDuplicateBtn.disabled = !Number.isInteger(this.selectedDeckAudioIndex);
        }

        if (this.elements.deckAudioTemplateApplyBtn) {
            this.elements.deckAudioTemplateApplyBtn.disabled = false;
        }

        const activeVoiceoverEntry = resolvedDeckSelection.activeVoiceoverEntry;
        const activeVoiceoverCues = resolvedDeckSelection.activeVoiceoverCues;

        this.applyDeckVoiceoverForm(activeVoiceoverEntry);
        this.applyDeckCueForm(
            Number.isInteger(this.selectedDeckCueIndex)
                ? activeVoiceoverCues[this.selectedDeckCueIndex]
                : null
        );

        if (this.elements.deckCueApplyBtn) {
            this.elements.deckCueApplyBtn.disabled = !Number.isInteger(this.selectedDeckCueIndex);
        }

        if (this.elements.deckCueGenerateBtn) {
            this.elements.deckCueGenerateBtn.disabled = !String(activeVoiceoverEntry?.text || '').trim();
        }

        if (this.elements.deckCueAppendBtn) {
            this.elements.deckCueAppendBtn.disabled = !String(activeVoiceoverEntry?.text || '').trim();
        }

        if (this.elements.deckCueDuplicateBtn) {
            this.elements.deckCueDuplicateBtn.disabled = !Number.isInteger(this.selectedDeckCueIndex);
        }

        if (this.elements.deckCueRetimeBtn) {
            this.elements.deckCueRetimeBtn.disabled = activeVoiceoverCues.length === 0;
        }

        if (this.elements.deckCueRemoveBtn) {
            this.elements.deckCueRemoveBtn.disabled = !Number.isInteger(this.selectedDeckCueIndex);
        }

        if (this.elements.deckVoiceoverCopyPrevBtn) {
            this.elements.deckVoiceoverCopyPrevBtn.disabled = !this.getAdjacentDeckVoiceoverEntry(
                sceneVoiceover,
                this.selectedDeckVoiceoverSceneIndex,
                'prev'
            );
        }

        if (this.elements.deckVoiceoverCopyNextBtn) {
            this.elements.deckVoiceoverCopyNextBtn.disabled = !this.getAdjacentDeckVoiceoverEntry(
                sceneVoiceover,
                this.selectedDeckVoiceoverSceneIndex,
                'next'
            );
        }

        if (this.elements.deckVoiceoverClearGeneratedBtn) {
            this.elements.deckVoiceoverClearGeneratedBtn.disabled = !sceneVoiceover.some((entry) => entry.generated === true);
        }

        if (this.elements.deckTimelineStarterResetBtn) {
            this.elements.deckTimelineStarterResetBtn.disabled = !starterState.hasStarter;
        }

        CREATE_PAGE_DECK_UI.renderSelectable({
            items: timeline.markers,
            container: this.elements.deckMarkerList,
            emptyMessage: this.t('deckMarkerEmpty'),
            renderEmptyState: (message) => CREATE_PAGE_DECK_RENDERING.renderEmptyState(
                message,
                this.escapeHtml.bind(this)
            ),
            renderSelectableList: CREATE_PAGE_DECK_SYNC.renderSelectableList,
            renderHtml: () => CREATE_PAGE_DECK_RENDERING.renderMarkerList({
                markers: timeline.markers,
                selectedIndex: this.selectedDeckMarkerIndex,
                placeholderText: this.t('deckMarkerPlaceholder'),
                getSceneLabel: (sceneIndex) => this.getMarkerSceneLabel(sceneIndex),
                getKindLabel: (kind) => (
                    kind === 'edit'
                        ? this.t('deckMarkerKindEdit')
                        : kind === 'narration'
                            ? this.t('deckMarkerKindNarration')
                            : this.t('deckMarkerKindNavigation')
                ),
                getAnchorLabel: (anchor) => (
                    anchor === 'exit'
                        ? this.t('deckMarkerAnchorExit')
                        : anchor === 'advance'
                            ? this.t('deckMarkerAnchorAdvance')
                            : this.t('deckMarkerAnchorStart')
                ),
                escapeHtml: this.escapeHtml.bind(this)
            }),
            selector: '[data-marker-index]',
            datasetKey: 'markerIndex',
            onSelect: (index) => this.setSelectedDeckMarker(index)
        });

        CREATE_PAGE_DECK_UI.renderSelectable({
            items: timeline.audioTracks,
            container: this.elements.deckAudioList,
            emptyMessage: this.t('deckAudioEmpty'),
            renderEmptyState: (message) => CREATE_PAGE_DECK_RENDERING.renderEmptyState(
                message,
                this.escapeHtml.bind(this)
            ),
            renderSelectableList: CREATE_PAGE_DECK_SYNC.renderSelectableList,
            renderHtml: () => CREATE_PAGE_DECK_RENDERING.renderAudioList({
                audioTracks: timeline.audioTracks,
                selectedIndex: this.selectedDeckAudioIndex,
                formatTime: (ms) => this.formatDeckAudioTime(ms),
                getStartLabel: (time) => this.t('deckAudioMetaStart', { time }),
                getAutoplayLabel: () => this.t('deckAudioMetaAutoplay'),
                getLoopLabel: () => this.t('deckAudioMetaLoop'),
                escapeHtml: this.escapeHtml.bind(this)
            }),
            selector: '[data-audio-index]',
            datasetKey: 'audioIndex',
            onSelect: (index) => this.setSelectedDeckAudioTrack(index)
        });

        CREATE_PAGE_DECK_UI.renderSelectable({
            items: activeVoiceoverCues,
            container: this.elements.deckCueList,
            emptyMessage: this.t('deckCueEmpty'),
            renderEmptyState: (message) => CREATE_PAGE_DECK_RENDERING.renderEmptyState(
                message,
                this.escapeHtml.bind(this)
            ),
            renderSelectableList: CREATE_PAGE_DECK_SYNC.renderSelectableList,
            renderHtml: () => CREATE_PAGE_DECK_RENDERING.renderCueList({
                cues: activeVoiceoverCues,
                selectedIndex: this.selectedDeckCueIndex,
                formatTime: (ms) => this.formatDeckAudioTime(ms),
                getAtLabel: (time) => this.t('deckCueMetaAt', { time }),
                escapeHtml: this.escapeHtml.bind(this)
            }),
            selector: '[data-cue-index]',
            datasetKey: 'cueIndex',
            onSelect: (index) => this.setSelectedDeckCue(index)
        });
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

        this.elements.editText?.addEventListener('input', () => {
            if (this.modalMode === 'deck') {
                this.syncDeckTooling(false);
                return;
            }

        if (this.modalMode === 'slide') {
            this.syncSlideTooling();
        }
    });

        [
            this.elements.slideTypeSelect
        ].forEach((element) => {
            element?.addEventListener('change', () => this.updateSlideDraftFromTooling());
        });

        [
            this.elements.slideTitleInput,
            this.elements.slideSubtitleInput,
            this.elements.slideContentInput
        ].forEach((element) => {
            element?.addEventListener('input', () => this.updateSlideDraftFromTooling());
        });

        [
            this.elements.slideMotionSceneSelect,
            this.elements.slideMotionHeadingSelect,
            this.elements.slideMotionSubtitleSelect,
            this.elements.slideMotionContentSelect,
            this.elements.slideMotionMediaSelect,
            this.elements.slideTransitionPresetSelect,
            this.elements.slideTransitionOverlaySelect
        ].forEach((element) => {
            element?.addEventListener('change', () => this.updateSlideDraftFromTooling());
        });

        this.elements.slideMediaTypeSelect?.addEventListener('change', () => {
            this.updateSlideMediaFieldState(this.elements.slideMediaTypeSelect.value);
            this.updateSlideDraftFromTooling();
        });

        [
            this.elements.slideMediaSourceInput,
            this.elements.slideMediaMimeTypeInput,
            this.elements.slideMediaPosterInput,
            this.elements.slideMediaAltInput,
            this.elements.slideMediaCaptionInput
        ].forEach((element) => {
            element?.addEventListener('input', () => this.updateSlideDraftFromTooling());
        });

        [
            this.elements.slideMediaAutoplay,
            this.elements.slideMediaLoop
        ].forEach((element) => {
            element?.addEventListener('change', () => this.updateSlideDraftFromTooling());
        });

        this.elements.slideDurationInput?.addEventListener('input', () => this.updateSlideDraftFromTooling());
        this.elements.slideVoiceoverLanguageSelect?.addEventListener('change', () => this.updateSlideVoiceoverDraft({ sync: true }));
        this.elements.slideVoiceoverTextInput?.addEventListener('input', () => this.updateSlideVoiceoverDraft({ sync: false }));
        this.elements.slideVoiceoverCueAddBtn?.addEventListener('click', () => this.addSlideVoiceoverCue());
        this.elements.slideVoiceoverCueApplyBtn?.addEventListener('click', () => this.applySelectedSlideVoiceoverCue());
        this.elements.slideVoiceoverCueRemoveBtn?.addEventListener('click', () => this.removeSelectedSlideVoiceoverCue());

        [
            this.elements.slideTransitionDurationInput,
            this.elements.slideTransitionContentDelayInput,
            this.elements.slideTransitionMotionDurationInput,
            this.elements.slideTransitionStaggerInput,
            this.elements.slideTransitionEnterInput,
            this.elements.slideTransitionHoldInput,
            this.elements.slideTransitionExitInput
        ].forEach((element) => {
            element?.addEventListener('input', () => this.updateSlideDraftFromTooling());
        });

        CREATE_PAGE_DECK_BINDINGS.bindDeckToolingEvents(this);
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

    _legacyRenderLoadingCard(message) {
        this.elements.resultArea.innerHTML = `
            <div class="result-card">
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p>${this.escapeHtml(message)}</p>
                </div>
            </div>
        `;
    }

    _legacyRenderClarificationCard(message) {
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

    _legacyRenderOutlineCard() {
        const slideCount = this.currentSlides.length;
        const deckTimelinePills = this.getDeckTimelinePills();
        const activeScenePackLabel = this.getScenePackTemplateLabel(this.scenePackTemplate);

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

    _legacyRenderSuccessCard(record) {
        this.generatedHtml = record.html;
        this.pptxUrl = record.pptxUrl || `/api/presentations/${this.presentationId}/export.pptx`;
        this.lastBuildState = {
            status: 'ready',
            progress: 100,
            step: 5,
            message: this.t('presentationReady')
        };
        this.appendBuildLog(this.lastBuildState.message);
        this.renderBuildCard(this.lastBuildState);

        const sidebar = this.elements.resultArea.querySelector('.build-sidebar');
        if (sidebar) {
            const successPanel = document.createElement('div');
            successPanel.className = 'status-panel';
            successPanel.innerHTML = `
                <div class="status-panel-title">${this.t('availableActions')}</div>
                <div class="status-panel-actions stacked">
                    <button class="result-btn primary" id="openReadyPresentationBtn">
                        <i class="ph ph-monitor-play"></i>
                        ${this.t('openStandalone')}
                    </button>
                    <button class="result-btn" id="downloadPresentationBtn">
                        <i class="ph ph-download-simple"></i>
                        ${this.t('downloadHtml')}
                    </button>
                    <button class="result-btn" id="downloadPptxBtn">
                        <i class="ph ph-file-arrow-down"></i>
                        ${this.t('downloadPptx')}
                    </button>
                </div>
            `;
            sidebar.appendChild(successPanel);
        }

        document.getElementById('openReadyPresentationBtn')?.addEventListener('click', () => this.openPresentationPage());
        document.getElementById('downloadPresentationBtn')?.addEventListener('click', () => this.downloadHTML());
        document.getElementById('downloadPptxBtn')?.addEventListener('click', () => this.downloadPPTX());
    }

    _legacyRenderBuildCard(state = {}) {
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

    _legacyRenderSuccessCard(record) {
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

    _legacyRenderErrorCard(message) {
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
                        timeline: this.currentOutline.timeline || null,
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
            subtitle: slide.subtitle,
            content: slide.content,
            media: slide.media || null,
            animation: slide.animation || null,
            transition: slide.transition || null,
            durationMs: slide.durationMs || null,
            voiceover: slide.voiceover || null
        }, null, 2);
        this.elements.editPrompt.value = '';
        this.elements.editJsonArea.style.display = 'block';
        this.elements.editLoading.style.display = 'none';
        this.elements.regenerateEdit.disabled = false;
        this.elements.editModal.classList.add('active');
    }

    closeEditModal() {
        this.selectedSlideCueIndex = null;
        this.selectedDeckMarkerIndex = null;
        this.selectedDeckAudioIndex = null;
        this.selectedDeckVoiceoverSceneIndex = 0;
        this.selectedDeckCueIndex = null;
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
        const mediaSummary = slide?.media?.source
            ? `${slide.media.type === 'video' ? 'Video' : 'Image'}: ${slide.media.source}`
            : '';
        const animationSummary = slide?.animation?.scene
            ? `Motion: ${slide.animation.scene}`
            : '';
        const durationSummary = slide?.durationMs
            ? `Duration: ${Math.round(Number(slide.durationMs) / 1000)}s`
            : '';
        const voiceoverSummary = slide?.voiceover?.text
            ? 'Voiceover'
            : '';

        if (Array.isArray(slide.content)) {
            return [slide.content.join(' · '), mediaSummary, animationSummary, durationSummary, voiceoverSummary]
                .filter(Boolean)
                .join(' · ');
        }

        if (Array.isArray(slide.items)) {
            return [slide.items.join(' · '), mediaSummary, animationSummary, durationSummary, voiceoverSummary]
                .filter(Boolean)
                .join(' · ');
        }

        return slide.content || mediaSummary || animationSummary || durationSummary || voiceoverSummary || '等待补充内容';
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
        const card = document.querySelector(`.style-preview-card[data-val="${value}"]`);
        return card?.dataset?.styleLabel || card?.querySelector('.style-preview-name')?.textContent?.trim() || '';
    }

    _legacyRenderOutlineCard() {
        const slideCount = this.currentSlides.length;
        const deckTimelinePills = this.getDeckTimelinePills();
        const activeScenePackLabel = this.getScenePackTemplateLabel(this.scenePackTemplate);

        this.elements.resultArea.innerHTML = `
            <div class="result-card">
                <div class="result-header">
                    <div>
                        <div class="result-title">
                            <i class="ph ph-list-checks"></i>
                            ${this.escapeHtml(this.currentOutline?.title || this.t('untitledOutline'))}
                        </div>
                        <p class="result-subtitle">${this.escapeHtml(this.currentOutline?.subtitle || this.t('outlineReadySubtitle'))}</p>
                    </div>
                    <div class="result-btns">
                        <label class="result-select-group" for="outlineInsertTemplateSelect">
                            <span>${this.escapeHtml(this.t('sceneTemplateText'))}</span>
                            <select id="outlineInsertTemplateSelect">
                                ${this.buildSelectOptions(this.getSlideTypeOptions().map((option) => ({
                                    ...option,
                                    selected: option.value === this.insertTemplate
                                })))}
                            </select>
                        </label>
                        <label class="result-select-group" for="outlineScenePackSelect">
                            <span>${this.escapeHtml(this.t('scenePackTemplateText'))}</span>
                            <select id="outlineScenePackSelect">
                                ${this.buildSelectOptions(this.getScenePackOptions().map((option) => ({
                                    ...option,
                                    selected: option.value === this.scenePackTemplate
                                })))}
                            </select>
                        </label>
                        <button class="result-btn" id="addSlideBtn">
                            <i class="ph ph-plus"></i>
                            ${this.t('addSlide')}
                        </button>
                        <button class="result-btn" id="addScenePackBtn">
                            <i class="ph ph-stack"></i>
                            ${this.t('addScenePack')}
                        </button>
                        <button class="result-btn" id="editDeckSettingsBtn">
                            <i class="ph ph-sliders-horizontal"></i>
                            ${this.t('deckSettings')}
                        </button>
                        <button class="result-btn primary" id="generatePresentationBtn">
                            <i class="ph ph-play"></i>
                            ${this.t('generatePresentation')}
                        </button>
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
                                    ${this.isRecentlyInsertedSlide(index)
                                        ? `<span class="slide-badge">${this.escapeHtml(this.getRecentInsertionBadgeLabel(index))}</span>`
                                        : ''}
                                </div>
                                <div class="slide-desc">${this.escapeHtml(this.getSlideSummary(slide))}</div>
                            </div>
                            <div class="slide-actions">
                                <button
                                    class="slide-action-btn"
                                    data-move-up-index="${index}"
                                    title="${this.escapeHtml(this.t('slideActionMoveUp'))}"
                                    aria-label="${this.escapeHtml(this.t('slideActionMoveUp'))}"
                                    ${index === 0 ? 'disabled' : ''}
                                >
                                    <i class="ph ph-arrow-up"></i>
                                </button>
                                <button
                                    class="slide-action-btn"
                                    data-move-down-index="${index}"
                                    title="${this.escapeHtml(this.t('slideActionMoveDown'))}"
                                    aria-label="${this.escapeHtml(this.t('slideActionMoveDown'))}"
                                    ${index === slideCount - 1 ? 'disabled' : ''}
                                >
                                    <i class="ph ph-arrow-down"></i>
                                </button>
                                <button
                                    class="slide-action-btn"
                                    data-insert-index="${index}"
                                    title="${this.escapeHtml(this.t('slideActionInsertAfter'))}"
                                    aria-label="${this.escapeHtml(this.t('slideActionInsertAfter'))}"
                                >
                                    <i class="ph ph-plus"></i>
                                </button>
                                <button
                                    class="slide-action-btn"
                                    data-insert-pack-index="${index}"
                                    title="${this.escapeHtml(this.t('slideActionInsertPackAfter'))}"
                                    aria-label="${this.escapeHtml(this.t('slideActionInsertPackAfter'))}"
                                >
                                    <i class="ph ph-stack"></i>
                                </button>
                                <button
                                    class="slide-action-btn"
                                    data-duplicate-index="${index}"
                                    title="${this.escapeHtml(this.t('slideActionDuplicate'))}"
                                    aria-label="${this.escapeHtml(this.t('slideActionDuplicate'))}"
                                >
                                    <i class="ph ph-copy"></i>
                                </button>
                                <button
                                    class="slide-edit-btn"
                                    data-edit-index="${index}"
                                    title="${this.escapeHtml(this.t('editSlideTitle'))}"
                                    aria-label="${this.escapeHtml(this.t('editSlideTitle'))}"
                                >
                                    <i class="ph ph-pencil-simple"></i>
                                </button>
                                <button
                                    class="slide-action-btn warn"
                                    data-remove-index="${index}"
                                    title="${this.escapeHtml(this.t('slideActionRemove'))}"
                                    aria-label="${this.escapeHtml(this.t('slideActionRemove'))}"
                                    ${slideCount <= 1 ? 'disabled' : ''}
                                >
                                    <i class="ph ph-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

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

        document.getElementById('addSlideBtn')?.addEventListener('click', () => {
            this.insertSlideAt(this.currentSlides.length, this.insertTemplate, 'slideInserted');
        });

        document.getElementById('addScenePackBtn')?.addEventListener('click', () => {
            this.insertScenePackAt(this.currentSlides.length, this.scenePackTemplate, 'scenePackInserted');
        });

        document.getElementById('editDeckSettingsBtn')?.addEventListener('click', () => this.openDeckSettingsModal());
        document.getElementById('generatePresentationBtn')?.addEventListener('click', () => this.generatePresentation());

        this.elements.resultArea.querySelectorAll('[data-edit-index]').forEach((button) => {
            button.addEventListener('click', () => {
                this.openEditModal(Number(button.dataset.editIndex));
            });
        });

        this.elements.resultArea.querySelectorAll('[data-duplicate-index]').forEach((button) => {
            button.addEventListener('click', () => {
                this.duplicateSlide(Number(button.dataset.duplicateIndex));
            });
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
            button.addEventListener('click', () => {
                this.moveSlide(Number(button.dataset.moveUpIndex), 'up');
            });
        });

        this.elements.resultArea.querySelectorAll('[data-move-down-index]').forEach((button) => {
            button.addEventListener('click', () => {
                this.moveSlide(Number(button.dataset.moveDownIndex), 'down');
            });
        });

        this.elements.resultArea.querySelectorAll('[data-remove-index]').forEach((button) => {
            button.addEventListener('click', () => {
                this.removeSlide(Number(button.dataset.removeIndex));
            });
        });
    }

    openEditModal(index) {
        if (!this.currentSlides[index] || !this.elements.editModal) {
            return;
        }

        this.applyModalCopy('slide');
        this.editingSlideIndex = index;
        this.selectedSlideCueIndex = null;
        const slide = this.currentSlides[index];
        this.writeSlideDraftToEditor(this.buildSlideEditorPayload(slide));
        this.elements.editPrompt.value = '';
        this.elements.editJsonArea.style.display = 'block';
        this.elements.editLoading.style.display = 'none';
        this.elements.regenerateEdit.disabled = false;
        this.elements.editModal.classList.add('active');
        this.syncSlideTooling();
    }

    openDeckSettingsModal() {
        if (!this.currentOutline || !this.elements.editModal) {
            return;
        }

        this.applyModalCopy('deck');
        this.editingSlideIndex = null;
        this.selectedSlideCueIndex = null;
        this.selectedDeckMarkerIndex = null;
        this.selectedDeckAudioIndex = null;
        this.selectedDeckVoiceoverSceneIndex = 0;
        this.selectedDeckCueIndex = null;
        this.elements.editText.value = JSON.stringify(this.buildDeckSettingsPayload(), null, 2);
        this.elements.editPrompt.value = '';
        this.elements.editJsonArea.style.display = 'block';
        this.elements.editLoading.style.display = 'none';
        this.elements.editModal.classList.add('active');
        this.syncDeckTooling(true);
    }

    async regenerateSlide() {
        if (this.modalMode !== 'slide') {
            return;
        }

        const prompt = this.elements.editPrompt?.value.trim();
        if (!prompt) {
            this.notify(this.t('describeRewrite'), 'error');
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
                throw new Error(data.error || 'AI rewrite failed.');
            }

            this.writeSlideDraftToEditor(this.buildSlideEditorPayload(data.slide));
            this.elements.editJsonArea.style.display = 'block';
            this.syncSlideTooling();
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
            if (this.modalMode === 'deck') {
                const parsed = this.getDeckDraftFromEditor(true);
                if (!parsed) {
                    return;
                }
                const current = this.currentOutline || {};
                this.currentOutline = {
                    ...current,
                    title: Object.prototype.hasOwnProperty.call(parsed, 'title')
                        ? String(parsed.title || '')
                        : current.title,
                    subtitle: Object.prototype.hasOwnProperty.call(parsed, 'subtitle')
                        ? String(parsed.subtitle || '')
                        : current.subtitle,
                    timeline: Object.prototype.hasOwnProperty.call(parsed, 'timeline')
                        ? (parsed.timeline && typeof parsed.timeline === 'object' ? this.normalizeDeckTimeline(parsed.timeline) : null)
                        : current.timeline
                };
                const sceneVoiceover = this.normalizeDeckSceneVoiceoverList(parsed.sceneVoiceover);
                const voiceoverBySceneIndex = new Map(sceneVoiceover.map((entry) => [entry.sceneIndex, entry]));
                this.currentSlides = this.currentSlides.map((slide, index) => {
                    const nextSlide = {
                        ...slide,
                        index: index + 1
                    };
                    const entry = voiceoverBySceneIndex.get(index);

                    if (entry) {
                        const existingVoiceover = slide?.voiceover && typeof slide.voiceover === 'object'
                            ? slide.voiceover
                            : {};
                        nextSlide.voiceover = {
                            ...existingVoiceover,
                            language: entry.language,
                            text: entry.text,
                            cues: entry.cues.map((cue) => ({
                                atMs: cue.atMs,
                                text: cue.text
                            }))
                        };
                    } else if (Object.prototype.hasOwnProperty.call(nextSlide, 'voiceover')) {
                        delete nextSlide.voiceover;
                    }

                    return nextSlide;
                });
                this.currentOutline.slides = this.currentSlides;
                this.closeEditModal();
                this.renderOutlineCard();
                this.notify(this.t('deckUpdated'));
                return;
            }

            const parsed = this.getSlideDraftFromEditor(true);
            if (!parsed) {
                return;
            }

            const nextSlideDraft = this.sanitizeSlideDraftForSave(parsed);
            const index = this.editingSlideIndex;
            const existingSlide = {
                ...this.currentSlides[index]
            };
            delete existingSlide.type;
            delete existingSlide.title;
            delete existingSlide.subtitle;
            delete existingSlide.content;
            delete existingSlide.items;
            delete existingSlide.points;
            delete existingSlide.bullets;
            delete existingSlide.animation;
            delete existingSlide.transition;
            delete existingSlide.media;
            delete existingSlide.voiceover;
            delete existingSlide.durationMs;
            this.currentSlides[index] = {
                ...existingSlide,
                ...nextSlideDraft,
                index: index + 1
            };
            this.closeEditModal();
            this.renderOutlineCard();
            this.notify(this.t('slideUpdated'));
        } catch (error) {
            this.notify(this.t('invalidJson'), 'error');
        }
    }

    downloadPPTX() {
        if (!this.pptxUrl) {
            this.notify(this.t('pptxNotReady'), 'error');
            return;
        }

        window.open(this.pptxUrl, '_blank', 'noopener');
    }

    getBuildSteps() {
        return Array.isArray(this.copy?.buildSteps) ? this.copy.buildSteps : [];
    }

    getSlideSummary(slide) {
        const mediaSummary = slide?.media?.source
            ? `${slide.media.type === 'video' ? this.t('video') : this.t('image')}: ${slide.media.source}`
            : '';
        const animationSummary = slide?.animation?.scene
            ? `${this.t('motion')}: ${slide.animation.scene}`
            : '';
        const transitionTiming = slide?.transition?.preset
            ? [
                Number.isFinite(Number(slide?.transition?.durationMs))
                    ? `${Math.round(Number(slide.transition.durationMs) / 10) / 100}s`
                    : '',
                Number.isFinite(Number(slide?.transition?.enterMs)) && Number(slide.transition.enterMs) > 0
                    ? `${this.t('transitionEnter')} ${Math.round(Number(slide.transition.enterMs))}ms`
                    : '',
                Number.isFinite(Number(slide?.transition?.holdMs)) && Number(slide.transition.holdMs) > 0
                    ? `${this.t('transitionHold')} ${Math.round(Number(slide.transition.holdMs))}ms`
                    : '',
                Number.isFinite(Number(slide?.transition?.exitMs)) && Number(slide.transition.exitMs) > 0
                    ? `${this.t('transitionExit')} ${Math.round(Number(slide.transition.exitMs))}ms`
                    : '',
                Number.isFinite(Number(slide?.transition?.contentDelayMs)) && Number(slide.transition.contentDelayMs) > 0
                    ? `+${Math.round(Number(slide.transition.contentDelayMs))}ms`
                    : '',
                Number.isFinite(Number(slide?.transition?.staggerStepMs)) && Number(slide.transition.staggerStepMs) > 0
                    ? `step ${Math.round(Number(slide.transition.staggerStepMs))}ms`
                    : ''
            ].filter(Boolean).join(' ')
            : '';
        const transitionSummary = slide?.transition?.preset
            ? `${this.t('transition')}: ${slide.transition.preset}${transitionTiming ? ` (${transitionTiming})` : ''}`
            : '';
        const durationSummary = slide?.durationMs
            ? `${this.t('duration')}: ${Math.round(Number(slide.durationMs) / 1000)}s`
            : '';
        const voiceoverSummary = slide?.voiceover?.text
            ? this.t('voiceover')
            : '';
        const separator = this.locale === 'zh-CN' ? ' · ' : ' • ';

        if (Array.isArray(slide.content)) {
            return [slide.content.join(separator), mediaSummary, animationSummary, transitionSummary, durationSummary, voiceoverSummary]
                .filter(Boolean)
                .join(separator);
        }

        if (Array.isArray(slide.items)) {
            return [slide.items.join(separator), mediaSummary, animationSummary, transitionSummary, durationSummary, voiceoverSummary]
                .filter(Boolean)
                .join(separator);
        }

        return slide.content || mediaSummary || animationSummary || transitionSummary || durationSummary || voiceoverSummary || this.t('waitingContent');
    }

    getLabel(type, value) {
        if (type === 'purpose') {
            return this.copy?.purposeLabels?.[value] || '';
        }

        if (type === 'length') {
            return this.copy?.lengthLabels?.[value] || '';
        }

        return '';
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

const CREATE_STATIC_I18N = {
    'zh-CN': {
        pageTitle: '创建演示文稿 - Xiangyu Slides',
        introTag: '从脚本到独立页面',
        introTitle: '先生成脚本，再一键生成带 ID 的独立幻灯片页面',
        introDescription: '这里会先帮你整理演示脚本。确认脚本后点击“开始生成”，系统会在新页面打开一个专属地址，例如 <code>/presentations/pres_xxx</code>，同时在当前页展示实时进度，不再是黑盒。',
        introMetaRoute: '干净路由：`/create`',
        introMetaWindow: '新窗口独立访问',
        introMetaStages: '可见的生成阶段',
        advancedShellLabel: 'Advanced Workspace',
        advancedShellTitle: '在这里继续精修结构、风格与导出',
        advancedShellHint: '左侧负责配置和输入，右侧负责脚本、构建状态和结果工作区。',
        advancedShellPillOutline: 'Outline',
        advancedShellPillBuild: 'Build',
        advancedShellPillExport: 'Export',
        advancedWorkspaceTitle: '编辑工作区',
        advancedWorkspaceHint: '脚本、生成进度、结果卡片和后续微调都集中在这里。',
        purposeLabel: '选择用途',
        lengthLabel: '演示文稿长度',
        styleLabel: '选择风格',
        inputHint: 'Enter 发送生成脚本，Shift + Enter 换行',
        quickStartTitle: '快速开始',
        quickStartTeaching: '📚 教学培训：面向零基础学员的 AI 发展与应用课程',
        quickStartProduct: '🚀 产品发布：新产品发布会、媒体与客户同步宣讲',
        quickStartPitch: '💰 融资演讲：给投资人看的商业计划与融资路演',
        quickStartTech: '💻 技术分享：面向团队或社区的架构与实践拆解',
        quickStartReport: '📊 年度报告：企业年度经营回顾与下一年规划',
        quickPrompts: {
            teaching: '帮我做一个 AI 发展教学演示 PPT，面向零基础学员，包含人工智能发展史、机器学习基础、深度学习核心原理、Transformer 应用、主流框架对比，以及 AI 在医疗、金融、教育和自动驾驶中的应用趋势。',
            product: '帮我做一个新产品发布会演示 PPT，用于面向投资者、媒体和客户正式发布一款创新产品，内容需要包含市场痛点、核心功能、技术优势、交互体验、竞品分析、定价策略、推广计划和路线图。',
            pitch: '帮我做一个商业融资路演 PPT，用于向投资人展示项目并争取融资，内容包含项目简介、市场空间、团队背景、商业模式、竞争优势、财务预测、融资需求和资金用途。',
            tech: '帮我做一个技术专题分享演示 PPT，用于向团队或技术社区讲解一项技术方案，内容包含技术背景、核心原理、系统架构、详细设计、性能优化、踩坑记录、代码示例和效果数据。',
            report: '帮我做一个企业年度总结演示 PPT，用于向员工、股东和合作伙伴汇报全年工作，内容包含经营回顾、核心业务指标、产品研发成果、技术与工程成就、市场拓展、团队建设、财务表现和下一年规划。'
        }
    },
    en: {
        pageTitle: 'Create Presentation - Xiangyu Slides',
        introTag: 'From Outline to Standalone Page',
        introTitle: 'Draft the outline first, then generate a standalone presentation with its own ID',
        introDescription: 'This page helps you shape the presentation outline first. After you confirm it, click “Generate Presentation” and the system will open a dedicated URL such as <code>/presentations/pres_xxx</code>, while showing visible progress here instead of acting like a black box.',
        introMetaRoute: 'Clean route: `/create`',
        introMetaWindow: 'Standalone page in a new window',
        introMetaStages: 'Visible generation stages',
        advancedShellLabel: 'Advanced Workspace',
        advancedShellTitle: 'Refine structure, style, and export in one workspace',
        advancedShellHint: 'The left side handles setup and input. The right side holds the outline, build state, and result workspace.',
        advancedShellPillOutline: 'Outline',
        advancedShellPillBuild: 'Build',
        advancedShellPillExport: 'Export',
        advancedWorkspaceTitle: 'Editing Workspace',
        advancedWorkspaceHint: 'Outline editing, build state, result cards, and follow-up refinement stay here.',
        purposeLabel: 'Choose Purpose',
        lengthLabel: 'Presentation Length',
        styleLabel: 'Choose Style',
        inputHint: 'Press Enter to generate the outline, Shift + Enter for a new line',
        quickStartTitle: 'Quick Start',
        quickStartTeaching: '📚 Teaching: an introductory AI development and applications course',
        quickStartProduct: '🚀 Product Launch: align media, customers, and partners around a new launch',
        quickStartPitch: '💰 Pitch: a fundraising deck for investors and financing conversations',
        quickStartTech: '💻 Tech Talk: architecture and implementation breakdown for a team or community',
        quickStartReport: '📊 Annual Review: company performance recap and next-year planning',
        quickPrompts: {
            teaching: 'Create an AI teaching deck for beginners covering the history of AI, machine learning basics, deep learning foundations, Transformer applications, framework comparisons, and the future of AI in healthcare, finance, education, and autonomous driving.',
            product: 'Create a product launch deck for investors, media, and customers, covering market pain points, core features, technical advantages, interaction experience, competitive analysis, pricing, go-to-market strategy, and roadmap.',
            pitch: 'Create a fundraising pitch deck for investors covering the project overview, market size, team background, business model, competitive edge, financial projections, funding ask, and use of funds.',
            tech: 'Create a technical sharing deck for a team or developer community that explains a technical solution, including context, core principles, system architecture, detailed design, performance optimization, implementation lessons, code examples, and outcome metrics.',
            report: 'Create an annual review deck for employees, shareholders, and partners, covering business recap, core KPIs, product and R&D outcomes, engineering achievements, market expansion, team growth, financial performance, and next-year plans.'
        }
    }
};

function setElementWithExistingIcon(element, label) {
    if (!element) {
        return;
    }

    const icon = element.querySelector('i');
    if (!icon) {
        element.textContent = label;
        return;
    }

    element.innerHTML = `${icon.outerHTML} ${label}`;
}

const ADVANCED_EDITOR_COPY = {
    'zh-CN': {
        purposeMeta: {
            teaching: '课程讲解 · 培训 · 课堂',
            pitch: '投资叙事 · 商业论证 · 融资',
            product: '发布会 · 产品演示 · 市场沟通',
            meeting: '周会汇报 · 对齐 · 决策同步',
            company: '品牌介绍 · 团队能力 · 对外呈现',
            tech: '架构拆解 · 技术方案 · 实践复盘',
            personal: '作品集 · 简历表达 · 个人介绍',
            story: '故事讲述 · 案例拆解 · 内容表达',
            marketing: '营销活动 · 增长叙事 · 转化',
            event: '活动议程 · 现场串联 · 重要公告'
        },
        lengthLabels: {
            short: '简短',
            medium: '中等',
            long: '完整'
        },
        lengthMeta: {
            short: '5-8 页 · 快节奏首稿',
            medium: '8-15 页 · 标准叙事',
            long: '15-25 页 · 完整展开'
        },
        styleMeta: {
            'bold-signal': { label: 'Bold · 大胆', meta: '发布会感 · 强对比' },
            'electric-studio': { label: 'Electric · 电光', meta: '科技感 · 演示型' },
            'creative-voltage': { label: 'Creative · 创意', meta: '亮色系 · 概念稿' },
            'dark-botanical': { label: 'Botanical · 森系', meta: '质感深色 · 内容型' },
            'notebook-tabs': { label: 'Notebook · 笔记', meta: '编辑感 · 轻阅读' },
            'pastel-geometry': { label: 'Pastel · 粉彩', meta: '柔和明亮 · 教学型' },
            'split-pastel': { label: 'Split · 分割', meta: '双栏杂志感 · 结构清晰' },
            'vintage-editorial': { label: 'Vintage · 复古', meta: '品牌叙事 · 杂志调性' },
            'neon-cyber': { label: 'Neon · 赛博', meta: '强视觉氛围 · 夜景感' },
            'terminal-green': { label: 'Terminal · 终端', meta: '开发者风格 · 技术分享' }
        },
        quickStartLabels: {
            teaching: '教学培训',
            product: '产品发布',
            pitch: '融资演讲',
            tech: '技术分享',
            report: '年度报告'
        },
        quickStartMeta: {
            teaching: '零基础课程 · 清晰知识结构',
            product: '发布节奏 · 媒体与客户同步',
            pitch: '投资人语境 · 更强商业论证',
            tech: '架构思路 · 代码与实践结合',
            report: '年度回顾 · 关键指标与规划'
        }
    },
    en: {
        purposeMeta: {
            teaching: 'course flow · training · workshop',
            pitch: 'investor narrative · business case · fundraising',
            product: 'launch story · demo flow · market sync',
            meeting: 'weekly review · alignment · decision sync',
            company: 'brand intro · team capability · external deck',
            tech: 'architecture breakdown · technical plan · postmortem',
            personal: 'portfolio · resume story · self intro',
            story: 'storytelling · case study · narrative content',
            marketing: 'campaign narrative · growth story · conversion',
            event: 'agenda flow · on-stage guidance · announcement'
        },
        lengthLabels: {
            short: 'Short',
            medium: 'Medium',
            long: 'Long'
        },
        lengthMeta: {
            short: '5-8 slides · faster first pass',
            medium: '8-15 slides · standard narrative',
            long: '15-25 slides · full expansion'
        },
        styleMeta: {
            'bold-signal': { label: 'Bold', meta: 'keynote contrast · launch energy' },
            'electric-studio': { label: 'Electric', meta: 'tech-forward · studio feel' },
            'creative-voltage': { label: 'Creative', meta: 'bright concept · punchy color' },
            'dark-botanical': { label: 'Botanical', meta: 'textured dark · editorial depth' },
            'notebook-tabs': { label: 'Notebook', meta: 'editorial notes · lighter reading' },
            'pastel-geometry': { label: 'Pastel', meta: 'soft light · teaching friendly' },
            'split-pastel': { label: 'Split', meta: 'two-column magazine flow' },
            'vintage-editorial': { label: 'Vintage', meta: 'brand narrative · print tone' },
            'neon-cyber': { label: 'Neon', meta: 'night-mode energy · visual punch' },
            'terminal-green': { label: 'Terminal', meta: 'developer tone · technical share' }
        },
        quickStartLabels: {
            teaching: 'Teaching Deck',
            product: 'Product Launch',
            pitch: 'Investor Pitch',
            tech: 'Tech Talk',
            report: 'Annual Review'
        },
        quickStartMeta: {
            teaching: 'beginner-friendly lesson flow',
            product: 'launch pacing for media and customers',
            pitch: 'investor-ready story and proof',
            tech: 'architecture + implementation framing',
            report: 'annual recap with metrics and next steps'
        }
    }
};

function getAdvancedEditorCopy(locale) {
    return ADVANCED_EDITOR_COPY[locale] || ADVANCED_EDITOR_COPY.en;
}

function setOptionButtonContent(element, label, meta) {
    if (!element) {
        return;
    }

    const icon = element.querySelector('i')?.cloneNode(true);
    element.textContent = '';

    if (icon) {
        const iconWrap = document.createElement('span');
        iconWrap.className = 'editor-option-icon';
        iconWrap.appendChild(icon);
        element.appendChild(iconWrap);
    }

    const copy = document.createElement('span');
    copy.className = 'editor-option-copy';

    const title = document.createElement('span');
    title.className = 'editor-option-title';
    title.textContent = label;
    copy.appendChild(title);

    if (meta) {
        const metaEl = document.createElement('span');
        metaEl.className = 'editor-option-meta';
        metaEl.textContent = meta;
        copy.appendChild(metaEl);
    }

    element.appendChild(copy);
    element.setAttribute('aria-label', meta ? `${label} - ${meta}` : label);
}

function setStyleCardContent(card, label, meta) {
    if (!card) {
        return;
    }

    const name = card.querySelector('.style-preview-name');
    if (name) {
        name.textContent = label;
    }

    let metaEl = card.querySelector('.style-preview-meta');
    if (!metaEl) {
        metaEl = document.createElement('div');
        metaEl.className = 'style-preview-meta';
        card.appendChild(metaEl);
    }

    metaEl.textContent = meta || '';
    card.dataset.styleLabel = label;
    card.setAttribute('aria-label', meta ? `${label} - ${meta}` : label);
}

function setQuickStartButtonContent(element, label, meta, iconName) {
    if (!element) {
        return;
    }

    element.textContent = '';

    const iconWrap = document.createElement('span');
    iconWrap.className = 'quick-start-btn-icon';
    const icon = document.createElement('i');
    icon.className = `ph ${iconName}`;
    iconWrap.appendChild(icon);
    element.appendChild(iconWrap);

    const copy = document.createElement('span');
    copy.className = 'quick-start-btn-copy';

    const title = document.createElement('span');
    title.className = 'quick-start-btn-title';
    title.textContent = label;
    copy.appendChild(title);

    if (meta) {
        const metaEl = document.createElement('span');
        metaEl.className = 'quick-start-btn-meta';
        metaEl.textContent = meta;
        copy.appendChild(metaEl);
    }

    element.appendChild(copy);
    element.setAttribute('aria-label', meta ? `${label} - ${meta}` : label);
}

Object.assign(CreateStudio.prototype, {
    applyStaticI18n() {
        const staticCopy = CREATE_STATIC_I18N[this.locale] || CREATE_STATIC_I18N.en;
        const editorCopy = getAdvancedEditorCopy(this.locale);

        document.title = staticCopy.pageTitle;
        window.XiangyuI18n?.setPageLocale?.(this.locale);
        this.elements.textarea?.setAttribute(
            'placeholder',
            this.locale === 'zh-CN'
                ? '描述你想创建的演示主题、目标听众和重点内容。'
                : 'Describe the presentation topic, target audience, and key points you want to cover.'
        );

        setElementWithExistingIcon(document.getElementById('createNavHome'), this.locale === 'zh-CN' ? '首页' : 'Home');
        setElementWithExistingIcon(document.getElementById('createNavCreate'), this.locale === 'zh-CN' ? '创建' : 'Create');

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.title = this.locale === 'zh-CN' ? '切换主题' : 'Toggle theme';
        }

        document.getElementById('introTag') && (document.getElementById('introTag').innerHTML = '<i class="ph ph-sparkle"></i> ' + staticCopy.introTag);
        document.getElementById('introTitle') && (document.getElementById('introTitle').textContent = staticCopy.introTitle);
        document.getElementById('introDescription') && (document.getElementById('introDescription').innerHTML = staticCopy.introDescription);
        setElementWithExistingIcon(document.getElementById('introMetaRoute'), staticCopy.introMetaRoute);
        setElementWithExistingIcon(document.getElementById('introMetaWindow'), staticCopy.introMetaWindow);
        setElementWithExistingIcon(document.getElementById('introMetaStages'), staticCopy.introMetaStages);
        document.getElementById('advancedShellLabel') && (document.getElementById('advancedShellLabel').textContent = staticCopy.advancedShellLabel);
        document.getElementById('advancedShellTitle') && (document.getElementById('advancedShellTitle').textContent = staticCopy.advancedShellTitle);
        document.getElementById('advancedShellHint') && (document.getElementById('advancedShellHint').textContent = staticCopy.advancedShellHint);
        document.getElementById('advancedShellPillOutline') && (document.getElementById('advancedShellPillOutline').textContent = staticCopy.advancedShellPillOutline);
        document.getElementById('advancedShellPillBuild') && (document.getElementById('advancedShellPillBuild').textContent = staticCopy.advancedShellPillBuild);
        document.getElementById('advancedShellPillExport') && (document.getElementById('advancedShellPillExport').textContent = staticCopy.advancedShellPillExport);
        document.getElementById('advancedWorkspaceTitle') && (document.getElementById('advancedWorkspaceTitle').textContent = staticCopy.advancedWorkspaceTitle);
        document.getElementById('advancedWorkspaceHint') && (document.getElementById('advancedWorkspaceHint').textContent = staticCopy.advancedWorkspaceHint);
        setElementWithExistingIcon(document.getElementById('purposeLabel'), staticCopy.purposeLabel);
        setElementWithExistingIcon(document.getElementById('lengthLabel'), staticCopy.lengthLabel);
        setElementWithExistingIcon(document.getElementById('styleLabel'), staticCopy.styleLabel);
        document.getElementById('advancedSetupLabel') && (document.getElementById('advancedSetupLabel').textContent = this.locale === 'zh-CN' ? '项目设置' : 'Project Setup');
        document.getElementById('advancedSetupCopy') && (document.getElementById('advancedSetupCopy').textContent = this.locale === 'zh-CN' ? '先确定用途、篇幅和视觉风格，再开始生成 outline。' : 'Choose purpose, deck length, and visual style before drafting the outline.');
        document.getElementById('advancedBriefLabel') && (document.getElementById('advancedBriefLabel').textContent = this.locale === 'zh-CN' ? '脚本输入' : 'Brief Composer');
        document.getElementById('advancedBriefCopy') && (document.getElementById('advancedBriefCopy').textContent = this.locale === 'zh-CN' ? '在这里输入主题和受众描述，先把脚本整理出来，再进入独立页面构建。' : 'Write the brief here, then turn it into an outline before building the standalone page.');
        document.getElementById('advancedStarterLabel') && (document.getElementById('advancedStarterLabel').textContent = this.locale === 'zh-CN' ? '快速起步' : 'Quick Starters');
        document.getElementById('advancedStarterCopy') && (document.getElementById('advancedStarterCopy').textContent = this.locale === 'zh-CN' ? '想更快拿到第一版时，可以直接套用这些 starter prompt。' : 'Use a starter prompt when you want a faster first outline and a clearer scene direction.');

        const purposeButtons = {
            teaching: this.copy?.purposeLabels?.teaching || 'Teaching',
            pitch: this.copy?.purposeLabels?.pitch || 'Pitch',
            product: this.copy?.purposeLabels?.product || 'Product',
            meeting: this.copy?.purposeLabels?.meeting || 'Meeting',
            company: this.copy?.purposeLabels?.company || 'Company',
            tech: this.copy?.purposeLabels?.tech || 'Tech',
            personal: this.copy?.purposeLabels?.personal || 'Personal',
            story: this.copy?.purposeLabels?.story || 'Story',
            marketing: this.copy?.purposeLabels?.marketing || 'Marketing',
            event: this.copy?.purposeLabels?.event || 'Event'
        };

        Object.entries(purposeButtons).forEach(([key, label]) => {
            setOptionButtonContent(
                this.elements.purposeArea?.querySelector(`[data-val="${key}"]`),
                label,
                editorCopy?.purposeMeta?.[key] || ''
            );
        });

        const lengthButtons = {
            short: editorCopy?.lengthLabels?.short || 'Short',
            medium: editorCopy?.lengthLabels?.medium || 'Medium',
            long: editorCopy?.lengthLabels?.long || 'Long'
        };

        Object.entries(lengthButtons).forEach(([key, label]) => {
            setOptionButtonContent(
                this.elements.lengthArea?.querySelector(`[data-val="${key}"]`),
                label,
                editorCopy?.lengthMeta?.[key] || ''
            );
        });

        Object.entries(editorCopy?.styleMeta || {}).forEach(([key, value]) => {
            setStyleCardContent(
                this.elements.styleArea?.querySelector(`[data-val="${key}"]`),
                value.label,
                value.meta
            );
        });

        const inputHint = document.getElementById('inputHint');
        if (inputHint) {
            inputHint.textContent = staticCopy.inputHint;
        }

        setElementWithExistingIcon(document.getElementById('quickStartTitle'), staticCopy.quickStartTitle);

        const quickButtons = {
            Teaching: { key: 'teaching', icon: 'graduation-cap' },
            Product: { key: 'product', icon: 'rocket-launch' },
            Pitch: { key: 'pitch', icon: 'currency-dollar' },
            Tech: { key: 'tech', icon: 'code' },
            Report: { key: 'report', icon: 'chart-line-up' }
        };
        Object.entries(quickButtons).forEach(([suffix, config]) => {
            setQuickStartButtonContent(
                document.getElementById(`quickStart${suffix}`),
                editorCopy?.quickStartLabels?.[config.key] || '',
                editorCopy?.quickStartMeta?.[config.key] || '',
                config.icon
            );
        });

        if (this.elements.cancelEdit) {
            this.elements.cancelEdit.textContent = this.t('cancel');
        }

        this.setButtonLabel(this.elements.regenerateEdit, 'sparkle', this.t('rewriteWithAi'));
        this.setButtonLabel(this.elements.saveEdit, '', this.t('saveSlide'));
        this.applyModalCopy('slide');
    },

    quickGenerate(type) {
        const { textarea, sendButton } = this.elements;
        const staticCopy = CREATE_STATIC_I18N[this.locale] || CREATE_STATIC_I18N.en;
        const prompt = staticCopy.quickPrompts?.[type] || this.quickPrompts[type] || type;

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
});

document.addEventListener('DOMContentLoaded', () => {
    window.createStudio = new CreateStudio();
});
