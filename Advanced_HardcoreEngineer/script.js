document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('lesson-grid');
    
    // Extracted from the 48-lesson Master_Syllabus.md
    const lessons = [
        "Lesson01_工程制图概论与SolidWorks环境",
        "Lesson02_正投影法与三视图基础",
        "Lesson03_草图绘制与几何约束",
        "Lesson04_尺寸标注系统与规范",
        "Lesson05_基础特征：拉伸与旋转",
        "Lesson06_工程图生成与公差概念",
        "Lesson07_剖视图与轴测图表达",
        "Lesson08_综合测试：机械零件测绘",
        "Lesson09_高级特征：扫描与放样设计",
        "Lesson10_曲面建模基础",
        "Lesson11_复杂零件模型构建技巧",
        "Lesson12_质量属性与材料选择",
        "Lesson13_智能小车底盘建模实战",
        "Lesson14_机械臂连杆与传动件建模",
        "Lesson15_齿轮与螺纹参数化设计",
        "Lesson16_3D打印前处理：悬垂与支撑优化",
        "Lesson17_装配体环境与标准配合",
        "Lesson18_高级配合与机械配合",
        "Lesson19_自顶向下装配设计",
        "Lesson20_干涉检查与公差分析",
        "Lesson21_运动算例：马达与动画记录",
        "Lesson22_基础运动学仿真",
        "Lesson23_有限元分析初步",
        "Lesson24_综合装配：机械臂整机验证",
        "Lesson25_ESP32硬件生态与IDE配置",
        "Lesson26_直流电机DC与PWM调速原理",
        "Lesson27_步进电机原理与A4988驱动",
        "Lesson28_伺服舵机Servo控制原理",
        "Lesson29_I2C与SPI通信协议基础",
        "Lesson30_电源管理与布线规范",
        "Lesson31_机械臂执行器调试实战",
        "Lesson32_传感器基础：超声波与红外模块",
        "Lesson33_嵌入式系统的中断与定时器",
        "Lesson34_闭环控制基础：认识PID算法",
        "Lesson35_智能小车电机PID循迹控制",
        "Lesson36_机械臂运动学：正向运动学FK",
        "Lesson37_机械臂逆向运动学IK解析",
        "Lesson38_串口通信与指令解析系统",
        "Lesson39_无线控制：ESP32无线与蓝牙通信",
        "Lesson40_电路设计入门与综合测试",
        "Lesson41_系统集成：机械臂与小车底盘联合组装",
        "Lesson42_机器视觉初探：OpenCV与颜色识别",
        "Lesson43_视觉引导下的机械臂抓取算法",
        "Lesson44_复杂轨迹规划与平滑算法",
        "Lesson45_跨平台联调：Python上位机与ESP32下位机",
        "Lesson46_综合考核：自动分拣机器人任务_上",
        "Lesson47_综合考核：自动分拣机器人任务_下",
        "Lesson48_CSWA认证模拟测试与结业路演"
    ];

    lessons.forEach((lesson, index) => {
        const a = document.createElement('a');
        a.href = `${lesson}/index.html`;
        a.className = 'lesson-card';
        
        const titleText = lesson.replace(/^Lesson\d+_/, '');
        
        a.innerHTML = `
            <div class="id">CHAPTER ${(index + 1).toString().padStart(2, '0')}</div>
            <div class="title">${titleText}</div>
        `;
        
        grid.appendChild(a);
    });
});
