const express = require('express');

function createInternalRoutes({ config, copilotService }) {
    const router = express.Router();

    router.post('/media-tasks/:id/callback', async (req, res) => {
        const expectedSecret = config.MEDIA_TASK_CALLBACK_SECRET || '';
        const receivedSecret = String(req.headers['x-xiangyu-media-secret'] || '');

        if (!expectedSecret || receivedSecret !== expectedSecret) {
            return res.status(401).json({ error: 'Unauthorized callback' });
        }

        try {
            const updatedTask = await copilotService.handleMediaTaskCallback({
                taskId: req.params.id,
                status: req.body?.status,
                result: req.body?.result,
                error: req.body?.error,
                provider: req.body?.provider,
                providerTaskId: req.body?.providerTaskId
            });

            if (!updatedTask) {
                return res.status(404).json({ error: 'Media task not found' });
            }

            res.json({
                ok: true,
                task: updatedTask
            });
        } catch (error) {
            console.error('Error handling media task callback:', error);
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}

module.exports = {
    createInternalRoutes
};
