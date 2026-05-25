document.addEventListener('DOMContentLoaded', () => {
    const lockBtn = document.getElementById('lock-btn');
    const demoCyl = document.getElementById('demo-cyl');
    const valZ = document.getElementById('val-z');
    const valX = document.getElementById('val-x');
    const valY = document.getElementById('val-y');

    if(lockBtn) {
        lockBtn.addEventListener('click', () => {
            lockBtn.classList.toggle('unlocked');
            
            if(lockBtn.classList.contains('unlocked')) {
                lockBtn.textContent = '🔓 已解锁 (自由缩放)';
                demoCyl.classList.add('unlocked-flat');
                valZ.textContent = '4';
                // X and Y remain 50
            } else {
                lockBtn.textContent = '🔒 锁定中 (等比缩放)';
                demoCyl.classList.remove('unlocked-flat');
                valZ.textContent = '50';
            }
        });
    }
});
