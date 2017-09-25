/// <reference path="GameEvent.ts"/>
/// <reference path="SpawnEvent.ts"/>
/// <reference path="ClearEvent.ts"/>

class ConditionalEvent implements GameEvent{
    health: number;
    events:GameEvent[];

    constructor(input:any){
        this.health = 100;
        if("health" in input){
            this.health = 100 * parseFloat(input["health"]);
        }
        this.events = [];
        if("events" in input){
            for(let s of input["events"]){
                
                let parts:string[] = s.split(",");
                let type:string = "";
                let name:string = "";
                let radius:number = 0;
                let phase:number = 0;
                let speed:number=0;
                let direction:number=0;
                if(parts.length >= 1){
                    type = parts[0].toLowerCase();
                }
                if(parts.length >= 2){
                    name = parts[1].toLowerCase();
                }
                if(parts.length >= 3){
                    radius = parseInt(parts[2]);
                }
                if(parts.length >= 4){
                    phase = parseInt(parts[3]);
                }
                if(parts.length >= 5){
                    speed = parseInt(parts[4]);
                }
                if(parts.length >= 6){
                    direction = parseInt(parts[5]);
                }
                if(type == "spawn" || type == "add"){
                    this.events.push(new SpawnEvent(name, radius, phase, speed, direction));
                }
                if(type == "delete" || type == "clear"){
                    this.events.push(new ClearEvent(name));
                }
            }
        }
    }

    apply(world:World, x: number, y: number): void {
        for(let e of this.events){
            e.apply(world, x, y);
        }
    }
}