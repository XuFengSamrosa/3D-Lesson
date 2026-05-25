document.addEventListener('DOMContentLoaded', () => {
    const stepBtns = document.querySelectorAll('.step-btn');
    const descriptions = document.querySelectorAll('.desc');
    const visualSide = document.querySelector('.visual-side');
    const scene = document.querySelector('.scene');
    
    let autoRotate = true;
    let angle = 45;
    let selectedColor = '#007aff'; // 默认画笔颜色：蓝色
    let selectedMode = 'part';      // 默认填色模式：零件分色

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

    // 联动控制面板与填色控制元素
    const panel = document.getElementById('color-panel');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const brushBtns = document.querySelectorAll('.brush-btn');
    const sliceBtn = document.getElementById('slice-test-btn');
    const feedback = document.getElementById('color-feedback');

    const shieldBase = document.querySelector('.shield-base');
    const shieldPattern = document.querySelector('.shield-pattern');
    const patternText = document.querySelector('.pattern-text');
    const amsNozzle = document.querySelector('.ams-nozzle');
    const wasteTower = document.querySelector('.waste-tower');

    // 1. 画笔选择事件
    brushBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            brushBtns.forEach(b => {
                b.classList.remove('active');
                b.style.border = '2.5px solid white';
            });
            btn.classList.add('active');
            btn.style.border = '2.5px solid #2997ff'; // 蓝色边框表示选中
            selectedColor = btn.getAttribute('data-color');
            
            if (feedback) {
                feedback.innerHTML = `💡 画笔已选择，点击 3D 场景中的“盾牌底板”或“浮雕花纹”即可进行填色！`;
                feedback.style.color = '#2997ff';
            }
        });
    });

    // 2. 填色模式选择事件
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'white';
                b.style.color = '#1d1d1f';
                b.style.borderColor = '#ddd';
            });
            btn.classList.add('active');
            btn.style.background = '#2997ff';
            btn.style.color = 'white';
            btn.style.borderColor = '#2997ff';

            selectedMode = btn.getAttribute('data-mode');

            if (feedback) {
                if (selectedMode === 'part') {
                    feedback.innerHTML = `✅ 独立零件上色：模型按组件（底盘/图腾）分开染色，高度上无杂乱交错，换色仅需 1 次，废料极少。`;
                    feedback.style.color = '#34c759';
                } else {
                    feedback.innerHTML = `⚠️ 按高度层上色：在同一层内混杂了不同颜色，这将导致喷嘴在每一层都疯狂退料和进料，产生巨量废料！`;
                    feedback.style.color = '#ff9500';
                }
            }
        });
    });

    // 3. 实时交互式填色 (点击底座)
    if (shieldBase) {
        shieldBase.addEventListener('click', (e) => {
            e.stopPropagation();
            const faces = shieldBase.querySelectorAll('.face');
            faces.forEach(f => {
                f.style.background = `linear-gradient(135deg, ${selectedColor}, #1a1a1a)`;
                f.style.borderColor = selectedColor;
            });
            if (feedback) {
                feedback.innerHTML = '🎨 盾牌底座填色成功！';
                feedback.style.color = '#34c759';
            }
        });
    }

    // 点击花纹组件上色
    if (shieldPattern) {
        shieldPattern.addEventListener('click', (e) => {
            e.stopPropagation();
            const faces = shieldPattern.querySelectorAll('.face');
            faces.forEach(f => {
                f.style.background = `linear-gradient(135deg, ${selectedColor}, #555)`;
                f.style.borderColor = selectedColor;
            });
            if (patternText) {
                patternText.style.color = '#ffffff';
                patternText.style.textShadow = `0 0 8px ${selectedColor}, 0 0 12px #ffffff`;
            }
            if (feedback) {
                feedback.innerHTML = '🎨 浮雕花纹填色成功！';
                feedback.style.color = '#34c759';
            }
        });
    }

    // 4. 多色切片打印评估
    if (sliceBtn) {
        sliceBtn.addEventListener('click', () => {
            // 自动跳入步骤 3 (料塔冲刷演示)
            const step3Btn = document.querySelector('.step-btn[data-step="3"]');
            if (step3Btn && !step3Btn.classList.contains('active')) {
                step3Btn.click();
            }

            if (feedback) {
                feedback.innerHTML = '⚡️ 正在启动多色切片分析，模拟 AMS 进退退料与清洗路径...';
                feedback.style.color = '#ff9500';
            }

            // 喷嘴进入疯狂运行轨道
            if (amsNozzle) {
                amsNozzle.classList.add('slicing-crazy');
            }

            // 根据不同的模式决定废料塔高度
            if (wasteTower) {
                wasteTower.classList.remove('huge', 'tiny');
                if (selectedMode === 'part') {
                    wasteTower.classList.add('tiny');
                } else {
                    wasteTower.classList.add('huge');
                }
            }

            // 3秒后得出评估报告，喷嘴复位
            setTimeout(() => {
                if (amsNozzle) {
                    amsNozzle.classList.remove('slicing-crazy');
                }

                if (selectedMode === 'part') {
                    if (feedback) {
                        feedback.innerHTML = `🎉 评估合格！零件上色模式合理。总换色次数：1次。废料重量：仅成品重量的 4%。切片顺利通过城堡质量测试！`;
                        feedback.style.color = '#34c759';
                    }
                } else {
                    if (feedback) {
                        feedback.innerHTML = `🚨 评估警告：由于高度交替混色，切片换色次数爆表 (124次)！废料塔比大盾牌重 380%，工期暴增 450%！建议使用零件上色模式。`;
                        feedback.style.color = '#ff3b30';
                    }
                }
            }, 3000);
        });
    }

    // 重置盾牌初始颜色和料塔
    function resetColorsAndTower(step) {
        if (wasteTower) {
            wasteTower.classList.remove('huge', 'tiny');
        }
        if (amsNozzle) {
            amsNozzle.classList.remove('slicing-crazy');
        }

        const baseFaces = shieldBase ? shieldBase.querySelectorAll('.face') : [];
        const patternFaces = shieldPattern ? shieldPattern.querySelectorAll('.face') : [];

        if (step === 0) {
            // 素模状态 (全灰色)
            baseFaces.forEach(f => {
                f.style.background = 'rgba(142, 142, 147, 0.9)';
                f.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            });
            patternFaces.forEach(f => {
                f.style.background = 'rgba(120, 120, 125, 0.95)';
                f.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            });
            if (patternText) {
                patternText.style.color = 'rgba(255, 255, 255, 0.9)';
                patternText.style.textShadow = 'none';
            }
        } else if (step === 4) {
            // 步骤4：默认上好高品质颜色 (深蓝 + 金黄)
            baseFaces.forEach(f => {
                f.style.background = 'linear-gradient(135deg, #0056b3, #002752)';
                f.style.borderColor = '#007aff';
            });
            patternFaces.forEach(f => {
                f.style.background = 'linear-gradient(135deg, #ffd700, #b8860b)';
                f.style.borderColor = '#ffd700';
            });
            if (patternText) {
                patternText.style.color = '#ffffff';
                patternText.style.textShadow = '0 0 8px #ffd700, 0 0 12px #ffffff';
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

            // 联动面板显示隐藏
            if (panel) {
                if (step > 0 && step < 5) {
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'none';
                }
            }

            // 重置坐标与状态
            resetColorsAndTower(step);

            if (feedback) {
                if (step === 0) {
                    feedback.innerHTML = '💡 提示：点击盾牌的不同组件，用当前选择的画笔为它着色！';
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
