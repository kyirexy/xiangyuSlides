import { logger, task } from '@trigger.dev/sdk/v3';
import { buildMediaResult, postMediaTaskCallback, sleep } from './shared/media-callback.mjs';

export const imageGenerationTask = task({
    id: 'xiangyu.media.image',
    run: async (payload) => {
        await postMediaTaskCallback(payload, {
            status: 'running',
            provider: 'trigger.dev',
            result: {
                message: `${payload.label} is running`
            }
        });

        try {
            await sleep(1200);
            const result = buildMediaResult(payload, {
                assetUrl: `/assets/generated/${payload.taskId}.png`
            });
            await postMediaTaskCallback(payload, {
                status: 'ready',
                provider: 'trigger.dev',
                providerTaskId: payload.taskId,
                result
            });
            logger.info('Image media task completed', {
                taskId: payload.taskId,
                presentationId: payload.presentationId
            });
            return result;
        } catch (error) {
            await postMediaTaskCallback(payload, {
                status: 'failed',
                provider: 'trigger.dev',
                providerTaskId: payload.taskId,
                error: error?.message || 'Image generation failed'
            });
            throw error;
        }
    }
});
