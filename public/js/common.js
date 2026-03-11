// ==================== 通用 JavaScript ====================

// ==================== Toast 提示 ====================
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.className = "toast " + type;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// ==================== 主题切换 ====================
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

// ==================== Agent 集成弹窗 ====================
function initInstallModal() {
    const modal = document.getElementById('installModal');
    if (!modal) return;

    // 点击遮罩关闭弹窗
    modal.addEventListener('click', (e) => {
        if (e.target.id === 'installModal') closeInstallModal();
    });
}

function openInstallModal() {
    const modal = document.getElementById('installModal');
    if (modal) modal.classList.add('active');
}

function closeInstallModal() {
    const modal = document.getElementById('installModal');
    if (modal) modal.classList.remove('active');
}

function copyInstallPrompt() {
    const promptEl = document.getElementById('installPrompt');
    if (!promptEl) return;

    const text = promptEl.textContent;
    navigator.clipboard.writeText(text);

    const copyText = document.getElementById('copyText');
    if (copyText) {
        copyText.textContent = '已复制!';
        setTimeout(() => copyText.textContent = '复制', 2000);
    }
    showToast('提示词已复制到剪贴板');
}

// ==================== 页面加载完成后初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initInstallModal();
});
