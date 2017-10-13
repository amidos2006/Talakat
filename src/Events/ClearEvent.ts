/// <reference path="GameEvent.ts"/>

namespace Talakat{
    export class ClearEvent implements GameEvent{
        name:string;

        constructor(name:string){
            this.name = name;
        }

        apply(world:World, x:number, y:number): void {
            if(this.name.toLowerCase() == "bullet"){
                (world).removeAllBullets();
            }
            else if(this.name.toLowerCase() == "spawner"){
                (world).removeAllSpawners();
            }
            else{
                (world).removeSpawners(this.name.toLowerCase());
            }
        }
    }
}