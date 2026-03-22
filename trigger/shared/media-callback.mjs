export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function postMediaTaskCallback(payload, body) {
    const response = await fetch(payload.callbackUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-xiangyu-media-secret': payload.callbackSecret
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Media callback failed (${response.status}): ${text}`);
    }

    return response.json();
}

export function buildMediaResult(payload, extra = {}) {
    return {
        message: `${payload.label} ready`,
        previewUrl: `/presentations/${payload.presentationId}`,
        assetUrl: extra.assetUrl || '',
        mediaKind: payload.kind,
        ...extra
    };
}
