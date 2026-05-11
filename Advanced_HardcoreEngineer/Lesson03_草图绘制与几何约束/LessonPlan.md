# Lesson 3 - 草图绘制与几何约束
> 所属模块: 机械制图与工程基础

## 0. 课程概览 (Course Telemetry)
* **核心环境**：`SolidWorks / CAD / Motion / CAE`
* **课程时长**：90 分钟（30分钟深度理论 + 60分钟硬核实操）
* **核心目标**：彻底打通【草图绘制与几何约束】的底层架构，从原理到工业级落地。

---

## 1. 结构与算法拆解 (Engineering Breakdown)
深究草图几何拓扑引擎，利用代数方程和几何约束矩阵实现二维轮廓的绝对刚性控制。

本节课程的工业级核心节点拆解如下，请务必在实操前深刻理解其数学与物理意义：
1. **草图求解器(Sketch Solver)自由度(DOF)分析**
   > *深度拓展*：在现代工业标准中，该节点决定了系统的基准误差界限。错误的理解将直接导致后续公差计算(TolAnalyst)与闭环控制系统失控。
2. **拓扑约束矩阵：共线、同心、相切与对称的数学表达**
   > *深度拓展*：掌握此环节可以避免在复杂装配和极限运行状态下的非线性崩溃。
3. **多轮廓草图嵌套与区域轮廓(Contour)选择技术**
   > *深度拓展*：跨界融合的关键所在，将抽象的算法或空间几何转化为实打实的物理执行机构。

---

## 2. 硬核构建与执行流 (Implementation & Coding)
真正的工程师不依赖鼠标的随机点击，而是依靠严密的参数矩阵与代码逻辑驱动。

### 核心执行逻辑片段
```text
' 构建高刚性约束矩阵
Part.InsertSketch2 True
Part.SketchManager.CreateLine 0, 0, 0, 0.05, 0, 0
Part.SketchAddConstraints "sgHORIZONTAL2D"

' 闭合环路检测
log_status("Validating Sketch Contour Integrity...")
boolstatus = Part.Extension.SelectByID2("Line1", "SKETCHSEGMENT", 0, 0, 0, False, 0, Nothing, 0)
```
*执行提示*：在执行上述指令/特征堆叠时，必须时刻开启自检机制，确保每一个变量(`Global Variable`)与函数(`Function`)处于完全定义(Fully Defined)的状态。

---

## 3. 极限测试与排错 (Stress Test & Debugging)
工业现场充满不确定性，排查(Debug)能力是鉴别工程师段位的唯一标准。
当你遇到以下致命错误时，请参照处理方案：

- 🔴 **[ERR_01] 草图求解器计算奇异(Singularity)导致的无解报错**
  - **排查链路**：从源头检查几何基准面或传感器原始数据(Raw Data)，切断多余的冗余约束(Redundant Mates/Constraints)。
- 🔴 **[ERR_02] 微小几何重叠(Micro-overlaps)引发的特征生成失败**
  - **排查链路**：进入安全模式(Safe Mode)或单步调试，逐行/逐特征(Feature Rollback)恢复系统至上一个无错状态。
- 🔴 **[ERR_03] 悬空点(Dangling points)造成的欠定义状态排查**
  - **排查链路**：检查硬件物理连接、内存(RAM)泄漏或SolidWorks/编译器内部缓存溢出。

---

## 4. 进阶挑战令 (Advanced Mission Directive)
**[S-CLASS] 实操考核：**
> 绘制一个包含15个以上几何图元的多级嵌套草图，且在不使用任何尺寸标注的情况下，仅依靠几何约束达到完全定义(Fully Defined)状态。

*要求*：必须在不查阅参考文档的情况下独立完成。完成后，请执行系统级干涉检查/内存检测工具，确保 0 Error, 0 Warning。
