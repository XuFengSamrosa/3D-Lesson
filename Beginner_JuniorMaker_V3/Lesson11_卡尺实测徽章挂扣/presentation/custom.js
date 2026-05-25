document.addEventListener('DOMContentLoaded', () => {
    const stepBtns = document.querySelectorAll('.step-btn');
    const descriptions = document.querySelectorAll('.desc');
    const visualSide = document.querySelector('.visual-side');
    const scene = document.querySelector('.scene');
    
    let autoRotate = true;
    let angle = 45;
    let hasMeasured = false; // 是否已经进行了卡尺测量
    let currentGap = 0.5;   // 默认 0.5mm 间隙 (4.5mm 凹槽)

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

    // 联动测量控制元素
    const panel = document.getElementById('caliper-panel');
    const measureBtn = document.getElementById('measure-btn');
    const assembleBtn = document.getElementById('assemble-btn');
    const gapBtns = document.querySelectorAll('.gap-btn');
    const feedback = document.getElementById('caliper-feedback');

    const caliper = document.querySelector('.caliper');
    const slidingJaw = document.querySelector('.sliding-jaw');
    const readout = document.querySelector('.caliper-readout');
    const badgePlate = document.querySelector('.badge-plate');
    
    const badgeHolder = document.querySelector('.badge-holder');
    const holderFront = document.querySelector('.holder-front');
    const fitIndicator = document.querySelector('.fit-indicator');

    // 1. 卡尺测量动作
    if (measureBtn) {
        measureBtn.addEventListener('click', () => {
            if (!slidingJaw || !readout) return;
            
            // 切换步骤到步骤 1 (测量步骤)
            const step1Btn = document.querySelector('.step-btn[data-step="1"]');
            if (step1Btn && !step1Btn.classList.contains('active')) {
                step1Btn.click();
            }

            // 播放卡爪滑动动画
            slidingJaw.style.transition = 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
            slidingJaw.style.transform = 'translate3d(25px, 2px, 0)'; // 抵住徽章厚度 4px 处

            // 滚动数显数值
            let currentRead = 0.0;
            const interval = setInterval(() => {
                currentRead += 0.2;
                if (currentRead >= 4.0) {
                    currentRead = 4.0;
                    clearInterval(interval);
                    hasMeasured = true;
                    if (feedback) {
                        feedback.innerHTML = `✅ 测量完毕：名字徽章厚度实测为 <b>4.0mm</b>。卡尺读数精细锁死！`;
                        feedback.style.color = '#34c759';
                    }
                }
                readout.textContent = `${currentRead.toFixed(1)}mm`;
            }, 70);
        });
    }

    // 2. 调节卡槽宽度
    gapBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            gapBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'white';
                b.style.color = '#1d1d1f';
                b.style.borderColor = '#ddd';
            });
            btn.classList.add('active');
            btn.style.background = '#2997ff';
            btn.style.color = 'white';
            btn.style.borderColor = '#2997ff';

            currentGap = parseFloat(btn.getAttribute('data-gap'));

            // 物理微调：0.5mm 间隙下前挡板往外位移 0.25px (两侧累加 0.5px)
            if (holderFront) {
                if (currentGap === 0.0) {
                    holderFront.style.transform = 'translate3d(0, 4.0px, -2.5px)'; // 4.0mm
                } else {
                    holderFront.style.transform = 'translate3d(0, 4.25px, -2.5px)'; // 4.5mm
                }
            }

            if (feedback) {
                if (currentGap === 0.0) {
                    feedback.innerHTML = `⚠️ 零间隙：凹槽净宽 4.0mm。卡槽尺寸与徽章完全一致，由于打印收缩与热胀变形，极易发生干涉导致焊死！`;
                    feedback.style.color = '#ff9500';
                } else {
                    feedback.innerHTML = `✅ 黄金配合：凹槽净宽 4.5mm。预留了 0.5mm 滑动公差缝隙，装配成功率 100%。`;
                    feedback.style.color = '#34c759';
                }
            }

            // 如果已经滑入，重新测试插接以更新状态
            const activeBtn = document.querySelector('.step-btn.active');
            if (activeBtn && parseInt(activeBtn.getAttribute('data-step')) >= 3) {
                runAssemblyTest();
            }
        });
    });

    // 3. 执行插接物理测试
    function runAssemblyTest() {
        if (!badgePlate || !badgeHolder) return;

        // 清理旧状态
        badgeHolder.classList.remove('interference');
        if (fitIndicator) {
            fitIndicator.classList.remove('fail', 'success');
        }

        if (currentGap === 0.0) {
            // 零间隙：滑落到一半被卡住 (Z = 28px)
            badgePlate.style.transition = 'transform 1s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
            badgePlate.style.transform = 'translate3d(0, 0, 28px)'; // 卡住
            
            setTimeout(() => {
                badgeHolder.classList.add('interference');
                if (fitIndicator) {
                    fitIndicator.classList.add('fail');
                }
                if (feedback) {
                    feedback.innerHTML = `🚨 装配干涉：卡槽零公差，零点几毫米的误差将徽章死死卡在入口，无法插入！`;
                    feedback.style.color = '#ff3b30';
                }
            }, 1000);
        } else {
            // 0.5mm 黄金配合：完全滑入 (Z = 11.5px)
            badgePlate.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
            badgePlate.style.transform = 'translate3d(0, 0, 11.5px)'; // 滑入到底部
            
            setTimeout(() => {
                if (fitIndicator) {
                    fitIndicator.classList.add('success');
                }
                if (feedback) {
                    feedback.innerHTML = `🎉 卡扣成功！预留 0.5mm 间隙，名字徽章滑入卡槽完全锁定，装配清脆过关！`;
                    feedback.style.color = '#34c759';
                }
            }, 1200);
        }
    }

    if (assembleBtn) {
        assembleBtn.addEventListener('click', () => {
            // 切换步骤到步骤 3 (装配步骤)
            const step3Btn = document.querySelector('.step-btn[data-step="3"]');
            if (step3Btn && !step3Btn.classList.contains('active')) {
                step3Btn.click();
            } else {
                runAssemblyTest();
            }
        });
    }

    // 重置全部状态到指定步骤
    function resetToStep(step) {
        if (badgePlate) {
            badgePlate.style.transition = 'none';
            if (step < 3) {
                badgePlate.style.transform = 'translate3d(0, 0, 45px)'; // 悬空
            } else {
                if (currentGap === 0.0) {
                    badgePlate.style.transform = 'translate3d(0, 0, 28px)';
                } else {
                    badgePlate.style.transform = 'translate3d(0, 0, 11.5px)';
                }
            }
        }

        if (caliper && slidingJaw && readout) {
            if (step === 0) {
                slidingJaw.style.transform = 'translate3d(25px, 20px, 0)'; // 退回
                readout.textContent = '0.0mm';
                hasMeasured = false;
            } else if (step === 1) {
                // 如果是直接点的步骤1，则自动运行测量
                slidingJaw.style.transform = 'translate3d(25px, 2px, 0)';
                readout.textContent = '4.0mm';
                hasMeasured = true;
            }
        }

        if (badgeHolder && fitIndicator) {
            badgeHolder.classList.remove('interference');
            fitIndicator.classList.remove('fail', 'success');
            
            if (step === 4) {
                if (currentGap === 0.0) {
                    badgeHolder.classList.add('interference');
                    fitIndicator.classList.add('fail');
                } else {
                    fitIndicator.classList.add('success');
                }
            }
        }
    }

    // 核心步骤切换按钮
    stepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const step = parseInt(btn.getAttribute('data-step'));
            
            stepBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            descriptions.forEach(d => d.classList.remove('show'));
            const targetDesc = document.getElementById(`desc-${step}`);
            if(targetDesc) targetDesc.classList.add('show');

            // 联动控制面板
            if (panel) {
                if (step > 0 && step < 5) {
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'none';
                }
            }

            // 初始化卡尺与徽章的物理坐标
            resetToStep(step);

            // 如果切到步骤 3，自动执行插接动画
            if (step === 3) {
                setTimeout(runAssemblyTest, 200);
            }

            if (feedback) {
                if (step === 0) {
                    feedback.innerHTML = '💡 请先点击“游标卡尺测量”以夹紧名字徽章。';
                    feedback.style.color = '#2997ff';
                } else if (step === 1 && hasMeasured) {
                    feedback.innerHTML = `✅ 测量完毕：名字徽章厚度实测为 <b>4.0mm</b>。卡尺读数精细锁死！`;
                    feedback.style.color = '#34c759';
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
});
