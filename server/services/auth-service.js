const crypto = require('crypto');
const { createInitialData } = require('../config/runtime');
const { readJsonFile, writeJsonFile } = require('../storage/file-json-store');

function createAuthService({ config }) {
    let memoryData = config.isVercel ? createInitialData() : null;

    function readData() {
        if (config.isVercel) {
            return memoryData;
        }

        return readJsonFile(config.DATA_FILE, createInitialData());
    }

    function saveData(data) {
        if (config.isVercel) {
            memoryData = data;
            return;
        }

        writeJsonFile(config.DATA_FILE, data);
    }

    function generateApiKey() {
        return `xy_${crypto.randomBytes(16).toString('hex')}`;
    }

    function register({ email, password }) {
        if (!email || !password) {
            throw new Error('Email and password required');
        }

        const data = readData();
        const existingUser = Object.values(data.users).find((user) => user.email === email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const userId = `user_${crypto.randomBytes(8).toString('hex')}`;
        const apiKey = generateApiKey();

        data.users[userId] = {
            id: userId,
            email,
            password,
            createdAt: new Date().toISOString(),
            isPro: false,
            freeUsesRemaining: 10
        };
        data.apiKeys[apiKey] = userId;
        data.usage[userId] = {
            count: 0,
            month: new Date().getMonth()
        };

        saveData(data);

        return {
            success: true,
            user: { id: userId, email },
            apiKey,
            message: 'Account created successfully'
        };
    }

    function login({ email, password }) {
        const data = readData();
        const user = Object.values(data.users).find((item) => item.email === email && item.password === password);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        let apiKey = Object.keys(data.apiKeys).find((key) => data.apiKeys[key] === user.id);
        if (!apiKey) {
            apiKey = generateApiKey();
            data.apiKeys[apiKey] = user.id;
            saveData(data);
        }

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                isPro: user.isPro
            },
            apiKey
        };
    }

    function getCurrentUser({ userId, user, isLocalMode }) {
        if (isLocalMode) {
            return {
                mode: 'local',
                message: 'Local development mode'
            };
        }

        const data = readData();
        const usage = data.usage[userId] || { count: 0 };

        return {
            user,
            usage: {
                used: usage.count,
                limit: user?.isPro ? 'unlimited' : 10,
                isPro: Boolean(user?.isPro)
            }
        };
    }

    function upgrade({ userId, plan }) {
        const data = readData();
        const user = data.users[userId];
        if (!user) {
            throw new Error('User not found');
        }

        if (plan === 'pro') {
            user.isPro = true;
            user.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        }

        saveData(data);

        return {
            success: true,
            message: plan === 'pro' ? 'Upgraded to Pro plan' : 'Plan updated',
            isPro: user.isPro
        };
    }

    function authenticateApiKey(req, res, next) {
        const authHeader = req.headers.authorization;
        const apiKey = authHeader ? authHeader.replace('Bearer ', '') : null;

        if (!apiKey) {
            req.isLocalMode = true;
            req.userId = 'local';
            req.usage = {
                used: 0,
                limit: 'unlimited'
            };
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

        if (user.expiresAt && new Date(user.expiresAt) < new Date()) {
            return res.status(403).json({ error: 'API Key expired' });
        }

        const currentMonth = new Date().getMonth();
        const usage = data.usage[userId] || { count: 0, month: currentMonth };
        if (usage.month !== currentMonth) {
            usage.count = 0;
            usage.month = currentMonth;
        }

        usage.count += 1;
        data.usage[userId] = usage;
        saveData(data);

        req.userId = userId;
        req.user = user;
        req.usage = {
            used: usage.count,
            limit: user.isPro ? 'unlimited' : 10
        };
        next();
    }

    return {
        authenticateApiKey,
        getCurrentUser,
        login,
        register,
        upgrade
    };
}

module.exports = {
    createAuthService
};
