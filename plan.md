---
title: 工程路线图与当前状态
status: active
updated: 2026-03-17
summary: 记录当前代码状态、已完成阶段、架构原则、里程碑顺序和下一轮规划入口，供后续开发计划直接引用。
---

# 工程路线图与当前状态

## 1. 文档目的

这份文档不是产品宣讲稿，也不是给模型的 prompt 集合。

它只服务于工程执行，回答四个问题：

1. 当前代码已经做到哪一步
2. 当前系统的稳定内核是什么
3. 后续开发应该按什么顺序推进
4. 下一轮计划应该从哪里开始展开

## 2. 当前状态快照

## 2.1 已完成阶段

### Step 1：generator 拆分

已完成：

- `presentation-generator.js` 已改为 facade
- generator 逻辑已拆分到：
  - `server/generator/theme-registry.js`
  - `server/generator/normalize-outline.js`
  - `server/generator/html-renderer.js`
  - `server/generator/pptx-renderer.js`

### Step 2：canonical schema 与 adapter

已完成：

- `Presentation v1` 模型已建立
- outline -> presentation adapter 已建立
- legacy record -> presentation adapter 已建立
- presentation -> legacy response adapter 已建立

### P0 闭环：store / service / route / server 接线

已完成：

- `Presentation v1` 已接入真实运行链路
- presentation store / asset store 已接入
- presentation service / outline service 已接入
- presentation routes / meta routes / auth routes / page routes 已拆出
- `server.js` 已收口为 bootstrap / composition 入口
- 老接口路径与主要响应字段保持兼容

## 2.2 当前已验证

已通过 smoke test：

- 旧 `presentations/*.json` 读取时可懒升级为 `presentation/v1`
- 新记录写入时为 canonical `presentation/v1`
- `/api/styles`
- `/api/generate-html`
- `/api/presentations/generate`
- `/api/presentations/:id`
- `/api/presentations/:id/html`
- `/api/presentations/:id/export.pptx`

## 2.3 当前仍未完成

尚未进入真实用户链路的能力：

- scene-driven viewer/runtime
- animation preset runtime
- media upload / media registry / scene media binding
- timeline runtime
- voiceover / subtitle placeholder 的真实消费
- video export
- Agent 编排

## 3. 当前架构基线

## 3.1 当前稳定内核

当前项目可以认为已经进入以下基线：

- 数据内核：`Presentation v1`
- 内容组织：`Presentation -> Scene -> Element`
- 存储策略：本地 JSON / Vercel 内存双模式
- 渲染出口：HTML / PPTX
- 兼容层：legacy outline / legacy response adapter

## 3.2 当前服务端主链路

### create / generate 路径

- `create-page.js`
- `/api/generate-outline`
- `/api/presentations/generate`
- `outline-service`
- `presentation-service`
- `presentation-store`
- compatibility response
- `presentation-viewer.js`

### preview 路径

- `/presentations/:id`
- `/api/presentations/:id`
- compatibility response
- `iframe.srcdoc`

### export 路径

- `/api/presentations/:id/html`
- `/api/presentations/:id/export.pptx`

## 3.3 当前架构仍然存在的短板

虽然 P0 闭环已经完成，但当前项目仍然保留以下限制：

1. preview 仍然主要消费最终 HTML，而不是结构化 runtime。
2. scene 已经存在于 canonical schema，但 viewer 尚未真正以 scene 为驱动。
3. asset-store 已存在，但 media 只是预留入口，还没有真实业务闭环。
4. timeline 还没有成为播放器和渲染器的统一调度层。
5. Agent 仍然没有真实进入生成流程。

## 4. 工程原则

后续所有开发必须继续遵守以下原则。

### 4.1 渐进升级，不推倒重来

- 保留现有页面角色
- 保留现有路由语义
- 保留当前部署方式
- 不做一次性大迁移

### 4.2 schema-first

- 新能力必须优先写入 canonical schema
- 不允许先写页面特判，再补数据结构

### 4.3 compatibility-first

- create / preview / MCP / CLI 的兼容优先级高于内部“完美重构”
- 内部模型可升级，但外部调用不能轻易破坏

### 4.4 先 runtime，再高级能力

没有 scene-driven runtime，就不要急着做复杂动画、媒体编排和 Agent。

### 4.5 预览运行时与最终渲染运行时分离

- 前端 runtime 用于预览、交互、快速反馈
- 最终 renderer 用于视频导出和成片

## 5. 里程碑顺序

## 5.1 已完成：P0 结构化内核接入

产物：

- canonical schema
- adapter
- store
- service
- route
- server bootstrap

## 5.2 下一阶段：P1 动态演示内核

这是下一轮开发计划的起点。

目标：

- viewer 开始消费 scene / presentation 数据
- 引入最小 runtime player
- 保持现有 preview 页面和 URL 不变
- 支持最小图片 / 视频 element

P1 的核心不是“做华丽动画”，而是先让 scene 真正进入预览运行时。

## 5.3 后续阶段：P1.5 最小动画预设

目标：

- 建立 animation preset registry
- 建立 scene / element motion config
- 引入最小播放控制和转场控制

## 5.4 后续阶段：P2 媒体层

目标：

- 上传 / 注册 / 读取媒体
- scene 与 media binding
- 资产 metadata 和最小素材引用

## 5.5 后续阶段：P3 时间轴与音视频占位

目标：

- 场景时序
- voiceover placeholder
- subtitle placeholder
- render plan 扩展

## 5.6 后续阶段：P4 Agent 编排

目标：

- 从单次 AI 调用升级到结构化多阶段生成流程
- 扩展 MCP 工具
- 引入 project brief / scene plan / media plan / assembly plan

## 5.7 后续阶段：P5 视频输出

目标：

- 服务端视频渲染
- HTML 预览版和 MP4 成片版双输出

## 6. 依赖顺序

后续开发必须遵守以下依赖关系：

1. `scene-driven viewer` 先于 `timeline runtime`
2. `media asset binding` 先于 `AI 视频 provider`
3. `animation preset schema` 先于 `AE 风格增强`
4. `structured pipeline` 先于 `Agent orchestration`
5. `final render runtime` 先于 `全自动短视频导出`

换句话说：

- 不先让 preview 消费 scene，就不要做复杂动画系统
- 不先让 scene 能引用 media，就不要做 AI 视频接入
- 不先让 pipeline 结构化，就不要做多 Agent

## 7. 当前建议的下一轮规划入口

下一轮开发计划应明确聚焦：

## 7.1 第一优先级

**scene-driven preview runtime**

需要解决：

- preview 如何不再只吃 `html`
- presentation / scene 如何映射到前端 runtime
- 旧 HTML 预览如何兼容
- runtime shell、scene renderer、viewer bridge 的边界

## 7.2 第二优先级

**minimal media embedding**

需要解决：

- Scene element 如何引用 image / video
- preview 如何加载和播放媒体
- canonical schema 中 media 如何和 scene 绑定

## 7.3 第三优先级

**animation preset baseline**

需要解决：

- 动画预设 registry
- scene 级 / element 级 motion config
- 最小转场与播放节奏

## 8. 当前明确不建议立即投入

在下一轮规划前，不建议直接跳到以下主题：

- 全自动短视频平台
- 多 Agent 总控
- 多供应商 AI 视频接入
- 大规模素材库建设
- React / Next.js 全量重构

## 9. 后续制定计划时的输入模板

如果后面要继续让我制定下一步开发计划，默认应以这份文档为准，并采用以下上下文：

- 当前阶段：P0 已完成
- 目标阶段：P1 动态演示内核
- 规划重点：scene-driven preview runtime + minimal media embedding
- 约束：保持 create / preview / server.js / presentation-generator.js 角色稳定
- 暂不处理：Agent 编排、视频导出、大型重构

## 10. 当前结论

从工程执行角度，项目已经完成“结构化内核接入”。

后面最合理的开发顺序不是继续强化 generator，而是：

1. 让 preview 真正消费 `Presentation v1`
2. 让 scene 成为前端运行时核心
3. 让 media 和 animation 开始进入 scene
4. 再扩展 timeline、Agent、视频导出

下一轮开发计划应直接从：

**P1：scene-driven preview runtime + minimal media embedding**

开始展开。
