// ==================== 首页 JavaScript ====================

// ==================== 飘字背景效果 ====================
function initTextBackground() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 背景文字 - 项目名和特点
    const bgTexts = [
        'XiangyuSlides', 'Video', 'PPT', 'AI', '演示文稿',
        '生成', '创建', '设计', '制作', '渲染',
        'Slides', 'Present', 'Design', 'Create', 'AI',
        'Agent', '智能', '自动化', '快速', '高效'
    ];

    const colors = [
        'rgba(14, 165, 233, 0.08)',
        'rgba(236, 72, 153, 0.08)',
        'rgba(34, 197, 94, 0.08)',
        'rgba(249, 115, 22, 0.08)',
        'rgba(168, 85, 247, 0.07)',
    ];

    const fontSize = 18;
    const gap = 120;
    const columns = Math.floor(canvas.width / gap);
    const rows = Math.floor(canvas.height / gap);

    const textGrid = [];
    for (let i = 0; i < columns; i++) {
        textGrid[i] = [];
        for (let j = 0; j < rows; j++) {
            textGrid[i][j] = {
                text: bgTexts[Math.floor(Math.random() * bgTexts.length)],
                alpha: Math.random() * 0.25 + 0.05,
                speed: 0.3 + Math.random() * 0.4,
                offset: Math.random() * gap,
                startY: -30 - Math.random() * 100 // 从上方开始
            };
        }
    }

    function draw() {
        // 半透明白色背景
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                const cell = textGrid[i][j];
                const x = i * gap + cell.offset;
                // 从上往下飘
                const y = cell.startY + (Date.now() * cell.speed * 0.01) % (canvas.height + 60);

                if (y > -30 && y < canvas.height + 30) {
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    ctx.fillStyle = color;
                    ctx.font = fontSize + 'px sans-serif';
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

// ==================== 打字机效果 (循环多个关键词) ====================
function initTypewriter() {
    // 要循环显示的关键词
    const phrases = [
        'Agent',
        'AI 前端模拟工具',
        'AI 演示文档'
    ];

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
            // 正在输入
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentPhrase.length) {
                // 短语输入完成，等待后开始删除
                setTimeout(() => {
                    isDeleting = true;
                    typeWriter();
                }, pauseTime);
                return;
            }
        } else {
            // 正在删除
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                // 当前短语删除完成，切换到下一个
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }

        const speed = isDeleting ? deleteSpeed : typeSpeed;
        setTimeout(typeWriter, speed);
    }

    setTimeout(typeWriter, 500);
}

// ==================== 页面加载完成后初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initTextBackground();
    initTypewriter();
});
