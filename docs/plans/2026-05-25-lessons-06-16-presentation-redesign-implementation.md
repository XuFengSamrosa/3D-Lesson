# 第 6 至 16 课网页个性化重构与净化执行计划

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** 完成 `Beginner_JuniorMaker_V3` 中第 6 至 16 课（共 11 节课）演示网页的文件夹/标题重命名、文案彻底净化以及个性化 3D 物理模拟器的前端编码实现。

**Architecture:** 
1. 编写批量重命名脚本以安全迁移物理目录，防止 Git 历史丢失。
2. 逐一修改每一课的 `index.html`、`custom.css` 和 `custom.js`，将 3D 极客魔法模拟器与文案净化落地。
3. 保证完全兼容 `file://` 协议的无障碍加载，并在提交前进行自动化验证和手动复审。

**Tech Stack:** Vanilla HTML5 / Vanilla CSS3 (3D transform, clip-path) / Modern Javascript (ES6)

---

### Task 1: 物理目录批量重命名
**Files:**
- Modify: `Beginner_JuniorMaker_V3` 目录下的文件夹重命名。

**Step 1: 编写重命名脚本**
在 `scratch/rename_dirs.py` 中编写以下内容：
```python
import os
import shutil

base_dir = "/Users/samrosa/DEV/3D/Beginner_JuniorMaker_V3"
mapping = {
    "Lesson06_桌面小管家": "Lesson06_城堡守卫哨所",
    "Lesson07_迷你景观配件": "Lesson07_防卫城墙围栏",
    "Lesson08_旋转陀螺大赛": "Lesson08_城堡能量核心",
    "Lesson09_镂空灯罩设计": "Lesson09_魔法氛围灯塔",
    "Lesson10_关节可动小人": "Lesson10_球头关节守卫",
    "Lesson11_创意手机支架": "Lesson11_卡尺实测徽章挂扣",
    "Lesson12_拓竹A1大变身": "Lesson12_多彩城堡图腾",
    "Lesson13_梦想社区规划": "Lesson13_奇幻城堡大总管",
    "Lesson14_梦想社区建模": "Lesson14_城堡合体兴土木",
    "Lesson15_打印与组装": "Lesson15_量产与后处理工坊",
    "Lesson16_作品发布会": "Lesson16_城堡落成发布会"
}

for src, dst in mapping.items():
    src_path = os.path.join(base_dir, src)
    dst_path = os.path.join(base_dir, dst)
    if os.path.exists(src_path):
        # 使用 git mv 确保 Git 历史记录保留
        os.system(f'git mv "{src_path}" "{dst_path}"')
        print(f"Renamed {src} to {dst}")
```

**Step 2: 执行重命名脚本并验证**
运行：`python3 scratch/rename_dirs.py`
Expected: 所有的课程文件夹在 Git 中被重命名为新名字。运行 `git status` 确认没有出现 Untracked 的新建文件夹，都是 `renamed` 状态。

**Step 3: Commit**
```bash
git add .
git commit -m "refactor: V3.0 课程物理目录批量重命名"
```

---

### Task 2: 重新设计第 6 课 (城堡守卫哨所) 个性化呈现
**Files:**
- Modify: `Beginner_JuniorMaker_V3/Lesson06_城堡守卫哨所/presentation/index.html`
- Modify: `Beginner_JuniorMaker_V3/Lesson06_城堡守卫哨所/presentation/custom.css`
- Modify: `Beginner_JuniorMaker_V3/Lesson06_城堡守卫哨所/presentation/custom.js`

**Step 1: 净化 HTML 文案并重命名标题**
- 将 `<title>` 更改为：`第06课：城堡守卫哨所收纳底座 - 3D打印魔法创客营`
- 将 Logo 更改为：`🏰 城堡守卫哨所`
- 将“核心目标”和“三维魔术解析”中的“盒子”、“桌面小管家”全部替换为“哨所底座”，大门部分增加“底厚滑块”的 HTML 容器：
  ```html
  <div class="tolerance-control">
      <label>预留底部地板厚度: <span id="floor-val">3.0</span>mm</label>
      <input type="range" id="floor-slider" min="0" max="6" step="0.5" value="3.0">
  </div>
  ```

**Step 2: 编码 3D 物理底厚动态反馈样式与脚本**
- 在 `custom.css` 中，为底厚不合格设置动画（让红色负零件和地板交叉，溢出漏底高亮闪烁）。
- 在 `custom.js` 中，添加滑块拖拽监听：
  ```javascript
  const slider = document.getElementById('floor-slider');
  const valDisp = document.getElementById('floor-val');
  const negativeGate = document.querySelector('.negative-gate');
  slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      valDisp.textContent = val.toFixed(1);
      // 调节 3D Z轴偏移
      const zOffset = 25 + val; // 基础25px + 底厚
      if (negativeGate) negativeGate.style.transform = `translate3d(0, -20px, ${zOffset}px)`;
      // 判定是否漏底
      if (val < 2.0) {
          // 变红警报
      } else {
          // 正常绿字
      }
  });
  ```

**Step 3: 验证并在本地双击测试**
用 Chrome/Safari 双击打开 `index.html`，测试拖动滑块：
- 当滑块拉到 0 时，显示红色 `🚨 漏水警报：Z=0，盒子漏底！`
- 当滑块拉到 3mm 时，显示 `✅ 安全底厚：3.0mm（合格）`
确认无报错。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker_V3/Lesson06_城堡守卫哨所
git commit -m "feat: 第6课 (城堡守卫哨所) 网页文案净化与个性化 3D 底厚模拟器"
```

---

### Task 3: 重新设计第 7 课 (防卫城墙围栏) 个性化呈现
**Files:**
- Modify: `Beginner_JuniorMaker_V3/Lesson07_防卫城墙围栏/presentation/index.html`
- Modify: `Beginner_JuniorMaker_V3/Lesson07_防卫城墙围栏/presentation/custom.css`
- Modify: `Beginner_JuniorMaker_V3/Lesson07_防卫城墙围栏/presentation/custom.js`

**Step 1: 净化 HTML 文案并替换 V1 景观配件词汇**
- 导航栏 Logo 更改为：`🧱 防卫城墙围栏`。
- 文案全部更改为城防围栏、立柱、悬空城墙梁。
- 增加“启用树形支撑” checkbox 以及立柱间距滑块。

**Step 2: 编写 3D 支撑生长与悬空拉丝坍塌效果**
- 在 `custom.css` 中编写 `.support-tree` 生长样式，以及当没有支撑打印时，通过 CSS 动画模拟悬空梁弯曲变形加红色发光。
- 在 `custom.js` 中编写 Checkbox 勾选监听，控制 `.support-tree` 显隐，并根据状态决定打印测试时是“完美梁”还是“塌陷梁”。

**Step 3: 本地验证**
双击打开 `index.html`，测试开关：
- 勾选树形支撑：长出绿色支撑树根，点击打印测试显示完美。
- 取消勾选：红字警报，梁体在打印时变形并生成炒面拉丝动画。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker_V3/Lesson07_防卫城墙围栏
git commit -m "feat: 第7课 (防卫城墙围栏) 网页文案净化与个性化 3D 支撑模拟器"
```

---

### Task 4: 重新设计第 8 课 (城堡能量核心) 个性化呈现
**Files:**
- Modify: `Beginner_JuniorMaker_V3/Lesson08_城堡能量核心/presentation/index.html`
- Modify: `Beginner_JuniorMaker_V3/Lesson08_城堡能量核心/presentation/custom.css`
- Modify: `Beginner_JuniorMaker_V3/Lesson08_城堡能量核心/presentation/custom.js`

**Step 1: 净化 HTML 文案**
- 主题全面升级为能量核心陀螺，移除“大赛、对战盘”等玩具概念。
- 添加“X轴偏差”调节微调器与“一键对齐”按钮。

**Step 2: 编写偏心剧烈晃动与平稳旋转的 JS/CSS 控制**
- 在 `custom.css` 中编写带有 `shake` 偏心抖动的关键帧动画。
- 在 `custom.js` 中通过改变 `scene` 旋转时的抖动幅度（基于偏心值），来动态计算旋转样式。

**Step 3: 本地验证**
- 当 X 轴偏差为 2mm 时：陀螺转动疯狂抖动发出警报。
- 偏差归零后：平稳流畅转动。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker_V3/Lesson08_城堡能量核心
git commit -m "feat: 第8课 (城堡能量核心) 网页文案净化与个性化 3D 对齐晃动模拟器"
```

---

### Task 5: 重新设计第 9 课 (魔法氛围灯塔) 个性化呈现
**Files:**
- Modify: `Beginner_JuniorMaker_V3/Lesson09_魔法氛围灯塔/presentation/index.html`
- Modify: `Beginner_JuniorMaker_V3/Lesson09_魔法氛围灯塔/presentation/custom.css`
- Modify: `Beginner_JuniorMaker_V3/Lesson09_魔法氛围灯塔/presentation/custom.js`

**Step 1: 净化 HTML 文案**
- 改为“魔法氛围灯塔”，移除“家用灯罩”概念。
- 添加“复制角度旋转钮 (30°/45°/90°)”以及“极坐标阵列”和“切削镂空”操作按钮。

**Step 2: 编写极坐标圆周旋转复制与 CSS 镂空投影效果**
- 在 `custom.css` 中设计镂空切刀阵列的 3D css transform（利用 `rotateY()` 控制角度），以及利用 CSS 的 `mix-blend-mode` 和阴影制作暖橙色透过镂空孔的漫反射魔法光效果。
- 在 `custom.js` 中利用循环动态插入指定数量的红色切刀模型，并在点击切割时改变圆柱灯罩的 `clip-path` 或者显隐样式。

**Step 3: 本地验证**
- 选择 45° 并执行：8个菱形切刀环绕，切割后镂空星光大亮。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker_V3/Lesson09_魔法氛围灯塔
git commit -m "feat: 第9课 (魔法氛围灯塔) 网页文案净化与 3D 极坐标阵列模拟器"
```

---

### Task 6: 重新设计第 10 课 (球头关节守卫) 个性化呈现
**Files:**
- Modify: `Beginner_JuniorMaker_V3/Lesson10_球头关节守卫/presentation/index.html`
- Modify: `Beginner_JuniorMaker_V3/Lesson10_球头关节守卫/presentation/custom.css`
- Modify: `Beginner_JuniorMaker_V3/Lesson10_球头关节守卫/presentation/custom.js`

**Step 1: 净化 HTML 文案**
- 主题更改为球头嵌套机械防卫守卫，移除“玩具木偶”等表述。
- 添加“公差间隙滑动条 (0.0 - 0.6mm)”和“剖视图开关”。

**Step 2: 编写 3D 球形嵌套配合与 X光半剖面视图**
- 在 `custom.css` 中利用 `clip-path` 将球窝前半部分裁切，露出内部红色球头。
- 在 `custom.js` 中动态改变红色球头的缩放或偏移来模拟间隙大小。当间隙在 0.1mm 以下时在剖面上高亮红色预警熔死。

**Step 3: 本地验证**
- 拉动滑块到 0.1mm：剖切面上球头球窝完全重叠，红字报警。
- 拉动到 0.3mm：露出完美均匀环形间隙，绿字通过。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker_V3/Lesson10_球头关节守卫
git commit -m "feat: 第10课 (球头关节守卫) 网页文案净化与 3D 公差剖视模拟器"
```

---

### Task 7: 重新设计第 11 课 (卡尺实测徽章挂扣) 个性化呈现
**Files:**
- Modify: `Beginner_JuniorMaker_V3/Lesson11_卡尺实测徽章挂扣/presentation/index.html`
- Modify: `Beginner_JuniorMaker_V3/Lesson11_卡尺实测徽章挂扣/presentation/custom.css`
- Modify: `Beginner_JuniorMaker_V3/Lesson11_卡尺实测徽章挂扣/presentation/custom.js`

**Step 1: 净化 HTML 文案并彻底废除手机支架日用品概念**
- 徽章底扣、滑块、卡尺测量、插接装配。
- 增加“卡尺测量”按钮，卡槽间隙单选框（4.0mm / 4.5mm）。

**Step 2: 编写 3D 游标卡尺测量与滑动插接阻挡动画**
- 在 `custom.css` 中编写游标卡尺尺身滑动的 3D CSS 动画。
- 在 `custom.js` 中控制插接测试时的物理移动限位。如果卡槽无公差，徽章移动到挂扣入口位置立刻被阻断并抖动闪红。如果卡槽有公差，滑入扣底。

**Step 3: 本地验证**
- 测试 4.0mm 卡槽：徽章卡在卡扣口报警。
- 测试 4.5mm 卡槽：顺利滑入。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker_V3/Lesson11_卡尺实测徽章挂扣
git commit -m "feat: 第11课 (卡尺实测徽章挂扣) 网页文案彻底净化与 3D 卡接模拟器"
```

---

### Task 8: 重新设计第 12 课 (多彩城堡图腾) 个性化呈现
**Files:**
- Modify: `Beginner_JuniorMaker_V3/Lesson12_多彩城堡图腾/presentation/index.html`
- Modify: `Beginner_JuniorMaker_V3/Lesson12_多彩城堡图腾/presentation/custom.css`
- Modify: `Beginner_JuniorMaker_V3/Lesson12_多彩城堡图腾/presentation/custom.js`

**Step 1: 净化 HTML 文案并废除外壳改色概念**
- 图腾徽章 AMS 涂色、按零件/按高度模式。
- 增加调色盘瓶刷（红、黄、蓝、黑），模式单选框。

**Step 2: 编写 3D 面板油漆桶涂装与换色排废吐丝动画**
- 在 `custom.css` 中为盾牌徽章各子组件编写变色样式。
- 在 `custom.js` 中监听点击，上色。若在“按高度”模式下，点击打印时，播放换色排废的耗时动画。

**Step 3: 本地验证**
- “按零件”填色，极速完成打印。
- “按高度”填色，弹出极慢的警告动画。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker_V3/Lesson12_多彩城堡图腾
git commit -m "feat: 第12课 (多彩城堡图腾) 网页文案彻底净化与 3D 多色涂装模拟器"
```

---

### Task 9: 重新设计第 13 课 (奇幻城堡大总管) 个性化呈现
**Files:**
- Modify: `Beginner_JuniorMaker_V3/Lesson13_奇幻城堡大总管/presentation/index.html`
- Modify: `Beginner_JuniorMaker_V3/Lesson13_奇幻城堡大总管/presentation/custom.css`
- Modify: `Beginner_JuniorMaker_V3/Lesson13_奇幻城堡大总管/presentation/custom.js`

**Step 1: 净化 HTML 文案为沙盘团队蓝图规划**
- 蓝图、榫卯接口协议规范。
- 增加榫头接口尺寸设定单选框（10mm紧配合 / 10.5mm留公差配合）。

**Step 2: 编写 3D 榫头拖拽拼装碰撞机制**
- 在 `custom.js` 中实现榫头的 Drag-and-Drop 拖拽或者点击落位判定，如果未留公差发生干涉边缘闪红，留公差后吸附成功。

**Step 3: 本地验证**
- 测试拖拽拼装，0公差装不进去；0.5mm 公差顺滑放入。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker_V3/Lesson13_奇幻城堡大总管
git commit -m "feat: 第13课 (奇幻城堡大总管) 网页文案彻底净化与 3D 榫卯配合装配"
```

---

### Task 10: 重新设计第 14 课 (城堡合体兴土木) 个性化呈现
**Files:**
- Modify: `Beginner_JuniorMaker_V3/Lesson14_城堡合体兴土木/presentation/index.html`
- Modify: `Beginner_JuniorMaker_V3/Lesson14_城堡合体兴土木/presentation/custom.css`
- Modify: `Beginner_JuniorMaker_V3/Lesson14_城堡合体兴土木/presentation/custom.js`

**Step 1: 净化 HTML 文案并替换梦想社区概念**
- 城堡多文件添加（Add File）、总装合体、干涉校验。
- 增加“一键合体”和“干涉体检”按钮。

**Step 2: 编写 3D 变形合体拼接与激光扫描干涉体检**
- 在 `custom.css` 中为所有构件（哨所、城梁、陀螺、守卫等）设计飞入城堡底座对应位置的 3D 飞入插槽动画。
- 在 `custom.js` 中编写干涉体检激光扫过，检查并显示通过提示。

**Step 3: 本地验证**
- 点击一键合体：所有散乱模型有序飞入城堡拼接。
- 点击干涉体检：激光扫过显示合格。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker_V3/Lesson14_城堡合体兴土木
git commit -m "feat: 第14课 (城堡合体兴土木) 网页文案彻底净化与 3D 合体拼装"
```

---

### Task 11: 重新设计第 15 课 (量产与后处理工坊) 个性化呈现
**Files:**
- Modify: `Beginner_JuniorMaker_V3/Lesson15_量产与后处理工坊/presentation/index.html`
- Modify: `Beginner_JuniorMaker_V3/Lesson15_量产与后处理工坊/presentation/custom.css`
- Modify: `Beginner_JuniorMaker_V3/Lesson15_量产与后处理工坊/presentation/custom.js`

**Step 1: 净化 HTML 文案并重构去支撑表述**
- 零件排版分盘、斜口钳剪断去除树形支撑。
- 增加“一键自动排盘”按钮和“安全去支撑”动作区。

**Step 2: 编写 3D 零件分盘散落与斜口钳拆解动画**
- 在 `custom.css` 中设计斜口钳剥离支撑的微动画，剥离后绿色支撑部分下坠隐去。
- 在 `custom.js` 中编写一键排版，多零件从 Plate 1 自动分配到 Plate 2 热床。

**Step 3: 本地验证**
- 测试点击排盘，零件自动对齐到双加热板。
- 测试点击钳子剪支撑，支撑剥落。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker_V3/Lesson15_量产与后处理工坊
git commit -m "feat: 第15课 (量产与后处理工坊) 网页文案彻底净化与 3D 排盘剥离模拟器"
```

---

### Task 12: 重新设计第 16 课 (城堡落成发布会) 个性化呈现
**Files:**
- Modify: `Beginner_JuniorMaker_V3/Lesson16_城堡落成发布会/presentation/index.html`
- Modify: `Beginner_JuniorMaker_V3/Lesson16_城堡落成发布会/presentation/custom.css`
- Modify: `Beginner_JuniorMaker_V3/Lesson16_城堡落成发布会/presentation/custom.js`

**Step 1: 净化 HTML 文案并替换梦想社区发布会概念**
- 城堡路演发布、启动典礼、结业证书。
- 增加“启动典礼”按钮。

**Step 2: 编写 3D 城堡全面运行动态光效与彩蛋证书**
- 在 `custom.css` 中编写城堡自转、挥臂、灯光透射三维综合动画，以及彩色礼花飘落动画。
- 在 `custom.js` 中实现点击启动，城堡运行并自动弹窗结业荣誉证书。

**Step 3: 本地验证**
- 点击启动典礼：城堡运转、礼花绽放、金光闪闪证书弹出。

**Step 4: Commit**
```bash
git add Beginner_JuniorMaker_V3/Lesson16_城堡落成发布会
git commit -m "feat: 第16课 (城堡落成发布会) 网页文案彻底净化与 3D 落成典礼"
```

---

### Task 13: 全局校验清理与同步远程
**Files:**
- Modify: `Beginner_JuniorMaker_V3`
- Modify: `.gitignore`

**Step 1: 运行自动化校验脚本**
运行：`python3 /Users/samrosa/.gemini/antigravity/brain/6526ae29-c446-4c44-b9fb-799554dd4c5e/scratch/verify_patches.py`
Expected: 所有的 11 节课都检测通过，确认没有任何外部 `shared_web` 跨目录跨域引用。

**Step 2: 清理无用文件并添加 `.gitignore` 规则**
- 在项目根目录的 `.gitignore` 中加入 `.DS_Store`，防止系统垃圾文件被同步：
  ```
  **/.DS_Store
  .DS_Store
  ```

**Step 3: 推送到 GitHub 远程仓库**
```bash
git add .
git commit -m "chore: 净化项目目录并同步最终 3D 个性化呈现改动"
git push origin main
```
