const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const { createRuntimeConfig, ensureRuntimeDirs } = require('./server/config/runtime');
const { createMiniMaxClient } = require('./server/ai/minimax-client');
const { createAuthService } = require('./server/services/auth-service');
const { createOutlineService } = require('./server/services/outline-service');
const { createCopilotService } = require('./server/services/copilot-service');
const { createPresentationService } = require('./server/services/presentation-service');
const { createPresentationStore } = require('./server/storage/presentation-store');
const { createAssetStore } = require('./server/storage/asset-store');
const { createCopilotThreadStore } = require('./server/storage/copilot-thread-store');
const { createMediaTaskStore } = require('./server/storage/media-task-store');
const { createLangfuseTracer } = require('./server/observability/langfuse-tracer');
const { createTriggerExecutor } = require('./server/execution/trigger-executor');
const { createAuthRoutes } = require('./server/api/auth-routes');
const { createInternalRoutes } = require('./server/api/internal-routes');
const { createMetaRoutes } = require('./server/api/meta-routes');
const { createPresentationRoutes } = require('./server/api/presentation-routes');
const { createPageRoutes } = require('./server/api/page-routes');

const config = createRuntimeConfig({ rootDir: __dirname });
ensureRuntimeDirs(config);

const app = express();
const miniMaxClient = createMiniMaxClient();
const presentationStore = createPresentationStore({ config });
const assetStore = createAssetStore({ config });
const copilotThreadStore = createCopilotThreadStore({ config });
const mediaTaskStore = createMediaTaskStore({ config });
const agentObservability = createLangfuseTracer({ config });
const triggerExecutor = createTriggerExecutor({ config });
const authService = createAuthService({ config });
const outlineService = createOutlineService({ miniMaxClient });
const presentationService = createPresentationService({
    assetStore,
    outlineService,
    presentationStore
});
const copilotService = createCopilotService({
    miniMaxClient,
    outlineService,
    presentationService,
    threadStore: copilotThreadStore,
    observability: agentObservability,
    execution: triggerExecutor,
    mediaTaskStore
});

app.use(cors());
app.use(bodyParser.json());
app.use('/assets', express.static(config.ASSETS_DIR));
if (fs.existsSync(config.CLIENT_DIST_DIR)) {
    app.use(express.static(config.CLIENT_DIST_DIR, { index: false }));
}
app.use(express.static(config.PUBLIC_DIR, { index: false }));

app.use('/api/auth', createAuthRoutes({ authService }));
app.use('/api/internal', createInternalRoutes({
    config,
    copilotService
}));
app.use('/api', createMetaRoutes({
    config,
    agentRuntime: {
        observability: agentObservability,
        execution: triggerExecutor,
        mediaTaskStore
    }
}));
app.use('/api', createPresentationRoutes({
    authenticateApiKey: authService.authenticateApiKey,
    copilotService,
    outlineService,
    presentationService,
    presentationStore
}));
app.use(createPageRoutes({
    publicDir: config.PUBLIC_DIR,
    clientDistDir: config.CLIENT_DIST_DIR
}));

const server = app.listen(config.PORT, () => {
    console.log(`Xiangyu Slides API running at http://localhost:${config.PORT}`);
    console.log(`API Documentation: http://localhost:${config.PORT}/api`);
});

module.exports = { app, server };
