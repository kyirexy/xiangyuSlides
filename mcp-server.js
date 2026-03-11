#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolSchema,
  ListResourcesSchema,
  ListToolsSchema,
  ReadResourceSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const https = require('https');
const http = require('http');

const API_BASE = process.env.API_BASE || 'http://localhost:3001';
const API_KEY = process.env.API_KEY || '';

// 调用你的 API
function callApi(endpoint, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_BASE);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` })
      }
    };

    const req = lib.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

// 获取风格列表
function getStyles() {
  return new Promise((resolve, reject) => {
    const url = new URL('/api/styles', API_BASE);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;

    const req = lib.get(url, { headers: API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {} }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
  });
}

const server = new Server(
  {
    name: 'xiangyu-slides',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// 列出可用工具
server.setRequestHandler(ListToolsSchema, async () => {
  return {
    tools: [
      {
        name: 'generate_presentation_outline',
        description: '生成演示文稿大纲',
        inputSchema: {
          type: 'object',
          properties: {
            topic: { type: 'string', description: '演示文稿主题' },
            purpose: { type: 'string', description: '用途: teaching/pitch/product/meeting/company/tech/personal/story/marketing/event' },
            length: { type: 'string', description: '长度: short/medium/long' }
          },
          required: ['topic']
        }
      },
      {
        name: 'generate_presentation_html',
        description: '生成演示文稿 HTML',
        inputSchema: {
          type: 'object',
          properties: {
            topic: { type: 'string', description: '演示文稿主题' },
            purpose: { type: 'string', description: '用途' },
            length: { type: 'string', description: '长度' },
            style: { type: 'string', description: '风格ID，如 bold-signal, neon-cyber' }
          },
          required: ['topic']
        }
      },
      {
        name: 'list_presentation_styles',
        description: '获取可用的演示文稿风格',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ]
  };
});

// 处理工具调用
server.setRequestHandler(CallToolSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'list_presentation_styles') {
      const styles = await getStyles();
      return { content: [{ type: 'text', text: JSON.stringify(styles, null, 2) }] };
    }

    if (name === 'generate_presentation_outline') {
      const result = await callApi('/api/generate-outline', {
        topic: args.topic,
        purpose: args.purpose || 'teaching',
        length: args.length || 'medium'
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'generate_presentation_html') {
      // 先生成大纲
      const outline = await callApi('/api/generate-outline', {
        topic: args.topic,
        purpose: args.purpose || 'teaching',
        length: args.length || 'medium'
      });

      // 再生成 HTML
      const html = await callApi('/api/generate-html', {
        outline,
        style: args.style || 'bold-signal'
      });

      return { content: [{ type: 'text', text: html.html || html }] };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return { content: [{ type: 'text', text: `Error: ${error.message}` }] };
  }
});

// 启动服务器
const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
