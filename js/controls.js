let currentSeed = [];

function createSeedGrid(size) {
    const container = document.getElementById('seed-pattern-container');
    container.innerHTML = '';
    
    currentSeed = Array(size).fill().map(() => Array(size).fill(0));
    
    const grid = document.createElement('div');
    grid.className = 'seed-grid';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const cell = document.createElement('div');
            cell.className = 'seed-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            if (size % 2 === 1 && 
                x === Math.floor(size/2) && 
                y === Math.floor(size/2)) {
                cell.classList.add('active');
                currentSeed[y][x] = 1;
            }
            
            cell.addEventListener('click', () => {
                cell.classList.toggle('active');
                currentSeed[y][x] = cell.classList.contains('active') ? 1 : 0;
                generateFractal();
            });
            
            grid.appendChild(cell);
        }
    }
    
    container.appendChild(grid);
}

function getCurrentSeed() {
    return currentSeed;
}

document.addEventListener('DOMContentLoaded', () => {
    const iterSlider = document.getElementById('iter');
    const seedSizeSlider = document.getElementById('seed-size');
    const color1Picker = document.getElementById('color1');
    const color2Picker = document.getElementById('color2');
    const resetBtn = document.getElementById('reset-btn');
    
    const iterValue = document.getElementById('iter-value');
    const seedSizeValue = document.getElementById('seed-size-value');
    
    // Initialize
    iterValue.textContent = params.iterations;
    seedSizeValue.textContent = params.seedSize;
    createSeedGrid(params.seedSize);
    
    // Event handlers
    iterSlider.addEventListener('input', (e) => {
        params.iterations = parseInt(e.target.value);
        iterValue.textContent = params.iterations;
        generateFractal();
    });
    
    seedSizeSlider.addEventListener('input', (e) => {
        params.seedSize = parseInt(e.target.value);
        seedSizeValue.textContent = params.seedSize;
        createSeedGrid(params.seedSize);
        generateFractal();
    });
    
    color1Picker.addEventListener('input', (e) => {
        params.color1 = e.target.value;
        createColorMap();
        needsRedraw = true;
    });
    
    color2Picker.addEventListener('input', (e) => {
        params.color2 = e.target.value;
        createColorMap();
        needsRedraw = true;
    });
    
    resetBtn.addEventListener('click', () => {
        params.iterations = 4;
        params.seedSize = 3;
        params.color1 = '#000931';
        params.color2 = '#00dee6';
        
        iterSlider.value = 4;
        seedSizeSlider.value = 3;
        color1Picker.value = '#000931';
        color2Picker.value = '#00dee6';
        
        iterValue.textContent = '4';
        seedSizeValue.textContent = '3';
        
        createSeedGrid(3);
        generateFractal();
    });
    
    window.addEventListener('resize', () => {
        if (typeof windowResized === 'function') {
            windowResized();
        }
    });
});

function createColorMap() {
    const startColor = hexToRgb(params.color1);
    const endColor = hexToRgb(params.color2);
    
    colorMap = [];
    for (let i = 0; i <= params.maxValue; i++) {
        const factor = params.maxValue > 0 ? i / params.maxValue : 0;
        const r = Math.round(startColor.r + factor * (endColor.r - startColor.r));
        const g = Math.round(startColor.g + factor * (endColor.g - startColor.g));
        const b = Math.round(startColor.b + factor * (endColor.b - startColor.b));
        colorMap.push(color(r, g, b));
    }
}

function hexToRgb(hex) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return { r, g, b };
}