class Food {
    constructor(x, y, size) {
        this.location = createVector(x, y);
        this.size = size;
    }
    render() {
        noStroke();
        fill(54, 50, 100);
        ellipse(this.location.x, this.location.y, this.size);
    }
}

class Boid {
    constructor(x, y, size) {
        this.location = createVector(x, y);
        this.z = random(0, 50);
        this.accelaration = createVector(x, y);
        this.angle = 0;
        if (size) {
            this.size = size;
        } else {
            this.size = random(8, 15);
        }
        this.r = map(this.size, 5, 20, 3, 5);
        this.accelarationLimit = random(0.1, map(this.size, 5, 20, 1, 2));
        this.target = undefined;
        if (size % 3 == 1) {
            this.color = createVector(197, 5, 95);
        } else {
            this.color = createVector(197, 10, 97);
        }
        this.boss = undefined;
    }

    addAccelaration(velocity, weight = 1) {
        if (!velocity)
            return;

        velocity.normalize();
        velocity.mult(weight);
        this.accelaration.add(velocity);
    }

    move() {
        // the smaller, the faster
        let randomAccelaration = map(noise(0, 0), 0, 1, 0.1, map(this.size, 
            config.boid.size.min, config.boid.size.max,
            config.boid.accelaration.max, config.boid.accelaration.min));

        this.accelaration.limit(this.accelarationLimit + randomAccelaration + map(this.z, -100, +100, 3, -2) - map(this.size, 1, 50, 0, 1));
        this.location.add(this.accelaration);
        this.z += sin(frameCount - noise(this.location.x, this.location.y)) + random(-1, 1) * noise(this.location.x, this.location.y);
    }

    render() {
        textSize(this.size - this.z/40);
        fill(this.color.x, this.color.y, this.color.z - this.z);
        noStroke();
        //let radian = -atan2(location.x - trianglePosition.x, location.y - trianglePosition.y)
        // let radian = -atan2(location.x - trianglePosition.x, location.y - trianglePosition.y)
        text("ゆ", this.location.x, this.location.y);
        // ellipse(this.location.x, this.location.y, this.r);
    }
}