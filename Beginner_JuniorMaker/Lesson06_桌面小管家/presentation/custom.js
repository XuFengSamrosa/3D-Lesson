document.addEventListener('DOMContentLoaded', () => {
    const visualSide = document.querySelector('.visual-side');
    const scene = document.querySelector('.scene');
    
    let autoRotate = true;
    let angle = 45;

    // 1. 旋转 3D 场景
    function rotateScene() {
        if(autoRotate && scene) {
            angle += 0.5;
            scene.style.transform = `rotateX(-20deg) rotateY(${angle}deg)`;
        }
        requestAnimationFrame(rotateScene);
    }
    if(scene) rotateScene();

    if(visualSide) {
        visualSide.addEventListener('mouseenter', () => autoRotate = false);
        visualSide.addEventListener('mouseleave', () => autoRotate = true);
    }

    // 2. CAD 实验室交互核心
    const wallSlider = document.getElementById('wall-slider');
    const floorSlider = document.getElementById('floor-slider');
    const wallVal = document.getElementById('wall-val');
    const floorVal = document.getElementById('floor-val');
    
    const xrayBtn = document.getElementById('xray-btn');
    const mathFormula = document.getElementById('math-formula');
    const safetyFeedback = document.getElementById('safety-feedback');
    
    const outerBox = document.querySelector('.outer-box');
    const innerCore = document.querySelector('.inner-core');

    const scale = 2.4; // 1mm 对应 2.4px 的缩放比例
    const baseSize = 120; // 外盒基础尺寸为 120px (对应外尺寸 50mm)

    // 设置外盒固定尺寸变量
    if (outerBox) {
        outerBox.style.setProperty('--w', `${baseSize}px`);
        outerBox.style.setProperty('--h', `${baseSize}px`);
        outerBox.style.setProperty('--d', `${baseSize}px`);
    }

    function updateCADParameters() {
        if (!wallSlider || !floorSlider) return;

        const wall = parseFloat(wallSlider.value);
        const floor = parseFloat(floorSlider.value);

        // 回显滑条数值
        if (wallVal) wallVal.innerText = wall.toFixed(1);
        if (floorVal) floorVal.innerText = floor.toFixed(1);

        // 3. 计算负零件尺寸与坐标 (像素值)
        const innerW = baseSize - 2 * (wall * scale);
        const innerD = baseSize - 2 * (wall * scale);
        const innerH = baseSize; // 高度固定切除
        const innerZ = floor * scale; // Z 轴抬升像素值

        if (innerCore) {
            innerCore.style.setProperty('--iw', `${innerW}px`);
            innerCore.style.setProperty('--id', `${innerD}px`);
            innerCore.style.setProperty('--ih', `${innerH}px`);
            innerCore.style.setProperty('--iz', `${innerZ}px`);
        }

        // 4. 实时渲染数学公式文本
        if (mathFormula) {
            const resultSize = 50 - 2 * wall;
            mathFormula.innerHTML = `外盒尺寸 (50mm) - 2 * 壁厚 (${wall.toFixed(1)}mm) = 负零件宽 (${resultSize.toFixed(1)} mm)`;
        }

        // 5. 安全评估回显
        if (safetyFeedback) {
            // 清除之前的状态类
            safetyFeedback.className = '';

            if (floor === 0) {
                safetyFeedback.classList.add('status-fail');
                safetyFeedback.innerHTML = '🚨 灾难错误：底板厚度为 0mm！内部负零件已切穿到底，收纳盒变成中通漏斗，无法装任何物品！';
            } else if (wall < 1.2) {
                safetyFeedback.classList.add('status-fail');
                safetyFeedback.innerHTML = `🚨 严重警告：壁厚过薄 (${wall.toFixed(1)}mm)！外壁强度极低，3D 打印后稍用力一捏即会碎裂！`;
            } else if (floor < 1.2) {
                safetyFeedback.classList.add('status-warn');
                safetyFeedback.innerHTML = `⚠️ 警告：底部底厚较薄 (${floor.toFixed(1)}mm)！底部容易因挤压而破裂，建议抬高至 1.5mm 以上。`;
            } else if (wall > 3.0) {
                safetyFeedback.classList.add('status-warn');
                safetyFeedback.innerHTML = `ℹ️ 提示：外壁偏厚 (${wall.toFixed(1)}mm)。结构虽坚实，但会消耗不必要的耗材，延长一倍打印时间。`;
            } else {
                safetyFeedback.classList.add('status-pass');
                safetyFeedback.innerHTML = `✅ 黄金配合：壁厚 ${wall.toFixed(1)}mm，底厚 ${floor.toFixed(1)}mm。材料利用率与物理强度达到完美平衡，合格！`;
            }
        }
    }

    // 绑定事件
    if (wallSlider) wallSlider.addEventListener('input', updateCADParameters);
    if (floorSlider) floorSlider.addEventListener('input', updateCADParameters);

    // 6. X-Ray 透视逻辑
    if (xrayBtn) {
        xrayBtn.addEventListener('click', () => {
            const isActive = xrayBtn.classList.toggle('active');
            if (isActive) {
                xrayBtn.innerText = '🌐 X-Ray 内部透视: ON';
                if (innerCore) innerCore.classList.add('xray-mode');
                // 让外盒面变半透明，方便看清内部
                document.querySelectorAll('.outer-box .face').forEach(face => {
                    face.style.background = 'rgba(142, 142, 147, 0.25)';
                });
            } else {
                xrayBtn.innerText = '🌐 X-Ray 内部透视: OFF';
                if (innerCore) innerCore.classList.remove('xray-mode');
                // 恢复外盒面不透明度
                document.querySelectorAll('.outer-box .face').forEach(face => {
                    face.style.background = 'rgba(142, 142, 147, 0.8)';
                });
            }
        });
    }

    // 初始执行一次
    updateCADParameters();
});
