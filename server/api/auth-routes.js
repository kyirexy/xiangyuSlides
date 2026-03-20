const express = require('express');

function createAuthRoutes({ authService }) {
    const router = express.Router();

    router.post('/register', (req, res) => {
        try {
            res.json(authService.register(req.body || {}));
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.post('/login', (req, res) => {
        try {
            res.json(authService.login(req.body || {}));
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    });

    router.get('/me', authService.authenticateApiKey, (req, res) => {
        res.json(authService.getCurrentUser({
            userId: req.userId,
            user: req.user,
            isLocalMode: req.isLocalMode
        }));
    });

    router.post('/upgrade', authService.authenticateApiKey, (req, res) => {
        try {
            res.json(authService.upgrade({
                userId: req.userId,
                plan: req.body?.plan
            }));
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    return router;
}

module.exports = {
    createAuthRoutes
};
