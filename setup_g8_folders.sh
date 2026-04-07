#!/bin/bash

# 1. 根目录清理
cd /Users/fengxu/Documents/dev/PPT
rm -rf Lesson[0-1][0-9]_*
rm -f demagic_script.py refactor_curriculum.py split_plans.py Grade3_LessonPlans.md Lesson01_初识数字制造.zip Grade8_LessonPlans.md

# 2. 8年级课程重命名 (复用现有资源)
cd Grade8_FutureDesigner

mv "Lesson02_布尔逻辑与装配" "Lesson02_精密建模与数字徽章" 2>/dev/null
mv "Lesson03_空间拓扑与回转" "Lesson05_空间拓扑与莫比乌斯环" 2>/dev/null
mv "Lesson04_阵列偏移与工业收纳" "Lesson06_阵列偏移与工业收纳" 2>/dev/null
mv "Lesson05_机械公差与斜面建模" "Lesson11_机械公差与斜面建模" 2>/dev/null
mv "Lesson06_逆向工程与精准适配" "Lesson12_逆向工程与适配系统" 2>/dev/null
mv "Lesson07_未来都市_系统规划" "Lesson13_未来都市_系统规划" 2>/dev/null
mv "Lesson08_未来都市_集成展示" "Lesson16_未来都市_成果演示" 2>/dev/null

# 3. 创建所有 16 节课的文件夹
mkdir -p "Lesson01_增材制造与工业4.0" "Lesson02_精密建模与数字徽章" "Lesson03_复杂装配与模块逻辑" "Lesson04_参数化几何与布尔运算" "Lesson05_空间拓扑与莫比乌斯环" "Lesson06_阵列偏移与工业收纳" "Lesson07_路径阵列与模块系统" "Lesson08_物理模拟与动态零件" "Lesson09_复杂纹理与光影工程" "Lesson10_机械联动与可动结构" "Lesson11_机械公差与斜面建模" "Lesson12_逆向工程与适配系统" "Lesson13_未来都市_系统规划" "Lesson14_未来都市_集成建模" "Lesson15_未来都市_生产工程" "Lesson16_未来都市_成果演示"

# 4. 批量拷贝通用的 css 和 js 到每个文件夹中
for dir in Lesson*; do
  cp "Lesson01_增材制造与工业4.0/style.css" "$dir/"
  cp "Lesson01_增材制造与工业4.0/script.js" "$dir/"
done

echo "目录结构调整与静态资源分发完成！"
