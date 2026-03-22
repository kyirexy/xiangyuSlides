const { spawn } = require('child_process');

const PORT = Number(process.env.PORT || 3012);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const STARTUP_TIMEOUT_MS = 20000;
const REQUEST_TIMEOUT_MS = 90000;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        return await fetch(url, {
            ...options,
            signal: controller.signal
        });
    } finally {
        clearTimeout(timeout);
    }
}

async function waitForServer() {
    const startedAt = Date.now();
    let lastError = null;

    while (Date.now() - startedAt < STARTUP_TIMEOUT_MS) {
        try {
            const response = await fetchWithTimeout(`${BASE_URL}/api/styles`);
            if (response.ok) {
                return;
            }
            lastError = new Error(`Unexpected status ${response.status}`);
        } catch (error) {
            lastError = error;
        }

        await sleep(500);
    }

    throw lastError || new Error('Server did not become ready in time.');
}

function parseSsePayload(raw) {
    return String(raw)
        .split(/\n\n+/)
        .map((chunk) => chunk.trim())
        .filter(Boolean)
        .map((chunk) => {
            const line = chunk
                .split(/\n/)
                .find((item) => item.startsWith('data: '));
            return line ? JSON.parse(line.slice(6)) : null;
        })
        .filter(Boolean);
}

async function assertHtmlPage(label, url, required) {
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
        throw new Error(`${label} failed with status ${response.status}`);
    }

    const body = await response.text();
    required.forEach((needle) => {
        if (!body.includes(needle)) {
            throw new Error(`${label} missing ${needle}`);
        }
    });
    console.log(`PASS ${label}`);
}

async function assertJson(label, url, validator) {
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
        throw new Error(`${label} failed with status ${response.status}`);
    }

    const payload = await response.json();
    await validator(payload, response);
    console.log(`PASS ${label}`);
    return payload;
}

async function postJson(url, payload) {
    const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    return response;
}

async function postSse(url, payload) {
    const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream'
        },
        body: JSON.stringify({
            ...payload,
            stream: true
        })
    });

    return response;
}

async function waitFor(checkFn, timeoutMs = 10000, intervalMs = 500) {
    const startedAt = Date.now();
    let lastError = null;

    while (Date.now() - startedAt < timeoutMs) {
        try {
            return await checkFn();
        } catch (error) {
            lastError = error;
        }

        await sleep(intervalMs);
    }

    throw lastError || new Error('waitFor timed out');
}

async function runChecks() {
    await assertHtmlPage('Home page (React)', `${BASE_URL}/`, [
        'data-xiangyu-react-root="true"',
        'Xiangyu Slides'
    ]);

    await assertHtmlPage('Create page (React)', `${BASE_URL}/create?lang=en`, [
        'data-xiangyu-react-root="true"',
        '/app-assets/'
    ]);

    await assertHtmlPage('Legacy create page', `${BASE_URL}/create-classic?lang=en`, [
        'toggleAdvancedModeBtn',
        'copilotInput',
        '/js/create-page.js'
    ]);

    await assertJson('Styles API', `${BASE_URL}/api/styles`, async (payload) => {
        if (!Array.isArray(payload) || payload.length === 0) {
            throw new Error('Styles API returned no styles.');
        }
    });

    const planResponse = await postSse(`${BASE_URL}/api/copilot/plan`, {
        messages: [
            {
                role: 'user',
                content: '帮我做一个中文教学演示，讲解如何用 Claude Code 协调多个 agent，偏展示型，适合现场分享。'
            }
        ],
        locale: 'zh-CN',
        uiLocale: 'zh-CN',
        outputIntent: 'showcase',
        visualPreference: 'showcase',
        allowClarification: false
    });

    if (!planResponse.ok) {
        throw new Error(`Copilot plan failed with status ${planResponse.status}`);
    }

    const planEvents = parseSsePayload(await planResponse.text());
    if (!planEvents.some((event) => event.kind === 'step')) {
        throw new Error('Copilot plan stream returned no step events.');
    }
    const planPayload = planEvents[planEvents.length - 1];
    if (!planPayload || planPayload.kind !== 'result') {
        throw new Error('Copilot plan stream returned no final result.');
    }
    if (!planPayload.draftBrief || typeof planPayload.draftBrief !== 'object') {
        throw new Error('Copilot plan returned no draftBrief.');
    }
    if (!planPayload.threadId) {
        throw new Error('Copilot plan returned no threadId.');
    }
    if (!Array.isArray(planPayload.agentSteps) || planPayload.agentSteps.length === 0) {
        throw new Error('Copilot plan returned no agentSteps.');
    }
    if (planPayload.draftBrief.locale !== 'zh-CN') {
        throw new Error(`Copilot plan returned wrong locale: ${planPayload.draftBrief.locale}`);
    }
    if (planPayload.readyToBuild !== true) {
        throw new Error('Copilot plan did not become readyToBuild.');
    }
    console.log('PASS Copilot plan');

    const buildResponse = await postJson(`${BASE_URL}/api/copilot/build/stream`, {
        draftBrief: planPayload.draftBrief,
        locale: 'zh-CN',
        threadId: planPayload.threadId
    });

    if (!buildResponse.ok) {
        throw new Error(`Copilot build failed with status ${buildResponse.status}`);
    }

    const buildEvents = parseSsePayload(await buildResponse.text());
    if (buildEvents.length === 0) {
        throw new Error('Copilot build returned no SSE events.');
    }

    const finalEvent = buildEvents[buildEvents.length - 1];
    if (finalEvent.threadId !== planPayload.threadId) {
        throw new Error('Copilot build returned mismatched threadId.');
    }
    if (!finalEvent.eventType || !finalEvent.stepLabel) {
        throw new Error('Copilot build returned no structured event fields.');
    }
    if (finalEvent.status !== 'ready') {
        throw new Error(`Copilot build did not finish ready. Final status: ${finalEvent.status}`);
    }
    if (!finalEvent.presentationId) {
        throw new Error('Copilot build returned no presentationId.');
    }
    if (!finalEvent.url || !finalEvent.pptxUrl) {
        throw new Error('Copilot build is missing output URLs.');
    }
    console.log('PASS Copilot build stream');

    await assertJson(
        'Copilot thread restore',
        `${BASE_URL}/api/copilot/threads/${planPayload.threadId}`,
        async (payload) => {
            if (payload.id !== planPayload.threadId) {
                throw new Error('Thread restore returned mismatched id.');
            }
            if (!payload.activePresentationId) {
                throw new Error('Thread restore is missing activePresentationId.');
            }
            if (!Array.isArray(payload.lastBuildArtifacts) || payload.lastBuildArtifacts.length === 0) {
                throw new Error('Thread restore is missing lastBuildArtifacts.');
            }
            if (!Array.isArray(payload.mediaTaskSummary) || payload.mediaTaskSummary.length === 0) {
                throw new Error('Thread restore is missing mediaTaskSummary.');
            }
        }
    );

    await waitFor(async () => {
        const response = await fetchWithTimeout(`${BASE_URL}/api/copilot/threads/${planPayload.threadId}`);
        if (!response.ok) {
            throw new Error(`Thread poll failed with status ${response.status}`);
        }

        const payload = await response.json();
        const statuses = Array.isArray(payload.mediaTaskSummary)
            ? payload.mediaTaskSummary.map((item) => item.status)
            : [];
        if (!statuses.some((status) => status === 'running' || status === 'ready')) {
            throw new Error('Media tasks did not advance past queued.');
        }
        return payload;
    }, 12000, 800);
    console.log('PASS Media task status writeback');

    const presentationId = finalEvent.presentationId;
    const metadata = await assertJson(
        'Presentation compatibility response',
        `${BASE_URL}/api/presentations/${presentationId}`,
        async (payload) => {
            if (!payload.html || !payload.outline || !Array.isArray(payload.outline.slides)) {
                throw new Error('Compatibility response missing html or outline.');
            }
            if (!payload.pptxUrl) {
                throw new Error('Compatibility response missing pptxUrl.');
            }
        }
    );

    const spec = await assertJson(
        'Presentation spec',
        `${BASE_URL}/api/presentations/${presentationId}/spec`,
        async (payload) => {
            if (payload.schemaVersion !== 'presentation/v1') {
                throw new Error(`Unexpected schemaVersion: ${payload.schemaVersion}`);
            }
            if (!Array.isArray(payload.scenes) || payload.scenes.length === 0) {
                throw new Error('Spec returned no scenes.');
            }
        }
    );

    await assertHtmlPage(
        'Preview page',
        `${BASE_URL}/presentations/${presentationId}?lang=en`,
        ['preview-frame', 'toolbarTitle', '/js/presentation-viewer.js']
    );

    const runtimeResponse = await fetchWithTimeout(`${BASE_URL}/presentation-runtime.html?id=${presentationId}&lang=en`);
    if (!runtimeResponse.ok) {
        throw new Error(`Runtime shell failed with status ${runtimeResponse.status}`);
    }
    const runtimeBody = await runtimeResponse.text();
    ['runtimeShell', '/js/presentation-runtime.js', 'subtitleText'].forEach((needle) => {
        if (!runtimeBody.includes(needle)) {
            throw new Error(`Runtime shell missing ${needle}`);
        }
    });
    console.log('PASS Runtime shell');

    const htmlResponse = await fetchWithTimeout(`${BASE_URL}/api/presentations/${presentationId}/html`);
    if (!htmlResponse.ok) {
        throw new Error(`Presentation HTML failed with status ${htmlResponse.status}`);
    }
    const html = await htmlResponse.text();
    if (!html.includes('<!DOCTYPE html>')) {
        throw new Error('Presentation HTML is missing doctype.');
    }
    console.log('PASS Presentation HTML');

    const pptxResponse = await fetchWithTimeout(`${BASE_URL}/api/presentations/${presentationId}/export.pptx`);
    if (!pptxResponse.ok) {
        throw new Error(`PPTX export failed with status ${pptxResponse.status}`);
    }
    const contentType = pptxResponse.headers.get('content-type') || '';
    if (!contentType.includes('presentationml.presentation')) {
        throw new Error(`Unexpected PPTX content-type: ${contentType}`);
    }
    const pptxBuffer = Buffer.from(await pptxResponse.arrayBuffer());
    if (pptxBuffer.length < 1000) {
        throw new Error('PPTX export looks too small.');
    }
    console.log('PASS Presentation PPTX');

    console.log(JSON.stringify({
        presentationId,
        locale: planPayload.draftBrief.locale,
        scenes: spec.scenes.length,
        slides: metadata.outline.slides.length,
        finalStatus: finalEvent.status,
        previewUrl: `${BASE_URL}${finalEvent.url}`,
        pptxUrl: `${BASE_URL}${finalEvent.pptxUrl}`
    }, null, 2));
}

async function main() {
    const child = spawn(process.execPath, ['server.js'], {
        cwd: process.cwd(),
        env: {
            ...process.env,
            PORT: String(PORT)
        },
        stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
        stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
        stderr += chunk.toString();
    });

    try {
        await waitForServer();
        await runChecks();
        console.log(`MVP smoke passed on ${BASE_URL}`);
    } catch (error) {
        console.error(`MVP smoke failed: ${error.message}`);
        if (stdout.trim()) {
            console.error('--- server stdout ---');
            console.error(stdout.trim());
        }
        if (stderr.trim()) {
            console.error('--- server stderr ---');
            console.error(stderr.trim());
        }
        process.exitCode = 1;
    } finally {
        if (!child.killed) {
            child.kill();
        }
    }
}

main();
