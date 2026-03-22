function createNoopSpan(metadata = {}) {
    return {
        metadata,
        record() {},
        update() {},
        end() {},
        fail() {}
    };
}

function createNoopTracer() {
    return {
        provider: 'noop',
        enabled: false,
        describe() {
            return {
                provider: 'noop',
                enabled: false
            };
        },
        startSpan(_name, metadata = {}) {
            return createNoopSpan(metadata);
        },
        async flush() {}
    };
}

function buildTraceMetadata(metadata = {}) {
    return {
        ...(metadata.metadata || {}),
        threadId: metadata.threadId || undefined,
        presentationId: metadata.presentationId || undefined,
        taskId: metadata.taskId || undefined
    };
}

function createLangfuseSpan(trace, metadata = {}) {
    return {
        metadata,
        record(stepName, payload = {}) {
            trace.span({
                name: stepName,
                input: payload.input || undefined,
                output: payload.output || undefined,
                metadata: {
                    ...buildTraceMetadata(metadata),
                    ...(payload.metadata || {})
                },
                level: payload.level || 'DEFAULT',
                statusMessage: payload.statusMessage || undefined
            });
        },
        update(payload = {}) {
            trace.update({
                output: payload.output || undefined,
                metadata: {
                    ...buildTraceMetadata(metadata),
                    ...(payload.metadata || {})
                }
            });
        },
        end(payload = {}) {
            trace.update({
                output: payload.output || undefined,
                metadata: {
                    ...buildTraceMetadata(metadata),
                    ...(payload.metadata || {})
                }
            });
        },
        fail(error, payload = {}) {
            trace.event({
                name: 'error',
                level: 'ERROR',
                statusMessage: error?.message || String(error || 'Unknown error'),
                metadata: {
                    ...buildTraceMetadata(metadata),
                    ...(payload.metadata || {})
                },
                input: payload.input || undefined
            });
        }
    };
}

function tryLoadLangfuse() {
    try {
        return require('langfuse');
    } catch (error) {
        return null;
    }
}

function createLangfuseTracer({ config } = {}) {
    const secretKey = process.env.LANGFUSE_SECRET_KEY || '';
    const publicKey = process.env.LANGFUSE_PUBLIC_KEY || '';
    const baseUrl = process.env.LANGFUSE_BASE_URL || '';
    const enabled = Boolean(secretKey && publicKey);

    if (!enabled) {
        return createNoopTracer();
    }

    const langfuseModule = tryLoadLangfuse();
    const Langfuse = langfuseModule?.Langfuse;
    if (!Langfuse) {
        return createNoopTracer();
    }

    const client = new Langfuse({
        secretKey,
        publicKey,
        baseUrl: baseUrl || undefined
    });

    return {
        provider: 'langfuse',
        enabled: true,
        describe() {
            return {
                provider: 'langfuse',
                enabled: true,
                baseUrl: baseUrl || null,
                rootDir: config?.rootDir || null
            };
        },
        startSpan(name, metadata = {}) {
            const trace = client.trace({
                name,
                input: metadata.input || undefined,
                metadata: buildTraceMetadata(metadata)
            });
            return createLangfuseSpan(trace, metadata);
        },
        async flush() {
            if (typeof client.flushAsync === 'function') {
                await client.flushAsync();
            } else if (typeof client.flush === 'function') {
                await client.flush();
            }
        }
    };
}

module.exports = {
    createLangfuseTracer
};
