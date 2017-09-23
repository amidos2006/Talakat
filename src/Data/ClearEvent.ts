/// <reference path="GameEvent.ts"/>

class ClearEvent implements GameEvent{
    name:string;

    constructor(name:string){
        this.name = name;
    }

    apply(x:number, y:number): void {
        if(this.name.toLowerCase() == "bullet"){
            (<GameWorld>currentWorld).removeAllBullets();
        }
        else if(this.name.toLowerCase() == "spawner"){
            (<GameWorld>currentWorld).removeAllSpawners();
        }
        else{
            (<GameWorld>currentWorld).removeSpawners(this.name.toLowerCase());
        }
    }
}