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

            if(visualSide) {
                // Clear old step classes
                visualSide.className = 'visual-side'; 
                if (step > 0) {
                    visualSide.classList.add(`step-${step}`);
                    // Trigger reflow to restart animations if any
                    void visualSide.offsetWidth; 
                }
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // 1. Parallax Demo Switch Logic
    const btnFront = document.getElementById('btn-front');
    const btnSide = document.getElementById('btn-side');
    const pScene = document.getElementById('p-scene');

    if(btnFront && btnSide && pScene) {
        btnFront.addEventListener('click', () => {
            btnFront.classList.add('active');
            btnSide.classList.remove('active');
            pScene.className = 'scene-container front-view';
        });

        btnSide.addEventListener('click', () => {
            btnSide.classList.add('active');
            btnFront.classList.remove('active');
            pScene.className = 'scene-container side-view';
        });
        
        pScene.className = 'scene-container front-view';
    }

    // 2. Interactive Coordinate Axis Demo Logic
    const axisButtons = document.querySelectorAll('.axis-card-btn');
    const xArrow = document.getElementById('arrow-x');
    const yArrow = document.getElementById('arrow-y');
    const zArrow = document.getElementById('arrow-z');

    if(xArrow && yArrow && zArrow) {
        axisButtons.forEach(btn => {
            const axis = btn.getAttribute('data-axis');
            
            btn.addEventListener('mouseenter', () => {
                highlightAxis(axis);
            });
            btn.addEventListener('mouseleave', () => {
                clearHighlight();
            });
            btn.addEventListener('click', () => {
                axisButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                highlightAxis(axis, true);
            });
        });
    }

    function highlightAxis(axis, keepActive = false) {
        if(!keepActive) {
            // clear temporary active classes from arrows
            xArrow.classList.remove('active');
            yArrow.classList.remove('active');
            zArrow.classList.remove('active');
        }
        
        if (axis === 'x') xArrow.classList.add('active');
        if (axis === 'y') yArrow.classList.add('active');
        if (axis === 'z') zArrow.classList.add('active');
    }

    function clearHighlight() {
        const activeBtn = document.querySelector('.axis-card-btn.active');
        if (activeBtn) {
            highlightAxis(activeBtn.getAttribute('data-axis'), true);
        } else {
            xArrow.classList.remove('active');
            yArrow.classList.remove('active');
            zArrow.classList.remove('active');
        }
    }

    // 3. Slider-controlled 3D Tilt Demo Logic
    const tiltRange = document.getElementById('tilt-range');
    const tBadgeModel = document.getElementById('t-badge-model');
    const arcFill = document.getElementById('arc-fill');
    const angleText = document.getElementById('angle-text');

    if(tiltRange && tBadgeModel && arcFill && angleText) {
        tiltRange.addEventListener('input', (e) => {
            const val = Number(e.target.value);
            
            // Apply 3D rotation around bottom center (using rotateX)
            // Lying flat (0 degrees) corresponds to -90deg rotation in CSS X space
            // Standing vertical (90 degrees) corresponds to 0deg rotation in CSS X space
            const rotateAngle = -90 + val;
            tBadgeModel.style.transform = `translate3d(0, -20px, 0) rotateX(${rotateAngle}deg)`;
            
            // Update goniometer arc dashboard
            // Circumference of r=40 is 251.2
            // Angle range 0 to 360 degrees
            const offset = 251.2 - (251.2 * (val / 360));
            arcFill.style.strokeDashoffset = offset;
            angleText.textContent = `${val}°`;
        });
        
        // Trigger initial update
        tiltRange.dispatchEvent(new Event('input'));
    }

    // 4. Slider-controlled 3D Assembly Demo Logic
    const assemblySlider = document.getElementById('assembly-slider');
    const aBadgeModel = document.getElementById('a-badge-model');
    const aInterferenceMesh = document.getElementById('a-interference-mesh');
    const assemblyStatus = document.getElementById('assembly-status');
    const btnAssembleAction = document.getElementById('btn-assemble-action');
    const aScene = document.getElementById('a-scene');

    let isFused = false;

    if (assemblySlider && aBadgeModel && aInterferenceMesh && assemblyStatus && btnAssembleAction && aScene) {
        const interferenceTop = aInterferenceMesh.querySelector('.top');
        const interferenceBottom = aInterferenceMesh.querySelector('.bottom');

        assemblySlider.addEventListener('input', (e) => {
            if (isFused) {
                // If fused, moving the slider breaks the fusion
                isFused = false;
                aBadgeModel.classList.remove('fused');
                aScene.classList.remove('success-flash');
            }

            const val = Number(e.target.value);
            
            // Apply translation Y to badge
            // In a-scene, badge is tilted rotateX(-60deg) for realism
            aBadgeModel.style.transform = `translate3d(0, ${-20 - val}px, 0) rotateX(-60deg)`;
            
            // Check interference
            if (val > 0) {
                // Suspended
                assemblyStatus.textContent = '⚠️ 悬空 (未连接)';
                assemblyStatus.className = 'status-indicator';
                btnAssembleAction.disabled = true;
                
                aInterferenceMesh.style.opacity = '0';
            } else if (val === 0) {
                // Just touching
                assemblyStatus.textContent = '⚠️ 仅接触 (极易断裂)';
                assemblyStatus.className = 'status-indicator';
                btnAssembleAction.disabled = true;
                
                aInterferenceMesh.style.opacity = '0.3';
                updateInterferenceMesh(1);
            } else if (val < 0 && val >= -15) {
                // Recommended depth
                assemblyStatus.textContent = `✅ 完美干涉 (插入深度: ${Math.abs(val)}mm)`;
                assemblyStatus.className = 'status-indicator ready';
                btnAssembleAction.disabled = false;
                
                aInterferenceMesh.style.opacity = '0.8';
                updateInterferenceMesh(Math.abs(val));
            } else {
                // Too deep
                assemblyStatus.textContent = `⚠️ 穿插过度 (深度: ${Math.abs(val)}mm)`;
                assemblyStatus.className = 'status-indicator';
                btnAssembleAction.disabled = true;
                
                aInterferenceMesh.style.opacity = '0.4';
                updateInterferenceMesh(Math.abs(val));
            }
        });

        btnAssembleAction.addEventListener('click', () => {
            isFused = true;
            aBadgeModel.classList.add('fused');
            aScene.classList.add('success-flash');
            aInterferenceMesh.style.opacity = '0';
            
            assemblyStatus.textContent = '🎉 组装成功! (已成实体)';
            assemblyStatus.className = 'status-indicator success';
            btnAssembleAction.disabled = true;
        });

        function updateInterferenceMesh(h) {
            aInterferenceMesh.style.height = `${h}px`;
            // Center Y translation for growing upwards from -20px
            const centerY = -20 + (h / 2);
            aInterferenceMesh.style.transform = `translate3d(0, ${centerY}px, 0)`;
            
            // Adjust top/bottom face translateZ to maintain box shape
            if (interferenceTop) interferenceTop.style.transform = `rotateX(90deg) translateZ(${h / 2}px)`;
            if (interferenceBottom) interferenceBottom.style.transform = `rotateX(-90deg) translateZ(${h / 2}px)`;
        }

        // Trigger initial update
        assemblySlider.dispatchEvent(new Event('input'));
    }
});
