const express = require('express');
const path = require('path');

function createPageRoutes({ publicDir }) {
    const router = express.Router();

    router.get('/create', (req, res) => {
        res.sendFile(path.join(publicDir, 'create.html'));
    });

    router.get('/presentations/:id', (req, res) => {
        res.sendFile(path.join(publicDir, 'preview.html'));
    });

    router.get('*', (req, res) => {
        res.sendFile(path.join(publicDir, 'index.html'));
    });

    return router;
}

module.exports = {
    createPageRoutes
};
