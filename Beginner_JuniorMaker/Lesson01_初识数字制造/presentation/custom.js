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
    // Machine Hover Logic
    const machineParts = document.querySelectorAll('.p-part');
    const mTitle = document.getElementById('m-title');
    const mDesc = document.getElementById('m-desc');
    const dangerOverlay = document.getElementById('danger-overlay');
    const btnCloseDanger = document.getElementById('btn-close-danger');

    machineParts.forEach(part => {
        part.addEventListener('mouseenter', () => {
            mTitle.textContent = part.getAttribute('data-title');
            mDesc.textContent = part.getAttribute('data-desc');
            if (part.classList.contains('danger')) {
                mTitle.style.color = '#e74c3c';
            } else {
                mTitle.style.color = '#f39c12';
            }
        });

        part.addEventListener('mouseleave', () => {
            mTitle.textContent = '把鼠标移到左侧打印机上...';
            mDesc.textContent = '探索各个组件的功能与原理。';
            mTitle.style.color = '#f39c12';
        });

        part.addEventListener('click', () => {
            if (part.classList.contains('danger')) {
                dangerOverlay.classList.add('show');
            }
        });
    });

    if(btnCloseDanger) {
        btnCloseDanger.addEventListener('click', () => {
            dangerOverlay.classList.remove('show');
        });
    }

    // Software UI Hover Logic
    const softwareParts = document.querySelectorAll('.software-model .p-part');
    const sTitle = document.getElementById('s-title');
    const sDesc = document.getElementById('s-desc');

    softwareParts.forEach(part => {
        part.addEventListener('mouseenter', () => {
            if(sTitle && sDesc) {
                sTitle.textContent = part.getAttribute('data-title');
                sDesc.textContent = part.getAttribute('data-desc');
            }
        });

        part.addEventListener('mouseleave', () => {
            if(sTitle && sDesc) {
                sTitle.textContent = '把鼠标移到左侧软件界面上...';
                sDesc.textContent = '探索指挥室的各个功能大区。';
            }
        });
    });

    // Slicing Demo Logic
    const layerContainer = document.getElementById('layer-container');
    const slider = document.getElementById('slice-slider');
    const layerCount = document.getElementById('layer-count');
    
    const TOTAL_LAYERS = 100;
    const layers = [];

    if (layerContainer && slider) {
        // Generate layers
        for (let i = 0; i < TOTAL_LAYERS; i++) {
            const layer = document.createElement('div');
            layer.classList.add('slice-layer');
            // Scale and border radius to make a sphere-like shape cut in half
            // Max radius at middle, min at top and bottom
            let progress = i / TOTAL_LAYERS;
            // Parabola formula for circle cross-section
            let scale = Math.sin(progress * Math.PI); 
            // Add minimum scale so it doesn't disappear completely at edges
            scale = scale * 0.8 + 0.2;
            
            layer.style.transform = `translateZ(${i * 2}px) scale(${scale})`;
            layerContainer.appendChild(layer);
            layers.push(layer);
        }

        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            layerCount.textContent = val;
            
            layers.forEach((layer, index) => {
                if (index < val) {
                    layer.style.opacity = '1';
                } else {
                    layer.style.opacity = '0';
                }
            });
        });
    }
});
