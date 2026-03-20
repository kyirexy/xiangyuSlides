const express = require('express');

function writeSseEvent(res, payload) {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function createPresentationRoutes({
    authenticateApiKey,
    copilotService,
    outlineService,
    presentationService,
    presentationStore
}) {
    const router = express.Router();

    router.get('/presentations/:id', async (req, res) => {
        const { id } = req.params;
        if (!presentationStore.isValidId(id)) {
            return res.status(400).json({ error: 'Invalid presentation id' });
        }

        const record = await presentationService.getPresentationResponse(id);
        if (!record) {
            return res.status(404).json({ error: 'Presentation not found' });
        }

        res.json(record);
    });

    router.get('/presentations/:id/spec', async (req, res) => {
        const { id } = req.params;
        if (!presentationStore.isValidId(id)) {
            return res.status(400).json({ error: 'Invalid presentation id' });
        }

        const presentation = await presentationService.getPresentationSpec(id);
        if (!presentation) {
            return res.status(404).json({ error: 'Presentation not found' });
        }

        res.json(presentation);
    });

    router.get('/presentations/:id/html', async (req, res) => {
        const { id } = req.params;
        if (!presentationStore.isValidId(id)) {
            return res.status(400).json({ error: 'Invalid presentation id' });
        }

        const html = await presentationService.getPresentationHtml(id);
        if (!html) {
            return res.status(404).json({ error: 'Presentation HTML not found' });
        }

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    });

    router.get('/presentations/:id/export.pptx', async (req, res) => {
        const { id } = req.params;
        if (!presentationStore.isValidId(id)) {
            return res.status(400).json({ error: 'Invalid presentation id' });
        }

        try {
            const result = await presentationService.exportPresentationPptx(id);
            if (!result) {
                return res.status(404).json({ error: 'Presentation not found' });
            }

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="${encodeURIComponent(result.fileName || id)}.pptx"`
            );
            res.send(result.buffer);
        } catch (error) {
            console.error('Error exporting PPTX:', error);
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/generate', authenticateApiKey, async (req, res) => {
        const { topic, purpose, length, style, content } = req.body || {};
        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        try {
            const result = await presentationService.generateFromTopic({
                topic,
                purpose,
                length,
                style,
                content
            });

            res.json({
                ...result,
                usage: req.usage || {
                    used: 0,
                    limit: 'unlimited'
                }
            });
        } catch (error) {
            console.error('Error in generate:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.post('/generate-outline', authenticateApiKey, async (req, res) => {
        const { content, topic } = req.body || {};
        let { purpose, length } = req.body || {};

        if (!topic || topic.trim().length < 3) {
            return res.json({
                clarification: true,
                message: 'Please provide a clearer presentation topic.'
            });
        }

        purpose = purpose || 'teaching';
        length = length || 'medium';

        try {
            const outline = await outlineService.generateStableOutline({ topic, purpose, length, content });
            res.json(outline);
        } catch (error) {
            console.error('Error generating outline:', error);
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/regenerate-slide', authenticateApiKey, async (req, res) => {
        try {
            const slide = await outlineService.regenerateSlide(req.body || {});
            res.json({ slide });
        } catch (error) {
            console.error('Error regenerating slide:', error);
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/copilot/plan', authenticateApiKey, async (req, res) => {
        const { messages, locale, uiLocale, outputIntent, visualPreference, allowClarification } = req.body || {};
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'messages are required' });
        }

        try {
            const result = await copilotService.plan({
                messages,
                locale,
                uiLocale,
                outputIntent,
                visualPreference,
                allowClarification: allowClarification !== false
            });

            res.json(result);
        } catch (error) {
            console.error('Error planning copilot draft:', error);
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/copilot/build/stream', authenticateApiKey, async (req, res) => {
        const { draftBrief, locale, presentationId } = req.body || {};

        if (!draftBrief || typeof draftBrief !== 'object') {
            return res.status(400).json({ error: 'draftBrief is required' });
        }

        const resolvedPresentationId = presentationId || copilotService.generatePresentationId();
        if (!presentationStore.isValidId(resolvedPresentationId)) {
            return res.status(400).json({ error: 'A valid presentationId is required' });
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');

        try {
            await copilotService.buildStream({
                draftBrief,
                locale,
                ownerId: req.userId,
                presentationId: resolvedPresentationId,
                onProgress(payload) {
                    writeSseEvent(res, payload);
                }
            });

            setTimeout(() => res.end(), 120);
        } catch (error) {
            console.error('Error in copilot build:', error);
            writeSseEvent(res, {
                presentationId: resolvedPresentationId,
                progress: -1,
                step: 1,
                message: `Generation failed: ${error.message}`,
                status: 'failed',
                url: `/presentations/${resolvedPresentationId}`,
                pptxUrl: `/api/presentations/${resolvedPresentationId}/export.pptx`,
                error: error.message
            });
            res.end();
        }
    });

    router.post('/presentations/generate', authenticateApiKey, async (req, res) => {
        const { outline, presentationId, style } = req.body || {};

        if (!presentationStore.isValidId(presentationId)) {
            return res.status(400).json({ error: 'A valid presentationId is required' });
        }

        if (!outline || !Array.isArray(outline.slides) || outline.slides.length === 0) {
            return res.status(400).json({ error: 'Outline with slides is required' });
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');

        try {
            await presentationService.buildPresentation({
                presentationId,
                outline,
                style,
                ownerId: req.userId,
                onProgress(payload) {
                    writeSseEvent(res, payload);
                }
            });

            setTimeout(() => res.end(), 120);
        } catch (error) {
            console.error('Error generating presentation record:', error);
            writeSseEvent(res, {
                presentationId,
                progress: -1,
                step: 4,
                message: `Generation failed: ${error.message}`,
                status: 'failed',
                url: `/presentations/${presentationId}`,
                pptxUrl: `/api/presentations/${presentationId}/export.pptx`,
                error: error.message
            });
            res.end();
        }
    });

    router.post('/generate-html', authenticateApiKey, async (req, res) => {
        const { outline, style } = req.body || {};

        if (!outline || !Array.isArray(outline.slides) || outline.slides.length === 0) {
            return res.status(400).json({ error: 'Outline with slides is required' });
        }

        try {
            res.json(await presentationService.generateHtml({ outline, style }));
        } catch (error) {
            console.error('Error generating HTML:', error);
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/generate/stream', authenticateApiKey, async (req, res) => {
        const { topic, purpose, length, style, content } = req.body || {};

        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');

        try {
            await presentationService.generateStream({
                topic,
                purpose,
                length,
                style,
                content,
                onProgress(payload) {
                    writeSseEvent(res, payload);
                }
            });

            setTimeout(() => res.end(), 120);
        } catch (error) {
            console.error('Error in stream generate:', error);
            writeSseEvent(res, {
                progress: -1,
                message: `Generation failed: ${error.message}`,
                error: error.message
            });
            res.end();
        }
    });

    return router;
}

module.exports = {
    createPresentationRoutes
};
