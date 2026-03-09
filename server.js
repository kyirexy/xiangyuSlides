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

app.post('/api/generate-html', authenticateApiKey, async (req, res) => {
    const { outline, style, editing } = req.body;

    const styleInfo = STYLE_PRESETS.find(s => s.id === style) || STYLE_PRESETS[0];

    const prompt = `生成一个完整的HTML演示文稿：

演示文稿大纲: ${JSON.stringify(outline)}
风格: ${styleInfo.name}

要求：
1. 使用CSS变量定义颜色
2. 每个.slide使用height: 100vh; overflow: hidden
3. 包含键盘导航和动画

风格CSS: ${getStyleCSS(style)}

直接返回完整HTML，不要解释。`;

    try {
        const result = await callMiniMax([
            { role: 'user', content: prompt }
        ]);

        const htmlMatch = result.match(/<html[\s\S]*<\/html>/i);
        res.json({ html: htmlMatch ? htmlMatch[0] : result });
    } catch (error) {
        console.error('Error generating HTML:', error);
        res.status(500).json({ error: error.message });
    }
});

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
