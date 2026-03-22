const express = require('express');
const { listStylePresets } = require('../generator/theme-registry');
const { readJsonFile } = require('../storage/file-json-store');

function createMetaRoutes({ config, agentRuntime }) {
    const router = express.Router();

    router.get('/styles', (req, res) => {
        res.json(listStylePresets());
    });

    router.get('/skills', (req, res) => {
        res.json(readJsonFile(config.SKILLS_FILE, { skills: [] }));
    });

    router.get('/skills/:id', (req, res) => {
        const skills = readJsonFile(config.SKILLS_FILE, { skills: [] });
        const skill = Array.isArray(skills.skills)
            ? skills.skills.find((item) => item.id === req.params.id)
            : null;

        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        res.json(skill);
    });

    router.get('/agent/runtime', (req, res) => {
        res.json({
            orchestration: 'langgraph-js',
            execution: agentRuntime?.execution?.describe?.() || {
                provider: 'local',
                enabled: false
            },
            observability: agentRuntime?.observability?.describe?.() || {
                provider: 'noop',
                enabled: false
            },
            media: {
                statuses: agentRuntime?.mediaTaskStore?.statuses || ['queued', 'running', 'ready', 'failed']
            }
        });
    });

    return router;
}

module.exports = {
    createMetaRoutes
};
