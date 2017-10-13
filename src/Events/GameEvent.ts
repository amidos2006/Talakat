namespace Talakat{
    export interface GameEvent{
        apply(world:World, x:number, y:number):void;
    }
}