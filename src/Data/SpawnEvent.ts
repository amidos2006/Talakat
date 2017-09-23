/// <reference path="GameEvent.ts"/>

class SpawnEvent implements GameEvent{
    name:string;
    radius:number;
    phase:number;
    speed:number;
    direction:number;

    constructor(name:string, radius:number, phase:number, speed:number, direction:number){
        this.name = name;
        this.radius = radius;
        this.phase = phase;
        this.speed = speed;
        this.direction = direction;
    }

    apply(x:number, y:number): void {
        let spawned:any = null;
        if(this.name.toLowerCase() == "bullet"){
            spawned = new Bullet(x + this.radius * Math.cos(this.phase), y + this.radius * Math.sin(this.phase));
            spawned.initialize(this.speed, this.direction);
        }
        else{
            spawned = (<GameWorld>currentWorld).definedSpawners[this.name.toLowerCase()].clone();
            spawned.setStartingValues(x + this.radius * Math.cos(this.phase), 
                y + this.radius * Math.sin(this.phase), this.speed, this.direction);
        }
        currentWorld.addEntity(spawned);
    }
}