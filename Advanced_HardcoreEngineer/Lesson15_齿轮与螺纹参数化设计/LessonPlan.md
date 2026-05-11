# Lesson 15 - 齿轮与螺纹参数化设计
> 所属模块: 零部件三维建模

## 0. 课程概览 (Course Telemetry)
* **核心环境**：`SolidWorks / CAD / Motion / CAE`
* **课程时长**：90 分钟（30分钟深度理论 + 60分钟硬核实操）
* **核心目标**：彻底打通【齿轮与螺纹参数化设计】的底层架构，从原理到工业级落地。

---

## 1. 结构与算法拆解 (Engineering Breakdown)
解析复杂机械传动机构的数学方程，掌握渐开线齿廓与螺旋面的方程式驱动构建。

本节课程的工业级核心节点拆解如下，请务必在实操前深刻理解其数学与物理意义：
1. **渐开线(Involute Curve)参数方程的极坐标表示**
   > *深度拓展*：在现代工业标准中，该节点决定了系统的基准误差界限。错误的理解将直接导致后续公差计算(TolAnalyst)与闭环控制系统失控。
2. **模数(Module)、压力角与分度圆的代数关联**
   > *深度拓展*：掌握此环节可以避免在复杂装配和极限运行状态下的非线性崩溃。
3. **螺旋扫描(Helical Sweep)与标准公制螺纹(Metric Thread)拓扑**
   > *深度拓展*：跨界融合的关键所在，将抽象的算法或空间几何转化为实打实的物理执行机构。

---

## 2. 硬核构建与执行流 (Implementation & Coding)
真正的工程师不依赖鼠标的随机点击，而是依靠严密的参数矩阵与代码逻辑驱动。

### 核心执行逻辑片段
```text
' 注入渐开线数学方程
log_status("Plotting Involute Curve via Equation...")
Dim eqCurve As Object
Set eqCurve = Part.SketchManager.CreateEquationSpline2("""r""*cos(""t"")+""r""*""t""*sin(""t"")", """r""*sin(""t"")-""r""*""t""*cos(""t"")", "", 0, "pi/2", False, 0, 0, 0, True, True)
' 阵列生成全齿
```
*执行提示*：在执行上述指令/特征堆叠时，必须时刻开启自检机制，确保每一个变量(`Global Variable`)与函数(`Function`)处于完全定义(Fully Defined)的状态。

---

## 3. 极限测试与排错 (Stress Test & Debugging)
工业现场充满不确定性，排查(Debug)能力是鉴别工程师段位的唯一标准。
当你遇到以下致命错误时，请参照处理方案：

- 🔴 **[ERR_01] 方程式语法错误导致的渐开线生成崩溃**
  - **排查链路**：从源头检查几何基准面或传感器原始数据(Raw Data)，切断多余的冗余约束(Redundant Mates/Constraints)。
- 🔴 **[ERR_02] 根部发生干涉需要倒角或修缘(Profile Modification)处理**
  - **排查链路**：进入安全模式(Safe Mode)或单步调试，逐行/逐特征(Feature Rollback)恢复系统至上一个无错状态。
- 🔴 **[ERR_03] 螺旋角度计算误差导致螺杆与螺母自锁失效或无法啮合**
  - **排查链路**：检查硬件物理连接、内存(RAM)泄漏或SolidWorks/编译器内部缓存溢出。

---

## 4. 进阶挑战令 (Advanced Mission Directive)
**[S-CLASS] 实操考核：**
> 使用方程式功能构建一对标准直齿圆柱齿轮（主动齿轮20齿，从动齿轮40齿，模数2），确保中心距绝对准确并进行装配。

*要求*：必须在不查阅参考文档的情况下独立完成。完成后，请执行系统级干涉检查/内存检测工具，确保 0 Error, 0 Warning。
