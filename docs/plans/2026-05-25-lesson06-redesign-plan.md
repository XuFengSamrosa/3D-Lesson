# Lesson 06 (V1 & V3) Redesign Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** 重构 V1.0 第6课《桌面小管家收纳盒》和 V3.0 第6课《城堡守卫哨所》的课件演示网页，使其具有独特的界面风格、全新的自由滑条交互组件和定制化的最终效果展示。

**Architecture:** 
1.  **V1.0 (极客 CAD 蓝图风)**：以三维网格为背景，核心为壁厚与底厚双滑条，实时更新模型几何尺寸、渲染计算公式，并给出是否会“一捏即碎”或“漏底”的安全报警回显。
2.  **V3.0 (全息激光防御沙盘风)**：以全息线框模型为展品，通过大门宽度与切削深度滑条实时监测防御塔基座承载，当切穿时基座产生物理断裂倾斜报警；同时配有切片层高扫描滑条，在侧边栏实时手绘投影生成该高度的 2D 切片几何图。

**Tech Stack:** HTML5, CSS3, Javascript, CSS 3D Transforms, Canvas API

---

### Task 1: 重构 V1.0 第6课 HTML
**Files:**
*   Modify: `Beginner_JuniorMaker/Lesson06_桌面小管家/presentation/index.html`

**Step 1: 编写重构代码**
重写 HTML，引入 CAD 网格底盘，重置 Slide 1/2 的文案，移去步骤控制按钮，添加 Wall & Floor 调节面板、X光透视开关及状态反馈反馈区。

**Step 2: 验证 HTML**
本地双击打开该 HTML，确认元素节点渲染完整且无外部 CSS/JS 报错。

**Step 3: Commit**
```bash
git add Beginner_JuniorMaker/Lesson06_桌面小管家/presentation/index.html
git commit -m "feat(v1-l6): redesign index.html for CAD Blueprints Sandbox"
```

---

### Task 2: 重构 V1.0 第6课 CSS
**Files:**
*   Modify: `Beginner_JuniorMaker/Lesson06_桌面小管家/presentation/custom.css`

**Step 1: 编写极客蓝图 CSS 样式**
添加工程图纸的细网格背景特效（使用 SVG 或 CSS gradient），设计高端的滑条组件样式，构建 3D 收纳盒外壳（由 5 个面组成）以及内置的红色吞噬负零件实体，配置半透明透视与红色警报样式。

**Step 2: 验证样式**
双击网页，确认深蓝色蓝图背景及滑块样式布局正常。

**Step 3: Commit**
```bash
git add Beginner_JuniorMaker/Lesson06_桌面小管家/presentation/custom.css
git commit -m "style(v1-l6): add CAD engineering styles and 3D inner negative parts"
```

---

### Task 3: 重构 V1.0 第6课 JS
**Files:**
*   Modify: `Beginner_JuniorMaker/Lesson06_桌面小管家/presentation/custom.js`

**Step 1: 编写参数联动 JS**
读取 Wall Thickness 和 Floor Thickness 滑块的值，通过修改 CSS variables 动态改变外盒的内缩和负零件的 Z-translate。实现安全性计算规则：
*   当底厚 == 0，高亮显示漏底灾难红字。
*   当壁厚 < 1.2mm，高亮显示一捏即碎黄字。
*   同时绘制实时的 CAD 减法计算文本（如 `负零件 X/Y 尺寸 = 50 - 2 * 2.0 = 46mm`）。
*   联动 X光开关：改变负零件的透明度和遮挡。

**Step 2: 验证交互**
拖动壁厚与底厚滑杆，确认 3D 盒子外形及内部负零件能顺畅发生缩放及位移变化，且状态栏的安全提示与计算式回显完全吻合。

**Step 3: Commit**
```bash
git add Beginner_JuniorMaker/Lesson06_桌面小管家/presentation/custom.js
git commit -m "feat(v1-l6): implement real-time CAD formula calculation and safety alerts"
```

---

### Task 4: 重构 V3.0 第6课 HTML
**Files:**
*   Modify: `Beginner_JuniorMaker_V3/Lesson06_城堡守卫哨所/presentation/index.html`

**Step 1: 编写战略防御沙盘 HTML**
将标题和内容彻底净化为“城堡守卫哨所”及前哨防线搭建。去除 5 步魔术解析步骤按钮。引入：
*   拱门宽度 (Gate Width) 及切削高度 (Gate Cut Height) 调节面板。
*   切片层高扫描 (Slice Layer height) 控制滑条。
*   2D 截面投影显示 Canvas 容器或面板区。
*   战略防御塔基座断裂闪烁警报区。

**Step 2: 验证 HTML**
本地浏览器中双击打开 V3 index.html，检查线框结构布局是否对齐。

**Step 3: Commit**
```bash
git add Beginner_JuniorMaker_V3/Lesson06_城堡守卫哨所/presentation/index.html
git commit -m "feat(v3-l6): redesign index.html for Holographic Sandbox and Slicing Scanner"
```

---

### Task 5: 重构 V3.0 第6课 CSS
**Files:**
*   Modify: `Beginner_JuniorMaker_V3/Lesson06_城堡守卫哨所/presentation/custom.css`

**Step 1: 编写全息线框 CSS 样式**
设计暗绿色的全息网格效果。将 3D 哨所模型及拱门卡口用荧光绿线框展示（`border: 1.5px solid #00d2ff` 或 `#34c759`，加上 `box-shadow` 发光）。设计基座物理断裂的动效类：当基座被大门切穿时，哨所底部两个零件分离并向左右倾斜 15 度，且全场灯光变红闪烁。

**Step 2: 验证样式**
双击网页，查看 3D 线框哨所模型和发光环是否正常。

**Step 3: Commit**
```bash
git add Beginner_JuniorMaker_V3/Lesson06_城堡守卫哨所/presentation/custom.css
git commit -m "style(v3-l6): implement holographic wireframe and foundation fracture visuals"
```

---

### Task 6: 重构 V3.0 第6课 JS
**Files:**
*   Modify: `Beginner_JuniorMaker_V3/Lesson06_城堡守卫哨所/presentation/custom.js`

**Step 1: 编写全息联动及 Canvas 扫描渲染**
实现滑块拖动交互：
*   控制大门切削高度与宽度：修改 3D 拱门盒子的 Y-scale 及 Z-scale。
*   当大门高度或宽度超限（导致承重底厚为 0 或开槽过大时），给 3D 模型添加断裂类，弹出“基座断裂”警报。
*   拖动“切片层高扫描仪”时：
    *   动态在 3D 模型上移动一条水平的全息扫描激光线。
    *   在 2D Canvas 上，根据当前的扫描高度，实时画出哨所的 2D 俯视切片截面投影（如：底座层为 60x60 实心方；拱门层为带凹槽的环型；塔顶层为 30x30 实心圆）。

**Step 2: 验证交互**
拖动大门开凿滑条，基座断裂报警响应灵敏。拖动切片扫描滑条，2D 切片图实时在侧边手绘刷新。

**Step 3: Commit**
```bash
git add Beginner_JuniorMaker_V3/Lesson06_城堡守卫哨所/presentation/custom.js
git commit -m "feat(v3-l6): implement slicing height scanner and 2D canvas drawing"
```

---

### Task 7: 最终验证与清理
**Files:**
*   Modify: `docs/plans/task.md`

**Step 1: 全局运行测试与清理**
清除所有生成的临时文件，确保没有产生 `.DS_Store`。用浏览器双击 V1 和 V3 的第 6 课 index.html，深度运行并测试各项交互。

**Step 2: 更新任务进度**
在 `docs/plans/task.md` 中标记第6课为已完成。

**Step 3: Commit & Push**
```bash
git add docs/plans/task.md
git commit -m "docs: finalize Lesson 06 V1/V3 redesign"
git push origin main
```
