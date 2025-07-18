let params = {
    iterations: 4,
    seedSize: 3,
    bgColor: '#070b15',
    color1: '#000931',
    color2: '#00dee6',
    maxValue: 1
};

let tFractal = new TFractal();
let fractalData = [];
let colorMap = [];
let canvasSize;
let needsRedraw = true;

function setup() {
    const container = document.getElementById('canvas-container');
    canvasSize = Math.min(container.offsetWidth, container.offsetHeight) * 0.9;
    const canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent('canvas-container');
    colorMode(RGB, 255);
    noStroke();
    
    generateFractal();
    createColorMap();
}

function draw() {
    if (!needsRedraw) return;
    
    background(params.bgColor);
    
    if (fractalData.length === 0) return;
    
    const cellSize = canvasSize / fractalData.length;
    
    push();
    translate((width - canvasSize) / 2, (height - canvasSize) / 2);
    
    noStroke();
    
    for (let y = 0; y < fractalData.length; y++) {
        for (let x = 0; x < fractalData[0].length; x++) {
            const val = fractalData[y][x];
            fill(colorMap[val]);
            rect(x * cellSize, y * cellSize, cellSize + 1, cellSize + 1);
        }
    }
    
    pop();
    
    needsRedraw = false;
}

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

function generateFractal() {
    const seed = getCurrentSeed();
    fractalData = tFractal.generate(params.iterations, seed);
    params.maxValue = Math.max(...fractalData.flat());
    createColorMap();
    needsRedraw = true;
}

function windowResized() {
    const container = document.getElementById('canvas-container');
    canvasSize = Math.min(container.offsetWidth, container.offsetHeight) * 0.9;
    resizeCanvas(canvasSize, canvasSize);
    needsRedraw = true;
}