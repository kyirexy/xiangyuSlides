const XiangyuI18n = {
    resolveLocale() {
        const params = new URLSearchParams(window.location.search);
        const requested = String(params.get('lang') || '').trim().toLowerCase();
        const preferred = requested
            || String(document.documentElement.lang || '').trim().toLowerCase()
            || String(navigator.language || navigator.userLanguage || '').trim().toLowerCase();

        return preferred.startsWith('zh') ? 'zh-CN' : 'en';
    },

    setPageLocale(locale) {
        const resolved = locale || this.resolveLocale();
        document.documentElement.lang = resolved;
        return resolved;
    },

    interpolate(template, values = {}) {
        return String(template || '').replace(/\{(\w+)\}/g, (_, key) => {
            const value = values[key];
            return value === undefined || value === null ? '' : String(value);
        });
    }
};

const COMMON_I18N = {
    'zh-CN': {
        themeToggle: '切换主题',
        copy: '复制',
        copied: '已复制',
        installPromptCopied: '提示词已复制到剪贴板',
        loginSuccess: '登录成功，欢迎回来。',
        fillCompleteInfo: '请填写完整信息。',
        passwordMismatch: '两次输入的密码不一致。',
        registerSuccess: '注册成功，请登录。'
    },
    en: {
        themeToggle: 'Toggle theme',
        copy: 'Copy',
        copied: 'Copied',
        installPromptCopied: 'The installation prompt has been copied to the clipboard.',
        loginSuccess: 'Login successful. Welcome back.',
        fillCompleteInfo: 'Please complete all required fields.',
        passwordMismatch: 'The passwords do not match.',
        registerSuccess: 'Registration successful. Please log in.'
    }
};

window.XiangyuI18n = XiangyuI18n;

function getCommonCopy() {
    const locale = window.XiangyuI18n.resolveLocale();
    return COMMON_I18N[locale] || COMMON_I18N.en;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    themeToggle.title = getCommonCopy().themeToggle;

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        themeToggle.title = getCommonCopy().themeToggle;
    });
}

function initInstallModal() {
    const modal = document.getElementById('installModal');
    if (!modal) return;

    modal.addEventListener('click', (event) => {
        if (event.target.id === 'installModal') closeInstallModal();
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

    navigator.clipboard.writeText(promptEl.textContent);
    const copy = getCommonCopy();
    const copyText = document.getElementById('copyText');

    if (copyText) {
        copyText.textContent = copy.copied;
        setTimeout(() => {
            copyText.textContent = copy.copy;
        }, 2000);
    }

    showToast(copy.installPromptCopied);
}

function initAuthModals() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.addEventListener('click', (event) => {
            if (event.target.id === 'loginModal') closeLoginModal();
        });
    }

    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        registerModal.addEventListener('click', (event) => {
            if (event.target.id === 'registerModal') closeRegisterModal();
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

function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const copy = getCommonCopy();

    if (email && password) {
        showToast(copy.loginSuccess);
        closeLoginModal();
    } else {
        showToast(copy.fillCompleteInfo, 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const copy = getCommonCopy();

    if (password !== confirmPassword) {
        showToast(copy.passwordMismatch, 'error');
        return;
    }

    if (username && email && password) {
        showToast(copy.registerSuccess);
        closeRegisterModal();
        setTimeout(() => openLoginModal(), 500);
    } else {
        showToast(copy.fillCompleteInfo, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    XiangyuI18n.setPageLocale();
    initTheme();
    initInstallModal();
    initAuthModals();
});
