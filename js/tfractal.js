class TFractal {
    constructor() {
        this.field = [];
        this.maxIter = 0;
    }

    process(iter, seed) {
        const seedSize = seed.length;
        const step = Math.pow(2, iter);
        
        for (let dx = 0; dx < Math.pow(2, this.maxIter - iter); dx++) {
            for (let dy = 0; dy < Math.pow(2, this.maxIter - iter); dy++) {
                for (let x = 0; x < seedSize; x++) {
                    for (let y = 0; y < seedSize; y++) {
                        const blockValue = seed[y][x] ? 1 : 0;
                        const startX = (x + dx * seedSize) * step;
                        const startY = (y + dy * seedSize) * step;
                        
                        for (let i = 0; i < step; i++) {
                            for (let j = 0; j < step; j++) {
                                if (startX + i < this.field.length && startY + j < this.field[0].length) {
                                    this.field[startY + j][startX + i] += blockValue;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        if (iter > 0) {
            this.process(iter - 1, seed);
        }
    }
    
    generate(iterations, seed) {
        this.maxIter = iterations;
        const size = Math.pow(2, iterations) * seed.length;
        this.field = Array(size).fill().map(() => Array(size).fill(0));
        this.process(iterations, seed);
        return this.field;
    }
}