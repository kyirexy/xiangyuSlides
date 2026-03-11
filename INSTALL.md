# Xiangyu Slides - 在 OpenClaw 中使用

## 安装提示词

复制以下内容到 OpenClaw 即可使用：

```
# Xiangyu Slides Skill

## 描述
AI 演示文稿生成器 - 输入主题自动生成精美 HTML 演示文稿

## 配置
API_URL: http://localhost:3001

## 工具
1. generate_presentation_outline - 生成演示文稿大纲
   - topic: string (必填) - 演示文稿主题
   - purpose: string - 用途 (teaching/pitch/product/meeting/company/tech/personal/story/marketing/event)
   - length: string - 长度 (short/medium/long)

2. generate_presentation_html - 生成演示文稿 HTML
   - topic: string (必填) - 演示文稿主题
   - purpose: string - 用途
   - length: string - 长度
   - style: string - 风格 (bold-signal/electric-studio/creative-voltage/dark-botanical/notebook-tabs/pastel-geometry/split-pastel/vintage-editorial/neon-cyber/terminal-green/swiss-modern/paper-ink)
   - output: string - 输出文件路径

3. list_presentation_styles - 获取可用风格

## 使用示例
用户: 帮我做一个关于AI的演示文稿
你: 调用 generate_presentation_html 工具，topic="AI人工智能发展"，purpose="teaching"，length="medium"，style="bold-signal"

## 注意
确保服务正在运行: cd xiangyu-slides-app && node server.js
```

---

## 快速开始

### 1. 启动服务
```bash
git clone https://github.com/kyirexy/xiangyuSlides.git
cd xiangyuSlides
npm install
node server.js
```

### 2. 在 OpenClaw 中使用

复制上方的安装提示词到 OpenClaw，即可生成演示文稿！

---

## API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/generate-outline` | POST | 生成大纲 |
| `/api/generate-html` | POST | 生成 HTML |
| `/api/styles` | GET | 风格列表 |
| `/api/skills` | GET | 技能注册 |
