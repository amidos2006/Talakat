/// <reference path="../Data/Point.ts"/>
/// <reference path="MovementPattern.ts"/>

namespace Talakat {
    export class LinePattern implements MovementPattern {
        private direction: number;
        private speedMag: number;
        private speed: Point;

        constructor(speed: number, direction: number) {
            this.speed = new Point(speed * Math.cos(direction * Math.PI / 180),
                speed * Math.sin(direction * Math.PI / 180));
            this.speedMag = speed;
            this.direction = direction;
        }

        adjustParameters(newValues: any[]): void {
            this.speed = new Point(newValues[0] * Math.cos(newValues[1] * Math.PI / 180),
                newValues[0] * Math.sin(newValues[1] * Math.PI / 180));
            this.speedMag = newValues[0];
            this.direction = newValues[1];
        }

        getParameters(): any[] {
            return [this.speedMag, this.direction];
        }

        getNextValues(x: number, y: number, radius: number, color: number): any {
            return {
                "x": x + this.speed.x,
                "y": y + this.speed.y,
                "radius": radius,
                "color": color
            };
        }
    }
}