const fs = require('fs');
const path = require('path');

function createInitialData() {
    return {
        users: {},
        apiKeys: {},
        usage: {}
    };
}

function detectVercel(rootDir) {
    return process.env.VERCEL === '1'
        || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined
        || process.env.VERCEL_REGION !== undefined
        || !fs.existsSync(path.join(rootDir, 'data.json'));
}

function createRuntimeConfig(options = {}) {
    const rootDir = options.rootDir || path.resolve(__dirname, '../..');
    const isVercel = detectVercel(rootDir);

    return {
        rootDir,
        isVercel,
        PORT: Number(process.env.PORT || options.port || 3001),
        DATA_FILE: path.join(rootDir, 'data.json'),
        PUBLIC_DIR: path.join(rootDir, 'public'),
        PRESENTATIONS_DIR: path.join(rootDir, 'presentations'),
        ASSETS_DIR: path.join(rootDir, 'assets'),
        SKILLS_FILE: path.join(rootDir, 'skills.json')
    };
}

function ensureRuntimeDirs(config) {
    if (config.isVercel) {
        return;
    }

    [config.PRESENTATIONS_DIR, config.ASSETS_DIR].forEach((dirPath) => {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    });

    if (!fs.existsSync(config.DATA_FILE)) {
        fs.writeFileSync(config.DATA_FILE, JSON.stringify(createInitialData(), null, 2));
    }
}

module.exports = {
    createInitialData,
    createRuntimeConfig,
    ensureRuntimeDirs
};
