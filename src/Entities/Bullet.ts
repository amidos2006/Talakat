/// <reference path="Entity.ts"/>

namespace Talakat {
    export class Bullet implements Entity {
        x: number;
        y: number;

        private radius: number;
        private color: number;
        private pattern: MovementPattern;
        private collider: CircleCollider;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        initialize(speed: number = 4, direction: number = 90, radius: number = 8, color: number = 0xff6666): void {
            this.pattern = new LinePattern(speed, direction);
            this.collider = new CircleCollider(this.x, this.y, this.radius);
            this.radius = radius;
            this.color = color;
        }

        clone(): Entity {
            let b: Bullet = new Bullet(this.x, this.y);
            b.pattern = this.pattern;
            b.collider = this.collider;
            b.radius = this.radius;
            b.color = this.color;
            return b;
        }

        getCollider(): Collider {
            return this.collider;
        }

        update(world: World): void {
            let result = this.pattern.getNextValues(this.x, this.y, this.radius, this.color);
            this.x = result["x"];
            this.y = result["y"];
            this.radius = result["radius"];
            this.color = result["color"];

            this.collider.position.x = this.x;
            this.collider.position.y = this.y;
            this.collider.radius = this.radius;

            if (this.x + this.radius < 0 || this.y + this.radius < 0 ||
                this.x - this.radius > width || this.y - this.radius > height) {
                world.removeEntity(this);
            }

            world.checkCollision(this);
        }

        draw(): void {
            strokeWeight(0);
            fill(color(this.color >> 16 & 0xff, this.color >> 8 & 0xff, this.color >> 0 & 0xff));
            ellipse(this.x, this.y, 2 * this.radius, 2 * this.radius);
            fill(color(255, 255, 255));
            ellipse(this.x, this.y, 1.75 * this.radius, 1.75 * this.radius);
        }
    }
}