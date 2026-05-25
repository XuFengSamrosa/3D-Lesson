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

            // 动态调节支撑面板的显隐 (在步骤2、3、4显示)
            const supportPanel = document.getElementById('support-panel');
            if (supportPanel) {
                if (step === '2' || step === '3' || step === '4') {
                    supportPanel.style.display = 'block';
                    // 刷新间距与支撑显示
                    updateFences();
                } else {
                    supportPanel.style.display = 'none';
                    // 恢复默认的样式和位置
                    resetFences();
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

    // 支撑与间距调节监听
    const spacingSlider = document.getElementById('spacing-slider');
    const spacingVal = document.getElementById('spacing-val');
    const supportCheckbox = document.getElementById('support-checkbox');
    const supportFeedback = document.getElementById('support-feedback');
    const fences = [
        document.querySelector('.fence.f1'),
        document.querySelector('.fence.f2'),
        document.querySelector('.fence.f3'),
        document.querySelector('.fence.f4')
    ];
    const beam = document.querySelector('.beam');
    const treeSupport = document.querySelector('.tree-support');

    function updateFences() {
        if (!spacingSlider) return;
        const spacing = parseInt(spacingSlider.value);
        if (spacingVal) spacingVal.textContent = spacing;

        const activeBtn = document.querySelector('.step-btn.active');
        if (!activeBtn) return;
        const currentStep = activeBtn.getAttribute('data-step');

        // 如果在第2、3、4步，允许拖拽改变间距
        if (currentStep === '2' || currentStep === '3' || currentStep === '4') {
            fences.forEach((f, idx) => {
                if (f) {
                    const offset = (idx - 1.5) * spacing;
                    f.style.transform = `translate3d(${offset}px, 0, 20px)`;
                }
            });
        }

        // 控制树形支撑和梁体塌陷
        if (currentStep === '3' || currentStep === '4') {
            const hasSupport = supportCheckbox && supportCheckbox.checked;
            if (hasSupport) {
                if (treeSupport) treeSupport.classList.remove('hidden');
                if (beam) beam.classList.remove('sag');
                if (supportFeedback) {
                    supportFeedback.innerHTML = `✅ 树形支撑已启用，托举倾斜梁安全打印。`;
                    supportFeedback.style.color = '#34c759';
                }
            } else {
                if (treeSupport) treeSupport.classList.add('hidden');
                // 仅在第3步模拟塌陷（打印失败）
                if (currentStep === '3') {
                    if (beam) beam.classList.add('sag');
                } else {
                    if (beam) beam.classList.remove('sag');
                }
                if (supportFeedback) {
                    supportFeedback.innerHTML = `🚨 悬空超限！未开启支撑，跨空梁因重力塌陷下坠！`;
                    supportFeedback.style.color = '#ff3b30';
                }
            }
        }
    }

    function resetFences() {
        fences.forEach(f => {
            if (f) f.style.transform = '';
        });
        if (beam) beam.classList.remove('sag');
        if (treeSupport) treeSupport.classList.remove('hidden');
    }

    if (spacingSlider) spacingSlider.addEventListener('input', updateFences);
    if (supportCheckbox) supportCheckbox.addEventListener('change', updateFences);
});


document.addEventListener('DOMContentLoaded', () => {
    console.log('Lesson 07 (Castle Fence) presentation loaded.');
});

