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

// ==================== 登录注册弹窗 ====================
function initAuthModals() {
    // 登录弹窗
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target.id === 'loginModal') closeLoginModal();
        });
    }

    // 注册弹窗
    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        registerModal.addEventListener('click', (e) => {
            if (e.target.id === 'registerModal') closeRegisterModal();
        });
    }
}

function openLoginModal() {
    closeRegisterModal();
    closeInstallModal();
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.add('active');
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.remove('active');
}

function openRegisterModal() {
    closeLoginModal();
    closeInstallModal();
    const modal = document.getElementById('registerModal');
    if (modal) modal.classList.add('active');
}

function closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) modal.classList.remove('active');
}

function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    // 模拟登录验证
    if (email && password) {
        showToast('登录成功！欢迎回来');
        closeLoginModal();
    } else {
        showToast('请填写完整信息', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
        showToast('两次输入的密码不一致', 'error');
        return;
    }

    // 模拟注册验证
    if (username && email && password) {
        showToast('注册成功！请登录');
        closeRegisterModal();
        setTimeout(() => openLoginModal(), 500);
    } else {
        showToast('请填写完整信息', 'error');
    }
}

// ==================== 页面加载完成后初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initInstallModal();
    initAuthModals();
});
