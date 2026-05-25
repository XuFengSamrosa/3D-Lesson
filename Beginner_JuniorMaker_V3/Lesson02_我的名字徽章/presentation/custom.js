document.addEventListener('DOMContentLoaded', () => {
    // Boolean Engrave Demo has been replaced with CSS 3D blocks

    // Infill Slider Demo
    const slider = document.getElementById('infill-slider');
    const valDisplay = document.getElementById('infill-val');
    const infillCube = document.getElementById('cube-infill');

    if (slider && infillCube && valDisplay) {
        // Map 5% - 50% to grid size 100px - 10px
        slider.addEventListener('input', (e) => {
            const percentage = parseInt(e.target.value);
            valDisplay.textContent = percentage;
            
            // At 5%, grid size is 100px (very sparse)
            // At 50%, grid size is 10px (very dense)
            const minSize = 10;
            const maxSize = 100;
            const minPct = 5;
            const maxPct = 50;
            
            // Linear mapping
            const gridSize = maxSize - ((percentage - minPct) / (maxPct - minPct)) * (maxSize - minSize);
            
            infillCube.style.backgroundSize = `${gridSize}px ${gridSize}px`;
        });
        
        // Init
        slider.dispatchEvent(new Event('input'));
    }
});
