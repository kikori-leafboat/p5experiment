let boundary = new Rectangle(200, 200, 200, 200);
var qt = new QuadTree(boundary, 4);
function setup() {
  // put setup code here
  createCanvas(400, 400);
  background(255);
  console.log(qt);

  for(let i = 0; i < 50; i++) {
    let p = new Point(randomGaussian(width/2, width/8), randomGaussian(height/2, height/8));
    qt.insert(p);
  }

  // background(0);
  // qt.show();

}

function draw() {
  // if(mouseIsPressed) {
  //   let m = new Point(mouseX, mouseY);
  //   qt.insert(m);
  // }
  // qt.show();


  background(0);
  qt.show();

  let range = new Rectangle(mouseX, mouseY, 55, 55);
  noFill();
  stroke(0, 255, 0);
  rectMode(CENTER);
  rect(range.x, range.y, range.w * 2, range.h * 2);
  let foundPoints = [];
  qt.query(range, foundPoints);
  console.log(foundPoints);

  strokeWeight(4);
  for (let p of foundPoints) {
    point(p.x, p.y);
  }
  strokeWeight(1);
}