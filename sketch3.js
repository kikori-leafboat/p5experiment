let boids = [100];
let foods = new Array();

function setup() {
  createCanvas(600, 600);
  frameRate(30);
  textFont("Hannari");

  for(let i = 0; i < 100; i++) {
    boids[i] = new Boid(random(width), random(height));
    if (i < 6) {
        boids[i].size = random(12, 20);
    }
  }
}

function seperation(current){
    // END PROCEDURE
    let steer = createVector(0, 0);
    let count = 0;
    for (let b of boids) {
        if(b != current) {
            if (b.location.dist(current.location) < 20 + b.r) {
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
    for (let b of boids) {
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
    let count = 0;
    for (let b of boids) {
        if(b != current) {
            steer.add(b.velocity);
        }
    }

    steer.div(boids.length - 1);

    return p5.Vector.sub(current.location, steer.div(8));
}

function draw() {
    background(0, 89, 124);

    if (mouseIsPressed){
        foods.push(new Food(mouseX, mouseY, 5));
    }

    let velocity = createVector(0, 0);

    for (let b of boids) {
        let alignment = this.alignment(b);
        alignment.normalize();
        alignment.mult(0.5);
        b.velocity.add(alignment);

        let seperation = this.seperation(b);
        seperation.normalize();
        seperation.mult(1);
        b.velocity.add(seperation);

        let cohesion = this.cohesion(b);
        cohesion.normalize();
        cohesion.mult(0.9);
        b.velocity.add(cohesion);

        if (b.target != undefined) {
            let userInteractionDirection = p5.Vector.sub(b.target.location, b.location);
            userInteractionDirection.normalize();
            userInteractionDirection.mult(0.5);
            b.velocity.add(userInteractionDirection);

        }else if (foods.length > 0) {
            let target = foods[ceil(random(0, foods.length-1))].location;
            let userInteractionDirection = p5.Vector.sub(target, b.location);
            userInteractionDirection.normalize();
            userInteractionDirection.mult(0.5);
            b.velocity.add(userInteractionDirection);
            
        } else {
            let userInteraction = createVector(mouseX, mouseY);
            let userInteractionDirection = p5.Vector.sub(userInteraction, b.location);
            userInteractionDirection.normalize();
            userInteractionDirection.mult(0.5);
            b.velocity.add(userInteractionDirection);
        }

        if(b.location.x > 600) {
            b.location.x = 600;
            b.velocity.add(createVector(-3, 0));
        }

        if(b.location.y > 600) {
            b.location.y = 600;
            b.velocity.add(createVector(0, -3));
        }

        if(b.location.x < 0) {
            b.location.x = 0;
            b.velocity.add(createVector(3, 0));
        }

        if(b.location.y < 0) {
            b.location.y = 0;
            b.velocity.add(createVector(0, 3));
        }
        b.velocity.limit((b.velocityLimit + map(noise(0, 0), 0, 1, 0.1,  map(b.size, 5, 20, 10, 5)))/1.8);
        
        b.location.add(b.velocity);
        textSize(b.size);
        b.render();

        for(let i = 0; i < foods.length; i++) {
            let f = foods[i];
            f.location.add(createVector(0, 0.008));
            if(p5.Vector.dist(f.location, b.location) - f.size - b.r < 1) {
                f.size -= 0.1;
            };

            if(f.size < 0.1) {
                foods.splice(i, 1);
            }

            if (f.location.y > 600) {
                foods.splice(i, 1);
            }
        }
    }


    for(let f of foods) {
        f.render();
    }


}