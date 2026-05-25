document.addEventListener('DOMContentLoaded', () => {
    // Expose function for inline HTML onclick handlers
    window.simulateColor = function(type) {
        const timeDisplay = document.getElementById('time-display');
        const wasteDisplay = document.getElementById('waste-display');
        const timeBoard = document.querySelector('.time-board');
        const vLayer = document.querySelector('.v-layer');
        const vVertical = document.querySelector('.v-vertical');

        if(type === 'good') {
            timeBoard.classList.remove('is-bad');
            timeDisplay.textContent = '01:18:00';
            wasteDisplay.textContent = '2 g';
            
            // Just a tiny bump in time and waste
        } else if (type === 'bad') {
            timeBoard.classList.add('is-bad');
            timeDisplay.textContent = '22:45:00';
            wasteDisplay.textContent = '185 g';
            
            // Trigger giant prime tower animation
            vVertical.classList.add('is-active');
        }
    };
});
