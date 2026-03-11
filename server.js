const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 初始化数据文件
function initData() {
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = {
            users: {},
            apiKeys: {},
            usage: {}
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
}
initData();

// 读取数据
function readData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

// 保存数据
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 生成 API Key
function generateApiKey() {
    return 'xy_' + crypto.randomBytes(16).toString('hex');
}

// API Key 验证中间件
function authenticateApiKey(req, res, next) {
    const authHeader = req.headers.authorization;
    const apiKey = authHeader ? authHeader.replace('Bearer ', '') : null;

    // 如果没有 API Key，检查是否在本地模式
    if (!apiKey) {
        // 本地开发模式，不需要验证
        req.isLocalMode = true;
        req.userId = 'local';
        return next();
    }

    const data = readData();
    const userId = data.apiKeys[apiKey];

    if (!userId) {
        return res.status(401).json({ error: 'Invalid API Key' });
    }

    const user = data.users[userId];
    if (!user) {
        return res.status(401).json({ error: 'User not found' });
    }

    // 检查是否过期
    if (user.expiresAt && new Date(user.expiresAt) < new Date()) {
        return res.status(403).json({ error: 'API Key expired' });
    }

    // 检查使用次数
    const usage = data.usage[userId] || { count: 0, month: new Date().getMonth() };
    const currentMonth = new Date().getMonth();

    // 重置月度计数
    if (usage.month !== currentMonth) {
        usage.count = 0;
        usage.month = currentMonth;
    }

    // 免费版每月 10 次
    const limit = Infinity;
    if (usage.count >= limit) {
        return res.status(403).json({
            error: 'Usage limit exceeded',
            limit: limit,
            used: usage.count,
            upgrade: !user.isPro ? 'https://xiangyu-slides.com/pricing' : null
        });
    }

    // 更新使用次数
    usage.count++;
    data.usage[userId] = usage;
    saveData(data);

    req.userId = userId;
    req.user = user;
    next();
}

// MiniMax API 配置
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || 'sk-cp-263Wz751k5CYbX3tUcZZ7hyL7W5h7s7xHbTftIztYxXuSFylcAgymsR8rGxBom8UtnhePBvDUmjuHtXC5JXc1z778oslqxDqINJuvgf6SL9zhdXAEGYU0UM';

// Style presets
const STYLE_PRESETS = [
    { id: 'bold-signal', name: 'Bold Signal', vibe: 'Confident, bold, modern', category: 'dark' },
    { id: 'electric-studio', name: 'Electric Studio', vibe: 'Bold, clean, professional', category: 'dark' },
    { id: 'creative-voltage', name: 'Creative Voltage', vibe: 'Bold, creative, energetic', category: 'dark' },
    { id: 'dark-botanical', name: 'Dark Botanical', vibe: 'Elegant, sophisticated, artistic', category: 'dark' },
    { id: 'notebook-tabs', name: 'Notebook Tabs', vibe: 'Editorial, organized, elegant', category: 'light' },
    { id: 'pastel-geometry', name: 'Pastel Geometry', vibe: 'Friendly, organized, modern', category: 'light' },
    { id: 'split-pastel', name: 'Split Pastel', vibe: 'Playful, modern, friendly', category: 'light' },
    { id: 'vintage-editorial', name: 'Vintage Editorial', vibe: 'Witty, confident, editorial', category: 'light' },
    { id: 'neon-cyber', name: 'Neon Cyber', vibe: 'Futuristic, techy, confident', category: 'specialty' },
    { id: 'terminal-green', name: 'Terminal Green', vibe: 'Developer-focused, hacker', category: 'specialty' },
    { id: 'swiss-modern', name: 'Swiss Modern', vibe: 'Clean, precise, Bauhaus', category: 'specialty' },
    { id: 'paper-ink', name: 'Paper & Ink', vibe: 'Editorial, literary, thoughtful', category: 'specialty' }
];

// Call MiniMax API
function callMiniMax(messages) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: 'MiniMax-M2.5-highspeed',
            messages: messages,
            max_tokens: 8000,
            temperature: 0.7
        });

        const options = {
            hostname: 'api.minimaxi.com',
            path: '/v1/text/chatcompletion_v2',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MINIMAX_API_KEY}`
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    if (response.choices && response.choices[0]) {
                        resolve(response.choices[0].message.content);
                    } else {
                        reject(new Error('Invalid API response: ' + body));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// ============ Auth API ============

// 注册
app.post('/api/auth/register', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    const data = readData();

    // 检查邮箱是否已存在
    const existingUser = Object.values(data.users).find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    const userId = 'user_' + crypto.randomBytes(8).toString('hex');
    const apiKey = generateApiKey();

    data.users[userId] = {
        id: userId,
        email: email,
        password: password, // 生产环境应该哈希存储
        createdAt: new Date().toISOString(),
        isPro: false,
        freeUsesRemaining: 10
    };

    data.apiKeys[apiKey] = userId;
    data.usage[userId] = { count: 0, month: new Date().getMonth() };

    saveData(data);

    res.json({
        success: true,
        user: { id: userId, email: email },
        apiKey: apiKey,
        message: 'Account created successfully'
    });
});

// 登录
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    const data = readData();
    const user = Object.values(data.users).find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 查找现有 API Key 或生成新的
    let apiKey = Object.keys(data.apiKeys).find(key => data.apiKeys[key] === user.id);
    if (!apiKey) {
        apiKey = generateApiKey();
        data.apiKeys[apiKey] = user.id;
        saveData(data);
    }

    res.json({
        success: true,
        user: { id: user.id, email: user.email, isPro: user.isPro },
        apiKey: apiKey
    });
});

// 获取用户信息
app.get('/api/auth/me', authenticateApiKey, (req, res) => {
    if (req.isLocalMode) {
        return res.json({
            mode: 'local',
            message: 'Local development mode'
        });
    }

    const data = readData();
    const usage = data.usage[req.userId] || { count: 0 };

    res.json({
        user: req.user,
        usage: {
            used: usage.count,
            limit: req.user.isPro ? 'unlimited' : 10,
            isPro: req.user.isPro
        }
    });
});

// 续费/升级
app.post('/api/auth/upgrade', authenticateApiKey, (req, res) => {
    const { plan } = req.body;

    const data = readData();
    const user = data.users[req.userId];

    if (plan === 'pro') {
        user.isPro = true;
        user.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30天
    }

    saveData(data);

    res.json({
        success: true,
        message: plan === 'pro' ? 'Upgraded to Pro plan' : 'Plan updated',
        isPro: user.isPro
    });
});

// ============ Public API ============

app.get('/api/styles', (req, res) => {
    res.json(STYLE_PRESETS);
});

// ============ Protected API ============

// 一键生成演示文稿
app.post('/api/generate', authenticateApiKey, async (req, res) => {
    const { topic, purpose, length, style, content, editing } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    // 根据用途生成不同的提示词
    const purposeDescriptions = {
        'teaching': '这是一个教学培训演示文稿，应该包含：课程目标、知识点讲解、案例分析、实践操作、总结回顾等环节。',
        'pitch': '这是一个融资演讲演示文稿，应该包含：项目简介、市场分析、竞争优势、商业模式、团队介绍、融资需求等。',
        'product': '这是一个产品发布会演示文稿，应该包含：产品背景、核心功能、用户体验、市场定位、发布计划等。',
        'meeting': '这是一个会议汇报演示文稿，应该包含：工作回顾、成果展示、问题分析、下一步计划等。',
        'company': '这是一个公司介绍演示文稿，应该包含：公司概况、核心业务、团队介绍、发展历程、愿景使命等。',
        'tech': '这是一个技术分享演示文稿，应该包含：技术背景、架构设计、核心原理、实战案例、总结展望等。',
        'personal': '这是一个个人简历演示文稿，应该包含：个人简介、教育背景、工作经历、项目经验、技能特长等。',
        'story': '这是一个故事讲解演示文稿，应该包含：故事背景、情节发展、人物介绍、高潮转折、寓意总结等。'
    };
    const purposeDesc = purposeDescriptions[purpose] || purposeDescriptions['teaching'];

    try {
        // Step 1: 生成大纲
        const outlinePrompt = `你是一个专业的演示文稿策划专家。根据以下信息创建一个详细的演示文稿大纲：

${purposeDesc}
长度: ${length || 'medium'}
主题: ${topic}
内容概要: ${content || ''}

请生成一个完整的演示文稿大纲，包含：
1. 标题
2. 副标题
3. 每个幻灯片的标题和主要内容要点

以JSON格式返回：
{
    "title": "演示文稿标题",
    "subtitle": "副标题",
    "slides": [
        {"type": "title/content/features/quote/code/end", "title": "幻灯片标题", "content": ["要点1", "要点2"]}
    ]
}`;

        const outlineResult = await callMiniMax([
            { role: 'user', content: outlinePrompt }
        ]);

        const jsonMatch = outlineResult.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to generate outline');
        }
        const outline = JSON.parse(jsonMatch[0]);

        // Step 2: 生成 HTML
        const styleInfo = STYLE_PRESETS.find(s => s.id === style) || STYLE_PRESETS[0];
        const htmlPrompt = `生成一个完整的HTML演示文稿：

演示文稿大纲: ${JSON.stringify(outline)}
风格: ${styleInfo.name} - ${styleInfo.vibe}

要求：
1. 使用CSS变量定义颜色
2. 每个.slide使用height: 100vh; overflow: hidden
3. 字体使用clamp()响应式
4. 包含键盘导航和动画

风格CSS: ${getStyleCSS(style)}

直接返回完整HTML，不要解释。`;

        const htmlResult = await callMiniMax([
            { role: 'user', content: htmlPrompt }
        ]);

        const htmlMatch = htmlResult.match(/<html[\s\S]*<\/html>/i);
        const html = htmlMatch ? htmlMatch[0] : htmlResult;

        // 获取使用统计
        const data = readData();
        const usage = data.usage[req.userId] || { count: 0 };

        res.json({
            success: true,
            outline: outline,
            html: html,
            style: styleInfo,
            usage: {
                used: usage.count,
                limit: req.user?.isPro ? 'unlimited' : 10
            }
        });
    } catch (error) {
        console.error('Error in generate:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/generate-outline', authenticateApiKey, async (req, res) => {
    let { purpose, length, content, topic } = req.body;

    // 如果主题太短或不清楚，询问用户
    if (!topic || topic.trim().length < 3) {
        return res.json({
            clarification: true,
            message: "请告诉我您想要创建什么主题的演示文稿？例如：AI发展趋势、产品介绍、培训课程等"
        });
    }

    // 如果信息不完整，尝试从主题推断或询问
    const needsClarification = [];

    // 检查用途
    if (!purpose || purpose === 'teaching') {
        // 从主题推断用途
        const topicLower = topic.toLowerCase();
        if (topicLower.includes('融资') || topicLower.includes('商业') || topicLower.includes('pitch')) {
            purpose = 'pitch';
        } else if (topicLower.includes('产品') || topicLower.includes('发布') || topicLower.includes('发布会')) {
            purpose = 'product';
        } else if (topicLower.includes('会议') || topicLower.includes('汇报') || topicLower.includes('总结')) {
            purpose = 'meeting';
        } else if (topicLower.includes('公司') || topicLower.includes('企业') || topicLower.includes('团队')) {
            purpose = 'company';
        } else if (topicLower.includes('技术') || topicLower.includes('架构') || topicLower.includes('代码')) {
            purpose = 'tech';
        } else if (topicLower.includes('简历') || topicLower.includes('个人') || topicLower.includes('自我介绍')) {
            purpose = 'personal';
        } else if (topicLower.includes('故事') || topicLower.includes('传说') || topicLower.includes('分享')) {
            purpose = 'story';
        }
    }

    // 默认长度
    if (!length) {
        length = 'medium';
    }

    // 用途描述
    const purposeDescriptions = {
        'teaching': '这是一个教学培训演示文稿，应该包含：课程目标、知识点讲解、案例分析、实践操作、总结回顾等环节。',
        'pitch': '这是一个融资演讲演示文稿，应该包含：项目简介、市场分析、竞争优势、商业模式、团队介绍、融资需求等。',
        'product': '这是一个产品发布会演示文稿，应该包含：产品背景、核心功能、用户体验、市场定位、发布计划等。',
        'meeting': '这是一个会议汇报演示文稿，应该包含：工作回顾、成果展示、问题分析、下一步计划等。',
        'company': '这是一个公司介绍演示文稿，应该包含：公司概况、核心业务、团队介绍、发展历程、愿景使命等。',
        'tech': '这是一个技术分享演示文稿，应该包含：技术背景、架构设计、核心原理、实战案例、总结展望等。',
        'personal': '这是一个个人简历演示文稿，应该包含：个人简介、教育背景、工作经历、项目经验、技能特长等。',
        'story': '这是一个故事讲解演示文稿，应该包含：故事背景、情节发展、人物介绍、高潮转折、寓意总结等。',
        'marketing': '这是一个营销推广演示文稿，应该包含：产品亮点、目标用户、推广策略、案例展示、行动号召等。',
        'event': '这是一个活动策划演示文稿，应该包含：活动背景、活动主题、日程安排、嘉宾介绍、宣传推广等。'
    };
    const purposeDesc = purposeDescriptions[purpose] || purposeDescriptions['teaching'];

    const prompt = `你是一个专业的演示文稿策划专家。根据以下信息创建一个详细的演示文稿大纲：

${purposeDesc}
长度: ${length}
主题: ${topic}
内容概要: ${content || '无'}

请严格按照以下JSON格式返回，不要包含任何其他文字：
{
    "title": "演示文稿标题",
    "subtitle": "副标题",
    "slides": [
        {"type": "title", "title": "幻灯片标题", "content": ["要点1", "要点2"]},
        {"type": "content", "title": "幻灯片标题", "content": ["要点1", "要点2", "要点3"]},
        {"type": "features", "title": "幻灯片标题", "content": ["特性1", "特性2", "特性3"]},
        {"type": "end", "title": "结束页标题", "content": ["感谢语"]}
    ]
}

${length === 'short' ? '确保slides数组有5-8个幻灯片。' : length === 'long' ? '确保slides数组有15-25个幻灯片。' : '确保slides数组有8-15个幻灯片。'}`;

    try {
        const result = await callMiniMax([
            { role: 'user', content: prompt }
        ]);

        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const outline = JSON.parse(jsonMatch[0]);
            res.json(outline);
        } else {
            throw new Error('No JSON found in response');
        }
    } catch (error) {
        console.error('Error generating outline:', error);
        res.status(500).json({ error: error.message });
    }
});

// 重新生成单个幻灯片
app.post('/api/regenerate-slide', authenticateApiKey, async (req, res) => {
    const { slide, outline, prompt } = req.body;

    const promptText = `根据以下要求重新生成这个幻灯片：

当前幻灯片: ${JSON.stringify(slide)}
演示文稿大纲: ${outline.title}
其他幻灯片: ${JSON.stringify(outline.slides)}
用户修改要求: ${prompt}

请直接返回JSON格式的幻灯片内容，不要包含任何解释。格式：
{"type": "类型", "title": "标题", "content": ["内容项1", "内容项2", ...]}

类型可以是: title, content, features, end`;

    try {
        const result = await callMiniMax([
            { role: 'user', content: promptText }
        ]);

        // Extract JSON from response
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const slideData = JSON.parse(jsonMatch[0]);
            res.json({ slide: slideData });
        } else {
            throw new Error('无法解析AI返回的内容');
        }
    } catch (error) {
        console.error('Error regenerating slide:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/generate-html', authenticateApiKey, async (req, res) => {
    const { outline, style, editing } = req.body;

    const styleInfo = STYLE_PRESETS.find(s => s.id === style) || STYLE_PRESETS[0];

    // Get style-specific CSS
    const styleCSS = getFullStyleCSS(style, styleInfo);

    const prompt = `生成一个完整的HTML演示文稿：

演示文稿大纲: ${JSON.stringify(outline)}
风格: ${styleInfo.name} - ${styleInfo.vibe}

要求：
1. 每个幻灯片使用 <section class="slide"> 包裹
2. 内容放在 <div class="slide-content"> 中
3. 使用CSS变量定义颜色，标题使用clamp()响应式字体
4. 使用reveal类实现滚动动画
5. 包含键盘导航（左右箭头、空格）、触摸滑动、进度条、导航点

风格CSS: ${styleCSS}

请直接返回完整HTML代码，不要包含任何解释文字。HTML应该是一个完整的、可以独立运行的演示文稿。`;

    try {
        const result = await callMiniMax([
            { role: 'user', content: prompt }
        ]);

        // Extract just the HTML part
        const htmlMatch = result.match(/<html[\s\S]*<\/html>/i);
        let html = htmlMatch ? htmlMatch[0] : result;

        // Ensure the HTML has proper structure - if not, we'll wrap it
        if (!html.includes('.slide') && html.includes('<!DOCTYPE html>')) {
            // The API returned good HTML, use it as-is
        } else if (!html.includes('<!DOCTYPE html>')) {
            // Need to wrap the content in a proper HTML structure
            html = wrapInHTMLTemplate(html, outline, style, styleInfo);
        }

        res.json({ html: html });
    } catch (error) {
        console.error('Error generating HTML:', error);
        res.status(500).json({ error: error.message });
    }
});

function wrapInHTMLTemplate(content, outline, style, styleInfo) {
    const styleCSS = getFullStyleCSS(style, styleInfo);
    const slideCount = outline.slides?.length || 0;

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${outline.title || '演示文稿'}</title>
    <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=clash-display@400,500,600,700&display=swap">
    <style>
        /* === BASE STYLES === */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-snap-type: y mandatory; scroll-behavior: smooth; }
        body { height: 100%; overflow-x: hidden; }

        /* === VIEWPORT FITTING (MANDATORY) === */
        .slide {
            width: 100vw;
            height: 100vh;
            height: 100dvh;
            overflow: hidden;
            scroll-snap-align: start;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        .slide-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            max-height: 100%;
            overflow: hidden;
            padding: var(--slide-padding);
        }

        /* === TYPOGRAPHY === */
        :root {
            --title-size: clamp(2rem, 6vw, 4.5rem);
            --h2-size: clamp(1.5rem, 4vw, 3rem);
            --body-size: clamp(0.9rem, 1.5vw, 1.25rem);
            --slide-padding: clamp(1.5rem, 4vw, 4rem);
            --content-gap: clamp(1rem, 2vw, 2rem);
            ${styleCSS}
        }

        /* === ANIMATIONS === */
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .slide.visible .reveal {
            opacity: 1;
            transform: translateY(0);
        }
        .reveal:nth-child(1) { transition-delay: 0.1s; }
        .reveal:nth-child(2) { transition-delay: 0.2s; }
        .reveal:nth-child(3) { transition-delay: 0.3s; }
        .reveal:nth-child(4) { transition-delay: 0.4s; }
        .reveal:nth-child(5) { transition-delay: 0.5s; }

        /* === NAVIGATION === */
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--accent);
            z-index: 1000;
            transition: width 0.3s ease;
        }
        .nav-dots {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 1000;
        }
        .nav-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(255,255,255,0.3);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .nav-dot.active {
            background: var(--accent);
            transform: scale(1.3);
        }
        .slide-number {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 0.9rem;
            color: rgba(255,255,255,0.5);
            z-index: 1000;
        }

        /* === CONTENT STYLES === */
        h1 { font-size: var(--title-size); font-weight: 700; line-height: 1.1; margin-bottom: var(--content-gap); }
        h2 { font-size: var(--h2-size); font-weight: 600; margin-bottom: var(--content-gap); }
        p, li { font-size: var(--body-size); line-height: 1.6; }
        ul { list-style: none; }
        ul li { padding: 0.5rem 0; padding-left: 1.5rem; position: relative; }
        ul li::before { content: "→"; position: absolute; left: 0; color: var(--accent); }

        /* === RESPONSIVE === */
        @media (max-height: 700px) {
            :root { --slide-padding: clamp(1rem, 3vw, 2rem); --title-size: clamp(1.5rem, 5vw, 3rem); }
        }
        @media (max-width: 600px) {
            .nav-dots { right: 10px; }
            :root { --title-size: clamp(1.5rem, 8vw, 2.5rem); }
        }
        @media (prefers-reduced-motion: reduce) {
            * { animation-duration: 0.01ms !important; transition-duration: 0.2s !important; }
            html { scroll-behavior: auto; }
        }

        /* === BUILD ANIMATION === */
        .slide { opacity: 0; transform: scale(0.95); transition: opacity 0.5s ease, transform 0.5s ease; }
        .slide.visible { opacity: 1; transform: scale(1); }
        .slide.visible:nth-child(1) { transition-delay: 0s; }
        .slide.visible:nth-child(2) { transition-delay: 0.3s; }
        .slide.visible:nth-child(3) { transition-delay: 0.6s; }
        .slide.visible:nth-child(4) { transition-delay: 0.9s; }
        .slide.visible:nth-child(5) { transition-delay: 1.2s; }
        .slide.visible:nth-child(6) { transition-delay: 1.5s; }
        .slide.visible:nth-child(7) { transition-delay: 1.8s; }
        .slide.visible:nth-child(8) { transition-delay: 2.1s; }
        .slide.visible:nth-child(n+9) { transition-delay: 2.4s; }

        /* === USER CONTENT === */
        ${content}
    </style>
</head>
<body>
    <div class="progress-bar" id="progressBar"></div>
    <div class="nav-dots" id="navDots"></div>
    <div class="slide-number"><span id="currentSlideNum">1</span> / <span id="totalSlides">${outline.slides?.length || 0}</span></div>

    ${generateSlidesHTML(outline)}

    <script>
        class SlidePresentation {
            constructor() {
                this.slides = document.querySelectorAll('.slide');
                this.totalSlides = this.slides.length;
                this.currentSlide = 0;
                this.setupIntersectionObserver();
                this.setupKeyboardNav();
                this.setupTouchNav();
                this.setupProgressBar();
                this.setupNavDots();
                this.updateSlideNumber();

                if (this.slides.length > 0) {
                    this.slides[0].classList.add('visible');
                }
            }

            setupIntersectionObserver() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            const index = Array.from(this.slides).indexOf(entry.target);
                            this.currentSlide = index;
                            this.updateSlideNumber();
                            this.updateNavDots();
                        }
                    });
                }, { threshold: 0.5 });

                this.slides.forEach(slide => observer.observe(slide));
            }

            setupKeyboardNav() {
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
                        e.preventDefault();
                        this.next();
                    }
                    if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                        e.preventDefault();
                        this.prev();
                    }
                    if (e.key === 'Home') {
                        e.preventDefault();
                        this.goTo(0);
                    }
                    if (e.key === 'End') {
                        e.preventDefault();
                        this.goTo(this.totalSlides - 1);
                    }
                });
            }

            setupTouchNav() {
                let startX = 0;
                let startY = 0;

                document.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                });

                document.addEventListener('touchend', (e) => {
                    const endX = e.changedTouches[0].clientX;
                    const endY = e.changedTouches[0].clientY;
                    const diffX = endX - startX;
                    const diffY = endY - startY;

                    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                        if (diffX > 0) this.prev();
                        else this.next();
                    }
                });
            }

            setupProgressBar() {
                const progressBar = document.getElementById('progressBar');
                const update = () => {
                    const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
                    progressBar.style.width = progress + '%';
                };
                this.slides.forEach((_, i) => {
                    this.slides[i].addEventListener('click', (e) => {
                        if (e.clientX > window.innerWidth / 2) this.next();
                        else this.prev();
                    });
                });
                update();
                this._updateProgress = update;
            }

            setupNavDots() {
                const dotsContainer = document.getElementById('navDots');
                for (let i = 0; i < this.totalSlides; i++) {
                    const dot = document.createElement('div');
                    dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
                    dot.addEventListener('click', () => this.goTo(i));
                    dotsContainer.appendChild(dot);
                }
            }

            updateSlideNumber() {
                document.getElementById('currentSlideNum').textContent = this.currentSlide + 1;
                document.getElementById('totalSlides').textContent = this.totalSlides;
                if (this._updateProgress) this._updateProgress();
            }

            updateNavDots() {
                document.querySelectorAll('.nav-dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === this.currentSlide);
                });
            }

            next() {
                if (this.currentSlide < this.totalSlides - 1) {
                    this.goTo(this.currentSlide + 1);
                }
            }

            prev() {
                if (this.currentSlide > 0) {
                    this.goTo(this.currentSlide - 1);
                }
            }

            goTo(index) {
                this.slides[index].scrollIntoView({ behavior: 'smooth' });
            }
        }

        new SlidePresentation();
    <\/script>
</body>
</html>`;
}

function generateSlidesHTML(outline) {
    if (!outline || !outline.slides) return '';

    return outline.slides.map((slide, index) => {
        const contentHTML = generateSlideContent(slide);

        return `    <section class="slide">
        <div class="slide-content">
            ${contentHTML}
        </div>
    </section>`;
    }).join('\n');
}

function generateSlideContent(slide) {
    const type = slide.type || 'content';
    const title = slide.title || '';
    const content = slide.content || [];

    let html = '';

    switch (type) {
        case 'title':
            html = `
                <h1 class="reveal">${title}</h1>
                ${content[0] ? `<p class="reveal" style="font-size: 1.2em; opacity: 0.7;">${content[0]}</p>` : ''}
            `;
            break;

        case 'end':
            html = `
                <h1 class="reveal">${title}</h1>
                ${content.map(c => `<p class="reveal" style="margin-top: 1rem;">${c}</p>`).join('')}
            `;
            break;

        default:
            html = `
                <h2 class="reveal">${title}</h2>
                <ul class="reveal">
                    ${content.map(c => `<li>${c}</li>`).join('')}
                </ul>
            `;
    }

    return html;
}

function getFullStyleCSS(styleId, styleInfo) {
    const styles = {
        'bold-signal': `--bg-primary: #1a1a1a; --bg-secondary: #252525; --text-primary: #ffffff; --text-secondary: #b0b0b0; --accent: #FF5722; --accent-glow: rgba(255, 87, 34, 0.4); --font-display: 'Clash Display', sans-serif; --font-body: 'Satoshi', sans-serif;`,
        'electric-studio': `--bg-primary: #0a0a0a; --bg-secondary: #151515; --text-primary: #ffffff; --text-secondary: #a0a0a0; --accent: #4361ee; --accent-glow: rgba(67, 97, 238, 0.4); --font-display: 'Clash Display', sans-serif; --font-body: 'Satoshi', sans-serif;`,
        'creative-voltage': `--bg-primary: #001a2d; --bg-secondary: #002a45; --text-primary: #ffffff; --text-secondary: #b0c4d8; --accent: #00d4ff; --accent-glow: rgba(0, 212, 255, 0.4); --font-display: 'Clash Display', sans-serif; --font-body: 'Satoshi', sans-serif;`,
        'dark-botanical': `--bg-primary: #0f0f0f; --bg-secondary: #1a1a1a; --text-primary: #f5f5f5; --text-secondary: #a0a0a0; --accent: #d4a574; --accent-glow: rgba(212, 165, 116, 0.3); --font-display: 'Clash Display', sans-serif; --font-body: 'Satoshi', sans-serif;`,
        'notebook-tabs': `--bg-primary: #f8f6f1; --bg-secondary: #f0ede5; --text-primary: #1a1a1a; --text-secondary: #666666; --accent: #e85d04; --accent-glow: rgba(232, 93, 4, 0.2); --font-display: 'Clash Display', sans-serif; --font-body: 'Satoshi', sans-serif;`,
        'pastel-geometry': `--bg-primary: #c8d9e6; --bg-secondary: #b5cad6; --text-primary: #1a1a1a; --text-secondary: #4a5568; --accent: #7c3aed; --accent-glow: rgba(124, 58, 237, 0.2); --font-display: 'Clash Display', sans-serif; --font-body: 'Satoshi', sans-serif;`,
        'split-pastel': `--bg-primary: #fefcfb; --bg-secondary: #f5f0eb; --text-primary: #1a1a1a; --text-secondary: #5a5a5a; --accent: #ec4899; --accent-glow: rgba(236, 72, 153, 0.2); --font-display: 'Clash Display', sans-serif; --font-body: 'Satoshi', sans-serif;`,
        'vintage-editorial': `--bg-primary: #f5f3ee; --bg-secondary: #eae7de; --text-primary: #1a1a1a; --text-secondary: #5a5a5a; --accent: #b45309; --accent-glow: rgba(180, 83, 9, 0.2); --font-display: 'Clash Display', sans-serif; --font-body: 'Satoshi', sans-serif;`,
        'neon-cyber': `--bg-primary: #0a0a1a; --bg-secondary: #12122a; --text-primary: #00ff88; --text-secondary: #8888aa; --accent: #00ff88; --accent-glow: rgba(0, 255, 136, 0.5); --font-display: 'Clash Display', sans-serif; --font-body: 'Satoshi', sans-serif;`,
        'terminal-green': `--bg-primary: #0d1117; --bg-secondary: #161b22; --text-primary: #00ff00; --text-secondary: #8b949e; --accent: #00ff00; --accent-glow: rgba(0, 255, 0, 0.3); --font-display: 'JetBrains Mono', monospace; --font-body: 'JetBrains Mono', monospace;`,
        'swiss-modern': `--bg-primary: #ffffff; --bg-secondary: #f5f5f5; --text-primary: #000000; --text-secondary: #666666; --accent: #ff0000; --accent-glow: rgba(255, 0, 0, 0.2); --font-display: 'Clash Display', sans-serif; --font-body: 'Satoshi', sans-serif;`,
        'paper-ink': `--bg-primary: #f5f5dc; --bg-secondary: #ebebd3; --text-primary: #2c2c2c; --text-secondary: #5a5a5a; --accent: #8b4513; --accent-glow: rgba(139, 69, 19, 0.2); --font-display: 'Clash Display', serif; --font-body: 'Satoshi', serif;`
    };

    const css = styles[styleId] || styles['bold-signal'];

    // Add background styles based on the preset
    const bgStyles = {
        'bold-signal': 'background: linear-gradient(135deg, var(--bg-primary) 0%, #1a1a2e 100%);',
        'electric-studio': 'background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);',
        'creative-voltage': 'background: linear-gradient(180deg, #001a2d 0%, #003354 50%, #001a2d 100%);',
        'dark-botanical': 'background: radial-gradient(ellipse at top, #1a1a1a 0%, #0a0a0a 100%);',
        'notebook-tabs': 'background: var(--bg-primary);',
        'pastel-geometry': 'background: linear-gradient(135deg, #c8d9e6 0%, #a8c5d6 100%);',
        'split-pastel': 'background: linear-gradient(135deg, #f5e6dc 0%, #e4dff0 50%, #f5e6dc 100%);',
        'vintage-editorial': 'background: var(--bg-primary);',
        'neon-cyber': 'background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%);',
        'terminal-green': 'background: #0d1117;',
        'swiss-modern': 'background: #ffffff;',
        'paper-ink': 'background: var(--bg-primary);'
    };

    const bgStyle = bgStyles[styleId] || bgStyles['bold-signal'];

    return `${css}
        body { ${bgStyle} color: var(--text-primary); font-family: var(--font-body); }
        .slide { ${bgStyle} }`;
}

function getStyleCSS(styleId) {
    const styles = {
        'bold-signal': `--bg-primary: #1a1a1a; --card-bg: #FF5722; font: Archivo Black for display, Space Grotesk for body`,
        'electric-studio': `--bg-dark: #0a0a0a; --accent-blue: #4361ee; font: Manrope for display and body`,
        'creative-voltage': `--bg-primary: #0066ff; --accent-neon: #d4ff00; font: Syne for display, Space Mono for mono`,
        'dark-botanical': `--bg-primary: #0f0f0f; --accent-warm: #d4a574; font: Cormorant for display, IBM Plex Sans for body`,
        'notebook-tabs': `--bg-page: #f8f6f1; font: Bodoni Moda for display, DM Sans for body`,
        'pastel-geometry': `--bg-primary: #c8d9e6; font: Plus Jakarta Sans for display and body`,
        'split-pastel': `--bg-peach: #f5e6dc; --bg-lavender: #e4dff0; font: Outfit for display and body`,
        'vintage-editorial': `--bg-cream: #f5f3ee; font: Fraunces for display, Work Sans for body`
    };

    return styles[styleId] || styles['bold-signal'];
}

// Serve main app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Xiangyu Slides API running at http://localhost:${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/api`);
});
