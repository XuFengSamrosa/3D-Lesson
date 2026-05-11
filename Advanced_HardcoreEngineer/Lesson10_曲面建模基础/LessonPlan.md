# Lesson 10 - 曲面建模基础
> 所属模块: 零部件三维建模

## 0. 课程概览 (Course Telemetry)
* **核心环境**：`SolidWorks / CAD / Motion / CAE`
* **课程时长**：90 分钟（30分钟深度理论 + 60分钟硬核实操）
* **核心目标**：彻底打通【曲面建模基础】的底层架构，从原理到工业级落地。

---

## 1. 结构与算法拆解 (Engineering Breakdown)
跳脱实体的体积束缚，深入探讨NURBS（非均匀有理B样条）曲面的数学表达与拼接逻辑。

本节课程的工业级核心节点拆解如下，请务必在实操前深刻理解其数学与物理意义：
1. **NURBS曲面的U/V等参数线流向控制**
   > *深度拓展*：在现代工业标准中，该节点决定了系统的基准误差界限。错误的理解将直接导致后续公差计算(TolAnalyst)与闭环控制系统失控。
2. **曲面剪裁(Trim)与相互修剪的边界计算**
   > *深度拓展*：掌握此环节可以避免在复杂装配和极限运行状态下的非线性崩溃。
3. **边界曲面(Boundary Surface)与曲率梳(Curvature Comb)分析**
   > *深度拓展*：跨界融合的关键所在，将抽象的算法或空间几何转化为实打实的物理执行机构。

---

## 2. 硬核构建与执行流 (Implementation & Coding)
真正的工程师不依赖鼠标的随机点击，而是依靠严密的参数矩阵与代码逻辑驱动。

### 核心执行逻辑片段
```text
' 构建NURBS边界曲面
log_status("Evaluating NURBS UV Space...")
Dim myBndSurf As Object
Set myBndSurf = Part.FeatureManager.InsertBoundarySurface(2, 2, 0, 0)
' 评估斑马条纹(Zebra Stripes)连续性
```
*执行提示*：在执行上述指令/特征堆叠时，必须时刻开启自检机制，确保每一个变量(`Global Variable`)与函数(`Function`)处于完全定义(Fully Defined)的状态。

---

## 3. 极限测试与排错 (Stress Test & Debugging)
工业现场充满不确定性，排查(Debug)能力是鉴别工程师段位的唯一标准。
当你遇到以下致命错误时，请参照处理方案：

- 🔴 **[ERR_01] 修剪工具与目标曲面不完全相交导致的剪裁失败**
  - **排查链路**：从源头检查几何基准面或传感器原始数据(Raw Data)，切断多余的冗余约束(Redundant Mates/Constraints)。
- 🔴 **[ERR_02] 缝合曲面时微小间隙(Gap)造成的实体化失败**
  - **排查链路**：进入安全模式(Safe Mode)或单步调试，逐行/逐特征(Feature Rollback)恢复系统至上一个无错状态。
- 🔴 **[ERR_03] 奇异点(Singularity Point)附近引发的法线方向错乱**
  - **排查链路**：检查硬件物理连接、内存(RAM)泄漏或SolidWorks/编译器内部缓存溢出。

---

## 4. 进阶挑战令 (Advanced Mission Directive)
**[S-CLASS] 实操考核：**
> 利用曲面放样和边界曲面技术，构建一个符合人体工学的鼠标外壳，最后加厚转化为实体并进行斑马条纹连续性检查。

*要求*：必须在不查阅参考文档的情况下独立完成。完成后，请执行系统级干涉检查/内存检测工具，确保 0 Error, 0 Warning。
