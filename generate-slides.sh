#!/bin/bash

# Xiangyu Slides Generator Script
# 用法: ./generate-slides.sh "主题" [用途] [长度] [风格] [输出文件]

TOPIC="${1:-}"
PURPOSE="${2:-teaching}"
LENGTH="${3:-medium}"
STYLE="${4:-bold-signal}"
OUTPUT="${5:-presentation.html}"
API_URL="${API_URL:-http://localhost:3001}"

if [ -z "$TOPIC" ]; then
    echo "用法: ./generate-slides.sh <主题> [用途] [长度] [风格] [输出文件]"
    echo "示例: ./generate-slides.sh 'AI发展' teaching medium bold-signal my-slides.html"
    exit 1
fi

echo "🎯 主题: $TOPIC"
echo "📋 用途: $PURPOSE"
echo "📄 长度: $LENGTH"
echo "🎨 风格: $STYLE"
echo "💾 输出: $OUTPUT"
echo ""

# 生成大纲
echo "📝 正在生成大纲..."
OUTLINE=$(curl -s -X POST "$API_URL/api/generate-outline" \
    -H "Content-Type: application/json" \
    -d "{\"topic\":\"$TOPIC\",\"purpose\":\"$PURPOSE\",\"length\":\"$LENGTH\"}")

if echo "$OUTLINE" | grep -q "error"; then
    echo "❌ 生成大纲失败: $OUTLINE"
    exit 1
fi

echo "✅ 大纲生成完成"

# 生成 HTML
echo "🎨 正在生成演示文稿..."
HTML_RESULT=$(curl -s -X POST "$API_URL/api/generate-html" \
    -H "Content-Type: application/json" \
    -d "{\"outline\":$OUTLINE,\"style\":\"$STYLE\"}")

# 提取 HTML
HTML=$(echo "$HTML_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('html',''))" 2>/dev/null || echo "$HTML_RESULT")

if [ -z "$HTML" ] || echo "$HTML" | grep -q "error"; then
    echo "❌ 生成 HTML 失败"
    exit 1
fi

# 保存文件
echo "$HTML" > "$OUTPUT"
echo ""
echo "✅ 演示文稿已保存到: $OUTPUT"
echo "📂 可以在浏览器中打开查看"
