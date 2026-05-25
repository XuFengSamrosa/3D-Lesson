document.addEventListener('DOMContentLoaded', () => {
    const stepBtns = document.querySelectorAll('.step-btn');
    const descriptions = document.querySelectorAll('.desc');
    const visualSide = document.querySelector('.visual-side');
    const scene = document.querySelector('.scene');
    
    let autoRotate = true;
    let angle = 45;

    // 旋转 3D 场景
    function rotateScene() {
        if(autoRotate && scene) {
            angle += 0.5;
            let rotX = -20;
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

    // 联动控制面板与公差控制元素
    const panel = document.getElementById('tolerance-panel');
    const slider = document.getElementById('tolerance-slider');
    const valDisp = document.getElementById('tolerance-val');
    const feedback = document.getElementById('tolerance-feedback');
    const xrayToggle = document.getElementById('xray-toggle');

    const guardBody = document.querySelector('.guard-body');
    const guardArm = document.querySelector('.guard-arm');
    const armBall = document.querySelector('.arm-ball');
    const gapRing = document.querySelector('.gap-ring');

    // 更新公差状态及 3D 表现
    function updateTolerance() {
        if (!slider) return;
        const val = parseFloat(slider.value);
        if (valDisp) valDisp.textContent = val.toFixed(1);

        const activeBtn = document.querySelector('.step-btn.active');
        if (!activeBtn) return;
        const currentStep = parseInt(activeBtn.getAttribute('data-step'));

        // 1. 动态调节 3D 空气间隙环的尺寸
        if (gapRing) {
            // 公差越大，红色间隙环范围越大
            gapRing.style.transform = `rotateX(90deg) scale(${1 + val * 0.6})`;
            if (val > 0) {
                gapRing.style.borderColor = '#ff3b30';
                gapRing.style.boxShadow = '0 0 10px #ff3b30, inset 0 0 10px #ff3b30';
            } else {
                gapRing.style.borderColor = 'transparent';
                gapRing.style.boxShadow = 'none';
            }
        }

        // 2. 根据公差区间给出物理反应
        if (currentStep === 4) {
            if (val <= 0.1) {
                // 粘死状态：禁止正常挥舞旋转，显示融化发红，动画卡住
                if (armBall) armBall.classList.add('fused');
                if (guardArm) {
                    guardArm.style.animation = 'none';
                    guardArm.style.transform = 'translate3d(0, 0, 30px) rotateY(15deg) rotateX(10deg)'; // 歪斜卡死
                }
                if (feedback) {
                    feedback.innerHTML = `🚨 关节粘死：公差过小 (${val.toFixed(1)}mm)！打印时由于塑料热膨胀，手臂和窝体会熔为一体，完全焊死无法转动！`;
                    feedback.style.color = '#ff3b30';
                }
            } else if (val === 0.2) {
                // 摩擦大状态：顺畅度下降，转动干涩
                if (armBall) armBall.classList.remove('fused');
                if (guardArm) {
                    guardArm.style.animation = 'arm-defense-spin 8s linear infinite'; // 极其缓慢而吃力地转动
                }
                if (feedback) {
                    feedback.innerHTML = `⚠️ 间隙偏窄：公差 0.2mm。转动存在轻微摩擦干涉，容易卡顿，打印精度不高时仍会粘连。`;
                    feedback.style.color = '#ff9500';
                }
            } else if (val === 0.3 || val === 0.4) {
                // 黄金公差：顺畅旋转
                if (armBall) armBall.classList.remove('fused');
                if (guardArm) {
                    guardArm.style.animation = 'arm-defense-spin 3s linear infinite'; // 快速顺畅旋转
                }
                if (feedback) {
                    feedback.innerHTML = `✅ 黄金嵌套：公差 ${val.toFixed(1)}mm。实现零拼装一体成型打印，机械臂活动自如、精准防卫！`;
                    feedback.style.color = '#34c759';
                }
            } else {
                // 松旷状态：晃动旋转
                if (armBall) armBall.classList.remove('fused');
                if (guardArm) {
                    guardArm.style.animation = 'arm-loose-spin 2s linear infinite'; // 带晃动的旋转
                }
                if (feedback) {
                    feedback.innerHTML = `⚠️ 间隙过松：公差 ${val.toFixed(1)}mm 大于设计余量！手臂晃动松旷，扫射时会产生严重偏斜，影响防御线准度！`;
                    feedback.style.color = '#ff9500';
                }
            }
        } else {
            // 步骤 0, 1, 2, 3 不会挥舞
            if (armBall) armBall.classList.remove('fused');
            if (guardArm) {
                guardArm.style.animation = 'none';
                if (currentStep === 3) {
                    guardArm.style.transform = 'translate3d(0, 0, 30px)'; // 归位对齐
                }
            }

            if (val <= 0.1) {
                if (feedback) {
                    feedback.innerHTML = `🚨 公差过小 (${val.toFixed(1)}mm)：躯干球窝与手臂球头将发生重叠，打印时会彻底粘死。`;
                    feedback.style.color = '#ff3b30';
                }
            } else if (val === 0.3 || val === 0.4) {
                if (feedback) {
                    feedback.innerHTML = `✅ 空气墙就绪：预留 ${val.toFixed(1)}mm 打印间隙。`;
                    feedback.style.color = '#34c759';
                }
            } else {
                if (feedback) {
                    feedback.innerHTML = `⚠️ 公差较大 (${val.toFixed(1)}mm)：装配连接松垮。`;
                    feedback.style.color = '#ff9500';
                }
            }
        }
    }

    // X 光切片联动
    if (xrayToggle) {
        xrayToggle.addEventListener('change', () => {
            if (guardBody) {
                if (xrayToggle.checked) {
                    guardBody.classList.add('xray');
                } else {
                    guardBody.classList.remove('xray');
                }
            }
        });
    }

    if (slider) slider.addEventListener('input', updateTolerance);

    // 核心步骤切换
    stepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const step = parseInt(btn.getAttribute('data-step'));
            
            stepBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            descriptions.forEach(d => d.classList.remove('show'));
            const targetDesc = document.getElementById(`desc-${step}`);
            if(targetDesc) targetDesc.classList.add('show');

            // 联动控制面板显示/隐藏
            if (panel) {
                if (step === 3 || step === 4) {
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'none';
                }
            }

            // 联动 X 光剖切默认状态
            if (xrayToggle && guardBody) {
                if (step === 4) {
                    xrayToggle.checked = true;
                    guardBody.classList.add('xray');
                } else {
                    xrayToggle.checked = false;
                    guardBody.classList.remove('xray');
                }
            }

            // 更新状态
            updateTolerance();

            if(visualSide) {
                visualSide.className = 'visual-side'; 
                if (step > 0) {
                    visualSide.classList.add(`step-${step}`);
                    void visualSide.offsetWidth; 
                }
            }
        });
    });
});
