class Point{
    x:number;
    y:number;

    constructor(x:number=0, y:number=0){
        this.x = x;
        this.y = y;
    }

    add(x:number=0, y:number=0){
        return new Point(this.x + x, this.y + y);
    }

    subtract(x:number=0, y:number=0):Point{
        return new Point(this.x - x, this.y - y)
    }

    multiply(value:number=1):Point{
        return new Point(this.x * value, this.y * value);
    }

    normalize():Point{
        let mag:number = this.magnitude();
        if(mag > 0){
            return new Point(this.x/mag, this.y/mag);
        }
        return new Point(this.x, this.y);
    }

    magnitude():number{
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}