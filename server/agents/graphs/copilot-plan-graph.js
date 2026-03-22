const { Annotation, END, MemorySaver, START, StateGraph } = require('@langchain/langgraph');

const PlanState = Annotation.Root({
    threadId: Annotation(),
    messages: Annotation(),
    locale: Annotation(),
    uiLocale: Annotation(),
    outputIntent: Annotation(),
    visualPreference: Annotation(),
    allowClarification: Annotation(),
    existingThread: Annotation(),
    reasoningMode: Annotation(),
    webSearchEnabled: Annotation(),
    selectedModelId: Annotation(),
    latestPrompt: Annotation(),
    fallbackBrief: Annotation(),
    recentMessages: Annotation(),
    contextSummary: Annotation(),
    parsedPlan: Annotation(),
    draftBrief: Annotation(),
    assistantMessage: Annotation(),
    clarification: Annotation(),
    readyToBuild: Annotation(),
    shouldClarify: Annotation()
});

function createCopilotPlanGraph({ bootstrapPlan, callModelPlan, finalizePlan }) {
    const graph = new StateGraph(PlanState)
        .addNode('bootstrap', async (state) => bootstrapPlan(state))
        .addNode('llm_plan', async (state) => callModelPlan(state))
        .addNode('finalize', async (state) => finalizePlan(state))
        .addEdge(START, 'bootstrap')
        .addEdge('bootstrap', 'llm_plan')
        .addEdge('llm_plan', 'finalize')
        .addEdge('finalize', END);

    return graph.compile({
        checkpointer: new MemorySaver(),
        name: 'presentation-copilot-plan'
    });
}

module.exports = {
    createCopilotPlanGraph
};
