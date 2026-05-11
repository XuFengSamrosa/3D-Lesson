# Lesson 5 - 基础特征：拉伸与旋转
> 所属模块: 机械制图与工程基础

## 0. 课程概览 (Course Telemetry)
* **核心环境**：`SolidWorks / CAD / Motion / CAE`
* **课程时长**：90 分钟（30分钟深度理论 + 60分钟硬核实操）
* **核心目标**：彻底打通【基础特征：拉伸与旋转】的底层架构，从原理到工业级落地。

---

## 1. 结构与算法拆解 (Engineering Breakdown)
将二维拓扑图转化为三维实体，掌握拉伸与旋转两种基本体生成算法的布尔运算逻辑。

本节课程的工业级核心节点拆解如下，请务必在实操前深刻理解其数学与物理意义：
1. **拉伸终止条件(End Conditions)的空间拓扑判定**
   > *深度拓展*：在现代工业标准中，该节点决定了系统的基准误差界限。错误的理解将直接导致后续公差计算(TolAnalyst)与闭环控制系统失控。
2. **旋转轴(Axis of Revolution)与对称旋转体的矩阵变换**
   > *深度拓展*：掌握此环节可以避免在复杂装配和极限运行状态下的非线性崩溃。
3. **多实体(Multi-body)环境下的特征合并与分离**
   > *深度拓展*：跨界融合的关键所在，将抽象的算法或空间几何转化为实打实的物理执行机构。

---

## 2. 硬核构建与执行流 (Implementation & Coding)
真正的工程师不依赖鼠标的随机点击，而是依靠严密的参数矩阵与代码逻辑驱动。

### 核心执行逻辑片段
```text
' 执行拉伸特征布尔加运算
log_status("Executing Extrusion Boolean ADD...")
Dim myFeature As Object
Set myFeature = Part.FeatureManager.FeatureExtrusion2(True, False, False, 0, 0, 0.05, 0.01, False, False, False, False, 0, 0, False, False, False, False, True, True, True, 0, 0, False)

' 检查多实体干涉
```
*执行提示*：在执行上述指令/特征堆叠时，必须时刻开启自检机制，确保每一个变量(`Global Variable`)与函数(`Function`)处于完全定义(Fully Defined)的状态。

---

## 3. 极限测试与排错 (Stress Test & Debugging)
工业现场充满不确定性，排查(Debug)能力是鉴别工程师段位的唯一标准。
当你遇到以下致命错误时，请参照处理方案：

- 🔴 **[ERR_01] 拉伸方向向量错误导致的几何体自相交(Self-intersecting)**
  - **排查链路**：从源头检查几何基准面或传感器原始数据(Raw Data)，切断多余的冗余约束(Redundant Mates/Constraints)。
- 🔴 **[ERR_02] 旋转草图未闭合或轴线穿过轮廓内部报错**
  - **排查链路**：进入安全模式(Safe Mode)或单步调试，逐行/逐特征(Feature Rollback)恢复系统至上一个无错状态。
- 🔴 **[ERR_03] “成形到一面”终止条件中参考面丢失引发的特征断裂**
  - **排查链路**：检查硬件物理连接、内存(RAM)泄漏或SolidWorks/编译器内部缓存溢出。

---

## 4. 进阶挑战令 (Advanced Mission Directive)
**[S-CLASS] 实操考核：**
> 利用单一个多轮廓草图，配合不同区域的拉伸高度与旋转特征，一步生成带阶梯孔的法兰盘复杂实体模型。

*要求*：必须在不查阅参考文档的情况下独立完成。完成后，请执行系统级干涉检查/内存检测工具，确保 0 Error, 0 Warning。
