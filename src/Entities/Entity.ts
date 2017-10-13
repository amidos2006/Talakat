/// <reference path="../Collisions/Collider.ts"/>
/// <reference path="../Worlds/World.ts"/>

namespace Talakat{
    export interface Entity{
        x:number;
        y:number;
        
        clone():Entity;
        getCollider():Collider;
        update(world:World):void;
    }
}