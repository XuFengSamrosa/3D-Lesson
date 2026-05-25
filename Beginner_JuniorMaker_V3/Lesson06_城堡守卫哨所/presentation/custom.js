document.addEventListener('DOMContentLoaded', () => {
    const stepBtns = document.querySelectorAll('.step-btn');
    const descriptions = document.querySelectorAll('.desc');
    const visualSide = document.querySelector('.visual-side');
    const scene = document.querySelector('.scene');
    
    let autoRotate = true;
    let angle = 45;

    function rotateScene() {
        if(autoRotate && scene) {
            angle += 0.5;
            let rotX = -20;
            // Check if there is a specific tilt defined by the active step
            if(visualSide) {
                const activeClasses = Array.from(visualSide.classList);
                activeClasses.forEach(c => {
                    if(c.startsWith('tilt-')) rotX = parseInt(c.replace('tilt-', ''));
                });
            }
            scene.style.transform = `rotateX(${rotX}deg) rotateY(${angle}deg)`;
        }
        requestAnimationFrame(rotateScene);
    }
    if(scene) rotateScene();

    if(visualSide) {
        visualSide.addEventListener('mouseenter', () => autoRotate = false);
        visualSide.addEventListener('mouseleave', () => autoRotate = true);
    }

    stepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const step = btn.getAttribute('data-step');
            
            stepBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            descriptions.forEach(d => d.classList.remove('show'));
            const targetDesc = document.getElementById(`desc-${step}`);
            if(targetDesc) targetDesc.classList.add('show');

            // 动态调节底厚面板的显隐
            const floorPanel = document.getElementById('floor-panel');
            if (floorPanel) {
                if (step === '2' || step === '3') {
                    floorPanel.style.display = 'block';
                    // 触发展示当前滑块位置
                    updateFloorDepth();
                } else {
                    floorPanel.style.display = 'none';
                    // 恢复默认的 3D transform (清除行内样式以便应用 CSS 默认动画)
                    const negativeGate = document.querySelector('.negative-gate');
                    if (negativeGate) negativeGate.style.transform = '';
                }
            }

            if(visualSide) {
                // Clear old step classes
                visualSide.className = 'visual-side'; 
                if (step > 0) {
                    visualSide.classList.add(`step-${step}`);
                    // Trigger reflow to restart animations if any
                    void visualSide.offsetWidth; 
                }
            }
        });
    });

    // 实时底厚调节联动逻辑
    const slider = document.getElementById('floor-slider');
    const valDisp = document.getElementById('floor-val');
    const feedback = document.getElementById('floor-feedback');
    const negativeGate = document.querySelector('.negative-gate');

    function updateFloorDepth() {
        if (!slider) return;
        const val = parseFloat(slider.value);
        if (valDisp) valDisp.textContent = val.toFixed(1);
        
        // 动态提升红色负零件在 3D 空间中的 Z 轴高度 (基础贴地为 25px)
        if (negativeGate) {
            negativeGate.style.transform = `translate3d(0, -20px, ${25 + val * 2}px)`; // 放大一倍便于肉眼观察
        }

        // 判定安全红线并反馈
        if (val < 2.0) {
            if (feedback) {
                feedback.innerHTML = `🚨 漏水警报：Z=${val.toFixed(1)}mm！底板已被完全挖穿或太薄，模型会漏底！`;
                feedback.style.color = '#ff3b30';
            }
        } else {
            if (feedback) {
                feedback.innerHTML = `✅ 安全底厚：${val.toFixed(1)}mm（合格，已留出结实的地板）`;
                feedback.style.color = '#34c759';
            }
        }
    }

    if (slider) {
        slider.addEventListener('input', updateFloorDepth);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    console.log('Lesson 06 (Castle Outpost) presentation loaded.');
});
