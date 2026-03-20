const https = require('https');

const DEFAULT_API_KEY = process.env.MINIMAX_API_KEY || 'sk-cp-263Wz751k5CYbX3tUcZZ7hyL7W5h7s7xHbTftIztYxXuSFylcAgymsR8rGxBom8UtnhePBvDUmjuHtXC5JXc1z778oslqxDqINJuvgf6SL9zhdXAEGYU0UM';

function createMiniMaxClient(options = {}) {
    const apiKey = options.apiKey || DEFAULT_API_KEY;
    const model = options.model || 'MiniMax-M2.5-highspeed';

    return {
        chat(messages, requestOptions = {}) {
            return new Promise((resolve, reject) => {
                const payload = JSON.stringify({
                    model,
                    messages,
                    max_tokens: requestOptions.maxTokens || 8000,
                    temperature: requestOptions.temperature ?? 0.7
                });

                const req = https.request({
                    hostname: 'api.minimaxi.com',
                    path: '/v1/text/chatcompletion_v2',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    }
                }, (res) => {
                    let body = '';
                    res.on('data', (chunk) => {
                        body += chunk;
                    });
                    res.on('end', () => {
                        try {
                            const response = JSON.parse(body);
                            if (response.choices && response.choices[0]) {
                                resolve(response.choices[0].message.content);
                                return;
                            }

                            reject(new Error(`Invalid API response: ${body}`));
                        } catch (error) {
                            reject(error);
                        }
                    });
                });

                req.on('error', reject);
                req.write(payload);
                req.end();
            });
        }
    };
}

module.exports = {
    createMiniMaxClient
};
