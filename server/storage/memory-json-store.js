function createMemoryCollection(initialData = {}) {
    const state = { ...initialData };

    return {
        get(key) {
            return Object.prototype.hasOwnProperty.call(state, key) ? state[key] : null;
        },
        set(key, value) {
            state[key] = value;
            return value;
        },
        delete(key) {
            if (Object.prototype.hasOwnProperty.call(state, key)) {
                delete state[key];
                return true;
            }
            return false;
        },
        values() {
            return Object.values(state);
        },
        snapshot() {
            return { ...state };
        }
    };
}

module.exports = {
    createMemoryCollection
};
