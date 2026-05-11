# Lesson 32 - 传感器基础：超声波与红外模块
> 所属模块: 电机与驱动系统

## 0. 课程概览 (Course Telemetry)
* **核心环境**：`ESP32 / C++ / Python / EDA`
* **课程时长**：90 分钟（30分钟深度理论 + 60分钟硬核实操）
* **核心目标**：彻底打通【传感器基础：超声波与红外模块】的底层架构，从原理到工业级落地。

---

## 1. 结构与算法拆解 (Engineering Breakdown)
建立机器人的感知神经，利用光波与声波获取空间距离信息，并处理数字噪声。

本节课程的工业级核心节点拆解如下，请务必在实操前深刻理解其数学与物理意义：
1. **HC-SR04超声波的时差测距(ToF)原理与音速温度补偿**
   > *深度拓展*：在现代工业标准中，该节点决定了系统的基准误差界限。错误的理解将直接导致后续公差计算(TolAnalyst)与闭环控制系统失控。
2. **红外反射传感器(TCRT5000)的ADC模拟量阈值判定**
   > *深度拓展*：掌握此环节可以避免在复杂装配和极限运行状态下的非线性崩溃。
3. **传感器数据的滑动窗口滤波(Moving Average Filter)**
   > *深度拓展*：跨界融合的关键所在，将抽象的算法或空间几何转化为实打实的物理执行机构。

---

## 2. 硬核构建与执行流 (Implementation & Coding)
真正的工程师不依赖鼠标的随机点击，而是依靠严密的参数矩阵与代码逻辑驱动。

### 核心执行逻辑片段
```text
// 超声波测距与均值滤波
long measure_distance() {
  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms超时防死锁
  return duration * 0.034 / 2;
}
// 注入滤波矩阵...
```
*执行提示*：在执行上述指令/特征堆叠时，必须时刻开启自检机制，确保每一个变量(`Global Variable`)与函数(`Function`)处于完全定义(Fully Defined)的状态。

---

## 3. 极限测试与排错 (Stress Test & Debugging)
工业现场充满不确定性，排查(Debug)能力是鉴别工程师段位的唯一标准。
当你遇到以下致命错误时，请参照处理方案：

- 🔴 **[ERR_01] pulseIn函数无超时设置导致的线程死锁**
  - **排查链路**：从源头检查几何基准面或传感器原始数据(Raw Data)，切断多余的冗余约束(Redundant Mates/Constraints)。
- 🔴 **[ERR_02] 超声波多路反射(多径效应)引起的突变假数据(Outliers)**
  - **排查链路**：进入安全模式(Safe Mode)或单步调试，逐行/逐特征(Feature Rollback)恢复系统至上一个无错状态。
- 🔴 **[ERR_03] 环境光线红外线(如太阳光)导致红外传感器饱和失效**
  - **排查链路**：检查硬件物理连接、内存(RAM)泄漏或SolidWorks/编译器内部缓存溢出。

---

## 4. 进阶挑战令 (Advanced Mission Directive)
**[S-CLASS] 实操考核：**
> 结合超声波和红外模块，编写一个防跌落+避障算法，要求传感器数据必须经过中值滤波处理，彻底过滤偶尔出现的杂乱跳变。

*要求*：必须在不查阅参考文档的情况下独立完成。完成后，请执行系统级干涉检查/内存检测工具，确保 0 Error, 0 Warning。
