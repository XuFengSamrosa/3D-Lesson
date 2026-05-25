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

    // 装配与扫描逻辑
    const assemblePanel = document.getElementById('assemble-panel');
    const assembleAllBtn = document.getElementById('assemble-all-btn');
    const scanInterferenceBtn = document.getElementById('scan-interference-btn');
    const precisionBtns = document.querySelectorAll('.precision-btn');
    const assembleFeedback = document.getElementById('assemble-feedback');
    
    const outpostLeft = document.querySelector('.outpost-left');
    const outpostRight = document.querySelector('.outpost-right');
    const castleWall = document.querySelector('.castle-wall');
    const scannerPlate = document.querySelector('.scanner-plate');

    let currentPrecision = 'perfect'; // 'perfect' | 'error'
    let isAssembled = false;

    // 步骤按钮切换
    stepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const step = btn.getAttribute('data-step');
            
            stepBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            descriptions.forEach(d => d.classList.remove('show'));
            const targetDesc = document.getElementById(`desc-${step}`);
            if(targetDesc) targetDesc.classList.add('show');

            // 重置状态
            resetInteractiveState();

            if(visualSide) {
                visualSide.className = 'visual-side'; 
                if (step > 0) {
                    visualSide.classList.add(`step-${step}`);
                }
            }

            // 在步骤 3 和 步骤 4 时，显示交互装配控制面板
            if (step === '3' || step === '4') {
                if (assemblePanel) assemblePanel.style.display = 'block';
            } else {
                if (assemblePanel) assemblePanel.style.display = 'none';
            }

            // 如果是步骤 3 且还没手动点击装配，可以先将场景置为未装配状态
            if (step === '3') {
                isAssembled = false;
                if (assembleFeedback) {
                    assembleFeedback.innerHTML = '💡 提示：点击“一键大合体”按钮，将哨所和城墙合拢安装到大底座上！';
                    assembleFeedback.style.color = '#2997ff';
                }
            }

            // 如果直接切换到步骤 4，我们假定进行了一次自动装配
            if (step === '4') {
                isAssembled = true;
                applyAssemblePositions();
                triggerAutoScan();
            }
        });
    });

    // 精度/公差选择按钮
    precisionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            precisionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 按钮样式
            precisionBtns.forEach(b => {
                b.style.background = 'white';
                b.style.color = '#1d1d1f';
                b.style.borderColor = '#ddd';
            });
            btn.style.background = '#2997ff';
            btn.style.color = 'white';
            btn.style.borderColor = '#2997ff';

            currentPrecision = btn.getAttribute('data-type');
            
            if (assembleFeedback) {
                if (currentPrecision === 'perfect') {
                    assembleFeedback.innerHTML = '🛡️ 对齐公差已设为：无偏位 (完美配合)。请点击“一键大合体”！';
                    assembleFeedback.style.color = '#34c759';
                } else {
                    assembleFeedback.innerHTML = '⚠️ 对齐公差已设为：有偏位 (存在干涉)。请点击“一键大合体”！';
                    assembleFeedback.style.color = '#ff9500';
                }
            }

            // 如果在已装配状态下更改了公差，自动应用新位置并重置扫描结果
            if (isAssembled) {
                applyAssemblePositions();
                clearScanResult();
            }
        });
    });

    // 点击“一键大合体”
    if (assembleAllBtn) {
        assembleAllBtn.addEventListener('click', () => {
            isAssembled = true;
            
            // 切换到步骤 3 的显示类
            if (visualSide) {
                visualSide.className = 'visual-side step-3';
                // 激活对应的步骤按钮
                stepBtns.forEach(b => b.classList.remove('active'));
                const step3Btn = document.querySelector('.step-btn[data-step="3"]');
                if (step3Btn) step3Btn.classList.add('active');
                
                descriptions.forEach(d => d.classList.remove('show'));
                const desc3 = document.getElementById('desc-3');
                if (desc3) desc3.classList.add('show');
            }

            applyAssemblePositions();
            clearScanResult();

            if (assembleFeedback) {
                if (currentPrecision === 'perfect') {
                    assembleFeedback.innerHTML = '🧩 拼装完成！榫卯已完美咬合入座。请点击“红外干涉体检”检测隐蔽穿模碰撞！';
                    assembleFeedback.style.color = '#34c759';
                } else {
                    assembleFeedback.innerHTML = '🧩 拼装完成！因为发生了公差偏移，模型可能产生冲突。请立即进行“红外干涉体检”！';
                    assembleFeedback.style.color = '#ff9500';
                }
            }
        });
    }

    // 点击“红外干涉体检”
    if (scanInterferenceBtn) {
        scanInterferenceBtn.addEventListener('click', () => {
            if (!isAssembled) {
                if (assembleFeedback) {
                    assembleFeedback.innerHTML = '💡 请先点击“一键大合体”按钮，完成拼装后再运行红外体检！';
                    assembleFeedback.style.color = '#ff3b30';
                }
                return;
            }

            // 切换到步骤 4 扫描状态
            if (visualSide) {
                visualSide.className = 'visual-side step-4';
                // 激活对应的步骤按钮
                stepBtns.forEach(b => b.classList.remove('active'));
                const step4Btn = document.querySelector('.step-btn[data-step="4"]');
                if (step4Btn) step4Btn.classList.add('active');

                descriptions.forEach(d => d.classList.remove('show'));
                const desc4 = document.getElementById('desc-4');
                if (desc4) desc4.classList.add('show');
            }

            triggerAutoScan();
        });
    }

    // 核心函数：根据选定的公差应用组件的 3D 位置
    function applyAssemblePositions() {
        if (outpostLeft) outpostLeft.style.opacity = '1';
        if (outpostRight) outpostRight.style.opacity = '1';
        if (castleWall) castleWall.style.opacity = '1';

        if (currentPrecision === 'perfect') {
            if (castleWall) castleWall.classList.remove('err-offset');
        } else {
            if (castleWall) castleWall.classList.add('err-offset');
        }
    }

    // 核心函数：触发扫描并输出结果
    function triggerAutoScan() {
        if (assembleFeedback) {
            assembleFeedback.innerHTML = '🔍 红外安全扫描中... 正在检测榫卯边缘配合穿模点...';
            assembleFeedback.style.color = '#2997ff';
        }

        // 清除上一次的结果
        clearScanResult();

        if (scannerPlate) {
            scannerPlate.classList.remove('success', 'danger');
        }

        // 模拟 2 秒的红外扫射
        setTimeout(() => {
            // 确保在延时期间没有切换走步骤
            if (!visualSide || !visualSide.classList.contains('step-4')) return;

            if (currentPrecision === 'perfect') {
                if (scannerPlate) scannerPlate.classList.add('success');
                if (assembleFeedback) {
                    assembleFeedback.innerHTML = '🛡️ 干涉体检合格！检测结果：0 个碰撞冲突点。零件契合度 100%，已通过 3D 打印装配测试！';
                    assembleFeedback.style.color = '#34c759';
                }
            } else {
                if (scannerPlate) scannerPlate.classList.add('danger');
                
                // 将城防城墙与右侧哨所标为碰撞状态
                if (castleWall) castleWall.classList.add('collision');
                if (outpostRight) outpostRight.classList.add('collision');

                if (assembleFeedback) {
                    assembleFeedback.innerHTML = '🚨 干涉体检不合格！检测结果：发现 2 处穿模冲突。城防城墙与右侧哨所配合处发生 5.00mm 实体干涉挤压，切片将报错！请返回 CAD 增加公差配合。';
                    assembleFeedback.style.color = '#ff3b30';
                }
            }
        }, 2000);
    }

    // 清除扫描产生的高亮红光或绿光
    function clearScanResult() {
        if (castleWall) castleWall.classList.remove('collision');
        if (outpostRight) outpostRight.classList.remove('collision');
        if (scannerPlate) {
            scannerPlate.classList.remove('success', 'danger');
        }
    }

    // 重置所有状态
    function resetInteractiveState() {
        isAssembled = false;
        clearScanResult();
        if (castleWall) castleWall.classList.remove('err-offset');
        
        // 恢复透明度到对应步的默认
        if (outpostLeft) outpostLeft.style.opacity = '';
        if (outpostRight) outpostRight.style.opacity = '';
        if (castleWall) castleWall.style.opacity = '';
    }
});
