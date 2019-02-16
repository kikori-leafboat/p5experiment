class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = random(1, 12);
        this.highlight = false;
        this.nextStepX = random(-1, 1);
        this.nextStepY = random(-1, 1);
        this.weight = random(0.01, 5);
        this.colorR = random(50, 220);
        this.colorG = random(50, 255);
        this.colorB = random(50, 255);
        
        
    }

    move() {
        this.x += this.nextStepX;
        this.y += this.nextStepY;
    }

    render() {
        noStroke();

            fill(this.colorR - noise(frameCount) * 3, 
            this.colorG - noise(frameCount + 1) * 3,
            this.colorB - noise(frameCount + 2) * 3);
        ellipse(this.x, this.y, this.r);
        fill(0);
    }
}