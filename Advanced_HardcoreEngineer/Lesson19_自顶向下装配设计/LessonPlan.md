# Lesson 19 - 自顶向下装配设计
> 所属模块: 装配与运动仿真

## 0. 课程概览 (Course Telemetry)
* **核心环境**：`SolidWorks / CAD / Motion / CAE`
* **课程时长**：90 分钟（30分钟深度理论 + 60分钟硬核实操）
* **核心目标**：彻底打通【自顶向下装配设计】的底层架构，从原理到工业级落地。

---

## 1. 结构与算法拆解 (Engineering Breakdown)
颠覆传统建模顺序，掌握系统级架构设计(Systems Engineering)的核心理念，在装配体中驱动零件变体。

本节课程的工业级核心节点拆解如下，请务必在实操前深刻理解其数学与物理意义：
1. **骨架草图(Skeleton Sketch)主导的全局参数传递**
   > *深度拓展*：在现代工业标准中，该节点决定了系统的基准误差界限。错误的理解将直接导致后续公差计算(TolAnalyst)与闭环控制系统失控。
2. **虚拟零部件(Virtual Components)与上下文特征(In-Context)**
   > *深度拓展*：掌握此环节可以避免在复杂装配和极限运行状态下的非线性崩溃。
3. **外部参考(External References)的锁定与断开管理**
   > *深度拓展*：跨界融合的关键所在，将抽象的算法或空间几何转化为实打实的物理执行机构。

---

## 2. 硬核构建与执行流 (Implementation & Coding)
真正的工程师不依赖鼠标的随机点击，而是依靠严密的参数矩阵与代码逻辑驱动。

### 核心执行逻辑片段
```text
' 初始化骨架驱动网络
log_status("Generating Top-Down Skeleton Framework...")
Dim swComp As Object
swAssembly.InsertNewVirtualPart Nothing, swComp
' 在上下文中编辑：关联骨架草图节点
```
*执行提示*：在执行上述指令/特征堆叠时，必须时刻开启自检机制，确保每一个变量(`Global Variable`)与函数(`Function`)处于完全定义(Fully Defined)的状态。

---

## 3. 极限测试与排错 (Stress Test & Debugging)
工业现场充满不确定性，排查(Debug)能力是鉴别工程师段位的唯一标准。
当你遇到以下致命错误时，请参照处理方案：

- 🔴 **[ERR_01] 循环引用(Circular Reference)导致的特征树无限重建死循环**
  - **排查链路**：从源头检查几何基准面或传感器原始数据(Raw Data)，切断多余的冗余约束(Redundant Mates/Constraints)。
- 🔴 **[ERR_02] 外部参考断裂导致零件更新失效**
  - **排查链路**：进入安全模式(Safe Mode)或单步调试，逐行/逐特征(Feature Rollback)恢复系统至上一个无错状态。
- 🔴 **[ERR_03] 虚拟零件误删引起的系统级数据丢失**
  - **排查链路**：检查硬件物理连接、内存(RAM)泄漏或SolidWorks/编译器内部缓存溢出。

---

## 4. 进阶挑战令 (Advanced Mission Directive)
**[S-CLASS] 实操考核：**
> 使用一个全局3D草图作为骨架，设计一个三轴机械臂的外壳与连杆，当改变草图中的臂长参数时，所有零件自动更新尺寸。

*要求*：必须在不查阅参考文档的情况下独立完成。完成后，请执行系统级干涉检查/内存检测工具，确保 0 Error, 0 Warning。
