declare namespace Talakat {
    interface Collider {
        checkCollision(c: Collider): any;
    }
}
declare namespace Talakat {
    class Point {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        add(x?: number, y?: number): Point;
        subtract(x?: number, y?: number): Point;
        multiply(value?: number): Point;
        normalize(): Point;
        magnitude(): number;
    }
}
declare namespace Talakat {
    class CircleCollider implements Collider {
        position: Point;
        radius: number;
        constructor(x: number, y: number, radius: number);
        checkCollision(c: Collider): boolean;
    }
}
declare namespace Talakat {
    class ValueModifier {
        minValue: number;
        maxValue: number;
        timeBetween: number;
        rate: number;
        type: string;
        currentValue: number;
        currentRate: number;
        currentTimer: number;
        constructor(minValue?: number, maxValue?: number, rate?: number, timeBetween?: number, type?: string);
        initialize(): void;
        clone(): ValueModifier;
        update(): void;
    }
}
declare namespace Talakat {
    class Player implements Entity {
        x: number;
        y: number;
        radius: number;
        private originalX;
        private originalY;
        private currentLives;
        private speed;
        private collider;
        constructor(x: number, y: number, radius?: number, speed?: number, lives?: number);
        initialize(): void;
        getCollider(): Collider;
        getLives(): number;
        die(world: World): void;
        clone(): Entity;
        applyAction(action: Point): void;
        update(world: World): void;
    }
}
declare namespace Talakat {
    interface MovementPattern {
        adjustParameters(newValues: any[]): void;
        getParameters(): any[];
        getNextValues(x: number, y: number, diameter: number, color: number): any;
    }
}
declare namespace Talakat {
    class LinePattern implements MovementPattern {
        private direction;
        private speedMag;
        private speed;
        constructor(speed: number, direction: number);
        adjustParameters(newValues: any[]): void;
        getParameters(): any[];
        getNextValues(x: number, y: number, radius: number, color: number): any;
    }
}
declare namespace Talakat {
    class Bullet implements Entity {
        x: number;
        y: number;
        radius: number;
        color: number;
        private pattern;
        private collider;
        constructor(x: number, y: number);
        initialize(speed?: number, direction?: number, radius?: number, color?: number): void;
        clone(): Entity;
        getCollider(): Collider;
        update(world: World): void;
    }
}
declare namespace Talakat {
    class Spawner implements Entity {
        x: number;
        y: number;
        name: string;
        private movement;
        private spawnPattern;
        private patternIndex;
        private currentPatternTime;
        private totalPatternTime;
        private patternRepeat;
        private spawnerPhase;
        private spawnerRadius;
        private spawnedSpeed;
        private spawnedNumber;
        private spawnedAngle;
        private bulletRadius;
        private bulletColor;
        constructor(name: string);
        setStartingValues(x: number, y: number, speed?: number, direction?: number): void;
        initialize(spawner: any): void;
        getCollider(): Collider;
        clone(): Entity;
        update(world: World): void;
    }
}
declare namespace Talakat {
    class World {
        width: number;
        height: number;
        hideUnknown: boolean;
        disableCollision: boolean;
        definedSpawners: any;
        player: Player;
        boss: Boss;
        bullets: Bullet[];
        spawners: Spawner[];
        private created;
        private deleted;
        constructor(width: number, height: number);
        initialize(script: any): void;
        clone(): World;
        isWon(): boolean;
        checkInWorld(x: number, y: number, radius: number): boolean;
        isLose(): boolean;
        checkCollision(entity: Entity): void;
        addEntity(entity: Entity): void;
        removeEntity(entity: Entity): void;
        removeAllBullets(): void;
        removeAllSpawners(): void;
        removeSpawners(name: string): void;
        update(action: Point): void;
    }
}
declare namespace Talakat {
    interface Entity {
        x: number;
        y: number;
        clone(): Entity;
        getCollider(): Collider;
        update(world: World): void;
    }
}
declare namespace Talakat {
    interface GameEvent {
        apply(world: World, x: number, y: number): void;
    }
}
declare namespace Talakat {
    class SpawnEvent implements GameEvent {
        name: string;
        radius: number;
        phase: number;
        speed: number;
        direction: number;
        constructor(name: string, radius: number, phase: number, speed: number, direction: number);
        apply(world: World, x: number, y: number): void;
    }
}
declare namespace Talakat {
    class ClearEvent implements GameEvent {
        name: string;
        constructor(name: string);
        apply(world: World, x: number, y: number): void;
    }
}
declare namespace Talakat {
    class ConditionalEvent implements GameEvent {
        health: number;
        events: GameEvent[];
        constructor(input: any);
        apply(world: World, x: number, y: number): void;
    }
}
declare namespace Talakat {
    class GameScript {
        private events;
        private currentIndex;
        constructor();
        initialize(script: any): void;
        clone(): GameScript;
        update(world: World, x: number, y: number, health: number): void;
    }
}
declare namespace Talakat {
    class Boss implements Entity {
        x: number;
        y: number;
        private script;
        private health;
        private maxHealth;
        constructor();
        initialize(width: number, height: number, script: any): void;
        clone(): Entity;
        getCollider(): Collider;
        getHealth(): number;
        update(world: World): void;
    }
}
