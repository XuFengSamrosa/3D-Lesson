document.addEventListener('DOMContentLoaded', () => {
    // Layer Mechanics Demo
    const btnForceStand = document.getElementById('btn-force-stand');
    const btnForceLay = document.getElementById('btn-force-lay');
    const clipStand = document.getElementById('clip-stand');
    const clipLay = document.getElementById('clip-lay');
    const lMsg = document.getElementById('l-msg');

    if(btnForceStand && btnForceLay) {
        btnForceStand.addEventListener('click', () => {
            clipStand.classList.add('is-force');
            clipLay.classList.remove('is-force');
            lMsg.innerHTML = '<strong style="color:#e74c3c">灾难：层纹劈裂！</strong> 站立打印的夹子，受力方向与层纹平行。胶水承受不住拉力，直接断成两截！';
        });

        btnForceLay.addEventListener('click', () => {
            clipLay.classList.add('is-force');
            clipStand.classList.remove('is-force');
            lMsg.innerHTML = '<strong style="color:#2ecc71">坚不可摧！</strong> 侧躺打印的夹子，受力方向与层纹垂直。连续的塑料长丝贯穿受力点，极具韧性！';
        });
    }
});
