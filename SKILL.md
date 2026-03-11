---
name: xiangyu-slides
homepage: http://localhost:3001
description: "Xiangyu Slides: AI 演示文稿生成器 - 输入主题自动生成精美 HTML 演示文稿"
env:
  - API_URL
requires:
  - sessions_spawn
permissions:
  network:
    - "http://localhost:3001"
  filesystem:
    write:
      - "~/.openclaw/workspace/"
---

# Xiangyu Slides

AI 驱动的演示文稿生成器，通过 API 生成精美的 HTML 幻灯片。

## 前提条件

1. 克隆项目：
```bash
git clone https://github.com/kyirexy/xiangyuSlides.git
cd xiangyuSlides
npm install
```

2. 启动服务：
```bash
node server.js
# 服务运行在 http://localhost:3001
```

## 工作原理

这个 Skill 通过调用 REST API 生成演示文稿：
- API 基础 URL: `http://localhost:3001`
- 无需认证（本地模式）

## 工具

### 1. generate_presentation_outline

生成演示文稿大纲。

**参数：**
- `topic` (必填): 演示文稿主题
- `purpose` (可选): 用途 - teaching/pitch/product/meeting/company/tech/personal/story/marketing/event
- `length` (可选): 长度 - short/medium/long

**调用示例：**
```bash
curl -X POST http://localhost:3001/api/generate-outline \
  -H "Content-Type: application/json" \
  -d '{"topic":"AI发展趋势","purpose":"teaching","length":"medium"}'
```

### 2. generate_presentation_html

生成完整的 HTML 演示文稿文件。

**参数：**
- `topic` (必填): 演示文稿主题
- `purpose` (可选): 用途
- `length` (可选): 长度
- `style` (可选): 风格 ID
- `output` (可选): 输出文件路径

**可用风格：**
- `bold-signal` - 大胆
- `electric-studio` - 电光
- `creative-voltage` - 创意
- `dark-botanical` - 森系
- `notebook-tabs` - 笔记
- `pastel-geometry` - 粉彩
- `split-pastel` - 分割
- `vintage-editorial` - 复古
- `neon-cyber` - 赛博
- `terminal-green` - 终端
- `swiss-modern` - 瑞士
- `paper-ink` - 纸张

### 3. list_presentation_styles

获取所有可用的演示文稿风格。

## 使用流程

1. 用户请求创建演示文稿
2. 调用 `generate_presentation_outline` 获取大纲
3. 确认大纲内容
4. 调用 `generate_presentation_html` 生成完整 HTML
5. 告诉用户文件位置和如何查看

## 使用示例

**用户：** 帮我做一个关于 AI 发展的演示文稿

**你：**
```bash
# 1. 生成大纲
curl -X POST http://localhost:3001/api/generate-outline \
  -H "Content-Type: application/json" \
  -d '{"topic":"AI人工智能发展","purpose":"teaching","length":"medium"}'

# 2. 基于大纲生成 HTML
curl -X POST http://localhost:3001/api/generate-html \
  -H "Content-Type: application/json" \
  -d '{"outline":{...},"style":"bold-signal"}'
```

**结果：** 返回完整的 HTML 文件，可以直接在浏览器打开。

## 注意事项

- 确保服务正在运行
- 生成的文件是独立的 HTML，无需网络即可查看
- 支持响应式设计，适配桌面和移动设备
