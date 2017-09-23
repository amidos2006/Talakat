/// <reference path="Entity.ts"/>

class Boss implements Entity{
    x: number;
    y: number;

    private script:GameScript;
    
    private health:number;
    private maxHealth:number;

    constructor(){
        this.script = new GameScript();
    }

    initialize(script:any):void{
        this.x = width / 2;
        this.y = height / 4;
        this.maxHealth = 3000;
        if("health" in script){
            this.maxHealth = parseInt(script["health"]);
        }
        if("position" in script){
            let parts:string[] = script["position"].split(",");
            if(parts.length >= 1){
                this.x = parseInt(parts[0]);
            }
            if(parts.length >= 2){
                this.y = parseInt(parts[1]);
            }
        }
        if("script" in script){
            this.script.initialize(script["script"]);
        }
        this.health = this.maxHealth;
    }

    clone(): Entity {
        let boss:Boss = new Boss();
        boss.x = this.x;
        boss.y = this.y;
        boss.health = this.health;
        boss.maxHealth = this.maxHealth;
        boss.script = this.script.clone();
        return boss;
    }

    getCollider(): Collider {
        return null;
    }

    getHealth():number{
        return this.health / this.maxHealth;
    }
    
    update(): void {
        this.health -= 1;
        if(this.health < 0){
            this.health = 0;
        }
        this.script.update(this.x, this.y, 100 * this.health / this.maxHealth);
    }

    draw(): void {
        
    }
}