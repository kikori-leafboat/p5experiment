let config = {
    frameRate: 30,
    fontName: "Hannari",
    gravity: 0.008,
    canvasSize: {
        x: document.getElementById("main").clientWidth,
        y: document.getElementById("main").clientHeight
    },
    wallPushBackForce: 3,
    color: {
        background: {
            h: 197,
            s: 100,
            b: 49
        },
        foreground: {
            h:197,
            s: 5,
            b: 95
        },
        food: {
            h: 54,
            s: 50,
            b: 100
        }
    },
    boid: {
        number: 80,
        seperationDist: 10,
        alignmentDampingNum: 8,
        movementWeight: {
            alignment: 0.7,
            seperation: 1.2,
            cohesion: 0.9,
            disire: 0.9
        },
        size: {
            min: 5,
            max: 20
        },
        accelaration: {
            min: 2,
            max: 2.5
        }
    }
};

let boids = [config.boid.number];
let foods = new Array();
let qtree;

function setup() {
  colorMode(HSB);
  createCanvas(config.canvasSize.x, config.canvasSize.y);
  frameRate(config.frameRate);
  textFont(config.fontName);

  for(let i = 0; i < config.boid.number; i++) {
    boids[i] = new Boid(random(width), random(height));
    if(i % 8 == 0) {
        boids[i] = new Boid(random(width), random(height), random(15, 20));
    }
  }
}

function seperation(current){
    let steer = createVector(0, 0);
    let count = 0;

    for (let b of boids) {
        if(b != current) {
            if (b.location.dist(current.location) < config.boid.seperationDist + b.r * 2) {
                let direction = p5.Vector.sub(current.location, b.location);
                steer.add(direction);
                count++;
            }
        }
    }

    if(count == 0)
        return createVector();

    return steer.div(count);

}

function cohesion(current){

    let steer = createVector(0, 0);

    let range = new Circle(current.x, current.y, current.r * 2);
    let founded = qtree.query(range);

    for (let b of founded) {
        if(b != current) {
            steer.add(b.position);
        }
    }

    let centerOfMass = steer.div(boids.length - 1);
    centerOfMass.sub(current.location);
    return centerOfMass;
}

function alignment(current){
    let steer = createVector(0, 0);
    let range = new Circle(current.x, current.y, current.r * 2);
    let founded = qtree.query(range);
    for (let b of founded) {
        if(b != current) {
            steer.add(b.velocity);
        }
    }

    steer.div(boids.length - 1);

    return p5.Vector.sub(current.location, steer.div(config.boid.alignmentDampingNum));
}

function paintBackground() {
    background(config.color.background.h, config.color.background.s, config.color.background.b);
}

function handleUserInteraction() {
    if (mouseIsPressed){
        foods.push(new Food(mouseX, mouseY, 5));
    }
}

function initializeQuadTree() {
    let boundary = new Rectangle(300, 300, 300, 300);
    qtree = new QuadTree(boundary, 4);
}

function draw() {
    this.handleUserInteraction();
    this.paintBackground();
    this.initializeQuadTree();

    let target = undefined;
    if (foods.length > 0) {
        target = foods[ceil(random(0, foods.length-1))].location;
    } else {
        target = createVector(random(0, width),random(0, height));
    }

    for (let b of boids) {

        // store each position in quad tree
        let point = new Point(b.x, b.y, b);
        qtree.insert(point);

        b.addAccelaration(this.alignment(b), config.boid.movementWeight.alignment);
        b.addAccelaration(this.seperation(b), config.boid.movementWeight.seperation);
        b.addAccelaration(this.cohesion(b), config.boid.movementWeight.cohesion);
        
        if (b.target == undefined) {
            b.target = target;
        } else if (p5.Vector.dist(b.target, b.location) < 1 + b.r * 2) {
            b.target = target;
        }

        b.addAccelaration(p5.Vector.sub(b.target, b.location), 0.8);

        if(b.location.x > config.canvasSize.x) {
            b.location.x = config.canvasSize.x;
            b.addAccelaration(createVector(config.wallPushBackForce * -1, 0), 1);
        }

        if(b.location.y > config.canvasSize.y) {
            b.location.y = config.canvasSize.y;
            b.addAccelaration(createVector(0, config.wallPushBackForce * -1), 1);
        }

        if(b.location.x < 0) {
            b.location.x = 0;
            b.addAccelaration(createVector(config.wallPushBackForce, 0), 1);
        }

        if(b.location.y < 0) {
            b.location.y = 0;
            b.addAccelaration(createVector(0, config.wallPushBackForce), 1);
        }
        
        b.move();
        b.render();

        for(let i = 0; i < foods.length; i++) {
            let f = foods[i];
            f.location.add(createVector(0, config.gravity));
            if(p5.Vector.dist(f.location, b.location) - f.size * 2 - b.r * 2 < 1) {
                f.size -= 0.1;
                if (b.size < 30) {
                    b.size += 0.05;
                    b.r += 0.005;
                } else {
                    b.size += 0.01;
                    b.r += 0.001;
                }
            };
        }

        for(let i = 0; i < foods.length; i++) {
            let f = foods[i];
            if(f.size < 0.1) {
                foods.splice(i, 1);
            }

            if (f.location.y > config.canvasSize.y) {
                foods.splice(i, 1);
            }
            f.render();
        }
    }

}