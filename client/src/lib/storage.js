const RECENT_STORAGE_KEY = 'xiangyu-slides-recent-presentations';

function safeWindow() {
    return typeof window !== 'undefined' ? window : null;
}

export function readRecentPresentations() {
    const win = safeWindow();
    if (!win) {
        return [];
    }

    try {
        const raw = win.localStorage.getItem(RECENT_STORAGE_KEY);
        const parsed = JSON.parse(raw || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

export function writeRecentPresentations(items) {
    const win = safeWindow();
    if (!win) {
        return;
    }

    win.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(items.slice(0, 8)));
}

export function pushRecentPresentation(item) {
    const normalizedItem = {
        ...item,
        workspaceUrl: item?.workspaceUrl || '',
        threadId: item?.threadId || ''
    };
    const next = [normalizedItem, ...readRecentPresentations().filter((entry) => entry.id !== item.id)];
    writeRecentPresentations(next);
    return next;
}
