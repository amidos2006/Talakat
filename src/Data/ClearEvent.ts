/// <reference path="GameEvent.ts"/>

class ClearEvent implements GameEvent{
    name:string;

    constructor(name:string){
        this.name = name;
    }

    apply(world:World, x:number, y:number): void {
        if(this.name.toLowerCase() == "bullet"){
            (<GameWorld>world).removeAllBullets();
        }
        else if(this.name.toLowerCase() == "spawner"){
            (<GameWorld>world).removeAllSpawners();
        }
        else{
            (<GameWorld>world).removeSpawners(this.name.toLowerCase());
        }
    }
}