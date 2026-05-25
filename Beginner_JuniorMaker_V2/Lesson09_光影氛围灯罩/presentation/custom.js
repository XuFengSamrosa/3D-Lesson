document.addEventListener('DOMContentLoaded', () => {
    // Polar Snap Demo
    const btnSnap = document.getElementById('btn-snap-45');
    const pCursor = document.getElementById('p-cursor');
    let currentAngle = 0;

    if(btnSnap && pCursor) {
        btnSnap.addEventListener('click', () => {
            currentAngle += 45;
            pCursor.style.transform = `rotate(${currentAngle}deg)`;
            if(currentAngle >= 360) currentAngle = 0;
        });
    }

    // Hierarchy Orbit Demo
    const btnGroup = document.getElementById('btn-group');
    const orbitC = document.getElementById('orbit-c');
    const hScene = document.querySelector('.h-scene');
    const hStatus = document.getElementById('h-status');

    if(btnGroup && orbitC) {
        btnGroup.addEventListener('click', () => {
            orbitC.classList.toggle('is-grouped');
            hScene.classList.toggle('is-grouped');
            
            if(orbitC.classList.contains('is-grouped')) {
                btnGroup.textContent = '🔄 解除组装 (模拟错误)';
                btnGroup.style.background = '#e74c3c';
                
                hStatus.className = 'status-box ok mb-4';
                hStatus.innerHTML = '<h4>✅ 完美公转</h4><p>花纹已经成为主筒的附属品，完美地围绕中心原点(128,128)做圆周运动！</p>';
            } else {
                btnGroup.textContent = '施法：将花纹与主筒组装绑定！';
                btnGroup.style.background = '#3498db';
                
                hStatus.className = 'status-box mb-4';
                hStatus.innerHTML = '<h4>❌ 独立个体自转</h4><p>花纹没有和主筒组装，它只会原地打转或者乱飞！</p>';
            }
        });
    }
});
