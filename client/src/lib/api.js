async function request(path, options = {}) {
    return fetch(path, options);
}

export async function getStyles() {
    const response = await request('/api/styles');
    if (!response.ok) {
        throw new Error(`Failed to load styles: ${response.status}`);
    }
    return response.json();
}

export async function planCopilot(payload) {
    const response = await request('/api/copilot/plan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Copilot plan failed: ${response.status}`);
    }

    return response.json();
}

export async function planCopilotStream(payload, onEvent) {
    const response = await request('/api/copilot/plan', {
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

    if (!response.ok || !response.body) {
        throw new Error(`Copilot plan failed: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalResult = null;

    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }

        buffer += decoder.decode(value, { stream: true });
        buffer = parseSseChunk(buffer, (event) => {
            onEvent?.(event);
            if (event.kind === 'result') {
                finalResult = event;
            }
        });
    }

    if (buffer.trim()) {
        parseSseChunk(`${buffer}\n\n`, (event) => {
            onEvent?.(event);
            if (event.kind === 'result') {
                finalResult = event;
            }
        });
    }

    if (!finalResult) {
        throw new Error('Copilot plan stream ended without a final result.');
    }

    return finalResult;
}

export async function streamCopilotAgui(payload, onEvent) {
    const response = await request('/api/copilot/agui', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok || !response.body) {
        throw new Error(`Copilot AG-UI stream failed: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalResult = null;

    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }

        buffer += decoder.decode(value, { stream: true });
        buffer = parseSseChunk(buffer, (event) => {
            onEvent?.(event);
            if (event.type === 'RUN_FINISHED') {
                finalResult = event;
            }
        });
    }

    if (buffer.trim()) {
        parseSseChunk(`${buffer}\n\n`, (event) => {
            onEvent?.(event);
            if (event.type === 'RUN_FINISHED') {
                finalResult = event;
            }
        });
    }

    if (!finalResult) {
        throw new Error('Copilot AG-UI stream ended without RUN_FINISHED.');
    }

    return finalResult;
}

export async function getPresentationRecord(presentationId) {
    const response = await request(`/api/presentations/${presentationId}`);
    if (!response.ok) {
        throw new Error(`Failed to load presentation: ${response.status}`);
    }
    return response.json();
}

export async function getCopilotThread(threadId) {
    const response = await request(`/api/copilot/threads/${threadId}`);
    if (!response.ok) {
        throw new Error(`Failed to load thread: ${response.status}`);
    }
    return response.json();
}

function parseSseChunk(buffer, onEvent) {
    const parts = buffer.split(/\n\n+/);
    const incomplete = parts.pop() || '';

    parts.forEach((chunk) => {
        const line = chunk
            .split(/\n/)
            .find((item) => item.startsWith('data: '));
        if (!line) {
            return;
        }

        try {
            onEvent(JSON.parse(line.slice(6)));
        } catch (error) {
            // Ignore malformed event chunks and continue the stream.
        }
    });

    return incomplete;
}

export async function buildCopilotStream(payload, onEvent) {
    const response = await request('/api/copilot/build/stream', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok || !response.body) {
        throw new Error(`Copilot build failed: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }

        buffer += decoder.decode(value, { stream: true });
        buffer = parseSseChunk(buffer, onEvent);
    }

    if (buffer.trim()) {
        parseSseChunk(`${buffer}\n\n`, onEvent);
    }
}
