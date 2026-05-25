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

    // 交互面板控件
    const arrangePanel = document.getElementById('arrange-panel');
    const autoArrangeBtn = document.getElementById('auto-arrange-btn');
    const peelSupportBtn = document.getElementById('peel-support-btn');
    const arrangeFeedback = document.getElementById('arrange-feedback');

    // 步骤切换逻辑
    stepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const step = btn.getAttribute('data-step');
            updateStepUI(step);
        });
    });

    function updateStepUI(step) {
        stepBtns.forEach(b => b.classList.remove('active'));
        const targetBtn = document.querySelector(`.step-btn[data-step="${step}"]`);
        if (targetBtn) targetBtn.classList.add('active');

        descriptions.forEach(d => d.classList.remove('show'));
        const targetDesc = document.getElementById(`desc-${step}`);
        if(targetDesc) targetDesc.classList.add('show');

        if(visualSide) {
            visualSide.className = 'visual-side'; 
            visualSide.classList.add(`step-${step}`);
        }

        // 显示交互控制面板
        if (arrangePanel) {
            arrangePanel.style.display = 'block';
        }

        // 按钮可用状态及反馈文案更新
        if (step === '0') {
            if (autoArrangeBtn) autoArrangeBtn.disabled = false;
            if (peelSupportBtn) peelSupportBtn.disabled = true;
            if (arrangeFeedback) {
                arrangeFeedback.innerHTML = '💡 提示：零件在热床盘 1 上重叠！点击“一键自动排盘”按钮摆放零件。';
                arrangeFeedback.style.color = '#2997ff';
            }
        } else if (step === '1') {
            if (autoArrangeBtn) autoArrangeBtn.disabled = false;
            if (peelSupportBtn) peelSupportBtn.disabled = true;
            if (arrangeFeedback) {
                arrangeFeedback.innerHTML = '⚠️ 警告：零件堆叠发生物理冲突！点击“一键自动排盘”进行多加热盘分流。';
                arrangeFeedback.style.color = '#ff9500';
            }
        } else if (step === '2') {
            if (autoArrangeBtn) autoArrangeBtn.disabled = false;
            if (peelSupportBtn) peelSupportBtn.disabled = true;
            if (arrangeFeedback) {
                arrangeFeedback.innerHTML = '🛡️ 分流排版成功！两个热床都在安全打印范围。点击步骤 3 体验去支撑！';
                arrangeFeedback.style.color = '#34c759';
            }
        } else if (step === '3') {
            if (autoArrangeBtn) autoArrangeBtn.disabled = true;
            if (peelSupportBtn) peelSupportBtn.disabled = false;
            if (arrangeFeedback) {
                arrangeFeedback.innerHTML = '✂️ 检测到城防城墙悬空部分已生成树状支撑！请点击“斜口钳去支撑”开始剪断去除。';
                arrangeFeedback.style.color = '#ff3b30';
            }
        } else if (step === '4') {
            if (autoArrangeBtn) autoArrangeBtn.disabled = true;
            if (peelSupportBtn) peelSupportBtn.disabled = true;
            if (arrangeFeedback) {
                arrangeFeedback.innerHTML = '✨ 树状支撑已彻底剥离！哨所和城防城墙外观干净平整，已做好合体准备。';
                arrangeFeedback.style.color = '#34c759';
            }
        }
    }

    // 初始化显示步骤 0
    updateStepUI('0');

    // 一键自动排盘
    if (autoArrangeBtn) {
        autoArrangeBtn.addEventListener('click', () => {
            updateStepUI('2');
            if (arrangeFeedback) {
                arrangeFeedback.innerHTML = '🗂️ 一键排盘算法成功！城防城墙已自动移至第二个热床，防撞黄色警告解除。';
                arrangeFeedback.style.color = '#34c759';
            }
        });
    }

    // 斜口钳去支撑
    if (peelSupportBtn) {
        peelSupportBtn.addEventListener('click', () => {
            updateStepUI('3');
            if (arrangeFeedback) {
                arrangeFeedback.innerHTML = '✂️ 正在控制 3D 斜口钳切入树状支撑结合线... 请戴好护目镜防塑料飞溅！';
                arrangeFeedback.style.color = '#ff3b30';
            }
            
            // 禁用按钮防重复点击
            peelSupportBtn.disabled = true;

            // 1.8 秒后模拟完成去除，自动切入步骤 4
            setTimeout(() => {
                // 确保仍在步骤 3
                if (visualSide && visualSide.classList.contains('step-3')) {
                    updateStepUI('4');
                    if (arrangeFeedback) {
                        arrangeFeedback.innerHTML = '✨ 咔嚓！树状支撑完全被剥除，碎片已物理清理。零件底面展现平滑工业品质！';
                        arrangeFeedback.style.color = '#34c759';
                    }
                }
            }, 1800);
        });
    }
});
