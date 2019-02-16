/**
 * yu no suisou
 *
 * @copyright: (C) 2019 kikori-leafboat, All Rights Reserved.
 * @author:    kikori-leafboat https://kikori-leafboat.github.io/
 * @version:   1.0.0
 *
 */
document.querySelector("#i-char").addEventListener('change', (event) => {
   if (event.target.value) {
        config.boidText = event.target.value;
   } else {
        config.boidText = "ゆ";
   }
});

let config = {
    boidText: "ゆ",
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
            b: 99
        },
        food: {
            h: 54,
            s: 50,
            b: 100
        }
    },
    boid: {
        number: 40,
        seperationDist: 10,
        alignmentDampingNum: 8,
        movementWeight: {
            alignment: 0.7,
            seperation: 0.95,
            cohesion: 0.9,
            disire: 0.9
        },
        size: {
            min: 20,
            max: 50
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

  let currentBoss = new Boid(random(width), random(height));
  boids[0] = currentBoss;
  for(let i = 1; i < config.boid.number; i++) {
    boids[i] = new Boid(random(width), random(height));
    // if(i % 9 == 0) {
    //     currentBoss = boids[i];
    //     boids[i].target = currentBoss.location;
    // } else {
    //     boids[i].boss = currentBoss;
    //     boids[i].target = currentBoss.location;
    // }

    if(i % 8 == 0) {
        boids[i] = new Boid(random(width), random(height), random(15, 20));
    }
  }
}

function seperation(current){
    let steer = createVector(0, 0);
    let count = 0;

    // for (let b of boids) {
    let range = new Circle(current.x, current.y, current.r * 5);
    let founded = qtree.query(range);

    for (let b of founded) {
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

    let range = new Circle(current.x, current.y, current.r * 5);
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
    let range = new Circle(current.x, current.y, current.r * 5);
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
    if (mouseIsPressed && foods.length < 30){
        foods.push(new Food(mouseX, mouseY, 5));
    }
}

function initializeQuadTree() {
    // x, y, w, h
    let boundary = new Rectangle(width/2, height/2, width/2, height/2);
    qtree = new QuadTree(boundary, 4);
}

function renderGradationFrame(h, s, b, size) {
    fill(h, s, b, 0.3);
    rect(0, 0, width, size);
    rect(0, height - size, width, size);
    rect(0, 0, size, height);
    rect(width - size, 0, size, height);
}

function draw() {
    this.handleUserInteraction();
    this.paintBackground();
    this.initializeQuadTree();
    
    // rect(height - 20, 20, width, 20);
    
    let randomTarget = [
        createVector(random(0, width/2),random(0, height/2))
        ,createVector(random(width/2, width),random(height/2, height))
        ,createVector(random(width/2, width),random(0, height/2))
        ,createVector(random(0, width/2),random(height/2, height))];

    for (let b of boids) {
        // store each position in quad tree
        let point = new Point(b.location.x, b.location.y, b);
        qtree.insert(point);
    }

    // qtree.show();

    for (let i = 0; i < boids.length; i++) {
        let b = boids[i];

        b.addAccelaration(this.alignment(b), config.boid.movementWeight.alignment);
        b.addAccelaration(this.seperation(b), config.boid.movementWeight.seperation);
        b.addAccelaration(this.cohesion(b), config.boid.movementWeight.cohesion);

        if (b.target == undefined || p5.Vector.dist(b.target, b.location) < 1 + b.r * 2) {

            if (foods.length > 0) {
                b.target = foods[ceil(random(0, foods.length-1))].location
            } else {
                b.target = randomTarget[ceil(random(0, randomTarget.length-1))];
            }
        }

        if (b.target) {
            b.addAccelaration(p5.Vector.sub(b.target, b.location), 0.8);
        }

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

    this.renderGradationFrame(197, 100, 40, 17);
    this.renderGradationFrame(197, 100, 30, 12);
    this.renderGradationFrame(197, 100, 20, 5);

}