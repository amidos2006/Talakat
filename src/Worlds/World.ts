/// <reference path="../Entities/Player.ts"/>
/// <reference path="../Entities/Boss.ts"/>
/// <reference path="../Entities/Bullet.ts"/>
/// <reference path="../Entities/Spawner.ts"/>
/// <reference path="../Entities/Entity.ts"/>
/// <reference path="../Data/Point.ts"/>

namespace Talakat {
    export class World{
        width: number;
        height: number;
        hideUnknown:boolean;

        definedSpawners: any;

        player: Player;
        boss: Boss;
        bullets: Bullet[];
        spawners: Spawner[];

        private created: Entity[];
        private deleted: Entity[];

        constructor(width:number, height:number) {
            this.width = width;
            this.height = height;
            this.hideUnknown = false;
            this.bullets = [];
            this.spawners = [];
            this.created = [];
            this.deleted = [];
        }

        initialize(script: any): void {
            this.player = new Player(this.width / 2, 0.8 * this.height);
            this.player.initialize();
            this.boss = new Boss();
            if ("spawners" in script) {
                this.definedSpawners = {};
                for (let name in script["spawners"]) {
                    this.definedSpawners[name.toLowerCase()] = new Spawner(name.toLowerCase());
                    this.definedSpawners[name.toLowerCase()].initialize(script["spawners"][name]);
                }
            }
            if ("boss" in script) {
                this.boss.initialize(this.width, this.height, script["boss"]);
            }
        }

        clone(hideUnknown:boolean=false): World {
            let newWorld: World = new World(this.width, this.height);
            for (let e of this.bullets) {
                let temp: Entity = e.clone();
                newWorld.bullets.push(<Bullet>temp);
            }
            for (let e of this.spawners) {
                let temp: Entity = e.clone();
                newWorld.spawners.push(<Spawner>temp);
            }
            newWorld.player = <Player>this.player.clone();
            newWorld.boss = <Boss>this.boss.clone();
            newWorld.definedSpawners = this.definedSpawners;
            newWorld.hideUnknown = hideUnknown;
            return newWorld;
        }

        isWon(): boolean {
            if (this.boss == null) {
                return false;
            }
            return this.boss.getHealth() <= 0;
        }

        checkInWorld(x:number, y:number, radius:number):boolean{
            return !(x + radius < 0 || y + radius < 0 ||
                x - radius > this.width || y - radius > this.height);
        }

        isLose(): boolean {
            if (this.player == null) {
                return false;
            }
            return this.player.getLives() <= 0;
        }

        checkCollision(entity: Entity): void {
            let result: boolean = this.player.getCollider().checkCollision(entity.getCollider());
            if (result) {
                this.player.die(this);
            }
        }

        addEntity(entity: Entity): void {
            this.created.push(entity);
        }

        removeEntity(entity: Entity): void {
            this.deleted.push(entity);
        }

        removeAllBullets(): void {
            this.deleted = this.deleted.concat(this.bullets);
        }

        removeAllSpawners(): void {
            this.deleted = this.deleted.concat(this.spawners);
        }

        removeSpawners(name: string): void {
            for (let s of this.spawners) {
                if (name.toLowerCase() == s.name.toLowerCase()) {
                    this.deleted.push(s);
                }
            }
        }

        update(action: Point): void {
            if (this.isLose() || this.isWon()) {
                return;
            }

            if (this.player != null) {
                this.player.applyAction(action);
                this.player.update(this);
            }
            if (this.boss != null) {
                this.boss.update(this);
            }
            if(!this.hideUnknown){
                for (let s of this.spawners) {
                    s.update(this);
                }
            }
            for (let e of this.created) {
                if (e instanceof Bullet) {
                    this.bullets.push(e);
                }
                if (e instanceof Spawner) {
                    this.spawners.push(e);
                }
            }
            this.created.length = 0;
            for (let e of this.deleted) {
                if (e instanceof Bullet) {
                    let index: number = this.bullets.indexOf(e);
                    if (index >= 0) {
                        this.bullets.splice(index, 1);
                    }
                }
                if (e instanceof Spawner) {
                    let index: number = this.spawners.indexOf(e);
                    if (index >= 0) {
                        this.spawners.splice(index, 1);
                    }
                }
            }
            this.deleted.length = 0;
        }
    }
}