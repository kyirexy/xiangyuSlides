# Xiangyu Slides Skill

使用 AI 生成精美的 HTML 演示文稿。

## 使用场景

当用户需要创建演示文稿、PPT、幻灯片时使用此 skill。

## 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| topic | string | 是 | 演示文稿主题 |
| purpose | string | 否 | 用途: teaching/pitch/product/meeting/company/tech/personal/story/marketing/event |
| length | string | 否 | 长度: short(5-8页)/medium(8-15页)/long(15-25页) |
| style | string | 否 | 风格ID |

## 可用风格

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

## 调用方式

```bash
# 调用 API 生成演示文稿
curl -X POST http://localhost:3001/api/generate-outline \
  -H "Content-Type: application/json" \
  -d '{"topic":"AI发展趋势","purpose":"teaching","length":"medium"}'

# 获取可用风格
curl http://localhost:3001/api/styles
```

## 输出

返回完整的 HTML 演示文稿，可以直接保存为 .html 文件在浏览器中打开。
