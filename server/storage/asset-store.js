const path = require('path');
const { createMediaAssetV1 } = require('../models/presentation-v1');
const { createMemoryCollection } = require('./memory-json-store');
const { readJsonFile, writeJsonFile } = require('./file-json-store');

function createAssetStore({ config }) {
    const memoryStore = createMemoryCollection();

    function getFilePath(presentationId) {
        return path.join(config.ASSETS_DIR, `${presentationId}.json`);
    }

    function normalizeAssets(presentationId, assets = []) {
        return Array.isArray(assets)
            ? assets.map((asset, index) => createMediaAssetV1({
                id: asset?.id || `asset_${presentationId}_${index + 1}`,
                presentationId,
                ...asset
            }))
            : [];
    }

    function getByPresentationId(presentationId) {
        if (config.isVercel) {
            return memoryStore.get(presentationId) || [];
        }

        const payload = readJsonFile(getFilePath(presentationId), { presentationId, assets: [] });
        return normalizeAssets(presentationId, payload.assets);
    }

    function saveMany(presentationId, assets = []) {
        const normalized = normalizeAssets(presentationId, assets);

        if (config.isVercel) {
            memoryStore.set(presentationId, normalized);
            return normalized;
        }

        writeJsonFile(getFilePath(presentationId), {
            presentationId,
            assets: normalized
        });
        return normalized;
    }

    return {
        getByPresentationId,
        saveMany
    };
}

module.exports = {
    createAssetStore
};
