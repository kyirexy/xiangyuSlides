const { spawn } = require('child_process');

const PORT = Number(process.env.PORT || 3011);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const STARTUP_TIMEOUT_MS = 20000;
const REQUEST_TIMEOUT_MS = 8000;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        return response;
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

async function runChecks() {
    const checks = [
        {
            label: 'Home page',
            url: `${BASE_URL}/`,
            validate: async (response) => {
                const body = await response.text();
                const required = [
                    'data-xiangyu-react-root="true"',
                    'Xiangyu Slides'
                ];

                required.forEach((needle) => {
                    if (!body.includes(needle)) {
                        throw new Error(`Missing ${needle}`);
                    }
                });
            }
        },
        {
            label: 'Legacy create page',
            url: `${BASE_URL}/create-classic?lang=en`,
            validate: async (response) => {
                const body = await response.text();
                const required = [
                    'toggleAdvancedModeBtn',
                    'copilotInput',
                    '/js/create-page.js'
                ];

                required.forEach((needle) => {
                    if (!body.includes(needle)) {
                        throw new Error(`Missing ${needle}`);
                    }
                });
            }
        },
        {
            label: 'React create page',
            url: `${BASE_URL}/create?lang=en`,
            validate: async (response) => {
                const body = await response.text();
                const required = [
                    'data-xiangyu-react-root="true"',
                    '/app-assets/'
                ];

                required.forEach((needle) => {
                    if (!body.includes(needle)) {
                        throw new Error(`Missing ${needle}`);
                    }
                });
            }
        },
        {
            label: 'Preview page route',
            url: `${BASE_URL}/presentations/demo?lang=en`,
            validate: async (response) => {
                const body = await response.text();
                const required = [
                    'preview-frame',
                    'toolbarTitle',
                    '/js/presentation-viewer.js'
                ];

                required.forEach((needle) => {
                    if (!body.includes(needle)) {
                        throw new Error(`Missing ${needle}`);
                    }
                });
            }
        },
        {
            label: 'Preview shell alias',
            url: `${BASE_URL}/preview?id=demo&lang=en`,
            validate: async (response) => {
                const body = await response.text();
                const required = [
                    'preview-frame',
                    'toolbarTitle',
                    '/js/presentation-viewer.js'
                ];

                required.forEach((needle) => {
                    if (!body.includes(needle)) {
                        throw new Error(`Missing ${needle}`);
                    }
                });
            }
        },
        {
            label: 'Runtime shell',
            url: `${BASE_URL}/presentation-runtime.html?id=demo&lang=en`,
            validate: async (response) => {
                const body = await response.text();
                const required = [
                    'runtimeShell',
                    '/js/presentation-runtime.js',
                    '/js/presentation-runtime-families.js',
                    '/css/presentation-runtime-families.css',
                    'subtitleText'
                ];

                required.forEach((needle) => {
                    if (!body.includes(needle)) {
                        throw new Error(`Missing ${needle}`);
                    }
                });
            }
        },
        {
            label: 'Styles API',
            url: `${BASE_URL}/api/styles`,
            validate: async (response) => {
                const payload = await response.json();
                if (!Array.isArray(payload) || payload.length === 0) {
                    throw new Error('Styles API returned no styles.');
                }
            }
        }
    ];

    for (const check of checks) {
        const response = await fetchWithTimeout(check.url);
        if (!response.ok) {
            throw new Error(`${check.label} failed with status ${response.status}`);
        }
        await check.validate(response);
        console.log(`PASS ${check.label}`);
    }
}

async function main() {
    const child = spawn(process.execPath, ['server.js'], {
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
        console.log(`Frontend smoke passed on ${BASE_URL}`);
    } catch (error) {
        console.error(`Frontend smoke failed: ${error.message}`);
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
