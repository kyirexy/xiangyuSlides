---
title: AI 多媒体演示系统 PRD
status: active
updated: 2026-03-17
summary: 将当前 AI HTML Slides Generator 渐进升级为 scene-driven 的动态演示与多媒体内容系统，为动画、媒体、Agent 与短视频输出打基础。
---

# AI 多媒体演示系统 PRD

## 1. 文档目的

这份文档用于统一产品方向，明确项目从「AI HTML Slides Generator」升级到「AI 多媒体演示系统」的目标、边界和阶段性成果定义。

这不是一个全新产品的理想化设计，而是基于当前代码库、当前部署方式和当前用户路径的渐进升级文档。

## 2. 产品定义

### 2.1 一句话定义

一个从主题出发，生成可预览、可编辑、可插入媒体、可逐步演进到短视频输出的 AI 演示内容系统。

### 2.2 产品定位

当前产品定位不再只是：

- AI 生成一份 HTML 演示稿

而是逐步升级为：

- 以 `scene` 为核心内容单元
- 支持动画预设与动态播放
- 支持图片、视频、音频等媒体素材
- 支持 Agent 编排从主题到成品的多步骤生成
- 支持未来导出短视频

## 3. 当前基线

### 3.1 当前技术栈

- 前端：HTML5 + CSS3 + 原生 JavaScript
- 动画：原生 CSS Animation + Canvas
- 后端：Node.js + Express.js
- AI：MiniMax API
- 导出：PptxGenJS
- 接口：MCP + CLI
- 部署：Vercel / 本地
- 存储：`data.json` + `presentations/*.json`；Vercel 下内存存储

### 3.2 当前代码基线

当前代码库已完成 P0 基础地基：

- `presentation-generator.js` 已 facade 化
- generator 已拆分到 `server/generator/*`
- `Presentation v1` canonical schema 已建立
- outline / legacy record / compatibility response adapter 已建立
- canonical schema 已接入 store / service / route / server 真实运行链路
- 对外仍保持 `/create`、`/presentations/:id`、MCP、CLI、HTML/PPTX 导出兼容

### 3.3 当前仍未完成的能力

以下能力尚未进入真实产品闭环：

- scene-driven preview runtime
- 动画预设系统
- 媒体上传与素材库
- timeline 控制
- 配音 / 字幕
- 视频导出
- Agent 多步骤编排

## 4. 用户问题

当前产品虽然能生成 HTML 演示稿，但仍然存在以下核心问题：

1. 内容仍然偏 `slide-based`，难以支撑复杂动态叙事。
2. 预览运行时是 HTML 结果消费，不是 scene graph 消费，难以做高级动画和时间控制。
3. 没有媒体层，无法稳定支持图片、视频、音频插入和复用。
4. 没有中间状态模型，AI 难以参与多步骤决策。
5. 没有 timeline 和 render plan，无法平滑延伸到短视频导出。

## 5. 核心产品目标

## 5.1 短期目标

在不重写全栈的前提下，让系统具备以下能力：

- 以 `Presentation -> Scene -> Element` 组织内容
- 预览页开始消费结构化数据而不是纯 HTML 结果
- 支持最小媒体插入能力
- 支持最小动画预设能力

## 5.2 中期目标

- 支持时间轴占位与播放控制
- 支持素材库检索和媒体引用
- 支持配音、字幕和基础视听编排
- 支持更强的动态演示效果

## 5.3 长期目标

- 支持 Agent 编排整条生成链路
- 支持从主题到多场景 package 的结构化生成
- 支持服务端短视频渲染与导出
- 支持不同输出比例和不同内容形态复用

## 6. 非目标

当前阶段明确不做以下事情：

- 不直接推倒重写成 React / Next.js / TypeScript 全家桶
- 不做通用型视频编辑器
- 不做大型云基础设施迁移
- 不一开始就追求全自动短视频生产线
- 不让 AI 直接生成最终视频成品后端逻辑

## 7. 核心概念模型

后续所有能力统一围绕以下模型演进：

### 7.1 Presentation

表示一个完整演示项目，是当前 canonical object。

### 7.2 Scene

表示演示中的单个场景，是未来动画、媒体、时间轴和 Agent 的核心承载单元。

### 7.3 Media Asset

表示图片、视频、音频、动效等素材资源。

### 7.4 Animation Preset

表示可复用的参数化动效预设，而不是写死的逐页动画实现。

### 7.5 Timeline

表示场景时序、媒体轨道、字幕轨道和节奏点的抽象层。

### 7.6 Render Plan

表示同一份结构化内容如何输出为 HTML、PPTX、视频等不同目标。

### 7.7 Agent Task

表示未来多 Agent / 多工具协同时的任务状态、输入输出和依赖关系。

## 8. 运行时模型

这个产品未来需要两套运行时，而不是单一播放器：

### 8.1 前端预览运行时

负责：

- 结构化 scene 播放
- 交互动效
- 快速预览
- 内容编辑反馈

### 8.2 最终渲染运行时

负责：

- 组合视频、字幕、音频和动画
- 输出 MP4 / 短视频
- 承担最终成片职责

结论：

- 前端预览运行时和最终视频渲染运行时必须分离
- 两者应消费同一份结构化内容和 render plan

## 9. 阶段性版本定义

## 9.1 P0：结构化内核接入

目标：

- 让 `Presentation v1` 成为服务端真实数据内核
- 不破坏当前 create / preview / MCP / CLI 外部行为

当前状态：

- 已完成代码接入

## 9.2 P1：动态演示内核

目标：

- viewer 开始消费 scene 数据
- 支持最小动画预设
- 支持最小图片 / 视频嵌入

这是下一阶段最优先能力。

## 9.3 P2：媒体与时间轴

目标：

- 资产注册和素材引用
- 时间轴占位结构和基础播放控制
- voiceover / subtitle placeholder

## 9.4 P3：Agent 编排

目标：

- 从单次生成演进为结构化多步骤生成
- 引入 Director / Outline / Scene / Motion / Asset / Assembly 等职责层

## 9.5 P4：短视频输出

目标：

- 统一 timeline
- 支持服务端视频渲染
- 形成 HTML 预览版和视频成片版双输出

## 10. MVP 定义

下一代产品最小闭环不是“全自动短视频平台”，而是：

### Motion Deck MVP

满足以下条件即可对外称为新一代版本：

- 演示内容以 scene 为核心组织
- 预览页支持动态场景播放
- 支持最小图片 / 视频插入
- 支持一套最小动画预设
- 保留现有 HTML / PPTX 输出
- 为 timeline / voiceover / video export 预留接口

## 11. 成功标准

### 11.1 产品层成功标准

- 用户能在不改变主要操作路径的前提下生成更动态的演示
- 系统能稳定承载 scene、animation、media 结构
- 后续媒体层和 Agent 层接入时不需要推翻 P0/P1

### 11.2 技术层成功标准

- 数据内核稳定且可演进
- 兼容旧记录和旧接口
- 预览、导出、CLI、MCP 不因架构升级而失效

## 12. 当前结论

项目的正确升级路径不是继续增强“按页生成 HTML”，而是逐步把底层改造成：

**scene + media + animation + timeline + agent orchestration system**

其中下一步最重要的产品方向不是直接做视频平台，而是先完成：

**scene-driven preview runtime + minimal media embedding**
