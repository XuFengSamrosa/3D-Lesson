document.addEventListener('DOMContentLoaded', () => {
    // Merge Demo (Add vs Double Click)
    const btnAdd = document.getElementById('btn-add');
    const btnDouble = document.getElementById('btn-double');
    const workspace = document.getElementById('workspace');
    const alertBox = document.getElementById('alert-box');

    if(btnAdd && btnDouble && workspace) {
        btnAdd.addEventListener('click', () => {
            alertBox.classList.remove('show');
            workspace.classList.add('added');
            btnAdd.textContent = '✅ 添加成功';
            setTimeout(() => { btnAdd.textContent = '➕ 添加模型'; }, 2000);
        });

        btnDouble.addEventListener('click', () => {
            workspace.classList.remove('added');
            alertBox.classList.add('show');
        });
    }

    // X-Ray Toggle
    const modeNormal = document.getElementById('mode-normal');
    const modeXray = document.getElementById('mode-xray');
    const xrayViewport = document.getElementById('xray-viewport');

    if(modeNormal && modeXray && xrayViewport) {
        modeNormal.addEventListener('change', () => {
            if(modeNormal.checked) {
                xrayViewport.classList.remove('is-xray');
            }
        });

        modeXray.addEventListener('change', () => {
            if(modeXray.checked) {
                xrayViewport.classList.add('is-xray');
            }
        });
    }
});
