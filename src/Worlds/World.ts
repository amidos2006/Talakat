namespace Talakat{
    export interface World{
        clone():World;
        isWon():boolean;
        isLose():boolean;
        checkCollision(entity:Entity):void;
        addEntity(entity:Entity):void;
        removeEntity(entity:Entity):void;
        update(action:any):void;
        draw():void;
    }
}