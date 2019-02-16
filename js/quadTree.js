
class Point {
    constructor(x, y, userData) {
        this.x = x;
        this.y = y;
        this.userData = userData;
    }

}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return (point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h);
    }

    intersects(range) {
        return !(range.x - range.w > this.x + this.w ||
        range.x + range.w < this.x - this.w ||
        range.y - range.h > this.y + this.h ||
        range.y + range.h < this.y - this.h )
    }
}

class Circle {
    constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.rSquared = this.r * this.r;
    }
  
    contains(point) {
      // check if the point is in the circle by checking if the euclidean distance of
      // the point and the center of the circle if smaller or equal to the radius of
      // the circle
      let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2);
      return d <= this.rSquared;
    }
  
    intersects(range) {
  
      let xDist = Math.abs(range.x - this.x);
      let yDist = Math.abs(range.y - this.y);
  
      // radius of the circle
      let r = this.r;
  
      let w = range.w;
      let h = range.h;
  
      let edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);
  
      // no intersection
      if (xDist > (r + w) || yDist > (r + h))
        return false;
  
      // intersection within the circle
      if (xDist <= w || yDist <= h)
        return true;
  
      // intersection on the edge of the circle
      return edges <= this.rSquared;
    }
  }
  


class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.devided = false;
    }

    subdevide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let ne = new Rectangle(x + w/2, y - h/2, w/2, h/2);
        let nw = new Rectangle(x - w/2, y - h/2, w/2, h/2);
        let se = new Rectangle(x + w/2, y + h/2, w/2, h/2);
        let sw = new Rectangle(x - w/2, y + h/2, w/2, h/2);
        
        this.northeast = new QuadTree(ne, this.capacity);
        this.northwest = new QuadTree(nw, this.capacity);
        this.southeast = new QuadTree(se, this.capacity);
        this.southwest = new QuadTree(sw, this.capacity);

        this.devided = true;
        
    }

    insert(point) {

        if(!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;

        } else {
            if (!this.devided) {
                this.subdevide();
            }

            if(this.northeast.insert(point)) {
                return true;
            }

            if(this.northwest.insert(point)) {
                return true;
            }
            
            if(this.southeast.insert(point)) {
                return true;
            }

            if(this.southwest.insert(point)) {
                return true;
            }

        }
    }

    query(range, found) {

        if (!found) {
            found = [];
        }

        if (!this.boundary.intersects(range)) {
            return;
        }

        for (let p of this.points) {
            if (range.contains(p)) {
                found.push(p);
            }
        }

        if (this.devided) {
            // Add any of the points of the children
            this.northeast.query(range, found);
            this.northwest.query(range, found);
            this.southeast.query(range, found);
            this.southwest.query(range, found);
        }

        return found;
    }

    show() {
        stroke(255);
        noFill();
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);

        fill(255);
        strokeWeight(2);
        for(let i = 0; i < this.points.length; i++) {
            point(this.points[i].x, this.points[i].y);
        }
        strokeWeight(1);
        if (this.devided) {
            this.northeast.show();
            this.northwest.show();
            this.southeast.show();
            this.southwest.show();
        }
    }
}