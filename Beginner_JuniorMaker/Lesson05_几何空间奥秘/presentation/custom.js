document.addEventListener('DOMContentLoaded', () => {
    // Cut Demo Logic
    const btnCut = document.getElementById('btn-cut');
    const btnReset = document.getElementById('btn-reset');
    const cutViewport = document.getElementById('cut-viewport');

    if(btnCut && btnReset && cutViewport) {
        btnCut.addEventListener('click', () => {
            cutViewport.classList.add('is-cut');
        });

        btnReset.addEventListener('click', () => {
            cutViewport.classList.remove('is-cut');
        });
    }

    // Dowel Assemble Logic
    const btnAssemble = document.getElementById('btn-assemble');
    const dowelViewport = document.querySelector('.dowel-viewport');

    if(btnAssemble && dowelViewport) {
        btnAssemble.addEventListener('click', () => {
            dowelViewport.classList.toggle('is-assembled');
            if(dowelViewport.classList.contains('is-assembled')) {
                btnAssemble.textContent = '🧩 拆分开来看看内部孔位';
            } else {
                btnAssemble.textContent = '🔧 销钉拼装演示';
            }
        });
    }
});
