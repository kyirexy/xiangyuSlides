---
name: baoyu-slides-gen
description: AI 演示文稿生成与小红书发布工具。调用 frontend-slides API 生成 HTML 演示文稿，转换为小红书图片并自动发布。
---

# Baoyu Slides Gen

AI 演示文稿生成与小红书发布工具。

## 核心功能

1. **生成演示文稿** — 调用 frontend-slides API 生成 HTML 演示文稿
2. **转换为图片** — 将幻灯片转换为小红书九宫格图片
3. **自动发布** — 发布到小红书（微信公众号）

## 使用场景

当用户请求：
- "帮我做个 XX 主题的 PPT"
- "生成一个关于 XX 的演示文稿"
- "做一个 XX 相关的 PPT，发小红书"

## 工作流程

### Step 1: 收集信息

使用 AskUserQuestion 一次性收集：

**Question 1 — 主题** (header: "主题"):
演示文稿的主题是什么？例如：后羿射日、AI发展趋势

**Question 2 — 用途** (header: "用途"):
这个演示文稿的用途？
- 融资演讲
- 教学培训
- 会议演讲
- 内部演示

**Question 3 — 风格** (header: "风格"):
喜欢哪种视觉风格？
- Bold Signal (大胆现代)
- Creative Voltage (创意能量)
- Dark Botanical (暗黑优雅)
- Notebook Tabs (笔记风格)
- Pastel Geometry (粉彩几何)
- Split Pastel (粉彩分割)
- 其他风格

**Question 4 — 发布** (header: "发布"):
是否需要发布到小红书？
- 是，生成图片并发布
- 否，只生成 HTML 演示文稿

### Step 2: 生成演示文稿

调用 frontend-slides API：

```javascript
// POST http://localhost:3007/api/generate-outline
{
    "purpose": "teaching",
    "length": "medium",
    "topic": "主题",
    "content": "内容概要"
}

// POST http://localhost:3007/api/generate-html
{
    "outline": {...},
    "style": "bold-signal",
    "editing": false
}
```

获取返回的 HTML 内容。

### Step 3: 转换为小红书图片 (如需要)

如果用户选择发布到小红书：

使用 **baoyu-xhs-images** skill 将内容转换为小红书图片：

```javascript
// 调用 baoyu-xhs-images
topic: "演示文稿主题"
content: "幻灯片内容摘要"
style: "cartoon" // 小红书风格
```

### Step 4: 发布到小红书 (如需要)

使用 **baoyu-post-to-wechat** skill 发布：

```javascript
// 调用 baoyu-post-to-wechat
type: "image-text" // 图文消息
title: "演示文稿标题"
content: "内容描述"
images: [生成的图片base64或URL]
```

## API 参考

### 本地 API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `http://localhost:3007/api/styles` | GET | 获取可用风格列表 |
| `http://localhost:3007/api/generate-outline` | POST | 生成大纲 |
| `http://localhost:3007/api/generate-html` | POST | 生成 HTML |

### 请求示例

```javascript
// 生成大纲
fetch('http://localhost:3007/api/generate-outline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        purpose: 'teaching',
        length: 'medium',
        topic: '后羿射日',
        content: '中国古代神话故事'
    })
})

// 生成 HTML
fetch('http://localhost:3007/api/generate-html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        outline: outlineData,
        style: 'bold-signal',
        editing: false
    })
})
```

## 输出格式

返回给用户：

1. **HTML 文件** — 完整的演示文稿，可下载
2. **预览链接** — 浏览器直接预览
3. **小红书图片** (如选择发布)
4. **发布状态** (如选择发布)

## 注意事项

- 确保 localhost:3007 服务正在运行
- 小红书发布需要配置账号 Cookie
- 图片生成可能需要几分钟时间
