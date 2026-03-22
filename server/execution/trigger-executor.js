const crypto = require('crypto');

const TASK_IDS = {
    image_generation: 'xiangyu.media.image',
    tts_generation: 'xiangyu.media.audio',
    video_generation: 'xiangyu.media.video'
};

function createTaskId(prefix = 'task') {
    return `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;
}

function tryLoadTriggerSdk() {
    try {
        return require('@trigger.dev/sdk');
    } catch (error) {
        return null;
    }
}

function resolveTaskIdentifier(kind) {
    return TASK_IDS[kind] || 'xiangyu.media.generic';
}

function createLocalTaskResult(task) {
    return {
        id: createTaskId('media'),
        status: 'queued',
        provider: 'local',
        providerTaskId: '',
        task
    };
}

function createTriggerExecutor({ config } = {}) {
    const apiKey = process.env.TRIGGER_SECRET_KEY || '';
    const projectRef = process.env.TRIGGER_PROJECT_REF || config?.TRIGGER_PROJECT_REF || '';
    const apiUrl = process.env.TRIGGER_API_URL || config?.TRIGGER_API_URL || '';
    const baseUrl = process.env.APP_BASE_URL || config?.APP_BASE_URL || '';
    const callbackSecret = process.env.MEDIA_TASK_CALLBACK_SECRET || config?.MEDIA_TASK_CALLBACK_SECRET || '';
    const triggerModule = apiKey ? tryLoadTriggerSdk() : null;
    const tasksClient = triggerModule?.tasks || null;
    if (triggerModule?.configure && apiKey) {
        triggerModule.configure({
            accessToken: apiKey,
            baseURL: apiUrl || undefined
        });
    }

    const enabled = Boolean(apiKey && projectRef && baseUrl && callbackSecret && tasksClient);

    if (!enabled) {
        return {
            provider: 'local',
            enabled: false,
            describe() {
                return {
                    provider: 'local',
                    enabled: false,
                    projectRef: projectRef || null,
                    baseUrl: baseUrl || null,
                    apiUrl: apiUrl || null
                };
            },
            async enqueueMediaTask(task) {
                return createLocalTaskResult(task);
            }
        };
    }

    return {
        provider: 'trigger.dev',
        enabled: true,
        describe() {
            return {
                provider: 'trigger.dev',
                enabled: true,
                projectRef,
                baseUrl,
                apiUrl: apiUrl || null
            };
        },
        async enqueueMediaTask(task) {
            const id = createTaskId('media');
            const callbackUrl = `${baseUrl.replace(/\/$/, '')}/api/internal/media-tasks/${id}/callback`;
            const taskId = resolveTaskIdentifier(task.kind);
            const handle = await tasksClient.trigger(taskId, {
                taskId: id,
                kind: task.kind,
                label: task.label || task.kind,
                threadId: task.threadId || '',
                presentationId: task.presentationId || '',
                payload: task.payload || {},
                callbackUrl,
                callbackSecret
            });

            return {
                id,
                status: 'queued',
                provider: 'trigger.dev',
                providerTaskId: handle?.id || handle?.runId || '',
                task
            };
        }
    };
}

module.exports = {
    createTriggerExecutor
};
