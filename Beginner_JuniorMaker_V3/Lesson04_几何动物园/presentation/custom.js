document.addEventListener('DOMContentLoaded', () => {
    const btnExplode = document.getElementById('btn-explode');
    const pigModel = document.getElementById('pig-model');
    const formulaBox = document.getElementById('formula-box');

    if(btnExplode) {
        btnExplode.addEventListener('click', () => {
            pigModel.classList.toggle('exploded');
            formulaBox.classList.toggle('show');
            
            if(pigModel.classList.contains('exploded')) {
                btnExplode.textContent = '🔄 组合还原 (组装)';
                btnExplode.style.background = '#2ed573';
                btnExplode.style.boxShadow = '0 10px 20px rgba(46, 213, 115, 0.3)';
            } else {
                btnExplode.textContent = '✨ 施展透视魔法 (拆解)';
                btnExplode.style.background = '#ff4757';
                btnExplode.style.boxShadow = '0 10px 20px rgba(255, 71, 87, 0.3)';
            }
        });
    }

    // Painting Logic
    const colorBtns = document.querySelectorAll('.color-btn');
    const paintParts = document.querySelectorAll('.paintable-pig .part');
    let currentColor = { bg: '#ffcccc', border: '#ff9999' };

    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentColor = {
                bg: btn.getAttribute('data-bg'),
                border: btn.getAttribute('data-border')
            };
        });
    });

    paintParts.forEach(part => {
        part.addEventListener('click', () => {
            const type = part.getAttribute('data-part');
            
            if (type === 'ear') {
                part.style.borderBottomColor = currentColor.bg;
            } else if (type === 'snout') {
                part.style.backgroundColor = currentColor.bg;
                part.style.borderColor = currentColor.border;
            } else {
                part.style.backgroundColor = currentColor.bg;
            }
            
            // Create a small pop effect
            part.style.transform = 'scale(1.1)';
            setTimeout(() => {
                part.style.transform = '';
            }, 150);
        });
    });
});
