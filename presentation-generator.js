const { getTheme } = require('./server/generator/theme-registry');
const { normalizeOutline } = require('./server/generator/normalize-outline');
const { renderHtmlFromOutline } = require('./server/generator/html-renderer');
const { exportPptxFromOutline } = require('./server/generator/pptx-renderer');

function renderPresentationHtml(outlineInput, styleId) {
    return renderHtmlFromOutline(outlineInput, styleId);
}

function exportPresentationPptx(outlineInput, styleId) {
    return exportPptxFromOutline(outlineInput, styleId);
}

module.exports = {
    normalizeOutline,
    renderPresentationHtml,
    exportPresentationPptx,
    getTheme
};
