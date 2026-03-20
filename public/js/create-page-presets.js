window.XiangyuCreatePresets = window.XiangyuCreatePresets || {};

window.XiangyuCreatePresets.PURPOSE_STARTER_PROFILES = {
    'zh-CN': {
        teaching: {
            titleSubtitle: '概括这一页的学习目标或结论。',
            content: ['先定义核心概念', '再解释为什么重要', '最后给出下一步练习'],
            features: ['目标一：学员要理解什么', '目标二：学员要记住什么', '目标三：学员要马上去做什么'],
            quote: '讲清楚一件事，先给观众一个清晰模型。',
            quoteSource: '教学提示',
            code: ['const concept = explainIdea(input);', 'return buildPractice(concept);'],
            end: ['用一句话回顾本节重点', '给出练习、提问或行动入口']
        },
        pitch: {
            titleSubtitle: '用一句话说清融资故事或核心卖点。',
            content: ['点明市场痛点与机会窗口', '解释为什么这支团队能赢', '给出 traction 或关键证明'],
            features: ['痛点：今天哪里还没被满足', '证明：什么数据降低了风险', '诉求：希望投资人下一步做什么'],
            quote: '好的融资故事，会让机会看起来不可回避。',
            quoteSource: 'Investor memo',
            code: ['const growth = revenue * expansionRate;', 'console.log({ growth, runwayMonths });'],
            end: ['重申投资逻辑与增长想象', '明确 ask、时间点和跟进动作']
        },
        product: {
            titleSubtitle: '概括本页要强调的产品价值。',
            content: ['说明用户场景和痛点', '展示产品如何解决问题', '强调发布后的用户收益'],
            features: ['能力一：核心功能或亮点', '能力二：体验改进或性能提升', '能力三：上线后的业务价值'],
            quote: '真正好的产品发布，是让用户立刻知道为什么值得试。',
            quoteSource: '产品发布提示',
            code: ['const launchPlan = alignFeatureRollout(users);', 'announceValue(launchPlan);'],
            end: ['总结本次发布的核心变化', '给出试用、迁移或发布节奏']
        },
        meeting: {
            titleSubtitle: '概括这次汇报页的状态与结论。',
            content: ['先同步当前状态', '再解释风险或阻塞', '最后给出决策建议'],
            features: ['进展：已经完成了什么', '风险：哪些问题需要关注', '决策：这页希望会议达成什么'],
            quote: '会议汇报的价值，不是复述，而是推动决策。',
            quoteSource: '会议提示',
            code: ['const status = collectWeeklyStatus(items);', 'return summarizeRisks(status);'],
            end: ['总结本次会议结论', '明确 owner、截止时间和下一步']
        },
        company: {
            titleSubtitle: '用一句话说明公司定位或使命。',
            content: ['先说明公司在做什么', '再说明服务谁以及价值', '最后补充阶段或规模证明'],
            features: ['定位：一句话讲清业务', '客户：主要服务对象是谁', '证明：规模、案例或里程碑'],
            quote: '公司介绍不是堆信息，而是快速建立可信度。',
            quoteSource: '公司介绍提示',
            code: ['const summary = describeCompany(mission, market);', 'return attachProof(summary, traction);'],
            end: ['回收公司定位与核心优势', '给出合作、联系或下一步入口']
        },
        tech: {
            titleSubtitle: '概括这页的技术主题或架构重点。',
            content: ['先定义问题或约束', '再讲方案选择与原因', '最后给出工程权衡'],
            features: ['约束：系统面对的核心问题', '方案：采用了什么设计', '权衡：性能、复杂度或维护成本'],
            quote: '好技术分享要把选择背后的权衡讲清楚。',
            quoteSource: '技术分享提示',
            code: ['const pipeline = composeStages(input, context);', 'return optimizeForLatency(pipeline);'],
            end: ['回顾这次方案的关键取舍', '给出后续优化或讨论方向']
        },
        personal: {
            titleSubtitle: '概括这一页想让别人记住的个人亮点。',
            content: ['先说明你的角色或定位', '再补充代表性经历', '最后给出你想解决的问题'],
            features: ['背景：你来自哪里', '能力：最强的一项或两项优势', '目标：你下一步想创造什么价值'],
            quote: '个人介绍的关键，是让别人快速记住你的独特价值。',
            quoteSource: '个人介绍提示',
            code: ['const profile = summarizeStrengths(experience);', 'return connectToOpportunity(profile);'],
            end: ['总结你的个人标签', '给出联系方式或下一步合作方向']
        },
        story: {
            titleSubtitle: '用一句话写出这一幕的情境或张力。',
            content: ['先交代人物或背景', '再推进冲突或变化', '最后留下悬念或转折'],
            features: ['设定：观众此刻需要知道什么', '冲突：为什么事情开始变化', '转折：这一页之后会发生什么'],
            quote: '故事要推动观众往前看，而不是停在原地。',
            quoteSource: '叙事提示',
            code: ['const scene = buildScene(character, conflict);', 'return revealTurn(scene);'],
            end: ['总结这一段故事的变化', '把观众带向下一幕']
        },
        marketing: {
            titleSubtitle: '概括这一页的营销信息或传播主张。',
            content: ['先定义目标人群与场景', '再说明传播信息与利益点', '最后补充渠道或效果目标'],
            features: ['人群：这页主要打动谁', '信息：品牌想让对方记住什么', '动作：希望用户接下来做什么'],
            quote: '营销页不是说得越多越好，而是让记忆点足够集中。',
            quoteSource: '营销提示',
            code: ['const campaign = mapAudienceToMessage(segment);', 'trackConversion(campaign);'],
            end: ['总结传播主张与转化路径', '给出 CTA、投放或复盘动作']
        },
        event: {
            titleSubtitle: '概括这一页的活动目标或环节重点。',
            content: ['先说明活动环节目标', '再补充流程与资源安排', '最后说明现场执行重点'],
            features: ['流程：这一环节怎么推进', '资源：人、场地或物料怎么配置', '结果：结束时希望达成什么'],
            quote: '活动方案的可信度，来自细节和执行节奏。',
            quoteSource: '活动策划提示',
            code: ['const runbook = assignOwners(schedule);', 'syncVenueChecklist(runbook);'],
            end: ['回顾活动目标与关键节奏', '明确彩排、执行或复盘动作']
        }
    },
    en: {
        teaching: {
            titleSubtitle: 'Summarize the learning goal or takeaway for this scene.',
            content: ['Define the core concept in one clear sentence', 'Explain why it matters in practice', 'Give the audience the next learning step'],
            features: ['Goal one: what the audience should understand', 'Goal two: what they should remember', 'Goal three: what they should try next'],
            quote: 'A clear model is the fastest path to a good explanation.',
            quoteSource: 'Teaching note',
            code: ['const concept = explainIdea(input);', 'return buildPractice(concept);'],
            end: ['Recap the lesson in one sentence', 'Invite the audience to practice or ask questions']
        },
        pitch: {
            titleSubtitle: 'State the investor story or key promise in one line.',
            content: ['Frame the market pain and timing window', 'Explain why this team can win now', 'Point to traction or proof that de-risks the story'],
            features: ['Pain: what is still broken today', 'Proof: what traction lowers the risk', 'Ask: what next step you want from investors'],
            quote: 'A strong pitch makes the opportunity feel unavoidable.',
            quoteSource: 'Investor memo',
            code: ['const growth = revenue * expansionRate;', 'console.log({ growth, runwayMonths });'],
            end: ['Restate the investment thesis', 'Close with the ask, timing, and next step']
        },
        product: {
            titleSubtitle: 'Summarize the product value this scene should land.',
            content: ['Describe the user scenario and pain point', 'Show how the product resolves it', 'Highlight the benefit after launch'],
            features: ['Capability one: the core feature or highlight', 'Capability two: the experience or performance gain', 'Capability three: the business value after release'],
            quote: 'A launch lands when users instantly see why it is worth trying.',
            quoteSource: 'Launch note',
            code: ['const launchPlan = alignFeatureRollout(users);', 'announceValue(launchPlan);'],
            end: ['Recap the release value in one line', 'Give the audience a trial, migration, or rollout step']
        },
        meeting: {
            titleSubtitle: 'Summarize the status and decision this scene should support.',
            content: ['Share the current status first', 'Explain the risk or blocker next', 'End with the decision you need'],
            features: ['Progress: what is already done', 'Risk: what needs attention now', 'Decision: what the room should align on'],
            quote: 'A good meeting update moves the room toward a decision.',
            quoteSource: 'Meeting note',
            code: ['const status = collectWeeklyStatus(items);', 'return summarizeRisks(status);'],
            end: ['Summarize the meeting conclusion', 'List the owner, due date, and next action']
        },
        company: {
            titleSubtitle: 'State the company positioning or mission in one line.',
            content: ['Explain what the company does', 'Clarify who it serves and why it matters', 'Add one proof point about traction or scale'],
            features: ['Positioning: what business are you in', 'Customer: who you serve most clearly', 'Proof: the metric, case, or milestone that builds trust'],
            quote: 'A company intro works when credibility appears quickly.',
            quoteSource: 'Company note',
            code: ['const summary = describeCompany(mission, market);', 'return attachProof(summary, traction);'],
            end: ['Restate the company identity and edge', 'Offer the audience a contact or partnership next step']
        },
        tech: {
            titleSubtitle: 'Summarize the technical theme or architecture choice here.',
            content: ['Define the problem or constraint first', 'Explain the chosen approach and why', 'Close with the engineering tradeoff'],
            features: ['Constraint: what the system must handle', 'Approach: what design was chosen', 'Tradeoff: what changed in complexity, cost, or latency'],
            quote: 'A strong tech talk explains the tradeoffs behind the choice.',
            quoteSource: 'Engineering note',
            code: ['const pipeline = composeStages(input, context);', 'return optimizeForLatency(pipeline);'],
            end: ['Recap the key design tradeoffs', 'Point to the next optimization or discussion path']
        },
        personal: {
            titleSubtitle: 'Summarize the personal value you want people to remember.',
            content: ['Start with your role or positioning', 'Add one representative experience', 'Close with the problem you want to solve next'],
            features: ['Background: where you come from', 'Strength: the skill or edge you bring', 'Goal: the value you want to create next'],
            quote: 'A personal deck works when people remember your unique value fast.',
            quoteSource: 'Profile note',
            code: ['const profile = summarizeStrengths(experience);', 'return connectToOpportunity(profile);'],
            end: ['Recap your personal label in one line', 'Give a contact or collaboration next step']
        },
        story: {
            titleSubtitle: 'Write the situation or tension of this scene in one line.',
            content: ['Set the character or context first', 'Move the conflict or change forward', 'Leave the audience with a turn or question'],
            features: ['Setup: what the audience must know now', 'Conflict: why things begin to change', 'Turn: what this scene pushes toward next'],
            quote: 'A story scene should pull the audience forward, not leave them still.',
            quoteSource: 'Story note',
            code: ['const scene = buildScene(character, conflict);', 'return revealTurn(scene);'],
            end: ['Summarize what changed in this story beat', 'Lead the audience into the next moment']
        },
        marketing: {
            titleSubtitle: 'Summarize the message or campaign point this scene should land.',
            content: ['Define the audience and moment first', 'Clarify the message and benefit', 'Close with the channel or outcome target'],
            features: ['Audience: who this scene should move', 'Message: what they should remember', 'Action: what they should do next'],
            quote: 'Marketing works when the memory point stays sharper than the noise.',
            quoteSource: 'Campaign note',
            code: ['const campaign = mapAudienceToMessage(segment);', 'trackConversion(campaign);'],
            end: ['Recap the message and conversion path', 'Give the CTA, channel, or review step']
        },
        event: {
            titleSubtitle: 'Summarize the event goal or segment focus in one line.',
            content: ['State the segment goal first', 'Add the flow and resource setup', 'Close with the on-site execution focus'],
            features: ['Flow: how this segment should run', 'Resources: what people, venue, or assets are needed', 'Outcome: what should be true when it ends'],
            quote: 'Event plans become credible when timing and detail hold together.',
            quoteSource: 'Event note',
            code: ['const runbook = assignOwners(schedule);', 'syncVenueChecklist(runbook);'],
            end: ['Recap the event goal and key cadence', 'List the rehearsal, execution, or review next step']
        }
    }
};
