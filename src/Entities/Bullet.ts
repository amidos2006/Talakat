/// <reference path="Entity.ts"/>
/// <reference path="../Movements/LinePattern.ts"/>
/// <reference path="../Collisions/CircleCollider.ts"/>

namespace Talakat {
    export class Bullet implements Entity {
        x: number;
        y: number;
        radius: number;
        color: number;

        private pattern: LinePattern;
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

        update(world:World): void {
            let result = this.pattern.getNextValues(this.x, this.y, this.radius, this.color);
            this.x = result["x"];
            this.y = result["y"];
            this.radius = result["radius"];
            this.color = result["color"];

            this.collider.position.x = this.x;
            this.collider.position.y = this.y;
            this.collider.radius = this.radius;

            if (!world.checkInWorld(this.x, this.y, this.radius)) {
                world.removeEntity(this);
            }

            world.checkCollision(this);
        }
    }
}