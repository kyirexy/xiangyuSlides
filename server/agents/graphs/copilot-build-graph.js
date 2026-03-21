const { Annotation, END, MemorySaver, START, StateGraph } = require('@langchain/langgraph');

const BuildState = Annotation.Root({
    threadId: Annotation(),
    presentationId: Annotation(),
    ownerId: Annotation(),
    locale: Annotation(),
    draftBrief: Annotation(),
    normalizedBrief: Annotation(),
    outline: Annotation(),
    enrichedOutline: Annotation(),
    buildResult: Annotation()
});

function createCopilotBuildGraph({
    normalizeBriefNode,
    generateOutlineNode,
    enrichOutlineNode,
    buildPresentationNode
}) {
    const graph = new StateGraph(BuildState)
        .addNode('normalize_brief', async (state) => normalizeBriefNode(state))
        .addNode('generate_outline', async (state) => generateOutlineNode(state))
        .addNode('enrich_outline', async (state) => enrichOutlineNode(state))
        .addNode('build_presentation', async (state) => buildPresentationNode(state))
        .addEdge(START, 'normalize_brief')
        .addEdge('normalize_brief', 'generate_outline')
        .addEdge('generate_outline', 'enrich_outline')
        .addEdge('enrich_outline', 'build_presentation')
        .addEdge('build_presentation', END);

    return graph.compile({
        checkpointer: new MemorySaver(),
        name: 'presentation-copilot-build'
    });
}

module.exports = {
    createCopilotBuildGraph
};
