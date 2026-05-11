# Lesson 44 - 复杂轨迹规划与平滑算法
> 所属模块: 机器人综合项目

## 0. 课程概览 (Course Telemetry)
* **核心环境**：`ESP32 / C++ / Python / EDA`
* **课程时长**：90 分钟（30分钟深度理论 + 60分钟硬核实操）
* **核心目标**：彻底打通【复杂轨迹规划与平滑算法】的底层架构，从原理到工业级落地。

---

## 1. 结构与算法拆解 (Engineering Breakdown)
告别生硬的直线运动，研究工业机械臂的三次多项式与五次多项式轨迹规划，实现柔性动作。

本节课程的工业级核心节点拆解如下，请务必在实操前深刻理解其数学与物理意义：
1. **关节空间(Joint Space)与笛卡尔空间(Cartesian Space)插值差异**
   > *深度拓展*：在现代工业标准中，该节点决定了系统的基准误差界限。错误的理解将直接导致后续公差计算(TolAnalyst)与闭环控制系统失控。
2. **三次多项式(Cubic Polynomial)保证速度连续性**
   > *深度拓展*：掌握此环节可以避免在复杂装配和极限运行状态下的非线性崩溃。
3. **S型加减速曲线(S-Curve Profile)以控制急位移(Jerk)**
   > *深度拓展*：跨界融合的关键所在，将抽象的算法或空间几何转化为实打实的物理执行机构。

---

## 2. 硬核构建与执行流 (Implementation & Coding)
真正的工程师不依赖鼠标的随机点击，而是依靠严密的参数矩阵与代码逻辑驱动。

### 核心执行逻辑片段
```text
// 三次多项式轨迹插值器
void plan_cubic_trajectory(float q0, float q1, float t_total, float current_t, float &pos, float &vel) {
  float a0 = q0;
  float a1 = 0;
  float a2 = 3 * (q1 - q0) / pow(t_total, 2);
  float a3 = -2 * (q1 - q0) / pow(t_total, 3);
  pos = a0 + a1*current_t + a2*pow(current_t, 2) + a3*pow(current_t, 3);
  vel = a1 + 2*a2*current_t + 3*a3*pow(current_t, 2);
}
```
*执行提示*：在执行上述指令/特征堆叠时，必须时刻开启自检机制，确保每一个变量(`Global Variable`)与函数(`Function`)处于完全定义(Fully Defined)的状态。

---

## 3. 极限测试与排错 (Stress Test & Debugging)
工业现场充满不确定性，排查(Debug)能力是鉴别工程师段位的唯一标准。
当你遇到以下致命错误时，请参照处理方案：

- 🔴 **[ERR_01] 在笛卡尔空间直线插值导致关节角度发生奇异越界**
  - **排查链路**：从源头检查几何基准面或传感器原始数据(Raw Data)，切断多余的冗余约束(Redundant Mates/Constraints)。
- 🔴 **[ERR_02] 未限制最大速度与加速度(Jerk过大)导致舵机齿轮崩坏**
  - **排查链路**：进入安全模式(Safe Mode)或单步调试，逐行/逐特征(Feature Rollback)恢复系统至上一个无错状态。
- 🔴 **[ERR_03] 定时器中断抖动导致的插值时间步长(dt)不均匀引起的微小颤抖**
  - **排查链路**：检查硬件物理连接、内存(RAM)泄漏或SolidWorks/编译器内部缓存溢出。

---

## 4. 进阶挑战令 (Advanced Mission Directive)
**[S-CLASS] 实操考核：**
> 为机械臂编写一个画圆的轨迹规划算法。要求不仅在空间中画出一个绝对完美的圆，且机械臂的动作必须有平滑的加速起步和减速停止过程。

*要求*：必须在不查阅参考文档的情况下独立完成。完成后，请执行系统级干涉检查/内存检测工具，确保 0 Error, 0 Warning。
