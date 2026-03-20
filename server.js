const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createRuntimeConfig, ensureRuntimeDirs } = require('./server/config/runtime');
const { createMiniMaxClient } = require('./server/ai/minimax-client');
const { createAuthService } = require('./server/services/auth-service');
const { createOutlineService } = require('./server/services/outline-service');
const { createCopilotService } = require('./server/services/copilot-service');
const { createPresentationService } = require('./server/services/presentation-service');
const { createPresentationStore } = require('./server/storage/presentation-store');
const { createAssetStore } = require('./server/storage/asset-store');
const { createAuthRoutes } = require('./server/api/auth-routes');
const { createMetaRoutes } = require('./server/api/meta-routes');
const { createPresentationRoutes } = require('./server/api/presentation-routes');
const { createPageRoutes } = require('./server/api/page-routes');

const config = createRuntimeConfig({ rootDir: __dirname });
ensureRuntimeDirs(config);

const app = express();
const miniMaxClient = createMiniMaxClient();
const presentationStore = createPresentationStore({ config });
const assetStore = createAssetStore({ config });
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
    presentationService
});

app.use(cors());
app.use(bodyParser.json());
app.use('/assets', express.static(config.ASSETS_DIR));
app.use(express.static(config.PUBLIC_DIR, { extensions: ['html'] }));

app.use('/api/auth', createAuthRoutes({ authService }));
app.use('/api', createMetaRoutes({ config }));
app.use('/api', createPresentationRoutes({
    authenticateApiKey: authService.authenticateApiKey,
    copilotService,
    outlineService,
    presentationService,
    presentationStore
}));
app.use(createPageRoutes({ publicDir: config.PUBLIC_DIR }));

const server = app.listen(config.PORT, () => {
    console.log(`Xiangyu Slides API running at http://localhost:${config.PORT}`);
    console.log(`API Documentation: http://localhost:${config.PORT}/api`);
});

module.exports = { app, server };
