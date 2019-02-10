class Food {
    constructor(x, y, size) {
        this.location = createVector(x, y);
        this.size = size;
    }
    render() {
        stroke(255, 242, 128);
        fill(255, 242, 128);
        ellipse(this.location.x, this.location.y, this.size);
    }
}

class Boid {
    constructor(x, y, size) {
        this.location = createVector(x, y);
        this.velocity = createVector(x, y);
        this.angle = 0;
        if (size) {
            this.size = size;
        } else {
            this.size = random(8, 15);
        }
        this.r = map(this.size, 5, 20, 3, 5);
        // this.velocityLimit = random(0.1, map(size, 5, 20, 4, 0.5));
        this.velocityLimit = random(0.1, map(this.size, 5, 20, 4, 7));
        this.target = undefined;
        if (size % 3 == 1) {
            this.color = createVector(167, 184, 196);
        } else {
            this.color = createVector(222, 240, 247);
        }
    }

    render() {
        fill(this.color.x, this.color.y, this.color.z);
        noStroke();
        //let radian = -atan2(location.x - trianglePosition.x, location.y - trianglePosition.y)
        // let radian = -atan2(location.x - trianglePosition.x, location.y - trianglePosition.y)
        text("ゆ", this.location.x, this.location.y);
        // ellipse(this.location.x, this.location.y, this.r);
    }
}