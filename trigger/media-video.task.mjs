import { logger, task } from '@trigger.dev/sdk/v3';
import { buildMediaResult, postMediaTaskCallback, sleep } from './shared/media-callback.mjs';

export const videoGenerationTask = task({
    id: 'xiangyu.media.video',
    run: async (payload) => {
        await postMediaTaskCallback(payload, {
            status: 'running',
            provider: 'trigger.dev',
            result: {
                message: `${payload.label} is running`
            }
        });

        try {
            await sleep(2600);
            const result = buildMediaResult(payload, {
                assetUrl: `/assets/generated/${payload.taskId}.mp4`
            });
            await postMediaTaskCallback(payload, {
                status: 'ready',
                provider: 'trigger.dev',
                providerTaskId: payload.taskId,
                result
            });
            logger.info('Video media task completed', {
                taskId: payload.taskId,
                presentationId: payload.presentationId
            });
            return result;
        } catch (error) {
            await postMediaTaskCallback(payload, {
                status: 'failed',
                provider: 'trigger.dev',
                providerTaskId: payload.taskId,
                error: error?.message || 'Video generation failed'
            });
            throw error;
        }
    }
});
