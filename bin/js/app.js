var keys = {
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    left: false,
    right: false,
    up: false,
    down: false
};
var newWorld = null;
var currentWorld = null;
var action = null;
function preload() {
}
function setup() {
    var canvas = createCanvas(400, 640);
    canvas.parent("game");
    action = new Point();
}
function startGame(input) {
    newWorld = new GameWorld();
    var script = JSON.parse(input);
    newWorld.initialize(script);
}
function setKey(key, down) {
    if (key == keys.LEFT_ARROW) {
        keys.left = down;
    }
    if (key == keys.RIGHT_ARROW) {
        keys.right = down;
    }
    if (key == keys.UP_ARROW) {
        keys.up = down;
    }
    if (key == keys.DOWN_ARROW) {
        keys.down = down;
    }
}
function keyPressed() {
    setKey(keyCode, true);
}
function keyReleased() {
    setKey(keyCode, false);
}
function draw() {
    background(0, 0, 0);
    action.x = 0;
    action.y = 0;
    if (currentWorld != null) {
        if (keys.left) {
            action.x -= 1;
        }
        if (keys.right) {
            action.x += 1;
        }
        if (keys.up) {
            action.y -= 1;
        }
        if (keys.down) {
            action.y += 1;
        }
        currentWorld.update(action);
        currentWorld.draw();
    }
    if (newWorld != null) {
        currentWorld = newWorld;
        newWorld = null;
    }
}
var CircleCollider = (function () {
    function CircleCollider(x, y, radius) {
        this.position = new Point(x, y);
        this.radius = radius;
    }
    CircleCollider.prototype.checkCollision = function (c) {
        if (c instanceof CircleCollider) {
            var distance = c.position.subtract(this.position.x, this.position.y).magnitude();
            var colDist = c.radius + this.radius;
            return distance < colDist;
        }
        return false;
    };
    return CircleCollider;
}());
/// <reference path="GameEvent.ts"/>
var ClearEvent = (function () {
    function ClearEvent(name) {
        this.name = name;
    }
    ClearEvent.prototype.apply = function (x, y) {
        if (this.name.toLowerCase() == "bullet") {
            currentWorld.removeAllBullets();
        }
        else if (this.name.toLowerCase() == "spawner") {
            currentWorld.removeAllSpawners();
        }
        else {
            currentWorld.removeSpawners(this.name.toLowerCase());
        }
    };
    return ClearEvent;
}());
/// <reference path="GameEvent.ts"/>
var SpawnEvent = (function () {
    function SpawnEvent(name, radius, phase, speed, direction) {
        this.name = name;
        this.radius = radius;
        this.phase = phase;
        this.speed = speed;
        this.direction = direction;
    }
    SpawnEvent.prototype.apply = function (x, y) {
        var spawned = null;
        if (this.name.toLowerCase() == "bullet") {
            spawned = new Bullet(x + this.radius * Math.cos(this.phase), y + this.radius * Math.sin(this.phase));
            spawned.initialize(this.speed, this.direction);
        }
        else {
            spawned = currentWorld.definedSpawners[this.name.toLowerCase()].clone();
            spawned.setStartingValues(x + this.radius * Math.cos(this.phase), y + this.radius * Math.sin(this.phase), this.speed, this.direction);
        }
        currentWorld.addEntity(spawned);
    };
    return SpawnEvent;
}());
/// <reference path="GameEvent.ts"/>
/// <reference path="SpawnEvent.ts"/>
/// <reference path="ClearEvent.ts"/>
var ConditionalEvent = (function () {
    function ConditionalEvent(input) {
        this.health = 100;
        if ("health" in input) {
            this.health = parseInt(input["health"]);
        }
        this.events = [];
        if ("events" in input) {
            for (var _i = 0, _a = input["events"]; _i < _a.length; _i++) {
                var s = _a[_i];
                var parts = s.split(",");
                var type = "";
                var name_1 = "";
                var radius = 0;
                var phase = 0;
                var speed = 0;
                var direction = 0;
                if (parts.length >= 1) {
                    type = parts[0].toLowerCase();
                }
                if (parts.length >= 2) {
                    name_1 = parts[1].toLowerCase();
                }
                if (parts.length >= 3) {
                    radius = parseInt(parts[2]);
                }
                if (parts.length >= 4) {
                    phase = parseInt(parts[3]);
                }
                if (parts.length >= 5) {
                    speed = parseInt(parts[4]);
                }
                if (parts.length >= 6) {
                    direction = parseInt(parts[5]);
                }
                if (type == "spawn" || type == "add") {
                    this.events.push(new SpawnEvent(name_1, radius, phase, speed, direction));
                }
                if (type == "delete" || type == "clear") {
                    this.events.push(new ClearEvent(name_1));
                }
            }
        }
    }
    ConditionalEvent.prototype.apply = function (x, y) {
        for (var _i = 0, _a = this.events; _i < _a.length; _i++) {
            var e = _a[_i];
            e.apply(x, y);
        }
    };
    return ConditionalEvent;
}());
/// <reference path="ConditionalEvent.ts"/>
var GameScript = (function () {
    function GameScript() {
    }
    GameScript.prototype.initialize = function (script) {
        this.currentIndex = 0;
        this.events = [];
        for (var _i = 0, script_1 = script; _i < script_1.length; _i++) {
            var s = script_1[_i];
            this.events.push(new ConditionalEvent(s));
        }
    };
    GameScript.prototype.clone = function () {
        var script = new GameScript();
        script.events = this.events;
        script.currentIndex = this.currentIndex;
        return script;
    };
    GameScript.prototype.update = function (x, y, health) {
        if (this.currentIndex >= this.events.length) {
            return;
        }
        if (health <= this.events[this.currentIndex].health) {
            this.events[this.currentIndex].apply(x, y);
            this.currentIndex += 1;
        }
    };
    return GameScript;
}());
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Point.prototype.add = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        return new Point(this.x + x, this.y + y);
    };
    Point.prototype.subtract = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        return new Point(this.x - x, this.y - y);
    };
    Point.prototype.multiply = function (value) {
        if (value === void 0) { value = 1; }
        return new Point(this.x * value, this.y * value);
    };
    Point.prototype.normalize = function () {
        var mag = this.magnitude();
        if (mag > 0) {
            return new Point(this.x / mag, this.y / mag);
        }
        return new Point(this.x, this.y);
    };
    Point.prototype.magnitude = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    return Point;
}());
var ValueModifier = (function () {
    function ValueModifier(minValue, maxValue, rate, timeBetween, type) {
        if (minValue === void 0) { minValue = 0; }
        if (maxValue === void 0) { maxValue = 0; }
        if (rate === void 0) { rate = 0; }
        if (timeBetween === void 0) { timeBetween = 0; }
        if (type === void 0) { type = "none"; }
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.rate = rate;
        this.timeBetween = timeBetween;
        this.type = type;
    }
    ValueModifier.prototype.initialize = function () {
        this.currentValue = this.minValue;
        this.currentRate = this.rate;
        this.currentTimer = 0;
    };
    ValueModifier.prototype.clone = function () {
        var temp = new ValueModifier();
        temp.minValue = this.minValue;
        temp.maxValue = this.maxValue;
        temp.rate = this.rate;
        temp.timeBetween = this.timeBetween;
        temp.type = this.type;
        temp.currentValue = this.currentValue;
        temp.currentRate = this.currentRate;
        temp.currentTimer = this.currentTimer;
        return temp;
    };
    ValueModifier.prototype.update = function () {
        if (this.currentRate == 0) {
            return;
        }
        this.currentTimer -= 1;
        if (this.currentTimer <= 0) {
            this.currentValue += this.currentRate;
            this.currentTimer = this.timeBetween;
        }
        if (this.currentValue > this.maxValue) {
            if (this.type == "reverse") {
                this.currentValue = this.maxValue;
                this.currentRate *= -1;
            }
            else if (this.type == "circle") {
                this.currentValue = this.currentValue - this.maxValue + this.minValue;
            }
            else {
                this.currentValue = this.maxValue;
            }
        }
        if (this.currentValue < this.minValue) {
            if (this.type == "reverse") {
                this.currentValue = this.minValue;
                this.currentRate *= -1;
            }
            else if (this.type == "circle") {
                this.currentValue = this.currentValue + this.maxValue - this.minValue;
            }
            else {
                this.currentValue = this.minValue;
            }
        }
    };
    return ValueModifier;
}());
/// <reference path="Entity.ts"/>
var Boss = (function () {
    function Boss() {
        this.script = new GameScript();
    }
    Boss.prototype.initialize = function (script) {
        this.x = width / 2;
        this.y = height / 4;
        this.maxHealth = 3000;
        if ("health" in script) {
            this.maxHealth = parseInt(script["health"]);
        }
        if ("position" in script) {
            var parts = script["position"].split(",");
            if (parts.length >= 1) {
                this.x = parseInt(parts[0]);
            }
            if (parts.length >= 2) {
                this.y = parseInt(parts[1]);
            }
        }
        if ("script" in script) {
            this.script.initialize(script["script"]);
        }
        this.health = this.maxHealth;
    };
    Boss.prototype.clone = function () {
        var boss = new Boss();
        boss.x = this.x;
        boss.y = this.y;
        boss.health = this.health;
        boss.maxHealth = this.maxHealth;
        boss.script = this.script.clone();
        return boss;
    };
    Boss.prototype.getCollider = function () {
        return null;
    };
    Boss.prototype.getHealth = function () {
        return this.health / this.maxHealth;
    };
    Boss.prototype.update = function () {
        this.health -= 1;
        if (this.health < 0) {
            this.health = 0;
        }
        this.script.update(this.x, this.y, 100 * this.health / this.maxHealth);
    };
    Boss.prototype.draw = function () {
    };
    return Boss;
}());
/// <reference path="Entity.ts"/>
var Bullet = (function () {
    function Bullet(x, y) {
        this.x = x;
        this.y = y;
    }
    Bullet.prototype.initialize = function (speed, direction, radius, color) {
        if (speed === void 0) { speed = 4; }
        if (direction === void 0) { direction = 90; }
        if (radius === void 0) { radius = 8; }
        if (color === void 0) { color = 0xff6666; }
        this.pattern = new LinePattern(speed, direction);
        this.collider = new CircleCollider(this.x, this.y, this.radius);
        this.radius = radius;
        this.color = color;
    };
    Bullet.prototype.clone = function () {
        var b = new Bullet(this.x, this.y);
        b.pattern = this.pattern;
        b.collider = this.collider;
        b.radius = this.radius;
        b.color = this.color;
        return b;
    };
    Bullet.prototype.getCollider = function () {
        return this.collider;
    };
    Bullet.prototype.update = function () {
        var result = this.pattern.getNextValues(this.x, this.y, this.radius, this.color);
        this.x = result["x"];
        this.y = result["y"];
        this.radius = result["radius"];
        this.color = result["color"];
        this.collider.position.x = this.x;
        this.collider.position.y = this.y;
        this.collider.radius = this.radius;
        if (this.x + this.radius < 0 || this.y + this.radius < 0 ||
            this.x - this.radius > width || this.y - this.radius > height) {
            currentWorld.removeEntity(this);
        }
        currentWorld.checkCollision(this);
    };
    Bullet.prototype.draw = function () {
        strokeWeight(0);
        fill(color(this.color >> 16 & 0xff, this.color >> 8 & 0xff, this.color >> 0 & 0xff));
        ellipse(this.x, this.y, 2 * this.radius, 2 * this.radius);
        fill(color(255, 255, 255));
        ellipse(this.x, this.y, 1.75 * this.radius, 1.75 * this.radius);
    };
    return Bullet;
}());
/// <reference path="Entity.ts"/>
var Player = (function () {
    function Player(x, y, radius, speed, lives) {
        if (radius === void 0) { radius = 3; }
        if (speed === void 0) { speed = 4; }
        if (lives === void 0) { lives = 1; }
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.radius = radius;
        this.currentLives = lives;
    }
    Player.prototype.initialize = function () {
        this.originalX = this.x;
        this.originalY = this.y;
        this.collider = new CircleCollider(this.x, this.y, this.radius);
    };
    Player.prototype.getCollider = function () {
        return this.collider;
    };
    Player.prototype.getLives = function () {
        return this.currentLives;
    };
    Player.prototype.die = function () {
        this.currentLives -= 1;
        if (this.currentLives > 0) {
            currentWorld.removeAllBullets();
            this.x = this.originalX;
            this.y = this.originalY;
        }
    };
    Player.prototype.clone = function () {
        var p = new Player(this.x, this.y, this.radius, this.speed, this.currentLives);
        p.originalX = this.originalX;
        p.originalY = this.originalY;
        p.collider = this.collider;
        return p;
    };
    Player.prototype.applyAction = function (action) {
        if (this.currentLives < 0) {
            return;
        }
        var delta = action.multiply(this.speed);
        this.x += delta.x;
        this.y += delta.y;
    };
    Player.prototype.update = function () {
        if (this.x - this.radius < 0) {
            this.x = this.radius;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
        }
        if (this.x + this.radius > width) {
            this.x = width - this.radius;
        }
        if (this.y + this.radius > height) {
            this.y = height - this.radius;
        }
        this.collider.position.x = this.x;
        this.collider.position.y = this.y;
        this.collider.radius = this.radius;
    };
    Player.prototype.draw = function () {
        if (this.currentLives <= 0) {
            return;
        }
        strokeWeight(0);
        fill(color(255, 255, 255));
        ellipse(this.x, this.y, 2 * this.radius, 2 * this.radius);
    };
    return Player;
}());
/// <reference path="Entity.ts"/>
var Spawner = (function () {
    function Spawner(name) {
        this.x = 0;
        this.y = 0;
        this.name = name;
        this.movement = new LinePattern(0, 0);
    }
    Spawner.prototype.setStartingValues = function (x, y, speed, direction) {
        if (speed === void 0) { speed = 0; }
        if (direction === void 0) { direction = 0; }
        this.x = x;
        this.y = y;
        this.movement.adjustParameters([speed, direction]);
    };
    Spawner.prototype.initialize = function (spawner) {
        this.patternIndex = 0;
        this.currentPatternTime = 0;
        this.spawnPattern = [];
        if ("pattern" in spawner) {
            for (var _i = 0, _a = spawner["pattern"]; _i < _a.length; _i++) {
                var p = _a[_i];
                this.spawnPattern.push(p.toLowerCase());
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
            var parts = spawner["spawnerPhase"].split(",");
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
                this.spawnerPhase.type = parts[4].toLowerCase();
            }
        }
        this.spawnerPhase.initialize();
        this.spawnerRadius = new ValueModifier();
        if ("spawnerRadius" in spawner) {
            var parts = spawner["spawnerRadius"].split(",");
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
                this.spawnerRadius.type = parts[4].toLowerCase();
            }
        }
        this.spawnerRadius.initialize();
        this.spawnedRadius = new ValueModifier(5);
        if ("spawnedRadius" in spawner) {
            var parts = spawner["spawnedRadius"].split(",");
            if (parts.length >= 1) {
                this.spawnedRadius.minValue = parseFloat(parts[0]);
            }
            if (parts.length >= 2) {
                this.spawnedRadius.maxValue = parseFloat(parts[1]);
            }
            if (parts.length >= 3) {
                this.spawnedRadius.rate = parseFloat(parts[2]);
            }
            if (parts.length >= 4) {
                this.spawnedRadius.timeBetween = parseFloat(parts[3]);
            }
            if (parts.length >= 5) {
                this.spawnedRadius.type = parts[4].toLowerCase();
            }
        }
        this.spawnedRadius.initialize();
        this.spawnedColor = new ValueModifier(0xff0000);
        if ("spawnedColor" in spawner) {
            var parts = spawner["spawnedColor"].split(",");
            if (parts.length >= 1) {
                this.spawnedColor.minValue = parseFloat(parts[0]);
            }
            if (parts.length >= 2) {
                this.spawnedColor.maxValue = parseFloat(parts[1]);
            }
            if (parts.length >= 3) {
                this.spawnedColor.rate = parseFloat(parts[2]);
            }
            if (parts.length >= 4) {
                this.spawnedColor.timeBetween = parseFloat(parts[3]);
            }
            if (parts.length >= 5) {
                this.spawnedColor.type = parts[4].toLowerCase();
            }
        }
        this.spawnedColor.initialize();
        this.spawnedSpeed = new ValueModifier(2);
        if ("spawnedSpeed" in spawner) {
            var parts = spawner["spawnedSpeed"].split(",");
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
                this.spawnedSpeed.type = parts[4].toLowerCase();
            }
        }
        this.spawnedSpeed.initialize();
        this.spawnedNumber = new ValueModifier(1);
        if ("spawnedNumber" in spawner) {
            var parts = spawner["spawnedNumber"].split(",");
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
                this.spawnedNumber.type = parts[4].toLowerCase();
            }
        }
        this.spawnedNumber.initialize();
        this.spawnedAngle = new ValueModifier(360);
        if ("spawnedAngle" in spawner) {
            var parts = spawner["spawnedAngle"].split(",");
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
                this.spawnedAngle.type = parts[4].toLowerCase();
            }
        }
        this.spawnedAngle.initialize();
    };
    Spawner.prototype.getCollider = function () {
        return null;
    };
    Spawner.prototype.clone = function () {
        var spawner = new Spawner(this.name);
        spawner.spawnPattern = this.spawnPattern;
        spawner.patternIndex = this.patternIndex;
        spawner.currentPatternTime = this.currentPatternTime;
        spawner.totalPatternTime = this.totalPatternTime;
        spawner.patternRepeat = this.patternRepeat;
        spawner.spawnerPhase = this.spawnerPhase.clone();
        spawner.spawnerRadius = this.spawnerRadius.clone();
        spawner.spawnedRadius = this.spawnedRadius.clone();
        spawner.spawnedColor = this.spawnedColor.clone();
        spawner.spawnedSpeed = this.spawnedSpeed.clone();
        spawner.spawnedNumber = this.spawnedNumber.clone();
        spawner.spawnedAngle = this.spawnedAngle.clone();
        return spawner;
    };
    Spawner.prototype.update = function () {
        if (this.currentPatternTime > 0) {
            this.currentPatternTime -= 1;
        }
        this.spawnerPhase.update();
        this.spawnerRadius.update();
        this.spawnedRadius.update();
        this.spawnedColor.update();
        this.spawnedNumber.update();
        this.spawnedAngle.update();
        var result = this.movement.getNextValues(this.x, this.y, 0, 0);
        this.x = result["x"];
        this.y = result["y"];
        if (this.x + this.spawnerRadius.currentValue < 0 || this.y + this.spawnerRadius.currentValue < 0 ||
            this.x - this.spawnerRadius.currentValue > width || this.y - this.spawnerRadius.currentValue > height) {
            currentWorld.removeEntity(this);
        }
        if (this.currentPatternTime == 0) {
            this.patternIndex = (this.patternIndex + 1) % this.spawnPattern.length;
            this.currentPatternTime = this.totalPatternTime;
            if (this.spawnPattern[this.patternIndex] != "wait") {
                for (var i = 0; i < Math.floor(this.spawnedNumber.currentValue); i++) {
                    var spawnedAngle = this.movement.getParameters()[1] + this.spawnerPhase.currentValue + i * this.spawnedAngle.currentValue / Math.floor(this.spawnedNumber.currentValue);
                    var positionX = this.x + this.spawnerRadius.currentValue * Math.cos(radians(spawnedAngle));
                    var positionY = this.y + this.spawnerRadius.currentValue * Math.sin(radians(spawnedAngle));
                    if (this.spawnPattern[this.patternIndex] == "bullet") {
                        var bullet = new Bullet(positionX, positionY);
                        bullet.initialize(this.spawnedSpeed.currentValue, spawnedAngle, this.spawnedRadius.currentValue, this.spawnedColor.currentValue);
                        currentWorld.addEntity(bullet);
                    }
                    else {
                        var spawner = currentWorld.definedSpawners[this.spawnPattern[this.patternIndex]].clone();
                        if (spawner) {
                            spawner.setStartingValues(positionX, positionY, this.spawnedSpeed.currentValue, spawnedAngle);
                            currentWorld.addEntity(spawner);
                        }
                    }
                }
                if (this.patternRepeat > 0) {
                    this.patternRepeat -= 1;
                    if (this.patternRepeat == 0) {
                        currentWorld.removeEntity(this);
                    }
                }
            }
        }
    };
    Spawner.prototype.draw = function () {
        stroke(color(100, 100, 255));
        strokeWeight(2);
        noFill();
        ellipse(this.x, this.y, 2 * this.spawnerRadius.currentValue, 2 * this.spawnerRadius.currentValue);
    };
    return Spawner;
}());
var LinePattern = (function () {
    function LinePattern(speed, direction) {
        this.speed = new Point(speed * Math.cos(radians(direction)), speed * Math.sin(radians(direction)));
        this.speedMag = speed;
        this.direction = direction;
    }
    LinePattern.prototype.adjustParameters = function (newValues) {
        this.speed = new Point(newValues[0] * Math.cos(radians(newValues[1])), newValues[0] * Math.sin(radians(newValues[1])));
        this.speedMag = newValues[0];
        this.direction = newValues[1];
    };
    LinePattern.prototype.getParameters = function () {
        return [this.speedMag, this.direction];
    };
    LinePattern.prototype.getNextValues = function (x, y, radius, color) {
        return { "x": x + this.speed.x,
            "y": y + this.speed.y,
            "radius": radius,
            "color": color };
    };
    return LinePattern;
}());
/// <reference path="World.ts"/>
var GameWorld = (function () {
    function GameWorld() {
        this.bullets = [];
        this.spawners = [];
        this.created = [];
        this.deleted = [];
    }
    GameWorld.prototype.initialize = function (script) {
        this.player = new Player(width / 2, 0.8 * height);
        this.player.initialize();
        this.boss = new Boss();
        if ("spawners" in script) {
            this.definedSpawners = {};
            for (var name_2 in script["spawners"]) {
                this.definedSpawners[name_2.toLowerCase()] = new Spawner(name_2.toLowerCase());
                this.definedSpawners[name_2.toLowerCase()].initialize(script["spawners"][name_2]);
            }
        }
        if ("boss" in script) {
            this.boss.initialize(script["boss"]);
        }
    };
    GameWorld.prototype.clone = function () {
        var newWorld = new GameWorld();
        for (var _i = 0, _a = this.bullets; _i < _a.length; _i++) {
            var e = _a[_i];
            var temp = e.clone();
            newWorld.bullets.push(temp);
        }
        for (var _b = 0, _c = this.spawners; _b < _c.length; _b++) {
            var e = _c[_b];
            var temp = e.clone();
            newWorld.spawners.push(temp);
        }
        newWorld.player = this.player.clone();
        newWorld.boss = this.boss.clone();
        return newWorld;
    };
    GameWorld.prototype.isWon = function () {
        if (this.boss == null) {
            return false;
        }
        return this.boss.getHealth() <= 0;
    };
    GameWorld.prototype.isLose = function () {
        if (this.player == null) {
            return false;
        }
        return this.player.getLives() <= 0;
    };
    GameWorld.prototype.checkCollision = function (entity) {
        var result = this.player.getCollider().checkCollision(entity.getCollider());
        if (result) {
            this.player.die();
        }
    };
    GameWorld.prototype.addEntity = function (entity) {
        this.created.push(entity);
    };
    GameWorld.prototype.removeEntity = function (entity) {
        this.deleted.push(entity);
    };
    GameWorld.prototype.removeAllBullets = function () {
        this.deleted = this.deleted.concat(this.bullets);
    };
    GameWorld.prototype.removeAllSpawners = function () {
        this.deleted = this.deleted.concat(this.spawners);
    };
    GameWorld.prototype.removeSpawners = function (name) {
        for (var _i = 0, _a = this.spawners; _i < _a.length; _i++) {
            var s = _a[_i];
            if (name.toLowerCase() == s.name.toLowerCase()) {
                this.deleted.push(s);
            }
        }
    };
    GameWorld.prototype.update = function (action) {
        if (this.isLose() || this.isWon()) {
            return;
        }
        if (this.player != null) {
            this.player.applyAction(action);
            this.player.update();
        }
        if (this.boss != null) {
            this.boss.update();
        }
        for (var _i = 0, _a = this.spawners; _i < _a.length; _i++) {
            var s = _a[_i];
            s.update();
        }
        for (var _b = 0, _c = this.bullets; _b < _c.length; _b++) {
            var e = _c[_b];
            e.update();
        }
        for (var _d = 0, _e = this.created; _d < _e.length; _d++) {
            var e = _e[_d];
            if (e instanceof Bullet) {
                this.bullets.push(e);
            }
            if (e instanceof Spawner) {
                this.spawners.push(e);
            }
        }
        this.created.length = 0;
        for (var _f = 0, _g = this.deleted; _f < _g.length; _f++) {
            var e = _g[_f];
            if (e instanceof Bullet) {
                var index = this.bullets.indexOf(e);
                if (index >= 0) {
                    this.bullets.splice(index, 1);
                }
            }
            if (e instanceof Spawner) {
                var index = this.spawners.indexOf(e);
                if (index >= 0) {
                    this.spawners.splice(index, 1);
                }
            }
        }
        this.deleted.length = 0;
    };
    GameWorld.prototype.draw = function () {
        if (this.boss != null) {
            noFill();
            strokeWeight(4);
            stroke(color(124, 46, 46));
            arc(this.boss.x, this.boss.y, 200, 200, 0, 2 * PI * this.boss.getHealth());
        }
        if (this.player != null) {
            this.player.draw();
        }
        for (var _i = 0, _a = this.bullets; _i < _a.length; _i++) {
            var e = _a[_i];
            e.draw();
        }
        for (var _b = 0, _c = this.spawners; _b < _c.length; _b++) {
            var e = _c[_b];
            e.draw();
        }
        if (this.boss != null) {
            this.boss.draw();
        }
        if (this.isWon()) {
            // TODO:
        }
        if (this.isLose()) {
            // TODO:
        }
    };
    return GameWorld;
}());
