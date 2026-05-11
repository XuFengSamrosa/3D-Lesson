# Lesson 26 - 直流电机DC与PWM调速原理
> 所属模块: 电机与驱动系统

## 0. 课程概览 (Course Telemetry)
* **核心环境**：`ESP32 / C++ / Python / EDA`
* **课程时长**：90 分钟（30分钟深度理论 + 60分钟硬核实操）
* **核心目标**：彻底打通【直流电机DC与PWM调速原理】的底层架构，从原理到工业级落地。

---

## 1. 结构与算法拆解 (Engineering Breakdown)
解构有刷直流电机的物理模型，引入脉宽调制(PWM)技术实现功率输出的精细数字化控制。

本节课程的工业级核心节点拆解如下，请务必在实操前深刻理解其数学与物理意义：
1. **H桥(H-Bridge)驱动电路与电机正反转逻辑**
   > *深度拓展*：在现代工业标准中，该节点决定了系统的基准误差界限。错误的理解将直接导致后续公差计算(TolAnalyst)与闭环控制系统失控。
2. **PWM占空比(Duty Cycle)与平均电压积分关系**
   > *深度拓展*：掌握此环节可以避免在复杂装配和极限运行状态下的非线性崩溃。
3. **ESP32 LEDC (LED Control) 外设的硬件PWM发生器**
   > *深度拓展*：跨界融合的关键所在，将抽象的算法或空间几何转化为实打实的物理执行机构。

---

## 2. 硬核构建与执行流 (Implementation & Coding)
真正的工程师不依赖鼠标的随机点击，而是依靠严密的参数矩阵与代码逻辑驱动。

### 核心执行逻辑片段
```text
// ESP32 LEDC PWM Motor Control
const int pwmChannel = 0;
const int freq = 5000; // 5kHz避免人耳噪音
const int resolution = 8; // 8-bit (0-255)
void setup() {
  ledcSetup(pwmChannel, freq, resolution);
  ledcAttachPin(25, pwmChannel);
}
void loop() {
  for(int duty=0; duty<=255; duty++) {
    ledcWrite(pwmChannel, duty);
    delay(10);
  }
}
```
*执行提示*：在执行上述指令/特征堆叠时，必须时刻开启自检机制，确保每一个变量(`Global Variable`)与函数(`Function`)处于完全定义(Fully Defined)的状态。

---

## 3. 极限测试与排错 (Stress Test & Debugging)
工业现场充满不确定性，排查(Debug)能力是鉴别工程师段位的唯一标准。
当你遇到以下致命错误时，请参照处理方案：

- 🔴 **[ERR_01] PWM频率过低导致的电机异响(线圈啸叫)与抖动**
  - **排查链路**：从源头检查几何基准面或传感器原始数据(Raw Data)，切断多余的冗余约束(Redundant Mates/Constraints)。
- 🔴 **[ERR_02] H桥同侧MOS管直通短路烧毁驱动芯片(如L298N/TB6612)**
  - **排查链路**：进入安全模式(Safe Mode)或单步调试，逐行/逐特征(Feature Rollback)恢复系统至上一个无错状态。
- 🔴 **[ERR_03] 电机反电动势(Back EMF)击穿主控引脚(缺乏续流二极管)**
  - **排查链路**：检查硬件物理连接、内存(RAM)泄漏或SolidWorks/编译器内部缓存溢出。

---

## 4. 进阶挑战令 (Advanced Mission Directive)
**[S-CLASS] 实操考核：**
> 编写程序使用TB6612FNG驱动器控制直流电机，实现电机的平滑加速、匀速运行5秒，再平滑减速至反向运行的完整闭环流程。

*要求*：必须在不查阅参考文档的情况下独立完成。完成后，请执行系统级干涉检查/内存检测工具，确保 0 Error, 0 Warning。
