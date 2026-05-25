document.addEventListener('DOMContentLoaded', () => {
    const stepBtns = document.querySelectorAll('.step-btn');
    const descriptions = document.querySelectorAll('.desc');
    const visualSide = document.querySelector('.visual-side');
    const scene = document.querySelector('.scene');
    
    let autoRotate = true;
    let angle = 45;
    let ceremonyActive = false; // 是否启动了毕业典礼

    // 旋转 3D 场景
    function rotateScene() {
        if(autoRotate && scene) {
            // 如果启动了落成典礼，旋转速度加快
            const speed = ceremonyActive ? 2.5 : 0.5;
            angle += speed;
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
    const celebratePanel = document.getElementById('celebrate-panel');
    const launchCeremonyBtn = document.getElementById('launch-ceremony-btn');
    const celebrateFeedback = document.getElementById('celebrate-feedback');

    // 步骤切换
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

        // 重置典礼标记
        ceremonyActive = false;

        if(visualSide) {
            visualSide.className = 'visual-side'; 
            visualSide.classList.add(`step-${step}`);
        }

        // 仅在步骤 4 时，显示“启动落成典礼”面板
        if (step === '4') {
            if (celebratePanel) celebratePanel.style.display = 'block';
            if (celebrateFeedback) {
                celebrateFeedback.innerHTML = '💡 提示：点击“启动落成典礼”按钮，启动城堡霓虹灯环与核心电力，漫天星光闪烁庆贺！';
                celebrateFeedback.style.color = '#ffd700';
            }
        } else {
            if (celebratePanel) celebratePanel.style.display = 'none';
        }
    }

    // 初始化到步骤 0
    updateStepUI('0');

    // 启动落成典礼
    if (launchCeremonyBtn) {
        launchCeremonyBtn.addEventListener('click', () => {
            ceremonyActive = true;
            
            // 确保在步骤 4 下
            if (visualSide && !visualSide.classList.contains('step-4')) {
                updateStepUI('4');
            }

            // 更新反馈信息，渲染最终结营仪式词，并加上精美金黄色高亮
            if (celebrateFeedback) {
                celebrateFeedback.innerHTML = '⭐ 城堡量产落成典礼启动！全息展台电量充满，能量核心（黄金陀螺）开始极速运转！<br><br>🏅 恭喜通关！你已被正式授予“三维创客魔法工程师”毕业勋章，城堡防御线圆满落成！';
                celebrateFeedback.style.color = '#ffffff';
                celebrateFeedback.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
            }

            // 禁用按钮，烘托仪式感
            launchCeremonyBtn.innerHTML = '✨ 典礼运行中... 恭喜毕业！';
            launchCeremonyBtn.disabled = true;
            launchCeremonyBtn.style.background = 'linear-gradient(135deg, #ffd700, #ffffff)';
            launchCeremonyBtn.style.boxShadow = '0 0 30px #ffd700';

            // 播放一个彩纸粒子在控制面板上淡入的微效果
            setTimeout(() => {
                launchCeremonyBtn.disabled = false;
                launchCeremonyBtn.innerHTML = '⭐ 重新启动落成典礼';
                launchCeremonyBtn.style.background = 'linear-gradient(135deg, #ffd700, #ff9500)';
                launchCeremonyBtn.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.4)';
            }, 10000);
        });
    }
});
