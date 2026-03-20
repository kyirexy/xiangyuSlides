const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function existsJsonFile(filePath) {
    return fs.existsSync(filePath);
}

function readJsonFile(filePath, fallback = null) {
    if (!existsJsonFile(filePath)) {
        return fallback;
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJsonFile(filePath, value) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
    return value;
}

module.exports = {
    ensureDir,
    existsJsonFile,
    readJsonFile,
    writeJsonFile
};
