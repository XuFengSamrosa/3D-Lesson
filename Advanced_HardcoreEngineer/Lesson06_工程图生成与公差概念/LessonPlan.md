# Lesson 6 - 工程图生成与公差概念
> 所属模块: 机械制图与工程基础

## 0. 课程概览 (Course Telemetry)
* **核心环境**：`SolidWorks / CAD / Motion / CAE`
* **课程时长**：90 分钟（30分钟深度理论 + 60分钟硬核实操）
* **核心目标**：彻底打通【工程图生成与公差概念】的底层架构，从原理到工业级落地。

---

## 1. 结构与算法拆解 (Engineering Breakdown)
探索三维模型向工业标准的2D工程图转化的全流程，引入形位公差的数学模型。

本节课程的工业级核心节点拆解如下，请务必在实操前深刻理解其数学与物理意义：
1. **国标(GB)图纸格式与图框模板定制**
   > *深度拓展*：在现代工业标准中，该节点决定了系统的基准误差界限。错误的理解将直接导致后续公差计算(TolAnalyst)与闭环控制系统失控。
2. **尺寸公差(Dimensional Tolerance)带与配合类型解析**
   > *深度拓展*：掌握此环节可以避免在复杂装配和极限运行状态下的非线性崩溃。
3. **几何公差(GD&T)符号系统及基准(Datum)理论**
   > *深度拓展*：跨界融合的关键所在，将抽象的算法或空间几何转化为实打实的物理执行机构。

---

## 2. 硬核构建与执行流 (Implementation & Coding)
真正的工程师不依赖鼠标的随机点击，而是依靠严密的参数矩阵与代码逻辑驱动。

### 核心执行逻辑片段
```text
' 注入公差数据集
Dim myDimension As Object
Set myDimension = Part.Parameter("D1@Sketch1")
myDimension.ToleranceType = swTolType_e.swTolBILAT
myDimension.SetToleranceValues 0.05, -0.02

' 挂载形位公差控制框(Feature Control Frame)
log_status("Attaching GD&T Symbol...")
```
*执行提示*：在执行上述指令/特征堆叠时，必须时刻开启自检机制，确保每一个变量(`Global Variable`)与函数(`Function`)处于完全定义(Fully Defined)的状态。

---

## 3. 极限测试与排错 (Stress Test & Debugging)
工业现场充满不确定性，排查(Debug)能力是鉴别工程师段位的唯一标准。
当你遇到以下致命错误时，请参照处理方案：

- 🔴 **[ERR_01] 模型尺寸更新后工程图视图比例不同步**
  - **排查链路**：从源头检查几何基准面或传感器原始数据(Raw Data)，切断多余的冗余约束(Redundant Mates/Constraints)。
- 🔴 **[ERR_02] 公差带解析失败导致的装配体过度干涉**
  - **排查链路**：进入安全模式(Safe Mode)或单步调试，逐行/逐特征(Feature Rollback)恢复系统至上一个无错状态。
- 🔴 **[ERR_03] 剖面线(Hatch)跨越错误边界导致的渲染溢出**
  - **排查链路**：检查硬件物理连接、内存(RAM)泄漏或SolidWorks/编译器内部缓存溢出。

---

## 4. 进阶挑战令 (Advanced Mission Directive)
**[S-CLASS] 实操考核：**
> 为电机主轴输出标准工程图，正确标注配合尺寸的公差代号（如H7/g6），并添加圆柱度与同轴度的形位公差控制框。

*要求*：必须在不查阅参考文档的情况下独立完成。完成后，请执行系统级干涉检查/内存检测工具，确保 0 Error, 0 Warning。
