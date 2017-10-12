namespace Talakat{
    export interface Entity{
        x:number;
        y:number;
        
        clone():Entity;
        getCollider():Collider;
        update(world:World):void;
        draw():void;
    }
}