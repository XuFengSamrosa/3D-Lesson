document.addEventListener('DOMContentLoaded', () => {
    const stepBtns = document.querySelectorAll('.step-btn');
    const descriptions = document.querySelectorAll('.desc');
    const visualSide = document.querySelector('.visual-side');
    const scene = document.querySelector('.scene');
    
    let autoRotate = true;
    let angle = 45;
    let selectedContract = 'fit'; // 默认规范：fit (预留公差 10.5mm)

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

    // 联动控制面板与插接控制元素
    const panel = document.getElementById('contract-panel');
    const contractBtns = document.querySelectorAll('.contract-btn');
    const plugBtn = document.getElementById('plug-test-btn');
    const feedback = document.getElementById('contract-feedback');

    const peg = document.querySelector('.castle-outpost-peg');
    const slot1 = document.querySelector('.slot.s1-outpost');
    const holeLabel = document.querySelector('.label.l1-hole');

    // 1. 卡接规范按钮点击
    contractBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            contractBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'white';
                b.style.color = '#1d1d1f';
                b.style.borderColor = '#ddd';
            });
            btn.classList.add('active');
            btn.style.background = '#2997ff';
            btn.style.color = 'white';
            btn.style.borderColor = '#2997ff';

            selectedContract = btn.getAttribute('data-type');

            // 联动更新 3D 蓝图纸张上的尺寸标签
            if (holeLabel) {
                if (selectedContract === 'fuse') {
                    holeLabel.textContent = 'Hole: 10.0mm';
                    holeLabel.style.color = '#ff3b30';
                    holeLabel.style.borderColor = '#ff3b30';
                    holeLabel.style.boxShadow = '0 0 5px rgba(255, 59, 48, 0.5)';
                } else {
                    holeLabel.textContent = 'Hole: 10.5mm';
                    holeLabel.style.color = '#34c759';
                    holeLabel.style.borderColor = '#34c759';
                    holeLabel.style.boxShadow = '0 0 5px rgba(52, 199, 89, 0.5)';
                }
            }

            if (feedback) {
                if (selectedContract === 'fuse') {
                    feedback.innerHTML = `⚠️ 尺寸干涉：插孔与榫头设计同为 10.0mm。由于打印材料微量膨胀，绝对塞不进去！`;
                    feedback.style.color = '#ff9500';
                } else {
                    feedback.innerHTML = `✅ 合理公差：插孔宽度 10.5mm，预留了 0.5mm 配合间隙，组装最顺畅。`;
                    feedback.style.color = '#34c759';
                }
            }

            // 如果已经执行了插接，重新执行以更新装配物理动画
            const activeBtn = document.querySelector('.step-btn.active');
            if (activeBtn && parseInt(activeBtn.getAttribute('data-step')) >= 3) {
                runPlugTest();
            }
        });
    });

    // 2. 模拟插接拼装卡接物理运动
    function runPlugTest() {
        if (!peg || !slot1) return;

        // 清除状态
        peg.classList.remove('interference');
        slot1.classList.remove('success', 'fail');

        peg.style.opacity = '1';

        if (selectedContract === 'fuse') {
            // 无公差干涉：向下滑动到一半被阻挡停住 (Z = 16px)
            peg.style.transition = 'transform 0.8s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
            peg.style.transform = 'translate3d(-35px, 2px, 16px) scale(0.6)'; // 在插口上方卡死
            
            setTimeout(() => {
                peg.classList.add('interference');
                slot1.classList.add('fail');
                if (feedback) {
                    feedback.innerHTML = `🚨 装配干涉：由于公差为 0.0mm，插销与基座物理干涉卡死，硬挤会导致 3D 打印件断裂！`;
                    feedback.style.color = '#ff3b30';
                }
            }, 800);
        } else {
            // 预留公差：顺滑卡入插孔底部 (Z = -2px)
            peg.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
            peg.style.transform = 'translate3d(-35px, 2px, -2px) scale(0.6)'; // 滑入插槽内部
            
            setTimeout(() => {
                slot1.classList.add('success');
                if (feedback) {
                    feedback.innerHTML = `🎉 卡接成功！预留 0.5mm 卡扣配合公差，榫头完美插进城堡底盘，接口锁定成功！`;
                    feedback.style.color = '#34c759';
                }
            }, 1200);
        }
    }

    if (plugBtn) {
        plugBtn.addEventListener('click', () => {
            // 自动跳入步骤 3 (接口契约测试)
            const step3Btn = document.querySelector('.step-btn[data-step="3"]');
            if (step3Btn && !step3Btn.classList.contains('active')) {
                step3Btn.click();
            } else {
                runPlugTest();
            }
        });
    }

    // 根据步骤重置插销
    function resetPegToStep(step) {
        if (!peg || !slot1) return;

        peg.classList.remove('interference');
        slot1.classList.remove('success', 'fail');

        if (step < 2) {
            peg.style.opacity = '0';
            peg.style.transform = 'translate3d(-35px, 2px, 50px) scale(0.6)'; // 隐去
        } else if (step === 2) {
            peg.style.opacity = '0.6'; // 半透明悬浮，作为组装参考
            peg.style.transform = 'translate3d(-35px, 2px, 50px) scale(0.6)';
        } else {
            // 步骤 3 或 4
            if (selectedContract === 'fuse') {
                peg.style.opacity = '1';
                peg.style.transform = 'translate3d(-35px, 2px, 16px) scale(0.6)';
                peg.classList.add('interference');
                slot1.classList.add('fail');
            } else {
                peg.style.opacity = '1';
                peg.style.transform = 'translate3d(-35px, 2px, -2px) scale(0.6)';
                slot1.classList.add('success');
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

            // 联动控制面板显示/隐藏
            if (panel) {
                if (step >= 2 && step <= 4) {
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'none';
                }
            }

            // 重置插头和插槽
            resetPegToStep(step);

            // 步骤3自动播放装配
            if (step === 3) {
                setTimeout(runPlugTest, 200);
            }

            if (feedback) {
                if (step === 0 || step === 1) {
                    feedback.innerHTML = '💡 大总管提示：请先选择接口设计规范，再模拟插接测试。';
                    feedback.style.color = '#2997ff';
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
