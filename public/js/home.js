const HOME_I18N = {
    'zh-CN': {
        pageTitle: 'Xiangyu Slides - AI 演示文稿生成器',
        navHome: '首页',
        navCreate: '创建',
        themeToggle: '切换主题',
        login: '登录',
        register: '注册',
        heroSubtitle: '输入主题，AI 自动创建精美演示文稿',
        createBtn: '开始创建',
        agentBtn: 'Agent 集成',
        pricingTitle: '价格方案',
        pricingSubtitle: '选择适合你的方案',
        freeTitle: '免费版',
        freeDesc: '适合体验和轻量使用',
        freeFeatures: ['每月 10 次生成', '12 种风格选择', 'HTML 文件导出'],
        freeBtn: '当前方案',
        proTitle: '专业版',
        proDesc: '适合频繁使用和商业场景',
        proFeatures: ['无限次生成', '12 种风格选择', '优先技术支持'],
        proBtn: '立即升级',
        footerText: '© 2024 Xiangyu Slides. Built with MiniMax AI.',
        installTitle: 'Agent 集成',
        installBody: '复制以下提示词到你的 Agent（如 OpenClaw），即可直接调用 Xiangyu Slides 生成演示文稿。',
        installInfo: '提示：首次使用需启动服务 node server.js',
        installPrompt: `# Xiangyu Slides Skill

## 描述
AI 演示文稿生成器 - 输入主题自动生成精美 HTML 演示文稿

## 配置
API_URL: http://localhost:3001

## 工具
1. generate_presentation_outline - 生成演示文稿大纲
   - topic: string (必填) - 演示文稿主题
   - purpose: string - 用途 (teaching/pitch/product/meeting/company/tech/personal/story/marketing/event)
   - length: string - 长度 (short/medium/long)

2. generate_presentation_html - 生成演示文稿 HTML 并保存
   - topic: string (必填) - 演示文稿主题
   - purpose: string - 用途
   - length: string - 长度
   - style: string - 风格 (bold-signal/electric-studio/creative-voltage/dark-botanical/notebook-tabs/pastel-geometry/split-pastel/vintage-editorial/neon-cyber/terminal-green/swiss-modern/paper-ink)
   - output: string - 输出文件路径（如 slides.html）

3. list_presentation_styles - 获取可用风格

## 使用示例
用户: 帮我做一个 AI 演示文稿
你: 调用 generate_presentation_html，topic="AI 人工智能发展"，purpose="teaching"，length="medium"，style="bold-signal"，output="ai-slides.html"

## 注意
确保服务正在运行: node server.js (端口 3001)`,
        loginTitle: '登录',
        emailLabel: '邮箱',
        emailPlaceholder: '请输入邮箱',
        passwordLabel: '密码',
        passwordPlaceholder: '请输入密码',
        loginSubmit: '登录',
        loginFooterPrefix: '还没有账号？',
        loginFooterAction: '立即注册',
        registerTitle: '注册',
        usernameLabel: '用户名',
        usernamePlaceholder: '请输入用户名',
        registerPasswordPlaceholder: '请输入密码（至少6位）',
        confirmPasswordLabel: '确认密码',
        confirmPasswordPlaceholder: '请再次输入密码',
        registerSubmit: '注册',
        registerFooterPrefix: '已有账号？',
        registerFooterAction: '立即登录',
        typewriterPhrases: ['Agent', 'AI 前端辅助工具', 'AI 演示文稿'],
        bgTexts: [
            'XiangyuSlides', 'Video', 'PPT', 'AI', '演示文稿',
            '生成', '创建', '设计', '制作', '讲解',
            'Slides', 'Present', 'Design', 'Create', 'AI',
            'Agent', '智能', '自动化', '快速', '高效'
        ]
    },
    en: {
        pageTitle: 'Xiangyu Slides - AI Presentation Generator',
        navHome: 'Home',
        navCreate: 'Create',
        themeToggle: 'Toggle theme',
        login: 'Login',
        register: 'Register',
        heroSubtitle: 'Enter a topic and let AI build a polished presentation for you',
        createBtn: 'Start Creating',
        agentBtn: 'Agent Integration',
        pricingTitle: 'Pricing',
        pricingSubtitle: 'Choose the plan that fits your workflow',
        freeTitle: 'Free',
        freeDesc: 'Best for trying it out and light usage',
        freeFeatures: ['10 generations per month', '12 style presets', 'HTML export'],
        freeBtn: 'Current Plan',
        proTitle: 'Pro',
        proDesc: 'Best for frequent use and business scenarios',
        proFeatures: ['Unlimited generations', '12 style presets', 'Priority support'],
        proBtn: 'Upgrade Now',
        footerText: '© 2024 Xiangyu Slides. Built with MiniMax AI.',
        installTitle: 'Agent Integration',
        installBody: 'Copy the prompt below into your Agent client, such as OpenClaw, to generate presentations directly with Xiangyu Slides.',
        installInfo: 'Tip: start the service first with node server.js',
        installPrompt: `# Xiangyu Slides Skill

## Description
AI presentation generator that turns a topic into a polished HTML deck.

## Config
API_URL: http://localhost:3001

## Tools
1. generate_presentation_outline - Generate a presentation outline
   - topic: string (required) - Presentation topic
   - purpose: string - Use case (teaching/pitch/product/meeting/company/tech/personal/story/marketing/event)
   - length: string - Length (short/medium/long)

2. generate_presentation_html - Generate and save presentation HTML
   - topic: string (required) - Presentation topic
   - purpose: string - Use case
   - length: string - Length
   - style: string - Style preset
   - output: string - Output file path, for example slides.html

3. list_presentation_styles - List available style presets

## Example
User: Create an AI presentation
You: Call generate_presentation_html with topic="AI development", purpose="teaching", length="medium", style="bold-signal", output="ai-slides.html"

## Note
Make sure the service is running: node server.js (port 3001)`,
        loginTitle: 'Login',
        emailLabel: 'Email',
        emailPlaceholder: 'Enter your email',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter your password',
        loginSubmit: 'Login',
        loginFooterPrefix: 'No account yet?',
        loginFooterAction: 'Register now',
        registerTitle: 'Register',
        usernameLabel: 'Username',
        usernamePlaceholder: 'Enter your username',
        registerPasswordPlaceholder: 'Enter your password (at least 6 characters)',
        confirmPasswordLabel: 'Confirm Password',
        confirmPasswordPlaceholder: 'Re-enter your password',
        registerSubmit: 'Register',
        registerFooterPrefix: 'Already have an account?',
        registerFooterAction: 'Log in now',
        typewriterPhrases: ['Agent', 'AI Frontend Copilot', 'AI Presentations'],
        bgTexts: [
            'XiangyuSlides', 'Video', 'PPT', 'AI', 'Presentation',
            'Generate', 'Create', 'Design', 'Compose', 'Explain',
            'Slides', 'Present', 'Design', 'Create', 'AI',
            'Agent', 'Smart', 'Automation', 'Fast', 'Efficient'
        ]
    }
};

function getHomeLocale() {
    if (window.XiangyuI18n?.resolveLocale) {
        return window.XiangyuI18n.resolveLocale();
    }

    const requested = String(new URLSearchParams(window.location.search).get('lang') || '').trim().toLowerCase();
    return requested.startsWith('zh') ? 'zh-CN' : 'en';
}

function setTextWithIcon(element, label) {
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

function applyHomeI18n() {
    const locale = getHomeLocale();
    const copy = HOME_I18N[locale] || HOME_I18N.en;

    window.XiangyuI18n?.setPageLocale?.(locale);
    document.title = copy.pageTitle;

    setTextWithIcon(document.getElementById('homeNavHome'), copy.navHome);
    setTextWithIcon(document.getElementById('homeNavCreate'), copy.navCreate);
    setTextWithIcon(document.getElementById('homeLoginLink'), copy.login);
    setTextWithIcon(document.getElementById('homeRegisterLink'), copy.register);
    setTextWithIcon(document.getElementById('homeCreateBtn'), copy.createBtn);
    setTextWithIcon(document.getElementById('homeAgentBtn'), copy.agentBtn);

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.title = copy.themeToggle;
    }

    const heroSubtitle = document.getElementById('homeHeroSubtitle');
    if (heroSubtitle) {
        heroSubtitle.textContent = copy.heroSubtitle;
    }

    const pricingTitle = document.getElementById('pricingTitle');
    const pricingSubtitle = document.getElementById('pricingSubtitle');
    const pricingFreeTitle = document.getElementById('pricingFreeTitle');
    const pricingFreeDesc = document.getElementById('pricingFreeDesc');
    const pricingFreeBtn = document.getElementById('pricingFreeBtn');
    const pricingProTitle = document.getElementById('pricingProTitle');
    const pricingProDesc = document.getElementById('pricingProDesc');
    const pricingProBtn = document.getElementById('pricingProBtn');
    const footerText = document.getElementById('homeFooterText');

    if (pricingTitle) pricingTitle.textContent = copy.pricingTitle;
    if (pricingSubtitle) pricingSubtitle.textContent = copy.pricingSubtitle;
    if (pricingFreeTitle) pricingFreeTitle.textContent = copy.freeTitle;
    if (pricingFreeDesc) pricingFreeDesc.textContent = copy.freeDesc;
    if (pricingFreeBtn) pricingFreeBtn.textContent = copy.freeBtn;
    if (pricingProTitle) pricingProTitle.textContent = copy.proTitle;
    if (pricingProDesc) pricingProDesc.textContent = copy.proDesc;
    if (pricingProBtn) pricingProBtn.textContent = copy.proBtn;
    if (footerText) footerText.textContent = copy.footerText;

    const pricingCards = document.querySelectorAll('.pricing-card');
    const freeItems = pricingCards[0]?.querySelectorAll('.pricing-features li') || [];
    const proItems = pricingCards[1]?.querySelectorAll('.pricing-features li') || [];

    copy.freeFeatures.forEach((item, index) => setTextWithIcon(freeItems[index], item));
    copy.proFeatures.forEach((item, index) => setTextWithIcon(proItems[index], item));

    const installModal = document.getElementById('installModal');
    if (installModal) {
        const title = installModal.querySelector('.modal-header h3');
        const description = installModal.querySelector('.modal-body > p');
        const info = installModal.querySelector('.modal-body > div:last-child p');
        const prompt = document.getElementById('installPrompt');
        const copyText = document.getElementById('copyText');

        setTextWithIcon(title, copy.installTitle);
        if (description) description.textContent = copy.installBody;
        if (info) info.innerHTML = `<i class="ph ph-info"></i> ${copy.installInfo} <code>node server.js</code>`;
        if (prompt) prompt.textContent = copy.installPrompt;
        if (copyText) copyText.textContent = locale === 'zh-CN' ? '复制' : 'Copy';
    }

    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        setTextWithIcon(loginModal.querySelector('.modal-header h3'), copy.loginTitle);
        const labels = loginModal.querySelectorAll('.form-group label');
        if (labels[0]) labels[0].textContent = copy.emailLabel;
        if (labels[1]) labels[1].textContent = copy.passwordLabel;
        const inputs = loginModal.querySelectorAll('.form-group input');
        if (inputs[0]) inputs[0].placeholder = copy.emailPlaceholder;
        if (inputs[1]) inputs[1].placeholder = copy.passwordPlaceholder;
        const submit = loginModal.querySelector('.btn-auth-submit');
        if (submit) submit.textContent = copy.loginSubmit;
        const footer = loginModal.querySelector('.auth-footer');
        if (footer) {
            footer.innerHTML = `${copy.loginFooterPrefix}<a href="#" onclick="switchToRegister()">${copy.loginFooterAction}</a>`;
        }
    }

    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        setTextWithIcon(registerModal.querySelector('.modal-header h3'), copy.registerTitle);
        const labels = registerModal.querySelectorAll('.form-group label');
        if (labels[0]) labels[0].textContent = copy.usernameLabel;
        if (labels[1]) labels[1].textContent = copy.emailLabel;
        if (labels[2]) labels[2].textContent = copy.passwordLabel;
        if (labels[3]) labels[3].textContent = copy.confirmPasswordLabel;
        const inputs = registerModal.querySelectorAll('.form-group input');
        if (inputs[0]) inputs[0].placeholder = copy.usernamePlaceholder;
        if (inputs[1]) inputs[1].placeholder = copy.emailPlaceholder;
        if (inputs[2]) inputs[2].placeholder = copy.registerPasswordPlaceholder;
        if (inputs[3]) inputs[3].placeholder = copy.confirmPasswordPlaceholder;
        const submit = registerModal.querySelector('.btn-auth-submit');
        if (submit) submit.textContent = copy.registerSubmit;
        const footer = registerModal.querySelector('.auth-footer');
        if (footer) {
            footer.innerHTML = `${copy.registerFooterPrefix}<a href="#" onclick="switchToLogin()">${copy.registerFooterAction}</a>`;
        }
    }

    return copy;
}

function initTextBackground(copy) {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const bgTexts = Array.isArray(copy?.bgTexts) ? copy.bgTexts : HOME_I18N['zh-CN'].bgTexts;
    const colors = [
        'rgba(14, 165, 233, 0.08)',
        'rgba(236, 72, 153, 0.08)',
        'rgba(34, 197, 94, 0.08)',
        'rgba(249, 115, 22, 0.08)',
        'rgba(168, 85, 247, 0.07)'
    ];

    const fontSize = 18;
    const gap = 120;
    const columns = Math.max(1, Math.floor(canvas.width / gap));
    const rows = Math.max(1, Math.floor(canvas.height / gap));

    const textGrid = [];
    for (let i = 0; i < columns; i += 1) {
        textGrid[i] = [];
        for (let j = 0; j < rows; j += 1) {
            textGrid[i][j] = {
                text: bgTexts[Math.floor(Math.random() * bgTexts.length)],
                alpha: Math.random() * 0.25 + 0.05,
                speed: 0.3 + Math.random() * 0.4,
                offset: Math.random() * gap,
                startY: -30 - Math.random() * 100
            };
        }
    }

    function draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < columns; i += 1) {
            for (let j = 0; j < rows; j += 1) {
                const cell = textGrid[i][j];
                const x = i * gap + cell.offset;
                const y = cell.startY + (Date.now() * cell.speed * 0.01) % (canvas.height + 60);

                if (y > -30 && y < canvas.height + 30) {
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    ctx.fillStyle = color;
                    ctx.font = `${fontSize}px sans-serif`;
                    ctx.globalAlpha = cell.alpha;
                    ctx.textAlign = 'center';
                    ctx.fillText(cell.text, x, y);
                }
            }
        }

        ctx.globalAlpha = 1;
    }

    setInterval(draw, 60);
}

function initTypewriter(copy) {
    const phrases = Array.isArray(copy?.typewriterPhrases) ? copy.typewriterPhrases : HOME_I18N['zh-CN'].typewriterPhrases;
    const typeSpeed = 80;
    const pauseTime = 1500;
    const deleteSpeed = 40;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const element = document.getElementById('typewriter-line1');
    if (!element) return;

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex += 1;

            if (charIndex === currentPhrase.length) {
                setTimeout(() => {
                    isDeleting = true;
                    typeWriter();
                }, pauseTime);
                return;
            }
        } else {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex -= 1;

            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }

        setTimeout(typeWriter, isDeleting ? deleteSpeed : typeSpeed);
    }

    setTimeout(typeWriter, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    const copy = applyHomeI18n();
    initTextBackground(copy);
    initTypewriter(copy);
});
