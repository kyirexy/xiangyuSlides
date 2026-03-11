#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const API_BASE = process.env.XIANGYU_SLIDES_API || 'http://localhost:3001';

function usage() {
  console.log(`
Xiangyu Slides CLI

用法:
  xiangyu-slides generate <主题> [选项]

选项:
  --purpose, -p     用途: teaching|pitch|product|meeting|company|tech|personal|story|marketing|event
  --length, -l      长度: short|medium|long
  --style, -s       风格: bold-signal|electric-studio|creative-voltage|dark-botanical|notebook-tabs|pastel-geometry|split-pastel|vintage-editorial|neon-cyber|terminal-green|swiss-modern|paper-ink
  --output, -o      输出文件路径 (默认: presentation.html)

示例:
  xiangyu-slides generate "AI发展趋势" -p teaching -l medium -s bold-signal
  xiangyu-slides generate "产品发布会" -p product -o my-presentation.html

获取风格列表:
  xiangyu-slides styles
`);
  process.exit(1);
}

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
      headers: { 'Content-Type': 'application/json' }
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

async function getStyles() {
  return new Promise((resolve, reject) => {
    const url = new URL('/api/styles', API_BASE);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;

    const req = lib.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
  });
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'styles') {
    const styles = await getStyles();
    console.log('可用风格:');
    styles.forEach(s => console.log(`  ${s.id} - ${s.name} (${s.vibe})`));
    return;
  }

  if (command === 'generate') {
    const topic = args[1];
    if (!topic) usage();

    let purpose = 'teaching';
    let length = 'medium';
    let style = 'bold-signal';
    let output = 'presentation.html';

    for (let i = 2; i < args.length; i++) {
      const arg = args[i];
      if (arg === '-p' || arg === '--purpose') purpose = args[++i];
      else if (arg === '-l' || arg === '--length') length = args[++i];
      else if (arg === '-s' || arg === '--style') style = args[++i];
      else if (arg === '-o' || arg === '--output') output = args[++i];
    }

    console.log('正在生成演示文稿...');
    console.log(`  主题: ${topic}`);
    console.log(`  用途: ${purpose}`);
    console.log(`  长度: ${length}`);
    console.log(`  风格: ${style}`);

    try {
      const outline = await callApi('/api/generate-outline', { topic, purpose, length });
      console.log('大纲已生成...');

      const htmlResult = await callApi('/api/generate-html', { outline, style });
      const html = htmlResult.html;

      fs.writeFileSync(output, html);
      console.log(`✅ 演示文稿已保存到: ${output}`);
    } catch (e) {
      console.error('❌ 生成失败:', e.message);
      process.exit(1);
    }
    return;
  }

  usage();
}

main();
