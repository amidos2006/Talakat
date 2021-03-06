/// <reference path="Entity.ts"/>
/// <reference path="../Collisions/CircleCollider.ts"/>
/// <reference path="../Data/Point.ts"/>

namespace Talakat {
    export class Player implements Entity {
        x: number;
        y: number;
        radius: number;

        private originalX: number;
        private originalY: number;

        private currentLives: number;
        private speed: number;
        private collider: CircleCollider;

        constructor(x: number, y: number, radius: number = 3, speed: number = 4, lives: number = 1) {
            this.x = x;
            this.y = y;
            this.speed = speed;
            this.radius = radius;
            this.currentLives = lives;
        }

        initialize(): void {
            this.originalX = this.x;
            this.originalY = this.y;
            this.collider = new CircleCollider(this.x, this.y, this.radius);
        }

        getCollider(): Collider {
            return this.collider;
        }

        getLives(): number {
            return this.currentLives;
        }

        die(world: World): void {
            this.currentLives -= 1;
            if (this.currentLives > 0) {
                world.removeAllBullets();
                this.x = this.originalX;
                this.y = this.originalY;
            }
        }

        clone(): Entity {
            let p: Player = new Player(this.x, this.y, this.radius, this.speed, this.currentLives);
            p.originalX = this.originalX;
            p.originalY = this.originalY;
            p.collider = this.collider;
            return p;
        }

        applyAction(action: Point): void {
            if (this.currentLives < 0) {
                return;
            }

            let delta: Point = action.multiply(this.speed);
            this.x += delta.x;
            this.y += delta.y;
        }

        update(world:World): void {
            if (this.x - this.radius < 0) {
                this.x = this.radius;
            }
            if (this.y - this.radius < 0) {
                this.y = this.radius;
            }
            if (this.x + this.radius > world.width) {
                this.x = world.width - this.radius;
            }
            if (this.y + this.radius > world.height) {
                this.y = world.height - this.radius;
            }
            this.collider.position.x = this.x;
            this.collider.position.y = this.y;
            this.collider.radius = this.radius;
        }
    }
}