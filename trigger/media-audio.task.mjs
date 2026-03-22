import { logger, task } from '@trigger.dev/sdk/v3';
import { buildMediaResult, postMediaTaskCallback, sleep } from './shared/media-callback.mjs';

export const audioGenerationTask = task({
    id: 'xiangyu.media.audio',
    run: async (payload) => {
        await postMediaTaskCallback(payload, {
            status: 'running',
            provider: 'trigger.dev',
            result: {
                message: `${payload.label} is running`
            }
        });

        try {
            await sleep(1600);
            const result = buildMediaResult(payload, {
                assetUrl: `/assets/generated/${payload.taskId}.mp3`
            });
            await postMediaTaskCallback(payload, {
                status: 'ready',
                provider: 'trigger.dev',
                providerTaskId: payload.taskId,
                result
            });
            logger.info('Audio media task completed', {
                taskId: payload.taskId,
                presentationId: payload.presentationId
            });
            return result;
        } catch (error) {
            await postMediaTaskCallback(payload, {
                status: 'failed',
                provider: 'trigger.dev',
                providerTaskId: payload.taskId,
                error: error?.message || 'Audio generation failed'
            });
            throw error;
        }
    }
});
