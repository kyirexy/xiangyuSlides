const express = require('express');
const path = require('path');
const fs = require('fs');

function createPageRoutes({ publicDir, clientDistDir }) {
    const router = express.Router();
    const reactIndex = clientDistDir ? path.join(clientDistDir, 'index.html') : '';
    const hasReactApp = Boolean(reactIndex) && fs.existsSync(reactIndex);

    function sendReactOrLegacy(res, legacyFileName) {
        if (hasReactApp) {
            res.sendFile(reactIndex);
            return;
        }

        res.sendFile(path.join(publicDir, legacyFileName));
    }

    router.get('/create', (req, res) => {
        sendReactOrLegacy(res, 'create.html');
    });

    router.get('/create-classic', (req, res) => {
        res.sendFile(path.join(publicDir, 'create.html'));
    });

    router.get('/presentations/:id', (req, res) => {
        res.sendFile(path.join(publicDir, 'preview.html'));
    });

    router.get('/preview', (req, res) => {
        res.sendFile(path.join(publicDir, 'preview.html'));
    });

    router.get('/install', (req, res) => {
        res.sendFile(path.join(publicDir, 'install.html'));
    });

    router.get('*', (req, res) => {
        sendReactOrLegacy(res, 'index.html');
    });

    return router;
}

module.exports = {
    createPageRoutes
};
