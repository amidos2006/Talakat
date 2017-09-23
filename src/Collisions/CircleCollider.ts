class CircleCollider implements Collider{
    position:Point;
    radius:number;

    constructor(x:number, y:number, radius:number){
        this.position = new Point(x, y);
        this.radius = radius;
    }

    checkCollision(c:Collider) {
        if(c instanceof CircleCollider){
            let distance:number = c.position.subtract(this.position.x, this.position.y).magnitude();
            let colDist:number = c.radius + this.radius;
            return distance < colDist;
        }
        return false;
    }
}