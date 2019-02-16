let particles = [];
function setup() {
  createCanvas(600, 400);

  background(255);

  let a = random() * 2 * PI;
  let r = 300 * sqrt(random());

  let x = r * cos(a);
  let y = r * sin(a);

  for(let i = 0; i < 1000; i++) {
    particles[i] = new Particle(random(0, 600), random(0, 400));
    // particles[i] = new Particle(200 + x, y + 200);
    // console.log("x:" + x + " y:" + y);
    
  }


}

function draw() {
    
    let boundary = new Rectangle(300, 200, 300, 200);
    let qtree = new QuadTree(boundary, 4);
    
    for(let p of particles) {
        let point = new Point(p.x, p.y, p);
        qtree.insert(point);
    }
    
    for(let p of particles) {
        p.highlight = false;
        let range = new Circle(p.x, p.y, p.r * 2);
        let foundedPoints = qtree.query(range);
        for(let point of foundedPoints) {
            let other = point.userData;

            if (p != other) {
                let d = dist(p.x, p.y, other.x, other.y);
                if (d < p.r / 2 + other.r / 2) {
                    // collided
                    p.nextStepX = (other.x - p.x)/(other.r/2 + p.r/2 - 3);
                    p.nextStepY = (other.y - p.y)/(other.r/2 + p.r/2 - 3);
                    p.colorR += other.colorR/230;
                    p.colorG += other.colorG/230;
                    p.colorB += other.colorB/230;
                    p.r -= 0.01;
                    p.highlight = true;
                }
            }
        }
    }
    background(0);

    for (let p of particles) {
        p.render();
        p.move();
    }


}