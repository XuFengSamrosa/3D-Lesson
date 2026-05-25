# Lessons 06-16 Style Fix Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** 为 `Beginner_JuniorMaker` 的 Lesson 06 到 16 补全 `custom.css`、`custom.js` 并在相应的 `index.html` 中引入，以此修复 3D 步骤演示的动画样式与交互。

**Architecture:** 
* 使用纯 CSS 3D Transforms 进行多面体拼贴和渲染。
* 利用 `shared_web/script.js` 现有的 `.visual-side.step-X` 切换机制，通过 CSS 选择器为每个步骤编写平移动效 (`translate3d`)、颜色变化、虚线轮廓等状态。
* 在 `custom.js` 中保留极简的标准初始化，供未来可能需要的定制逻辑使用。

**Tech Stack:** HTML5, CSS3 (CSS 3D Transforms, Transition, Glassmorphism), Javascript (Vanilla).

---

### Task 1: Fix Lesson 06 (桌面小管家)

**Files:**
* Create: `Beginner_JuniorMaker/Lesson06_桌面小管家/presentation/custom.css`
* Create: `Beginner_JuniorMaker/Lesson06_桌面小管家/presentation/custom.js`
* Modify: `Beginner_JuniorMaker/Lesson06_桌面小管家/presentation/index.html`

**Step 1: Create custom.css**
定义 `.main-body` 与 `.negative-core` 的 3D 盒子面转换与步骤样式。
主要样式包括：
* `.main-body` 尺寸 60x80px，正侧面 `translateZ(30px)`。
* `.negative-core` 尺寸 50x90px，正侧面 `translateZ(25px)`，设置背景为半透明红色 `rgba(255, 59, 48, 0.65)`。
* 步骤样式：
  * `.visual-side.step-3 .negative-core` 沿 Z 轴/Y 轴向上偏移 (`transform: translate3d(0, -10px, 0)`)。
  * `.visual-side.step-4 .main-body .face` 变为半透明 `rgba(142, 142, 147, 0.35)` 并带有虚线边框 `border: 2px dashed #8e8e93`。

**Step 2: Create custom.js**
写入基础加载日志以匹配格式：
```javascript
document.addEventListener('DOMContentLoaded', () => {
    console.log('Lesson 06 presentation loaded.');
});
```

**Step 3: Modify index.html**
* 在 `<head>` 中清理原有的 `<style>...</style>` 标签。
* 引入 `<link rel="stylesheet" href="custom.css">`。
* 在 `</body>` 前面引入 `<script src="custom.js"></script>`。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker/Lesson06_桌面小管家/
git commit -m "feat: add 3D styles and scripts for Lesson 06"
```

---

### Task 2: Fix Lesson 07 (迷你景观配件)

**Files:**
* Create: `Beginner_JuniorMaker/Lesson07_迷你景观配件/presentation/custom.css`
* Create: `Beginner_JuniorMaker/Lesson07_迷你景观配件/presentation/custom.js`
* Modify: `Beginner_JuniorMaker/Lesson07_迷你景观配件/presentation/index.html`

**Step 1: Create custom.css**
* `.tub` (圆盘座)：60x60px，磨砂灰色，带 3D 边缘。
* `.div1`, `.div2` (拼插隔板)：60x60x4px 3D 薄板，`.div2` 旋转 90 度。
* `.tree` (支撑树)：翠绿色半透明发光支柱。
* 动画步骤：
  * `.step-2` 显示 `.div1`。
  * `.step-3` 显示 `.div2` 并平移相交。
  * `.step-4` 显示绿色树状支撑 `.tree`。

**Step 2: Create custom.js**
同样写入标准的 JavaScript 加载日志。

**Step 3: Modify index.html**
引入 `custom.css` 和 `custom.js` 并清理内联样式。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker/Lesson07_迷你景观配件/
git commit -m "feat: add 3D styles and scripts for Lesson 07"
```

---

### Task 3: Fix Lesson 08 (旋转陀螺大赛)

**Files:**
* Create: `Beginner_JuniorMaker/Lesson08_旋转陀螺大赛/presentation/custom.css`
* Create: `Beginner_JuniorMaker/Lesson08_旋转陀螺大赛/presentation/custom.js`
* Modify: `Beginner_JuniorMaker/Lesson08_旋转陀螺大赛/presentation/index.html`

**Step 1: Create custom.css**
* `.disc`：渲染为直径 80px，厚 12px 的 3D 圆柱形金属盘。
* `.pin`：渲染为 16x40px 的 3D 中心轴。
* 步骤样式：
  * `.step-2` 锁定轴心。
  * `.step-3` 在四周添加红色配重环（用 `box-shadow` 在盘面四个边缘生成发红光虚影）。
  * `.step-4` 让整个 `.scene` 翻转 180 度。

**Step 2: Create custom.js**
同上，写入标准 JS 日志。

**Step 3: Modify index.html**
引入 css 和 js，清理内联样式。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker/Lesson08_旋转陀螺大赛/
git commit -m "feat: add 3D styles and scripts for Lesson 08"
```

---

### Task 4: Fix Lesson 09 (镂空灯罩设计)

**Files:**
* Create: `Beginner_JuniorMaker/Lesson09_镂空灯罩设计/presentation/custom.css`
* Create: `Beginner_JuniorMaker/Lesson09_镂空灯罩设计/presentation/custom.js`
* Modify: `Beginner_JuniorMaker/Lesson09_镂空灯罩设计/presentation/index.html`

**Step 1: Create custom.css**
* `.cyl`：70x70x100px 的 3D 暖光发光灯罩外壳。
* `.hole`：红色的菱形 3D 虚影切口。
* 步骤样式：
  * `.step-4` 用 `box-shadow` 在圆周环绕多点生成 8 个红光镂空斑，并在灯罩表面用背景图片或 CSS 渐变高亮斑点来模拟镂空。

**Step 2: Create custom.js**
写入标准 JS 日志。

**Step 3: Modify index.html**
引入 css 和 js，清理内联样式。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker/Lesson09_镂空灯罩设计/
git commit -m "feat: add 3D styles and scripts for Lesson 09"
```

---

### Task 5: Fix Lesson 10 (关节可动小人)

**Files:**
* Create: `Beginner_JuniorMaker/Lesson10_关节可动小人/presentation/custom.css`
* Create: `Beginner_JuniorMaker/Lesson10_关节可动小人/presentation/custom.js`
* Modify: `Beginner_JuniorMaker/Lesson10_关节可动小人/presentation/index.html`

**Step 1: Create custom.css**
* `.box`：60x60x60px 3D 关节球窝体，半透明灰色。
* `.ball`：直径 40px 的蓝色 3D 球体，带球形质感。
* 步骤样式：
  * `.step-2` 圆角化 (`border-radius: 10px`) 并掏空球窝。
  * `.step-3` 球头嵌套在球窝里。
  * `.step-4` 场景旋转，在零件上用红虚线圈展示 0.3mm 的阻尼防粘连间隙。

**Step 2: Create custom.js**
同上，写入标准 JS 日志。

**Step 3: Modify index.html**
引入 css 和 js，清理内联样式。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker/Lesson10_关节可动小人/
git commit -m "feat: add 3D styles and scripts for Lesson 10"
```

---

### Task 6: Fix Lesson 11 (创意手机支架)

**Files:**
* Create: `Beginner_JuniorMaker/Lesson11_创意手机支架/presentation/custom.css`
* Create: `Beginner_JuniorMaker/Lesson11_创意手机支架/presentation/custom.js`
* Modify: `Beginner_JuniorMaker/Lesson11_创意手机支架/presentation/index.html`

**Step 1: Create custom.css**
* `.base`：60x80x20px 斜槽金属底座。
* `.back`：60x100x8px 倾斜支撑背板。
* 步骤样式：
  * `.step-2` 背板旋转并插进斜槽中。
  * `.step-3` 槽缝发光融合。
  * `.step-4` 支架底部熨斗切平，底部用绿色半透明底座底贴表示。

**Step 2: Create custom.js**
同上。

**Step 3: Modify index.html**
引入 css 和 js，清理内联样式。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker/Lesson11_创意手机支架/
git commit -m "feat: add 3D styles and scripts for Lesson 11"
```

---

### Task 7: Fix Lesson 12 (拓竹A1大变身)

**Files:**
* Create: `Beginner_JuniorMaker/Lesson12_拓竹A1大变身/presentation/custom.css`
* Create: `Beginner_JuniorMaker/Lesson12_拓竹A1大变身/presentation/custom.js`
* Modify: `Beginner_JuniorMaker/Lesson12_拓竹A1大变身/presentation/index.html`

**Step 1: Create custom.css**
* `.clam`：C 型弹性 3D 卡扣实体。
* 步骤样式：
  * `.step-1` 测量卡扣。
  * `.step-2` C型环生成。
  * `.step-3` C型环加厚加高，露出公差间隙槽。
  * `.step-4` 卡扣旋转躺平 90 度以优化打印方向。

**Step 2: Create custom.js**
同上。

**Step 3: Modify index.html**
引入 css 和 js，清理内联样式。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker/Lesson12_拓竹A1大变身/
git commit -m "feat: add 3D styles and scripts for Lesson 12"
```

---

### Task 8: Fix Lesson 13 (梦想社区规划)

**Files:**
* Create: `Beginner_JuniorMaker/Lesson13_梦想社区规划/presentation/custom.css`
* Create: `Beginner_JuniorMaker/Lesson13_梦想社区规划/presentation/custom.js`
* Modify: `Beginner_JuniorMaker/Lesson13_梦想社区规划/presentation/index.html`

**Step 1: Create custom.css**
* `.doc`：3D 蓝色发光科技感全息图纸网格。
* 步骤样式：
  * `.step-1` 网格显示。
  * `.step-2` 主城核心发光圆标亮起。
  * `.step-3` 蓝图绿/蓝色道路轮廓显示。
  * `.step-4` 沙盘整体缩小 0.8 倍并被红色比例尺框高亮包裹。

**Step 2: Create custom.js**
同上。

**Step 3: Modify index.html**
引入 css 和 js，清理内联样式。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker/Lesson13_梦想社区规划/
git commit -m "feat: add 3D styles and scripts for Lesson 13"
```

---

### Task 9: Fix Lesson 14 (梦想社区建模)

**Files:**
* Create: `Beginner_JuniorMaker/Lesson14_梦想社区建模/presentation/custom.css`
* Create: `Beginner_JuniorMaker/Lesson14_梦想社区建模/presentation/custom.js`
* Modify: `Beginner_JuniorMaker/Lesson14_梦想社区建模/presentation/index.html`

**Step 1: Create custom.css**
* `.base`：绿白色 3D 社区大底盘。
* `.p1`, `.p2`：红、蓝 3D 精致积木楼宇模型。
* 步骤样式：
  * `.step-1` 放置底盘。
  * `.step-2` 红蓝楼宇从空中缓缓降落到相同高度但不同水平位置。
  * `.step-3` 两楼宇与底盘完成插装。
  * `.step-4` 展示水平红色剖切光刀，检测相交干涉。

**Step 2: Create custom.js**
同上。

**Step 3: Modify index.html**
引入 css 和 js，清理内联样式。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker/Lesson14_梦想社区建模/
git commit -m "feat: add 3D styles and scripts for Lesson 14"
```

---

### Task 10: Fix Lesson 15 (打印与组装)

**Files:**
* Create: `Beginner_JuniorMaker/Lesson15_打印与组装/presentation/custom.css`
* Create: `Beginner_JuniorMaker/Lesson15_打印与组装/presentation/custom.js`
* Modify: `Beginner_JuniorMaker/Lesson15_打印与组装/presentation/index.html`

**Step 1: Create custom.css**
* `.part1`, `.part2`：两个 3D 构件。
* 步骤样式：
  * `.step-1` 两零件距离极近，底盘交界处红光呼吸闪烁（报警）。
  * `.step-2` 分离平移，外加安全绿色高亮环。
  * `.step-3` 在悬空中下生成白色柱状支撑结构。
  * `.step-4` 支撑剥离消失，两零件拼装合体。

**Step 2: Create custom.js**
同上。

**Step 3: Modify index.html**
引入 css 和 js，清理内联样式。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker/Lesson15_打印与组装/
git commit -m "feat: add 3D styles and scripts for Lesson 15"
```

---

### Task 11: Fix Lesson 16 (作品发布会)

**Files:**
* Create: `Beginner_JuniorMaker/Lesson16_作品发布会/presentation/custom.css`
* Create: `Beginner_JuniorMaker/Lesson16_作品发布会/presentation/custom.js`
* Modify: `Beginner_JuniorMaker/Lesson16_作品发布会/presentation/index.html`

**Step 1: Create custom.css**
* `.stage`：科技感环形跑马灯的黑色 3D 展盘。
* `.hero`：金黄发光、微凸的 3D 荣耀奖杯模型。
* 步骤样式：
  * `.step-1` 展盘灯光亮起。
  * `.step-2` 金色奖杯滑落放置到展盘中心。
  * `.step-3` 奖杯加亮并进行 360 度循环平滑自转（动画特效）。
  * `.step-4` 镜头拉远缩小，添加金黄色庆祝亮斑，大合照完美结营。

**Step 2: Create custom.js**
同上。

**Step 3: Modify index.html**
引入 css 和 js，清理内联样式。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker/Lesson16_作品发布会/
git commit -m "feat: add 3D styles and scripts for Lesson 16"
```

---

### Task 12: Verification and Testing

**Step 1: Run browser checks**
通过加载网页在本地测试 3D 展示效果，确认所有的步骤转换均运行正常且交互无错。
```bash
# Verify the presence of files
ls -l Beginner_JuniorMaker/Lesson*/presentation/custom.*
```
确保每个 Lesson 都已经生成且正确载入！
