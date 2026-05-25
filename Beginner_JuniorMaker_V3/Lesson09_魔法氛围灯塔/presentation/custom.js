document.addEventListener('DOMContentLoaded', () => {
    const stepBtns = document.querySelectorAll('.step-btn');
    const descriptions = document.querySelectorAll('.desc');
    const visualSide = document.querySelector('.visual-side');
    const scene = document.querySelector('.scene');
    
    let autoRotate = true;
    let angle = 45;
    let currentArrayAngle = 45; // 默认极坐标 45度 (8孔)

    // 旋转 3D 场景的主控函数
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

    // 联动控制面板与切刀渲染的元素
    const panel = document.getElementById('array-panel');
    const cuttersGroup = document.querySelector('.cutters-group');
    const beaconShell = document.querySelector('.beacon-shell');
    const angleBtns = document.querySelectorAll('.angle-btn');
    const feedback = document.getElementById('array-feedback');
    const cutBtn = document.getElementById('cut-btn');

    // 渲染极坐标阵列切刀
    function renderCutters(stepVal, arrayAngle) {
        if (!cuttersGroup) return;
        cuttersGroup.innerHTML = '';
        
        // 步骤 < 2 (不显示切刀) 或 步骤 4 (落成后切刀消失)
        if (stepVal < 2 || stepVal === 4) {
            return;
        }

        // 步骤 2: 只显示 1 片切刀 (c1) 作为引入
        if (stepVal === 2) {
            const cutterDiv = document.createElement('div');
            cutterDiv.className = 'part cutter c1';
            cutterDiv.style.transform = 'rotateZ(0deg) translate3d(0, 30px, 150px) rotateY(90deg) rotateX(45deg)';
            cutterDiv.style.opacity = '1';
            cutterDiv.innerHTML = `
                <div class="face front"></div><div class="face back"></div>
                <div class="face left"></div><div class="face right"></div>
                <div class="face top"></div><div class="face bottom"></div>
            `;
            cuttersGroup.appendChild(cutterDiv);
            return;
        }

        // 步骤 3: 极坐标阵列，根据选择的角度，在 360 度内均匀渲染切刀
        if (stepVal === 3) {
            const count = 360 / arrayAngle;
            for (let i = 0; i < count; i++) {
                const curAngle = i * arrayAngle;
                const cutterDiv = document.createElement('div');
                cutterDiv.className = `part cutter c${i+1}`;
                cutterDiv.style.transform = `rotateZ(${curAngle}deg) translate3d(0, 30px, 150px) rotateY(90deg) rotateX(45deg)`;
                cutterDiv.style.opacity = '1';
                cutterDiv.innerHTML = `
                    <div class="face front"></div><div class="face back"></div>
                    <div class="face left"></div><div class="face right"></div>
                    <div class="face top"></div><div class="face bottom"></div>
                `;
                cuttersGroup.appendChild(cutterDiv);
            }
        }
    }

    // 交互调节极坐标角度
    angleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            angleBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'white';
                b.style.color = '#1d1d1f';
                b.style.borderColor = '#ddd';
            });
            btn.classList.add('active');
            btn.style.background = '#2997ff';
            btn.style.color = 'white';
            btn.style.borderColor = '#2997ff';

            currentArrayAngle = parseInt(btn.getAttribute('data-angle'));
            const holes = 360 / currentArrayAngle;
            
            if (feedback) {
                feedback.innerHTML = `✅ 极坐标 ${currentArrayAngle}° 角度吸附就绪，共将阵列出 ${holes} 个自支撑菱形孔洞`;
                feedback.style.color = '#34c759';
            }

            // 重新渲染切刀
            const activeBtn = document.querySelector('.step-btn.active');
            if (activeBtn) {
                const currentStep = parseInt(activeBtn.getAttribute('data-step'));
                renderCutters(currentStep, currentArrayAngle);
            }
        });
    });

    // 模拟布尔镂空切割
    if (cutBtn) {
        cutBtn.addEventListener('click', () => {
            const activeBtn = document.querySelector('.step-btn.active');
            if (!activeBtn) return;
            const currentStep = parseInt(activeBtn.getAttribute('data-step'));

            // 只有在步骤 3 (阵列完成) 才能切割
            if (currentStep === 3) {
                // 1. 模拟切刀往里戳入的动画 (缩短距离)
                const cutters = document.querySelectorAll('.cutter');
                cutters.forEach(c => {
                    // 获取它原先旋转的 Z 角度
                    const transformStr = c.style.transform;
                    const zRotMatch = transformStr.match(/rotateZ\((.*?)\)/);
                    const zAngle = zRotMatch ? zRotMatch[1] : '0deg';
                    c.style.transform = `rotateZ(${zAngle}) translate3d(0, 22px, 150px) rotateY(90deg) rotateX(45deg)`;
                    c.style.filter = 'brightness(2)'; // 高亮闪烁
                });

                if (feedback) {
                    feedback.innerHTML = '⚡️ 正在执行布尔差集运算，切除交集实体...';
                    feedback.style.color = '#ff9500';
                }

                // 2. 500ms 后切换到步骤 4，完成镂空
                setTimeout(() => {
                    const step4Btn = document.querySelector('.step-btn[data-step="4"]');
                    if (step4Btn) {
                        step4Btn.click();
                    }
                }, 750);
            } else if (currentStep === 4) {
                if (feedback) {
                    feedback.innerHTML = '💡 已经完成布尔切割！可以在步骤 3 重新调整角度。';
                    feedback.style.color = '#2997ff';
                }
            } else {
                if (feedback) {
                    feedback.innerHTML = '⚠️ 请先进入 “3. 极坐标八方阵列” 步骤再执行切割。';
                    feedback.style.color = '#ff3b30';
                }
            }
        });
    }

    // 核心步骤按钮切换逻辑
    stepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const step = parseInt(btn.getAttribute('data-step'));
            
            stepBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            descriptions.forEach(d => d.classList.remove('show'));
            const targetDesc = document.getElementById(`desc-${step}`);
            if(targetDesc) targetDesc.classList.add('show');

            // 联动控制面板的显示隐藏
            if (panel) {
                if (step === 3 || step === 4) {
                    panel.style.display = 'block';
                    if (step === 4) {
                        if (feedback) {
                            feedback.innerHTML = `🎉 镂空切割完成！成功产生 ${360 / currentArrayAngle} 面 3D 自支撑菱形孔。`;
                            feedback.style.color = '#34c759';
                        }
                    } else {
                        if (feedback) {
                            feedback.innerHTML = `✅ 极坐标 ${currentArrayAngle}° 角度吸附就绪，共将阵列出 ${360 / currentArrayAngle} 个自支撑菱形孔洞`;
                            feedback.style.color = '#34c759';
                        }
                    }
                } else {
                    panel.style.display = 'none';
                }
            }

            // 控制灯罩的扣落及镂空
            if (beaconShell) {
                if (step === 4) {
                    beaconShell.classList.add('is-cut');
                } else {
                    beaconShell.classList.remove('is-cut');
                }
            }

            // 重新渲染切刀
            renderCutters(step, currentArrayAngle);

            if(visualSide) {
                // 清理旧的步骤类
                visualSide.className = 'visual-side'; 
                if (step > 0) {
                    visualSide.classList.add(`step-${step}`);
                    void visualSide.offsetWidth; 
                }
            }
        });
    });
});
