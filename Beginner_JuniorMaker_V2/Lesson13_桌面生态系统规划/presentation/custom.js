document.addEventListener('DOMContentLoaded', () => {
    // Current Date for Protocol Paper
    const dateSpan = document.getElementById('current-date');
    if(dateSpan) {
        const today = new Date();
        dateSpan.textContent = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    }

    // Assembly Demo
    const btnAssemble = document.getElementById('btn-assemble');
    const ecoDemo = document.querySelector('.eco-demo');
    if(btnAssemble && ecoDemo) {
        btnAssemble.addEventListener('click', () => {
            ecoDemo.classList.toggle('is-assembled');
            if(ecoDemo.classList.contains('is-assembled')) {
                btnAssemble.textContent = '📦 拆分模块 (各自研发)';
                btnAssemble.style.background = '#e74c3c';
            } else {
                btnAssemble.textContent = '🚀 启动航母：模块化组装！';
                btnAssemble.style.background = '#3498db';
            }
        });
    }

    // Protocol Signature
    const btnSign = document.getElementById('btn-sign');
    const signatures = document.getElementById('signatures');
    if(btnSign && signatures) {
        btnSign.addEventListener('click', () => {
            btnSign.style.display = 'none';
            signatures.classList.add('show');
        });
    }
});
