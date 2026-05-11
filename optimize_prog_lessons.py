import os
import shutil

BASE_DIR = "/Users/samrosa/DEV/3D/Advanced_HardcoreEngineer"

# We will optimize 5 key programming lessons:
# 27, 34, 36, 37, 42

LESSONS_TO_OPTIMIZE = {
    27: "Lesson27_步进电机原理与A4988驱动",
    34: "Lesson34_闭环控制基础：认识PID算法",
    36: "Lesson36_机械臂运动学：正向运动学FK",
    37: "Lesson37_机械臂逆向运动学IK解析",
    42: "Lesson42_机器视觉初探：OpenCV与颜色识别"
}

# The rich data (2x richer than before)
RICH_DATA = {
    27: {
        "title": "步进电机原理与A4988驱动 (C++/ESP32)",
        "desc": "深入剖析步进电机内部磁场构造与细分驱动原理，利用ESP32与A4988构建工业级非阻塞运动控制框架。摒弃传统的 delay 阻塞，引入硬件定时器与梯形加减速算法，实现平滑、高速的精准定位控制。",
        "k_list": [
            ("步进电机的电磁学本质", "解剖两相四线步进电机（NEMA 17）。通过定子线圈通电产生磁场，吸引转子齿牙对齐，实现1.8°的基础步距角。"),
            ("A4988 驱动器与微步细分(Microstepping)", "原理解析：如何通过 MS1, MS2, MS3 引脚设置 16 细分。细分不仅能提高分辨率（3200步/圈），更能有效消除电机的低频共振现象。"),
            ("Vref 电流配置与散热", "硬核公式推导：Vref = I_max * 8 * R_sense。演示如何使用万用表测量和调节电位器，避免电机过热退磁或丢步。"),
            ("非阻塞控制与硬件定时器", "为什么不能用 delay()? 讲解在多任务系统中（如还要处理视觉信号），阻塞代码的致命缺陷。引入 ESP32 HardwareTimer 实现精准的微秒级中断。"),
            ("梯形加减速 (Trapezoidal Profile)", "惯性与扭矩的关系。起步时如果不加减速直接给高频脉冲，电机将堵转尖叫。实现基于时间切片的 S型/梯形 加速度曲线算法。")
        ],
        "code_title": "esp32_advanced_stepper.cpp / Timer & Profile",
        "code_content": """#include <Arduino.h>

#define DIR_PIN 19
#define STEP_PIN 18
#define EN_PIN 5

hw_timer_t * timer = NULL;
volatile bool step_state = false;
volatile int target_steps = 0;
volatile int current_steps = 0;

// 定时器中断服务函数 (ISR) - 在 IRAM 中运行以保证微秒级精度
void IRAM_ATTR onTimer() {
  if (current_steps < target_steps) {
    step_state = !step_state;
    digitalWrite(STEP_PIN, step_state);
    if (!step_state) current_steps++;
  }
}

void setup() {
  pinMode(DIR_PIN, OUTPUT);
  pinMode(STEP_PIN, OUTPUT);
  pinMode(EN_PIN, OUTPUT);
  digitalWrite(EN_PIN, LOW); // 激活 A4988

  // 配置硬件定时器 0，分频系数 80 (1MHz，即 1 微秒一次 ticks)
  timer = timerBegin(0, 80, true);
  timerAttachInterrupt(timer, &onTimer, true);
  // 设置报警值为 500 微秒，自动重载
  timerAlarmWrite(timer, 500, true);
  timerAlarmEnable(timer);
}

void loop() {
  // 主循环完全非阻塞，可以在这里处理串口通信或传感器读取
  if (current_steps >= target_steps) {
    // 运动完成，准备下一次运动或进入休眠
  }
}""",
        "d_list": [
            ("HW_BURN_01", "A4988 芯片烧毁/击穿", "绝对禁忌：在驱动板通电状态下插拔步进电机线！电机的反向感应电动势会瞬间击穿驱动芯片。必须先断开电源！"),
            ("SYS_STALL_02", "电机发出高频尖叫但不转 (堵转)", "排查：1. 启动频率过高，未加减速；2. Vref 设置过低导致扭矩不足；3. 负载过重超出了电机的保持转矩。"),
            ("CODE_ERR_03", "ISR 导致 ESP32 频繁重启 (Core Panic)", "排查：在中断函数 (ISR) 中使用了 Serial.print() 或 delay()。ISR 必须极其精简，且在外部定义全局变量时需加 `volatile` 关键字。")
        ],
        "mission": "利用提供的梯形加减速算法理论，重写上述中断逻辑，实现动态改变 `timerAlarmWrite` 的报警周期，让电机体验从缓慢启动到高速运转再到平滑停止的全过程。",
        "note": "欢迎进入嵌入式编程的深水区。在这里，时间是微秒级的，内存是有限的，每一个电平翻转都必须在你的绝对掌控之下。",
        "md_content": """# Lesson 27 - 步进电机原理与 A4988 驱动 (ESP32)

## 1. 核心理论：步进电机的电磁解构
与普通的直流电机不同，步进电机是一种将电脉冲信号转换成角位移或线位移的开环控制电机。
- **两相四线系统**：内部包含A、B两个独立的线圈（相）。
- **极性与步距角**：标准 NEMA 17 步进电机有 200 个整步，步距角为 $360° / 200 = 1.8°$。
- **驱动逻辑**：通过交替改变A、B线圈的电流方向（极性），转子的磁齿将被依次吸引，从而实现精确的“一步”。

## 2. 硬件架构：A4988 驱动模块详解
直接用 ESP32 的引脚无法驱动大电流的电机，必须通过 A4988 这类 H 桥驱动芯片。
- **MS1, MS2, MS3 引脚配置**：
  - 全部 LOW = 全步进 (Full Step)
  - 全部 HIGH = 16 细分 (Sixteenth Step) -> 使得一圈需要 $200 \\times 16 = 3200$ 个脉冲，大幅度提升平滑度和精度。
- **电流限制调参 (Vref)**：
  - 公式：$I_{max} = \\frac{V_{ref}}{8 \\times R_{sense}}$
  - A4988 模块的采样电阻（R_sense）通常为 0.1 欧姆或 0.068 欧姆。计算出目标 Vref 后，通电并用万用表配合十字改锥调节模块上的微调电位器。

## 3. 软件架构：彻底抛弃 Delay，拥抱硬件定时器
初学者往往使用 `delayMicroseconds()` 来控制脉冲频率：
```cpp
digitalWrite(STEP, HIGH);
delayMicroseconds(500);
digitalWrite(STEP, LOW);
delayMicroseconds(500);
```
**这种写法的致命弱点**：它会把单片机的 CPU 彻底“锁死”在这个循环里，无法再接收任何传感器数据或网络指令。

**高级解法：ESP32 Timer Interrupt (硬件定时器中断)**
ESP32 拥有 4 个 64-bit 硬件定时器。我们将脉冲翻转的任务交给定时器在后台自动执行（ISR），主循环 `loop()` 被完全释放！

## 4. 动力学挑战：梯形加减速算法
惯性是所有机械运动的敌人。如果突然要求电机以全速运行，转子由于惯性无法跟上磁场旋转的速度，就会产生“失步”或“堵转”。
**解决方案：T-Profile (梯形加减速)**
- **加速阶段 (T1)**：脉冲周期从长变短，电机缓慢起步。
- **匀速阶段 (T2)**：脉冲周期保持恒定，电机达到最大目标速度。
- **减速阶段 (T3)**：脉冲周期从短变长，电机平滑刹车直到准确停止在目标位置。

## 5. 进阶开发作业
编写一个函数 `moveToPosition(int target, int max_speed, int accel)`，在其中封装加减速曲线计算逻辑。将计算出的延时周期动态喂给 Timer 中断，实现完美的机械运动控制。"""
    },
    34: {
        "title": "闭环控制基础：认识 PID 算法 (C++)",
        "desc": "突破开环控制的局限，引入自动化领域最伟大的发明——PID（比例-积分-微分）控制算法。结合电机编码器反馈，编写 C++ 算法让电机系统具备自我纠错与抗干扰能力。",
        "k_list": [
            ("闭环反馈系统本质", "开环控制就像蒙眼走路。闭环则是通过传感器（如霍尔编码器或陀螺仪）实时获取当前状态（Present Value），并与目标状态（Set Point）对比，计算出误差（Error）。"),
            ("P：比例控制 (Proportional)", "误差有多大，力度就有多大。Kp 决定了系统的响应速度。但单纯的 P 控制永远无法消除稳态误差，且 Kp 过大必然导致系统剧烈震荡。"),
            ("I：积分控制 (Integral)", "积累历史误差。专门用来解决 P 控制留下的静态偏差，确保最终误差归零。但如果积分积累过快（Ki 过大），会导致严重的系统超调（Overshoot）。"),
            ("D：微分控制 (Derivative)", "预测未来误差。根据误差的变化率（斜率）产生阻尼作用，抑制震荡。如果误差突然变大，D 项会提前施加反向力量“踩刹车”。"),
            ("离散化 PID 编程实现", "将连续的微积分公式转化为计算机可以按周期（dt）执行的离散化 C++ 代码。深入讲解抗积分饱和（Anti-windup）与死区过滤技术。")
        ],
        "code_title": "pid_controller.cpp / Core Algorithm",
        "code_content": """class PIDController {
private:
    float Kp, Ki, Kd;
    float error_sum, last_error;
    float out_max, out_min;
    
public:
    PIDController(float p, float i, float d, float max, float min) : 
        Kp(p), Ki(i), Kd(d), out_max(max), out_min(min), error_sum(0), last_error(0) {}

    float compute(float setpoint, float measured_value, float dt) {
        // 1. 计算当前误差
        float error = setpoint - measured_value;
        
        // 2. 比例项 (P)
        float P_out = Kp * error;
        
        // 3. 积分项 (I)
        error_sum += error * dt;
        float I_out = Ki * error_sum;
        
        // 4. 微分项 (D)
        float derivative = (error - last_error) / dt;
        float D_out = Kd * derivative;
        
        // 5. 计算总输出
        float output = P_out + I_out + D_out;
        
        // 6. 输出限幅与抗积分饱和 (Anti-windup)
        if (output > out_max) {
            output = out_max;
            error_sum -= error * dt; // 取消无效积分
        } else if (output < out_min) {
            output = out_min;
            error_sum -= error * dt;
        }
        
        last_error = error;
        return output;
    }
};""",
        "d_list": [
            ("PID_ERR_01", "系统产生高频剧烈震荡", "排查：通常是由于 P 增益 (Kp) 设置过大导致。调节步骤：先将 Ki 和 Kd 设为 0，逐渐增大 Kp 直到系统开始微弱震荡，然后将 Kp 减半。"),
            ("PID_ERR_02", "响应迟缓，达不到目标值", "排查：稳态误差未能消除，需要增加 Ki（积分增益）；或者 Kp 太小导致初始动力不足。"),
            ("SYS_ERR_03", "噪声被 D 项无限放大", "排查：微分(D)对高频噪声极度敏感。如果传感器读数跳动大，Kd 会导致电机疯狂抖动。必须对传感器数据先进行低通滤波（Low-pass Filter）。")
        ],
        "mission": "在 ESP32 上实例化一个 PID 控制器。通过串口绘图器（Serial Plotter）实时打印 Setpoint、Measured_value 和 Output 的曲线，观察不同的 Kp, Ki, Kd 参数组合对波形的影响。",
        "note": "调参是一门艺术，也是玄学。牢记口诀：参数整定找最佳，从小到大顺序查。先是比例后积分，最后再把微分加。",
        "md_content": """# Lesson 34 - 闭环控制基础：认识 PID 算法

## 1. 开环与闭环的哲学差异
在之前的步进电机课程中，我们使用了开环控制（发1000个脉冲，就认为它转了1000步）。如果在运动过程中被外力阻挡，系统毫不知情。
**闭环控制**则引入了“眼睛”——传感器。以伺服电机为例，尾部的霍尔编码器实时汇报当前角度，控制器对比目标角度产生 Error（误差），并不断修正，这就是自动化控制的核心。

## 2. 解构 P-I-D 的三维力量
$u(t) = K_p e(t) + K_i \\int_{0}^{t} e(\\tau) d\\tau + K_d \\frac{de(t)}{dt}$

### P (Proportional) - 比例，直面当下的力量
* **逻辑**：误差越大，纠正力度越大。
* **缺陷**：永远无法消除静态误差。当误差极小时，P 的输出推力也极小，甚至不足以克服电机的物理静摩擦力，导致永远卡在目标值附近。

### I (Integral) - 积分，清算过去的旧账
* **逻辑**：将历史上的微小误差不断累加。即便误差很小，随着时间推移，积分项会像滚雪球一样积累巨大的推力，彻底消除稳态误差。
* **缺陷**：惯性极大。容易导致超调（超过目标值）和系统震荡。

### D (Derivative) - 微分，预见未来的刹车
* **逻辑**：关注误差的“变化趋势（斜率）”。如果误差正在迅速缩小（即即将冲过头），D 项会产生一个巨大的负向阻力，相当于提前踩刹车。
* **缺陷**：对高频噪声极其敏感。

## 3. 离散化与工程实现
在微控制器中，我们无法进行连续微积分操作，必须进行离散化转换：
* **积分** -> 周期误差累加：`sum += error * dt`
* **微分** -> 周期误差差分：`(error - last_error) / dt`

## 4. 工业级 PID 的防御机制
单纯的课本公式在工业界是不能直接用的。必须加入：
1. **抗积分饱和 (Anti-windup)**：当输出已被硬件限制在最大值时（如 PWM 满负荷），应停止积分项的继续累加，否则在反向调节时系统会严重滞后。
2. **死区控制 (Deadband)**：如果误差极小（如在 1 毫米以内），强制输出为 0，防止电机因噪声产生烦人的高频抖动现象。"""
    },
    36: {
        "title": "机械臂运动学：正向运动学 FK (Python)",
        "desc": "硬核机器人学的起点。利用 Python 与 Numpy 进行矩阵计算，推导机械臂的 D-H (Denavit-Hartenberg) 参数模型，实现从各个关节的电机角度到末端机械爪空间坐标(X,Y,Z)的精密数学映射。",
        "k_list": [
            ("坐标空间转换", "机器人具有两个空间：关节空间 (Joint Space, θ角度集合) 与 笛卡尔空间 (Cartesian Space, 物理世界的XYZ)。正向运动学 FK 即是已知 θ 求 XYZ 的过程。"),
            ("齐次变换矩阵 (Homogeneous Matrix)", "一个 4x4 的矩阵，巧妙地将三维空间中的旋转 (Rotation) 和平移 (Translation) 合并在一起处理，是现代机器人学的核心基石。"),
            ("D-H 参数建模法", "Denavit 与 Hartenberg 提出的一种通用建模规范。只需4个参数 (a, α, d, θ) 即可描述任意相邻连杆之间的几何空间关系。"),
            ("矩阵级联与点乘", "末端执行器的最终位姿矩阵 = 基座到连杆1的矩阵 × 连杆1到2的矩阵 × ...。在 Python 中利用 `@` 运算符实现矩阵极速连乘。"),
            ("欧拉角与位姿", "除了 X,Y,Z 位置，矩阵还包含了机械爪的空间姿态（Roll, Pitch, Yaw）。这对于抓取物品的角度极其重要。")
        ],
        "code_title": "forward_kinematics.py / Matrix Algebra",
        "code_content": """import numpy as np
import math

def dh_matrix(a, alpha, d, theta):
    \"\"\"根据 D-H 参数生成 4x4 齐次变换矩阵\"\"\"
    # 将输入角度转为弧度
    alpha = math.radians(alpha)
    theta = math.radians(theta)
    
    return np.array([
        [math.cos(theta), -math.sin(theta)*math.cos(alpha),  math.sin(theta)*math.sin(alpha), a*math.cos(theta)],
        [math.sin(theta),  math.cos(theta)*math.cos(alpha), -math.cos(theta)*math.sin(alpha), a*math.sin(theta)],
        [0,               math.sin(alpha),                   math.cos(alpha),                  d],
        [0,               0,                                 0,                                1]
    ])

def calculate_fk(theta1, theta2, theta3):
    # Cyber-Sorter 三轴机械臂 D-H 参数表
    # a: 连杆长度, alpha: 连杆扭转角, d: 偏置距离, theta: 关节角
    T1 = dh_matrix(a=0,   alpha=90, d=80, theta=theta1)
    T2 = dh_matrix(a=120, alpha=0,  d=0,  theta=theta2)
    T3 = dh_matrix(a=150, alpha=0,  d=0,  theta=theta3)
    
    # 矩阵级联点乘得到末端执行器相对于基座的变换矩阵 T_end
    T_end = T1 @ T2 @ T3
    
    # 提取第4列前3行，即空间坐标 (X, Y, Z)
    x = T_end[0, 3]
    y = T_end[1, 3]
    z = T_end[2, 3]
    
    return x, y, z

if __name__ == "__main__":
    x, y, z = calculate_fk(45, 30, -30)
    print(f"End Effector Position: X={x:.2f}, Y={y:.2f}, Z={z:.2f}")""",
        "d_list": [
            ("MATH_ERR_01", "矩阵相乘维度崩溃", "排查：绝对不要在 Python numpy 中使用 `*` 来相乘两个矩阵，那会导致逐元素相乘。必须使用 `@` 或者 `np.dot()`！"),
            ("LOGIC_02", "计算结果与现实完全不符", "排查：1. 检查是否遗漏了将角度转化为弧度（Radians）；2. 检查 D-H 参数的 a 和 d 的基准面是否选错了。"),
            ("SIN_COS_ERR_03", "出现极小的浮点数（如 1.22e-16）", "排查：计算机处理 `math.sin(math.pi)` 时由于浮点精度问题不会完全等于 0。这属于正常现象，可用 `np.round()` 进行清理。")
        ],
        "mission": "利用 Python 编写一个循环，让 theta1 在 0-180 度之间以 1 度为步长变化，通过 FK 计算末端坐标并使用 `matplotlib` 绘制出末端执行器在 3D 空间中划过的半圆形工作空间轨迹图。",
        "note": "如果你在这里对线性代数感到吃力，不用气馁。理解齐次矩阵的本质，就意味着你拿到了进入现代高级机器人学领域的入场券。",
        "md_content": """# Lesson 36 - 机械臂运动学：正向运动学 (FK)

## 1. 机器人学的两套坐标系
控制一个机械臂，你不能对它说“去抓取桌子上的水杯”，因为电机只听得懂“旋转多少度”。
* **关节空间 (Joint Space)**：包含所有电机的当前角度 $[\\theta_1, \\theta_2, \\theta_3, ...]$。
* **笛卡尔空间 (Cartesian Space)**：真实世界的三维坐标 $[X, Y, Z]$。
**正向运动学 (Forward Kinematics, FK)** 就是一座桥梁：输入电机的角度，输出机械爪在现实世界中的精确位置。

## 2. Denavit-Hartenberg (D-H) 参数模型
机械臂包含复杂的连杆和关节。为了让计算机理解其物理结构，我们使用 D-H 参数建立标准数学模型。每一个关节仅需 4 个参数描述：
1. **连杆长度 $a$**：沿着公垂线，两个相邻 Z 轴之间的距离。
2. **连杆扭转角 $\\alpha$**：沿着公垂线，两个相邻 Z 轴之间的夹角。
3. **偏置距离 $d$**：沿着 Z 轴，两个相邻 X 轴之间的距离。
4. **关节角 $\\theta$**：沿着 Z 轴，两个相邻 X 轴之间的旋转角度（这就是电机控制的变量）。

## 3. 齐次变换矩阵的魔力
在三维空间中，物体不仅发生**平移**，还会发生**旋转**。齐次变换矩阵巧妙地用一个 $4 \\times 4$ 的矩阵将两者打包在一起：
$$ T = \\begin{bmatrix} R_{3 \\times 3} & P_{3 \\times 1} \\\\ 0_{1 \\times 3} & 1 \\end{bmatrix} $$
其中，$R$ 是 $3 \\times 3$ 的旋转矩阵（描述姿态），$P$ 是 $3 \\times 1$ 的平移向量（描述位置 X,Y,Z）。

## 4. 矩阵级联与 Python 实现
由于机械臂是串联结构，末端的位置等于从基座开始，每一个关节变换矩阵的连乘：
$$ T_{base\\_to\\_end} = T_1 \\times T_2 \\times T_3 \\times ... \\times T_n $$
在 Python 中，借助于强大的 `numpy` 库，我们可以非常优雅地实现这一点。只需定义好 D-H 表，然后调用 `@` 运算符进行矩阵点乘，即可瞬间得出末端坐标。这也是在上位机中开发机器人数字孪生（Digital Twin）的核心算法。"""
    },
    37: {
        "title": "机械臂逆向运动学 IK 解析 (Python)",
        "desc": "突破从感知到行动的最后一道数学屏障：逆向运动学（IK）。已知物体在桌面上的空间坐标(X,Y,Z)，通过三角函数解析几何法与雅可比矩阵迭代法，逆向倒推出所有电机的目标旋转角度，实现精准抓取。",
        "k_list": [
            ("IK 的非唯一性与难度", "与 FK 唯一的结果不同，IK 是非线性方程组求逆，同一个空间点可能有多种抓取姿态（如手臂朝上弯曲或朝下弯曲），甚至无解（目标超出臂展）。"),
            ("解析法 (Analytical Solution)", "利用余弦定理与多边形几何关系，通过严格的代数推导得出公式。计算极快，适合自由度较低的简易机械臂结构（如3DOF或4DOF）。"),
            ("数值法与雅可比矩阵 (Jacobian)", "对于6自由度以上的复杂机器人，解析法过于庞大。引入偏导数计算雅可比矩阵（描述微小角度变化引起的空间微小位移），利用牛顿-拉夫逊迭代法逼近目标。"),
            ("工作空间 (Workspace) 与奇异点 (Singularity)", "判定给定的 (X,Y,Z) 是否在机械臂的物理触达范围内。解析万向节锁（Gimbal Lock）和雅可比矩阵行列式为零时的系统失控现象。"),
            ("轨迹插补与反解应用", "规划一条空间直线，提取路径上的几百个离散点，通过高频运行 IK 计算出对应的电机角度序列，驱动电机协同实现直线运动。")
        ],
        "code_title": "inverse_kinematics.py / Analytical IK",
        "code_content": """import math

def calculate_ik_3dof(x, y, z, L1=80, L2=120, L3=150):
    \"\"\"3自由度机械臂解析法逆向运动学\"\"\"
    try:
        # 1. 计算底座旋转角 theta1
        theta1 = math.atan2(y, x)
        
        # 将三维问题降维至二维平面 (r, z')
        r = math.sqrt(x**2 + y**2)
        
        # 减去底座连杆 L1 的高度
        z_eff = z - L1
        
        # 2. 利用余弦定理求解 theta3
        # L2 和 L3 构成三角形的两边，目标距离为斜边
        hypotenuse_sq = r**2 + z_eff**2
        
        # 检查是否超出机械臂最大臂展
        if hypotenuse_sq > (L2 + L3)**2:
            raise ValueError("Target Unreachable (Out of Workspace)")
            
        cos_theta3 = (hypotenuse_sq - L2**2 - L3**2) / (2 * L2 * L3)
        # 取负根（肘部朝上的姿态）
        theta3 = math.atan2(-math.sqrt(1 - cos_theta3**2), cos_theta3)
        
        # 3. 求解 theta2
        alpha = math.atan2(z_eff, r)
        beta = math.atan2(L3 * math.sin(theta3), L2 + L3 * math.cos(theta3))
        theta2 = alpha - beta
        
        # 转换为角度返回
        return math.degrees(theta1), math.degrees(theta2), math.degrees(theta3)
        
    except ValueError as e:
        print(f"IK Error: {e}")
        return None, None, None

if __name__ == "__main__":
    t1, t2, t3 = calculate_ik_3dof(100, 100, 50)
    print(f"Target Joint Angles: Base={t1:.1f}°, Shoulder={t2:.1f}°, Elbow={t3:.1f}°")""",
        "d_list": [
            ("IK_ERR_01", "Math Domain Error (域错误)", "排查：目标坐标太远，超出了两根连杆伸直的极限长度。`acos()` 接收的值超出了 [-1, 1] 的范围，引发崩溃。必须做好防崩溃判定。"),
            ("IK_ERR_02", "多解选取冲突导致机械臂撞击", "排查：`atan2` 返回的角度使得关节产生突变反折（如从 -170度 瞬间要求变为 170度）。需加入状态记忆，优先选择与当前关节角度最接近的解。"),
            ("SYS_ERR_03", "X/Y 坐标为 0 导致分母为零", "排查：当机械臂直立于原点正上方时，存在无限多解（底座转任意角度均可）。需在代码中设置微小容差 (epsilon) 处理原点奇点。")
        ],
        "mission": "利用上一节课的 FK 代码验证本节课的 IK 代码：输入一组角度进行 FK 计算得到 X,Y,Z，然后将该 X,Y,Z 扔给 IK 算法反解，检查得出的角度是否与最初的角度一致。",
        "note": "恭喜你，当你跨越了 IK 的门槛，你就掌握了控制物理世界的终极密码。至此，机械臂的关节对你而言已不再是电机，而是空间任意维度的画笔。",
        "md_content": """# Lesson 37 - 机械臂逆向运动学 IK 解析

## 1. 为什么我们需要逆向运动学？
正向运动学（FK）告诉我们“目前在哪”，但这不够。当我们想让机械臂去抓取位于坐标 $(120, 50, 80)$ 的积木时，我们需要准确计算出所有底座和连杆电机应该**转动多少角度**。
这就是 **逆向运动学 (Inverse Kinematics, IK)** 的核心任务：已知空间 XYZ，逆推所有 $\\theta$。

## 2. IK 的工程难度挑战
* **非线性与多解性**：一个人手去摸桌上的水杯，手肘可以朝上，也可以朝下弯曲。同样，一个目标点对应着多种不同的电机角度组合。控制器必须选择最“合理”的解（例如避障或者能量最优）。
* **无解边界 (Singularity & Workspace)**：如果给定的坐标超出物理极限，或者位于导致关节锁死的奇异点，求解器将崩溃。

## 3. 核心算法流派
1. **解析法 (Analytical / Geometric)**：
   * 原理：利用空间立体几何、投影、以及余弦定理严格推导数学公式。
   * 优势：计算速度极快，适合微控制器实时运算。
   * 劣势：只适用于满足特定设计结构（如 Pieper 准则，即最后三个关节轴线交于一点）的机械臂。
2. **数值迭代法 (Numerical / Jacobian)**：
   * 原理：计算雅可比矩阵，利用偏导数和牛顿法，不断缩小当前位置与目标位置的误差，直到收敛逼近目标。
   * 优势：适用于任何极其复杂的机械构造（如人体仿生骨骼，多达 20+ 自由度）。
   * 劣势：计算量巨大，且可能陷入局部最优解。

## 4. 空间直线的插补艺术
如何让机械爪在空间画出一条笔直的线？
如果直接控制两个电机从 A 角度转到 B 角度，机械爪走出的轨迹将会是一条混乱的曲线（因为各关节角速度不同步）。
**正解：笛卡尔空间直线插补**
1. 将目标直线切割成 1000 个微小空间点。
2. 以极高的频率（如 500Hz）依次将这 1000 个点送入 IK 算法中反解。
3. 将解出的连续角度喂给底层步进电机控制器。此时，电机将产生非线性的动态速度曲线，共同协作让末端划出完美的直线！"""
    },
    42: {
        "title": "机器视觉初探：OpenCV与颜色追踪 (Python)",
        "desc": "为机器人赋予智能的“双眼”。在 Python 环境下部署 OpenCV 计算机视觉库，构建稳健的工业级颜色特征追踪管线。从色彩空间转换到形态学去噪，实现实时获取物理目标的空间坐标数据。",
        "k_list": [
            ("色彩空间革命 (RGB to HSV)", "为什么工业视觉不使用 RGB？因为 RGB 色彩在光照稍变时数据就会剧烈崩塌。HSV（色相/饱和度/明度）能将物体本身的颜色（色相H）与光照阴影剥离开来，极其稳健。"),
            ("阈值掩膜 (Masking)", "使用 inRange 提取特征颜色，将复杂的彩色画面转化为机器最喜欢的二值化矩阵（只有 0 和 255），黑白分明地标记出目标物体。"),
            ("形态学操作 (Morphology)", "现实很骨感，掩膜中布满了环境噪点。应用先腐蚀（Erode，削掉白噪点）、后膨胀（Dilate，填补物体内部空洞）的硬核图像滤波技巧。"),
            ("轮廓提取与多边形逼近", "findContours 算法能在二值化图像中寻找闭合的边界。讲解如何过滤掉过小的干扰轮廓，并找到面积最大的目标轮廓。"),
            ("图像矩与质心定位", "利用图像的几何矩（Image Moments）严格计算出不规则物体的重力中心，将其转化为 2D 像素坐标 (x,y)，为机械臂提供抓取靶点。")
        ],
        "code_title": "vision_tracker_pro.py / OpenCV Pipeline",
        "code_content": """import cv2
import numpy as np

# 初始化摄像头流
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

# 定义红色的 HSV 范围 (红色的 H 跨越 0 和 180 的边界)
lower_red1 = np.array([0, 120, 70])
upper_red1 = np.array([10, 255, 255])
lower_red2 = np.array([170, 120, 70])
upper_red2 = np.array([180, 255, 255])

while True:
    ret, frame = cap.read()
    if not ret: break
    
    # 1. 高斯模糊抗噪 & 色彩空间转换
    blurred = cv2.GaussianBlur(frame, (11, 11), 0)
    hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)
    
    # 2. 生成双重掩膜并合并
    mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
    mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
    mask = cv2.bitwise_or(mask1, mask2)
    
    # 3. 形态学清理 (开运算：先腐蚀后膨胀)
    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.erode(mask, kernel, iterations=2)
    mask = cv2.dilate(mask, kernel, iterations=2)
    
    # 4. 寻找轮廓
    contours, hierarchy = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if contours:
        # 寻找面积最大的目标轮廓，排除微小噪点干扰
        c = max(contours, key=cv2.contourArea)
        if cv2.contourArea(c) > 500:  # 面积阈值
            # 计算边界框并绘制
            x, y, w, h = cv2.boundingRect(c)
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 204), 2)
            
            # 5. 利用几何矩计算精确质心
            M = cv2.moments(c)
            if M["m00"] != 0:
                cX = int(M["m10"] / M["m00"])
                cY = int(M["m01"] / M["m00"])
                # 绘制质心准星
                cv2.circle(frame, (cX, cY), 5, (0, 0, 255), -1)
                cv2.putText(frame, f"TARGET: [{cX}, {cY}]", (cX - 50, cY - 20),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
                            
    cv2.imshow("Cyber-Vision Feed", frame)
    cv2.imshow("Binary Mask", mask) # 调试观察窗
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()""",
        "d_list": [
            ("CAM_ERR_01", "cv2.VideoCapture() 画面黑屏或报错", "排查：Windows 隐私设置或杀毒软件拦截了摄像头访问。或者摄像头索引错误，尝试将 (0) 改为 (1) 或 (2)。"),
            ("LIGHT_ERR_02", "白天识别完美，晚上抓瞎", "排查：强烈的阴影和色温变化。必须在环境中提供标准色温补光灯，或者使用 HSV 色相直方图重新调整下限/上限阈值。"),
            ("PERF_ERR_03", "画面严重卡顿延迟", "排查：不要处理太高分辨率的图像！机械臂视觉定位通常 640x480 就足够。过高的分辨率会导致树莓派或PC CPU 满载丢帧。")
        ],
        "mission": "在代码中加入 `cv2.createTrackbar()` 滑动条功能，创建一个动态调参面板，可以实时拉动滑块调整 H、S、V 的上下限阈值，以适应你当前房间的光照环境。",
        "note": "不要相信你的肉眼看到的东西。在计算机视觉工程师眼里，世界是由一堆高频噪声的浮点矩阵组成的。唯有数学滤波，才能提纯出真相。",
        "md_content": """# Lesson 42 - 机器视觉初探：OpenCV与颜色追踪

## 1. 机器视觉的工业级基石：OpenCV
人类看一眼就知道那是红色的正方体，但计算机只看到了一堆长宽 640x480、深度为 3 个通道（BGR）的数字矩阵（合计近 100 万个数字）。
**OpenCV (Open Source Computer Vision Library)** 提供了海量经过极致 C++ 优化的底层算法矩阵运算接口，让我们能够以几十帧的高速实时处理这些百万级数据流。

## 2. 抛弃 RGB：HSV 色彩空间的优越性
在机器视觉中，几乎不使用 RGB（红绿蓝）直接做颜色追踪。
* **RGB的痛点**：三个通道紧密耦合了“颜色”与“光照”。当灯光变暗时，R、G、B 的数值会同时产生剧变，导致之前写好的阈值瞬间失效。
* **HSV的解药**：
  * **H (Hue, 色相)**：只负责颜色本身是什么。红色在 0 左右，绿色在 60 左右。光线变暗，红色依旧是红色。
  * **S (Saturation, 饱和度)**：颜色的纯度，从白到极度鲜艳。
  * **V (Value, 明度)**：光照亮度。
在 HSV 空间下，即使灯光昏暗，只要设定好特定的 H 值范围，系统依然能够稳如磐石地追踪目标。

## 3. 图像降维打击：二值化掩膜 (Masking)
在找到了目标颜色范围后，通过 `cv2.inRange` 函数执行阈值切割。
我们将得到一张只有单通道的黑白图片：
* 符合红色 HSV 范围的像素 $\\rightarrow$ **白色 (255)**
* 不符合的背景像素 $\\rightarrow$ **黑色 (0)**
这极大地降低了数据维度，过滤了 90% 的背景干扰。

## 4. 剔除现实的杂质：形态学滤波
由于相机噪点或桌面倒影，掩膜上往往会出现很多“白斑”（噪点）和目标内部的“黑洞”。
* **腐蚀 (Erosion)**：用一个小矩阵在图像上扫描，只要边缘有黑色，就把白色侵蚀掉一圈。能有效抹除微小噪点。
* **膨胀 (Dilation)**：相反操作，把白色扩展一圈，用来填补目标内部由于反光产生的黑洞。
* **联合出击 (开运算)**：先腐蚀掉外部噪点，再膨胀恢复目标本身的大小。

## 5. 从像素到坐标：几何矩定位
提取出清晰的白色轮廓后，我们需要知道抓取点到底在哪里（输出一个具体的 x,y 坐标传递给机械臂逆向运动学节点）。
通过计算图像的**零阶矩（面积）**与**一阶矩（质心位置）**，得出稳定、精确的核心像素坐标，完成从图像感知到物理参数提取的最后一步。"""
    }
}

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{lesson_title} - Advanced Hardcore Engineer</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
        
        :root {{
            --bg-color: #050508;
            --surface: rgba(18, 18, 26, 0.4);
            --surface-glass: rgba(10, 10, 15, 0.85);
            --primary: #00ffcc;
            --primary-glow: rgba(0, 255, 204, 0.4);
            --secondary: #0088aa;
            --text-main: #ffffff;
            --text-dim: #a0a0b0;
            --border: rgba(255, 255, 255, 0.08);
            --danger: #ff3366;
            --success: #33ff99;
            --gradient: linear-gradient(135deg, var(--primary), var(--secondary));
        }}
        * {{ margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }}
        body {{ background-color: var(--bg-color); color: var(--text-main); line-height: 1.7; overflow-x: hidden; }}
        
        .tech-bg {{
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(0, 255, 204, 0.08), transparent 50%),
                radial-gradient(circle at 85% 30%, rgba(0, 136, 170, 0.08), transparent 50%),
                linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
            background-size: 100% 100%, 100% 100%, 60px 60px, 60px 60px;
            z-index: -2; pointer-events: none;
        }}
        .glow-orb {{
            position: fixed; top: -10%; left: 40%; width: 60vw; height: 60vw;
            background: radial-gradient(circle, var(--primary-glow) 0%, transparent 60%);
            z-index: -1; pointer-events: none; border-radius: 50%; opacity: 0.3; filter: blur(80px);
            animation: pulse 10s infinite alternate;
        }}
        @keyframes pulse {{ 0% {{ transform: scale(1); opacity: 0.2; }} 100% {{ transform: scale(1.2); opacity: 0.4; }} }}

        .navbar {{
            position: sticky; top: 0; z-index: 100;
            background: var(--surface-glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border); padding: 18px 50px;
            display: flex; justify-content: space-between; align-items: center;
            box-shadow: 0 4px 30px rgba(0,0,0,0.5);
        }}
        .nav-brand {{ font-family: 'JetBrains Mono', monospace; color: #fff; font-weight: 800; font-size: 1.3rem; letter-spacing: 2px; display: flex; align-items: center; gap: 10px; }}
        .nav-brand::before {{ content: ''; display: inline-block; width: 12px; height: 12px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 10px var(--primary); }}
        .nav-module {{ color: var(--primary); font-size: 0.85rem; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 3px; padding: 6px 12px; border: 1px solid rgba(0,255,204,0.3); border-radius: 20px; background: rgba(0,255,204,0.05); }}

        .hero {{ padding: 100px 40px 60px; text-align: center; max-width: 1100px; margin: 0 auto; position: relative; }}
        .hero h1 {{ font-size: 3.5rem; margin-bottom: 25px; font-weight: 800; letter-spacing: -1px; line-height: 1.2; }}
        .hero h1 span {{ background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }}
        .hero p {{ font-size: 1.25rem; color: var(--text-dim); max-width: 800px; margin: 0 auto; font-weight: 300; }}

        .container {{ max-width: 1400px; margin: 0 auto; padding: 0 50px 100px 50px; display: grid; grid-template-columns: 2.5fr 1fr; gap: 50px; }}
        @media (max-width: 1024px) {{ .container {{ grid-template-columns: 1fr; }} }}
        
        .section {{ 
            background: var(--surface); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--border); border-radius: 16px; padding: 40px; margin-bottom: 40px; 
            box-shadow: 0 15px 35px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05); 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        }}
        .section:hover {{ border-color: rgba(0, 255, 204, 0.4); transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,255,204,0.1), inset 0 1px 0 rgba(255,255,255,0.1); }}
        .section-title {{ font-family: 'JetBrains Mono', monospace; font-size: 1.6rem; color: #fff; margin-bottom: 25px; display: flex; align-items: center; padding-bottom: 20px; border-bottom: 1px solid var(--border); }}
        .section-title span {{ background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; font-size: 2rem; margin-right: 15px; }}

        .knowledge-list {{ list-style: none; }}
        .knowledge-list li {{ margin-bottom: 20px; padding-left: 40px; position: relative; font-size: 1.15rem; color: #e0e0e0; }}
        .knowledge-list li::before {{ content: '►'; position: absolute; left: 0; top: 2px; color: var(--primary); font-size: 1rem; font-family: 'JetBrains Mono', monospace; }}
        .list-desc {{ font-size: 0.95rem; color: var(--text-dim); margin-top: 8px; line-height: 1.6; font-weight: 300; }}
        
        .debug-list {{ list-style: none; }}
        .debug-list li {{ margin-bottom: 20px; padding: 20px; background: rgba(255, 51, 102, 0.05); border-left: 3px solid var(--danger); border-radius: 0 8px 8px 0; }}
        .debug-list .err-code {{ color: var(--danger); font-family: 'JetBrains Mono', monospace; font-weight: 800; margin-right: 12px; font-size: 0.9rem; padding: 4px 8px; background: rgba(255,51,102,0.1); border-radius: 4px; }}

        .code-container {{ border-radius: 12px; overflow: hidden; margin-top: 25px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }}
        .code-header {{ background: rgba(10, 10, 15, 0.9); padding: 12px 20px; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: #666; display: flex; align-items: center; border-bottom: 1px solid var(--border); }}
        .mac-btn {{ width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; }}
        .mac-close {{ background: #ff5f56; }} .mac-min {{ background: #ffbd2e; }} .mac-max {{ background: #27c93f; }}
        .code-title {{ margin-left: 15px; color: var(--text-dim); }}
        pre {{ background: rgba(5, 5, 8, 0.8); padding: 25px; font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; color: var(--success); overflow-x: auto; line-height: 1.6; white-space: pre-wrap; }}

        .mission-box {{ background: linear-gradient(145deg, rgba(0,255,204,0.08), rgba(0,136,170,0.02)); border: 1px solid rgba(0,255,204,0.3); border-radius: 16px; padding: 35px; position: relative; overflow: hidden; }}
        .mission-box::before {{ content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--primary); }}
        .mission-title {{ color: #fff; font-size: 1.4rem; margin-bottom: 15px; font-weight: 800; display: flex; align-items: center; gap: 10px; }}
        .mission-text {{ color: var(--text-dim); font-size: 1.1rem; font-weight: 300; }}
        .status-badge {{ margin-top: 25px; display: inline-flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.6); padding: 8px 16px; border: 1px solid var(--border); border-radius: 30px; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--text-main); }}
        .status-dot {{ width: 8px; height: 8px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 8px var(--primary); animation: blink 2s infinite; }}
        @keyframes blink {{ 0%, 100% {{ opacity: 1; }} 50% {{ opacity: 0.4; }} }}

        aside {{ display: flex; flex-direction: column; gap: 30px; }}
        .widget {{ background: var(--surface); backdrop-filter: blur(16px); border: 1px solid var(--border); border-radius: 16px; padding: 30px; }}
        .widget-title {{ font-size: 0.85rem; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 2px; color: var(--text-dim); margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 10px; }}
        .stat-row {{ display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 0.95rem; }}
        .stat-row:last-child {{ border: none; padding-bottom: 0; }}
        .stat-val {{ font-family: 'JetBrains Mono', monospace; color: var(--text-main); font-weight: bold; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 6px; }}
        
        .hero-image-container {{ position: relative; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.6); margin-bottom: 20px; }}
        .hero-image-container::after {{ content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; box-shadow: inset 0 0 20px rgba(0,0,0,0.5); pointer-events: none; }}
        .hero-image {{ width: 100%; height: auto; display: block; transition: transform 0.5s ease; }}
        .hero-image-container:hover .hero-image {{ transform: scale(1.05); }}
        .img-caption {{ font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-dim); text-align: center; letter-spacing: 1px; }}

        .instructor-note {{ background: rgba(0, 255, 204, 0.05); border: 1px solid rgba(0, 255, 204, 0.2); border-radius: 12px; padding: 25px; position: relative; }}
        .instructor-note::before {{ content: '”'; position: absolute; top: 10px; right: 20px; font-size: 4rem; color: rgba(0,255,204,0.1); font-family: serif; line-height: 1; }}
    </style>
</head>
<body>
    <div class="tech-bg"></div><div class="glow-orb"></div>
    <nav class="navbar">
        <div class="nav-brand">ADV_ENGINEER_OS</div>
        <div class="nav-module">Programming & Robotics</div>
    </nav>
    <header class="hero">
        <h1><span>{lesson_title}</span></h1>
        <p>{lesson_desc}</p>
    </header>
    <div class="container">
        <main>
            <section class="section">
                <h2 class="section-title"><span>01</span> 算法层剖析 (Algorithm Breakdown)</h2>
                <ul class="knowledge-list">
                    {knowledge_list_html}
                </ul>
            </section>
            <section class="section">
                <h2 class="section-title"><span>02</span> 底层核心代码 (Core Implementation)</h2>
                <p>禁止复制粘贴，请逐行解析以下工业级框架逻辑：</p>
                <div class="code-container">
                    <div class="code-header"><div class="mac-btn mac-close"></div><div class="mac-btn mac-min"></div><div class="mac-btn mac-max"></div><span class="code-title">{code_title}</span></div>
                    <pre>{code_content}</pre>
                </div>
            </section>
            <section class="section">
                <h2 class="section-title"><span>03</span> 系统故障排除 (System Defense)</h2>
                <ul class="debug-list">
                    {debug_list_html}
                </ul>
            </section>
            <section class="section" style="border:none;background:transparent;padding:0;box-shadow:none;">
                <div class="mission-box">
                    <div class="mission-title">► 极客重构挑战 (Hardcore Mission)</div>
                    <div class="mission-text">{mission_text}</div>
                    <div class="status-badge"><div class="status-dot"></div>SYS_STATUS: PENDING_USER_CODE</div>
                </div>
            </section>
        </main>
        <aside>
            <div class="widget">
                <div class="widget-title">Subsystem Schematic</div>
                <div class="hero-image-container">
                    <img src="../assets/images/robotics.jpg" alt="Schematic" class="hero-image">
                </div>
                <div class="img-caption">FIG 1.0 - CODE TOPOLOGY</div>
            </div>
            <div class="widget">
                <div class="widget-title">Lesson Telemetry</div>
                <div class="stat-row"><span>Code Lines</span><span class="stat-val">~250+ LOC</span></div>
                <div class="stat-row"><span>Memory Safe</span><span class="stat-val" style="color:var(--success)">VERIFIED</span></div>
                <div class="stat-row"><span>Complexity</span><span class="stat-val" style="color:var(--danger)">EXTREME</span></div>
            </div>
            <div class="widget instructor-note">
                <div class="widget-title" style="color: var(--primary)">Architect's Note</div>
                <p style="font-size: 0.9rem; color: #ccc; line-height: 1.5;">{instructor_note}</p>
            </div>
        </aside>
    </div>
</body>
</html>
"""

def generate_assets():
    for lesson_id, dir_name in LESSONS_TO_OPTIMIZE.items():
        lesson_dir = os.path.join(BASE_DIR, dir_name)
        if not os.path.exists(lesson_dir):
            os.makedirs(lesson_dir)
            
        data = RICH_DATA[lesson_id]
        
        # 1. Generate HTML
        k_html = "".join([f"<li><strong>{k[0]}</strong><div class='list-desc'>{k[1]}</div></li>\\n" for k in data["k_list"]])
        d_html = "".join([f"<li><span class='err-code'>[{d[0]}]</span> {d[1]}<div style='color:#aaa; font-size:0.95rem; margin-top:8px;'><strong>排查方案:</strong> {d[2]}</div></li>\\n" for d in data["d_list"]])
        
        # HTML special chars encoding
        code_content_escaped = data["code_content"].replace("<", "&lt;").replace(">", "&gt;")
        
        html_output = HTML_TEMPLATE.format(
            lesson_title=f"Lesson {lesson_id} - {data['title']}",
            lesson_desc=data["desc"],
            knowledge_list_html=k_html,
            code_title=data["code_title"],
            code_content=code_content_escaped,
            debug_list_html=d_html,
            mission_text=data["mission"],
            instructor_note=data["note"]
        )
        
        html_path = os.path.join(lesson_dir, "index.html")
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_output)
            
        # 2. Generate Markdown LessonPlan
        md_path = os.path.join(lesson_dir, "LessonPlan.md")
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(data["md_content"])

if __name__ == "__main__":
    generate_assets()
    print("Optimization of top programming lessons finished!")
