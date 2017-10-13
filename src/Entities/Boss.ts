/// <reference path="Entity.ts"/>
/// <reference path="../Events/GameScript.ts"/>

namespace Talakat {
    export class Boss implements Entity {
        x: number;
        y: number;

        private script: GameScript;

        private health: number;
        private maxHealth: number;

        constructor() {
            this.script = new GameScript();
        }

        initialize(width:number, height:number, script: any): void {
            this.x = width / 2;
            this.y = height / 4;
            this.maxHealth = 3000;
            if ("health" in script) {
                this.maxHealth = parseInt(script["health"]);
            }
            if ("position" in script) {
                let parts: string[] = script["position"].split(",");
                if (parts.length >= 1) {
                    this.x = parseFloat(parts[0]) * width;
                }
                if (parts.length >= 2) {
                    this.y = parseFloat(parts[1]) * height;
                }
            }
            if ("script" in script) {
                this.script.initialize(script["script"]);
            }
            this.health = this.maxHealth;
        }

        clone(): Entity {
            let boss: Boss = new Boss();
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

        getHealth(): number {
            return this.health / this.maxHealth;
        }

        update(world:World): void {
            this.health -= 1;
            if (this.health < 0) {
                this.health = 0;
            }
            this.script.update(world, this.x, this.y, 100 * this.health / this.maxHealth);
        }
    }
}