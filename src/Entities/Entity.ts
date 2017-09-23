interface Entity{
    x:number;
    y:number;
    
    clone():Entity;
    getCollider():Collider;
    update():void;
    draw():void;
}