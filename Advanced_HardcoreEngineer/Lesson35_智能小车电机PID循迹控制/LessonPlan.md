# Lesson 35 - 智能小车电机PID循迹控制
> 所属模块: 智能控制与电路

## 0. 课程概览 (Course Telemetry)
* **核心环境**：`ESP32 / C++ / Python / EDA`
* **课程时长**：90 分钟（30分钟深度理论 + 60分钟硬核实操）
* **核心目标**：彻底打通【智能小车电机PID循迹控制】的底层架构，从原理到工业级落地。

---

## 1. 结构与算法拆解 (Engineering Breakdown)
将PID算法应用于实体物理空间，结合红外灰度传感器阵列，实现智能小车的高速平滑循迹。

本节课程的工业级核心节点拆解如下，请务必在实操前深刻理解其数学与物理意义：
1. **传感器阵列加权平均(Weighted Average)计算偏航误差**
   > *深度拓展*：在现代工业标准中，该节点决定了系统的基准误差界限。错误的理解将直接导致后续公差计算(TolAnalyst)与闭环控制系统失控。
2. **双轮差速底盘的转向控制模型**
   > *深度拓展*：掌握此环节可以避免在复杂装配和极限运行状态下的非线性崩溃。
3. **Kp(响应速度)与Kd(阻尼系数)的经验整定(Tuning)方法**
   > *深度拓展*：跨界融合的关键所在，将抽象的算法或空间几何转化为实打实的物理执行机构。

---

## 2. 硬核构建与执行流 (Implementation & Coding)
真正的工程师不依赖鼠标的随机点击，而是依靠严密的参数矩阵与代码逻辑驱动。

### 核心执行逻辑片段
```text
// 灰度传感器加权寻线
int get_line_error() {
  int s1 = analogRead(A1); int s2 = analogRead(A2); int s3 = analogRead(A3);
  // 假设黑线值为高
  int error = (s1 * -100 + s2 * 0 + s3 * 100) / (s1 + s2 + s3 + 1); 
  return error;
}
// PID调整双轮PWM
float correction = calculate_PID(0, get_line_error());
set_motors(base_speed - correction, base_speed + correction);
```
*执行提示*：在执行上述指令/特征堆叠时，必须时刻开启自检机制，确保每一个变量(`Global Variable`)与函数(`Function`)处于完全定义(Fully Defined)的状态。

---

## 3. 极限测试与排错 (Stress Test & Debugging)
工业现场充满不确定性，排查(Debug)能力是鉴别工程师段位的唯一标准。
当你遇到以下致命错误时，请参照处理方案：

- 🔴 **[ERR_01] 传感器环境光校准不良导致底色识别错误(误把阴影当黑线)**
  - **排查链路**：从源头检查几何基准面或传感器原始数据(Raw Data)，切断多余的冗余约束(Redundant Mates/Constraints)。
- 🔴 **[ERR_02] Kp过大导致的寻线蛇形走位(高频振荡)**
  - **排查链路**：进入安全模式(Safe Mode)或单步调试，逐行/逐特征(Feature Rollback)恢复系统至上一个无错状态。
- 🔴 **[ERR_03] 速度过快+Kd太小导致过弯时无法及时拉回(冲出赛道)**
  - **排查链路**：检查硬件物理连接、内存(RAM)泄漏或SolidWorks/编译器内部缓存溢出。

---

## 4. 进阶挑战令 (Advanced Mission Directive)
**[S-CLASS] 实操考核：**
> 实现一个五路红外传感器的寻线小车代码，加入赛道丢失保护逻辑(若所有传感器全白则倒车或原地旋转寻找黑线)，并能在急弯处自动减速。

*要求*：必须在不查阅参考文档的情况下独立完成。完成后，请执行系统级干涉检查/内存检测工具，确保 0 Error, 0 Warning。
