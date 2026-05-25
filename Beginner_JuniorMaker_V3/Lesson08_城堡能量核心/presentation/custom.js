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

            // 动态调节对齐面板的显隐 (在步骤1, 2, 3, 4显示)
            const alignPanel = document.getElementById('align-panel');
            if (alignPanel) {
                if (step === '1' || step === '2' || step === '3' || step === '4') {
                    alignPanel.style.display = 'block';
                    updateAlignment();
                } else {
                    alignPanel.style.display = 'none';
                    resetSpinner();
                }
            }

            if(visualSide) {
                visualSide.className = 'visual-side'; 
                if (step > 0) {
                    visualSide.classList.add(`step-${step}`);
                    void visualSide.offsetWidth; 
                }
            }
        });
    });

    // 坐标同心对齐调节联动逻辑
    const slider = document.getElementById('align-slider');
    const valDisp = document.getElementById('align-val');
    const feedback = document.getElementById('align-feedback');
    const zeroBtn = document.getElementById('align-zero-btn');

    const spinner = document.querySelector('.core-spinner');
    const disc = document.querySelector('.spinner-disc');
    const shaft = document.querySelector('.spinner-shaft');
    const tip = document.querySelector('.spinner-tip');

    function updateAlignment() {
        if (!slider) return;
        const val = parseFloat(slider.value);
        if (valDisp) valDisp.textContent = val.toFixed(1);

        const activeBtn = document.querySelector('.step-btn.active');
        if (!activeBtn) return;
        const currentStep = activeBtn.getAttribute('data-step');

        // 步骤 1 (拆分状态) 时调节相对偏移
        if (currentStep === '1') {
            if (disc) disc.style.transform = `translate3d(${-20 - val * 6}px, ${-20 - val * 6}px, 90px)`;
            if (shaft) shaft.style.transform = `translate3d(${20 + val * 6}px, ${20 + val * 6}px, 120px)`;
            if (tip) tip.style.transform = `translate3d(0, ${-30 + val * 6}px, 60px)`;
        } 
        // 步骤 2, 3, 4 (对齐/拼合状态) 时
        else if (currentStep === '2' || currentStep === '3' || currentStep === '4') {
            // 如果 val != 0，手柄和飞轮会发生微小的相对错位
            const discZ = (currentStep === '4') ? 18 : 26;
            const shaftZ = (currentStep === '4') ? 39 : 47;
            const tipZ = (currentStep === '4') ? 6 : 14;

            if (disc) disc.style.transform = `translate3d(${val * 5}px, ${val * 5}px, ${discZ}px)`;
            if (shaft) shaft.style.transform = `translate3d(${-val * 3}px, ${-val * 3}px, ${shaftZ}px)`;
            if (tip) tip.style.transform = `translate3d(0, 0, ${tipZ}px)`;
        }

        // 步骤 4 (自转状态) 时，若偏心不为 0 则产生抖动
        if (currentStep === '4') {
            if (val !== 0) {
                if (spinner) {
                    spinner.classList.add('wobble');
                    // 设置自定义 CSS 属性作为抖动幅度
                    spinner.style.setProperty('--wobble-x', `${Math.abs(val) * 1.5}px`);
                    spinner.style.setProperty('--wobble-y', `${Math.abs(val) * 1.0}px`);
                }
                if (feedback) {
                    feedback.innerHTML = `🚨 偏心抖动：坐标偏差 ${val.toFixed(1)}mm！旋转时离心力会震塌哨所塔楼！`;
                    feedback.style.color = '#ff3b30';
                }
            } else {
                if (spinner) {
                    spinner.classList.remove('wobble');
                    spinner.style.removeProperty('--wobble-x');
                    spinner.style.removeProperty('--wobble-y');
                }
                if (feedback) {
                    feedback.innerHTML = `✅ 绝对对齐：偏差 0.0mm。同轴中心完全锁死，能量陀螺极速平稳自转！`;
                    feedback.style.color = '#34c759';
                }
            }
        } else {
            // 非步骤 4 时即使偏心也不旋转抖动
            if (spinner) {
                spinner.classList.remove('wobble');
            }
            if (val !== 0) {
                if (feedback) {
                    feedback.innerHTML = `⚠️ 轴心偏离：存在 ${val.toFixed(1)}mm 的装配对齐偏差。`;
                    feedback.style.color = '#ff9500';
                }
            } else {
                if (feedback) {
                    feedback.innerHTML = `✅ 坐标归零：各部件在 X/Y 轴上绝对同心对齐。`;
                    feedback.style.color = '#34c759';
                }
            }
        }
    }

    function resetSpinner() {
        if (spinner) {
            spinner.classList.remove('wobble');
            spinner.style.removeProperty('--wobble-x');
            spinner.style.removeProperty('--wobble-y');
        }
        if (disc) disc.style.transform = '';
        if (shaft) shaft.style.transform = '';
        if (tip) tip.style.transform = '';
    }

    if (slider) slider.addEventListener('input', updateAlignment);
    if (zeroBtn) {
        zeroBtn.addEventListener('click', () => {
            if (slider) {
                slider.value = 0;
                updateAlignment();
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    console.log('Lesson 08 (Castle Spinner) presentation loaded.');
});

