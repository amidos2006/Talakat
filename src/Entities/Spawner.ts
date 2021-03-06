/// <reference path="Entity.ts"/>
/// <reference path="../Data/ValueModifier.ts"/>
/// <reference path="../Movements/LinePattern.ts"/>

namespace Talakat {
    export class Spawner implements Entity {
        x: number;
        y: number;

        name: string;

        private movement: LinePattern;

        private spawnPattern: string[];
        private patternIndex: number;
        private currentPatternTime: number;
        private totalPatternTime: number;
        private patternRepeat: number;

        private spawnerPhase: ValueModifier;
        private spawnerRadius: ValueModifier;

        private spawnedSpeed: ValueModifier;
        private spawnedNumber: ValueModifier;
        private spawnedAngle: ValueModifier;

        private bulletRadius: ValueModifier;
        private bulletColor: ValueModifier;

        constructor(name: string) {
            this.x = 0;
            this.y = 0;
            this.name = name;
            this.movement = new LinePattern(0, 0);
        }

        setStartingValues(x: number, y: number, speed: number = 0, direction: number = 0): void {
            this.x = x;
            this.y = y;
            this.movement.adjustParameters([speed, direction]);
        }

        initialize(spawner: any): void {
            this.patternIndex = 0;
            this.currentPatternTime = 0;

            this.spawnPattern = [];
            if ("pattern" in spawner) {
                for (let p of spawner["pattern"]) {
                    this.spawnPattern.push(p.toLowerCase())
                }
            }
            if (this.spawnPattern.length == 0) {
                this.spawnPattern.push("bullet");
            }
            this.totalPatternTime = 0;
            if ("patternTime" in spawner) {
                this.totalPatternTime = parseInt(spawner["patternTime"]);
            }
            this.patternRepeat = 0;
            if ("patternRepeat" in spawner) {
                this.patternRepeat = parseInt(spawner["patternRepeat"]);
            }

            this.spawnerPhase = new ValueModifier(0, 360, 0);
            if ("spawnerPhase" in spawner) {
                let parts: string[] = spawner["spawnerPhase"].split(",");
                if (parts.length >= 1) {
                    this.spawnerPhase.minValue = parseFloat(parts[0]);
                }
                if (parts.length >= 2) {
                    this.spawnerPhase.maxValue = parseFloat(parts[1]);
                }
                if (parts.length >= 3) {
                    this.spawnerPhase.rate = parseFloat(parts[2]);
                }
                if (parts.length >= 4) {
                    this.spawnerPhase.timeBetween = parseFloat(parts[3]);
                }
                if (parts.length >= 5) {
                    this.spawnerPhase.type = parts[4].trim().toLowerCase();
                }
            }
            this.spawnerPhase.initialize();

            this.spawnerRadius = new ValueModifier();
            if ("spawnerRadius" in spawner) {
                let parts: string[] = spawner["spawnerRadius"].split(",");
                if (parts.length >= 1) {
                    this.spawnerRadius.minValue = parseFloat(parts[0]);
                }
                if (parts.length >= 2) {
                    this.spawnerRadius.maxValue = parseFloat(parts[1]);
                }
                if (parts.length >= 3) {
                    this.spawnerRadius.rate = parseFloat(parts[2]);
                }
                if (parts.length >= 4) {
                    this.spawnerRadius.timeBetween = parseFloat(parts[3]);
                }
                if (parts.length >= 5) {
                    this.spawnerRadius.type = parts[4].trim().toLowerCase();
                }
            }
            this.spawnerRadius.initialize();

            this.bulletRadius = new ValueModifier(5);
            if ("bulletRadius" in spawner) {
                let parts: string[] = spawner["bulletRadius"].split(",");
                if (parts.length >= 1) {
                    this.bulletRadius.minValue = parseFloat(parts[0]);
                }
                if (parts.length >= 2) {
                    this.bulletRadius.maxValue = parseFloat(parts[1]);
                }
                if (parts.length >= 3) {
                    this.bulletRadius.rate = parseFloat(parts[2]);
                }
                if (parts.length >= 4) {
                    this.bulletRadius.timeBetween = parseFloat(parts[3]);
                }
                if (parts.length >= 5) {
                    this.bulletRadius.type = parts[4].trim().toLowerCase();
                }
            }
            this.bulletRadius.initialize();

            this.bulletColor = new ValueModifier(0xff0000);
            if ("bulletColor" in spawner) {
                let parts: string[] = spawner["bulletColor"].split(",");
                if (parts.length >= 1) {
                    this.bulletColor.minValue = parseFloat(parts[0]);
                }
                if (parts.length >= 2) {
                    this.bulletColor.maxValue = parseFloat(parts[1]);
                }
                if (parts.length >= 3) {
                    this.bulletColor.rate = parseFloat(parts[2]);
                }
                if (parts.length >= 4) {
                    this.bulletColor.timeBetween = parseFloat(parts[3]);
                }
                if (parts.length >= 5) {
                    this.bulletColor.type = parts[4].trim().toLowerCase();
                }
            }
            this.bulletColor.initialize();

            this.spawnedSpeed = new ValueModifier(2);
            if ("spawnedSpeed" in spawner) {
                let parts: string[] = spawner["spawnedSpeed"].split(",");
                if (parts.length >= 1) {
                    this.spawnedSpeed.minValue = parseFloat(parts[0]);
                }
                if (parts.length >= 2) {
                    this.spawnedSpeed.maxValue = parseFloat(parts[1]);
                }
                if (parts.length >= 3) {
                    this.spawnedSpeed.rate = parseFloat(parts[2]);
                }
                if (parts.length >= 4) {
                    this.spawnedSpeed.timeBetween = parseFloat(parts[3]);
                }
                if (parts.length >= 5) {
                    this.spawnedSpeed.type = parts[4].trim().toLowerCase();
                }
            }
            this.spawnedSpeed.initialize();

            this.spawnedNumber = new ValueModifier(1);
            if ("spawnedNumber" in spawner) {
                let parts: string[] = spawner["spawnedNumber"].split(",");
                if (parts.length >= 1) {
                    this.spawnedNumber.minValue = parseFloat(parts[0]);
                }
                if (parts.length >= 2) {
                    this.spawnedNumber.maxValue = parseFloat(parts[1]);
                }
                if (parts.length >= 3) {
                    this.spawnedNumber.rate = parseFloat(parts[2]);
                }
                if (parts.length >= 4) {
                    this.spawnedNumber.timeBetween = parseFloat(parts[3]);
                }
                if (parts.length >= 5) {
                    this.spawnedNumber.type = parts[4].trim().toLowerCase();
                }
            }
            this.spawnedNumber.initialize();

            this.spawnedAngle = new ValueModifier(360);
            if ("spawnedAngle" in spawner) {
                let parts: string[] = spawner["spawnedAngle"].split(",");
                if (parts.length >= 1) {
                    this.spawnedAngle.minValue = parseFloat(parts[0]);
                }
                if (parts.length >= 2) {
                    this.spawnedAngle.maxValue = parseFloat(parts[1]);
                }
                if (parts.length >= 3) {
                    this.spawnedAngle.rate = parseFloat(parts[2]);
                }
                if (parts.length >= 4) {
                    this.spawnedAngle.timeBetween = parseFloat(parts[3]);
                }
                if (parts.length >= 5) {
                    this.spawnedAngle.type = parts[4].trim().toLowerCase();
                }
            }
            this.spawnedAngle.initialize();
        }

        getCollider(): Collider {
            return null;
        }

        clone(): Entity {
            let spawner: Spawner = new Spawner(this.name);
            spawner.x = this.x;
            spawner.y = this.y;
            spawner.spawnPattern = this.spawnPattern;
            spawner.patternIndex = this.patternIndex;
            spawner.currentPatternTime = this.currentPatternTime;
            spawner.totalPatternTime = this.totalPatternTime;
            spawner.patternRepeat = this.patternRepeat;
            spawner.spawnerPhase = this.spawnerPhase.clone();
            spawner.spawnerRadius = this.spawnerRadius.clone();
            spawner.bulletRadius = this.bulletRadius.clone();
            spawner.bulletColor = this.bulletColor.clone();
            spawner.spawnedSpeed = this.spawnedSpeed.clone();
            spawner.spawnedNumber = this.spawnedNumber.clone();
            spawner.spawnedAngle = this.spawnedAngle.clone();
            return spawner;
        }

        update(world:World): void {
            if (this.currentPatternTime > 0) {
                this.currentPatternTime -= 1;
            }
            this.spawnerPhase.update();
            this.spawnerRadius.update();
            this.bulletRadius.update();
            this.bulletColor.update();
            this.spawnedNumber.update();
            this.spawnedSpeed.update();
            this.spawnedAngle.update();

            let result = this.movement.getNextValues(this.x, this.y, 0, 0);
            this.x = result["x"];
            this.y = result["y"];

            if (!world.checkInWorld(this.x, this.y, this.spawnerRadius.currentValue)) {
                    world.removeEntity(this);
            }

            if (this.currentPatternTime == 0) {
                this.patternIndex = (this.patternIndex + 1) % this.spawnPattern.length;
                this.currentPatternTime = this.totalPatternTime;

                if (this.spawnPattern[this.patternIndex] != "wait") {
                    for (let i: number = 0; i < Math.floor(this.spawnedNumber.currentValue); i++) {
                        let spawnedAngle: number = this.movement.getParameters()[1] + this.spawnerPhase.currentValue + i * this.spawnedAngle.currentValue / Math.floor(this.spawnedNumber.currentValue);
                        let positionX: number = this.x + this.spawnerRadius.currentValue * Math.cos(spawnedAngle * Math.PI / 180);
                        let positionY: number = this.y + this.spawnerRadius.currentValue * Math.sin(spawnedAngle * Math.PI / 180);
                        if (this.spawnPattern[this.patternIndex] == "bullet") {
                            let bullet: Bullet = new Bullet(positionX, positionY);
                            bullet.initialize(this.spawnedSpeed.currentValue, spawnedAngle, this.bulletRadius.currentValue, this.bulletColor.currentValue)
                            world.addEntity(bullet);
                        }
                        else {
                            let spawner: Spawner = world.definedSpawners[this.spawnPattern[this.patternIndex]].clone();
                            if (spawner) {
                                spawner.setStartingValues(positionX, positionY, this.spawnedSpeed.currentValue, spawnedAngle);
                                world.addEntity(spawner);
                            }
                        }
                    }
                    if (this.patternRepeat > 0) {
                        this.patternRepeat -= 1;
                        if (this.patternRepeat == 0) {
                            world.removeEntity(this);
                        }
                    }
                }
            }
        }
    }
}