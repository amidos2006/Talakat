var Talakat;
(function (Talakat) {
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
    Talakat.Point = Point;
})(Talakat || (Talakat = {}));
/// <reference path="Collider.ts"/>
/// <reference path="../Data/Point.ts"/>
var Talakat;
(function (Talakat) {
    var CircleCollider = (function () {
        function CircleCollider(x, y, radius) {
            this.position = new Talakat.Point(x, y);
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
    Talakat.CircleCollider = CircleCollider;
})(Talakat || (Talakat = {}));
var Talakat;
(function (Talakat) {
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
    Talakat.ValueModifier = ValueModifier;
})(Talakat || (Talakat = {}));
/// <reference path="Entity.ts"/>
/// <reference path="../Collisions/CircleCollider.ts"/>
/// <reference path="../Data/Point.ts"/>
var Talakat;
(function (Talakat) {
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
            this.collider = new Talakat.CircleCollider(this.x, this.y, this.radius);
        };
        Player.prototype.getCollider = function () {
            return this.collider;
        };
        Player.prototype.getLives = function () {
            return this.currentLives;
        };
        Player.prototype.die = function (world) {
            this.currentLives -= 1;
            if (this.currentLives > 0) {
                world.removeAllBullets();
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
        Player.prototype.update = function (world) {
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
        };
        return Player;
    }());
    Talakat.Player = Player;
})(Talakat || (Talakat = {}));
/// <reference path="../Data/Point.ts"/>
/// <reference path="MovementPattern.ts"/>
var Talakat;
(function (Talakat) {
    var LinePattern = (function () {
        function LinePattern(speed, direction) {
            this.speed = new Talakat.Point(speed * Math.cos(direction * Math.PI / 180), speed * Math.sin(direction * Math.PI / 180));
            this.speedMag = speed;
            this.direction = direction;
        }
        LinePattern.prototype.adjustParameters = function (newValues) {
            this.speed = new Talakat.Point(newValues[0] * Math.cos(newValues[1] * Math.PI / 180), newValues[0] * Math.sin(newValues[1] * Math.PI / 180));
            this.speedMag = newValues[0];
            this.direction = newValues[1];
        };
        LinePattern.prototype.getParameters = function () {
            return [this.speedMag, this.direction];
        };
        LinePattern.prototype.getNextValues = function (x, y, radius, color) {
            return {
                "x": x + this.speed.x,
                "y": y + this.speed.y,
                "radius": radius,
                "color": color
            };
        };
        return LinePattern;
    }());
    Talakat.LinePattern = LinePattern;
})(Talakat || (Talakat = {}));
/// <reference path="Entity.ts"/>
/// <reference path="../Movements/LinePattern.ts"/>
/// <reference path="../Collisions/CircleCollider.ts"/>
var Talakat;
(function (Talakat) {
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
            this.pattern = new Talakat.LinePattern(speed, direction);
            this.collider = new Talakat.CircleCollider(this.x, this.y, this.radius);
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
        Bullet.prototype.update = function (world) {
            var result = this.pattern.getNextValues(this.x, this.y, this.radius, this.color);
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
        };
        return Bullet;
    }());
    Talakat.Bullet = Bullet;
})(Talakat || (Talakat = {}));
/// <reference path="Entity.ts"/>
/// <reference path="../Data/ValueModifier.ts"/>
/// <reference path="../Movements/LinePattern.ts"/>
var Talakat;
(function (Talakat) {
    var Spawner = (function () {
        function Spawner(name) {
            this.x = 0;
            this.y = 0;
            this.name = name;
            this.movement = new Talakat.LinePattern(0, 0);
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
            this.spawnerPhase = new Talakat.ValueModifier(0, 360, 0);
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
                    this.spawnerPhase.type = parts[4].trim().toLowerCase();
                }
            }
            this.spawnerPhase.initialize();
            this.spawnerRadius = new Talakat.ValueModifier();
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
                    this.spawnerRadius.type = parts[4].trim().toLowerCase();
                }
            }
            this.spawnerRadius.initialize();
            this.bulletRadius = new Talakat.ValueModifier(5);
            if ("bulletRadius" in spawner) {
                var parts = spawner["bulletRadius"].split(",");
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
            this.bulletColor = new Talakat.ValueModifier(0xff0000);
            if ("bulletColor" in spawner) {
                var parts = spawner["bulletColor"].split(",");
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
            this.spawnedSpeed = new Talakat.ValueModifier(2);
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
                    this.spawnedSpeed.type = parts[4].trim().toLowerCase();
                }
            }
            this.spawnedSpeed.initialize();
            this.spawnedNumber = new Talakat.ValueModifier(1);
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
                    this.spawnedNumber.type = parts[4].trim().toLowerCase();
                }
            }
            this.spawnedNumber.initialize();
            this.spawnedAngle = new Talakat.ValueModifier(360);
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
                    this.spawnedAngle.type = parts[4].trim().toLowerCase();
                }
            }
            this.spawnedAngle.initialize();
        };
        Spawner.prototype.getCollider = function () {
            return null;
        };
        Spawner.prototype.clone = function () {
            var spawner = new Spawner(this.name);
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
        };
        Spawner.prototype.update = function (world) {
            if (this.currentPatternTime > 0) {
                this.currentPatternTime -= 1;
            }
            this.spawnerPhase.update();
            this.spawnerRadius.update();
            this.bulletRadius.update();
            this.bulletColor.update();
            this.spawnedNumber.update();
            this.spawnedAngle.update();
            var result = this.movement.getNextValues(this.x, this.y, 0, 0);
            this.x = result["x"];
            this.y = result["y"];
            if (!world.checkInWorld(this.x, this.y, this.spawnerRadius.currentValue)) {
                world.removeEntity(this);
            }
            if (this.currentPatternTime == 0) {
                this.patternIndex = (this.patternIndex + 1) % this.spawnPattern.length;
                this.currentPatternTime = this.totalPatternTime;
                if (this.spawnPattern[this.patternIndex] != "wait") {
                    for (var i = 0; i < Math.floor(this.spawnedNumber.currentValue); i++) {
                        var spawnedAngle = this.movement.getParameters()[1] + this.spawnerPhase.currentValue + i * this.spawnedAngle.currentValue / Math.floor(this.spawnedNumber.currentValue);
                        var positionX = this.x + this.spawnerRadius.currentValue * Math.cos(spawnedAngle * Math.PI / 180);
                        var positionY = this.y + this.spawnerRadius.currentValue * Math.sin(spawnedAngle * Math.PI / 180);
                        if (this.spawnPattern[this.patternIndex] == "bullet") {
                            var bullet = new Talakat.Bullet(positionX, positionY);
                            bullet.initialize(this.spawnedSpeed.currentValue, spawnedAngle, this.bulletRadius.currentValue, this.bulletColor.currentValue);
                            world.addEntity(bullet);
                        }
                        else {
                            var spawner = world.definedSpawners[this.spawnPattern[this.patternIndex]].clone();
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
        };
        return Spawner;
    }());
    Talakat.Spawner = Spawner;
})(Talakat || (Talakat = {}));
/// <reference path="../Entities/Player.ts"/>
/// <reference path="../Entities/Boss.ts"/>
/// <reference path="../Entities/Bullet.ts"/>
/// <reference path="../Entities/Spawner.ts"/>
/// <reference path="../Entities/Entity.ts"/>
/// <reference path="../Data/Point.ts"/>
var Talakat;
(function (Talakat) {
    var World = (function () {
        function World(width, height) {
            this.width = width;
            this.height = height;
            this.hideUnknown = false;
            this.disableCollision = false;
            this.bullets = [];
            this.spawners = [];
            this.created = [];
            this.deleted = [];
        }
        World.prototype.initialize = function (script) {
            this.player = new Talakat.Player(this.width / 2, 0.8 * this.height);
            this.player.initialize();
            this.boss = new Talakat.Boss();
            if ("spawners" in script) {
                this.definedSpawners = {};
                for (var name_1 in script["spawners"]) {
                    this.definedSpawners[name_1.toLowerCase()] = new Talakat.Spawner(name_1.toLowerCase());
                    this.definedSpawners[name_1.toLowerCase()].initialize(script["spawners"][name_1]);
                }
            }
            if ("boss" in script) {
                this.boss.initialize(this.width, this.height, script["boss"]);
            }
        };
        World.prototype.clone = function () {
            var newWorld = new World(this.width, this.height);
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
            newWorld.definedSpawners = this.definedSpawners;
            newWorld.hideUnknown = this.hideUnknown;
            newWorld.disableCollision = this.disableCollision;
            return newWorld;
        };
        World.prototype.isWon = function () {
            if (this.boss == null) {
                return false;
            }
            return this.boss.getHealth() <= 0;
        };
        World.prototype.checkInWorld = function (x, y, radius) {
            return !(x + radius < 0 || y + radius < 0 ||
                x - radius > this.width || y - radius > this.height);
        };
        World.prototype.isLose = function () {
            if (this.player == null) {
                return false;
            }
            return this.player.getLives() <= 0;
        };
        World.prototype.checkCollision = function (entity) {
            if (this.disableCollision) {
                return;
            }
            var result = this.player.getCollider().checkCollision(entity.getCollider());
            if (result) {
                this.player.die(this);
            }
        };
        World.prototype.addEntity = function (entity) {
            this.created.push(entity);
        };
        World.prototype.removeEntity = function (entity) {
            this.deleted.push(entity);
        };
        World.prototype.removeAllBullets = function () {
            this.deleted = this.deleted.concat(this.bullets);
        };
        World.prototype.removeAllSpawners = function () {
            this.deleted = this.deleted.concat(this.spawners);
        };
        World.prototype.removeSpawners = function (name) {
            for (var _i = 0, _a = this.spawners; _i < _a.length; _i++) {
                var s = _a[_i];
                if (name.toLowerCase() == s.name.toLowerCase()) {
                    this.deleted.push(s);
                }
            }
        };
        World.prototype.update = function (action) {
            if (this.isLose() || this.isWon()) {
                return;
            }
            if (this.player != null && !this.disableCollision) {
                this.player.applyAction(action);
                this.player.update(this);
            }
            if (this.boss != null) {
                this.boss.update(this);
            }
            if (!this.hideUnknown) {
                for (var _i = 0, _a = this.spawners; _i < _a.length; _i++) {
                    var s = _a[_i];
                    s.update(this);
                }
            }
            for (var _b = 0, _c = this.created; _b < _c.length; _b++) {
                var e = _c[_b];
                if (e instanceof Talakat.Bullet) {
                    this.bullets.push(e);
                }
                if (e instanceof Talakat.Spawner) {
                    this.spawners.push(e);
                }
            }
            this.created.length = 0;
            for (var _d = 0, _e = this.deleted; _d < _e.length; _d++) {
                var e = _e[_d];
                if (e instanceof Talakat.Bullet) {
                    var index = this.bullets.indexOf(e);
                    if (index >= 0) {
                        this.bullets.splice(index, 1);
                    }
                }
                if (e instanceof Talakat.Spawner) {
                    var index = this.spawners.indexOf(e);
                    if (index >= 0) {
                        this.spawners.splice(index, 1);
                    }
                }
            }
            this.deleted.length = 0;
        };
        return World;
    }());
    Talakat.World = World;
})(Talakat || (Talakat = {}));
/// <reference path="../Collisions/Collider.ts"/>
/// <reference path="../Worlds/World.ts"/>
/// <reference path="GameEvent.ts"/>
var Talakat;
(function (Talakat) {
    var SpawnEvent = (function () {
        function SpawnEvent(name, radius, phase, speed, direction) {
            this.name = name;
            this.radius = radius;
            this.phase = phase;
            this.speed = speed;
            this.direction = direction;
        }
        SpawnEvent.prototype.apply = function (world, x, y) {
            var spawned = null;
            if (this.name.toLowerCase() == "bullet") {
                spawned = new Talakat.Bullet(x + this.radius * Math.cos(this.phase), y + this.radius * Math.sin(this.phase));
                spawned.initialize(this.speed, this.direction);
            }
            else {
                spawned = (world).definedSpawners[this.name.toLowerCase()].clone();
                spawned.setStartingValues(x + this.radius * Math.cos(this.phase), y + this.radius * Math.sin(this.phase), this.speed, this.direction);
            }
            world.addEntity(spawned);
        };
        return SpawnEvent;
    }());
    Talakat.SpawnEvent = SpawnEvent;
})(Talakat || (Talakat = {}));
/// <reference path="GameEvent.ts"/>
var Talakat;
(function (Talakat) {
    var ClearEvent = (function () {
        function ClearEvent(name) {
            this.name = name;
        }
        ClearEvent.prototype.apply = function (world, x, y) {
            if (this.name.toLowerCase() == "bullet") {
                (world).removeAllBullets();
            }
            else if (this.name.toLowerCase() == "spawner") {
                (world).removeAllSpawners();
            }
            else {
                (world).removeSpawners(this.name.toLowerCase());
            }
        };
        return ClearEvent;
    }());
    Talakat.ClearEvent = ClearEvent;
})(Talakat || (Talakat = {}));
/// <reference path="GameEvent.ts"/>
/// <reference path="SpawnEvent.ts"/>
/// <reference path="ClearEvent.ts"/>
var Talakat;
(function (Talakat) {
    var ConditionalEvent = (function () {
        function ConditionalEvent(input) {
            this.health = 100;
            if ("health" in input) {
                this.health = 100 * parseFloat(input["health"]);
            }
            this.events = [];
            if ("events" in input) {
                for (var _i = 0, _a = input["events"]; _i < _a.length; _i++) {
                    var s = _a[_i];
                    var parts = s.split(",");
                    var type = "";
                    var name_2 = "";
                    var radius = 0;
                    var phase = 0;
                    var speed = 0;
                    var direction = 0;
                    if (parts.length >= 1) {
                        type = parts[0].trim().toLowerCase();
                    }
                    if (parts.length >= 2) {
                        name_2 = parts[1].trim().toLowerCase();
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
                        this.events.push(new Talakat.SpawnEvent(name_2, radius, phase, speed, direction));
                    }
                    if (type == "delete" || type == "clear") {
                        this.events.push(new Talakat.ClearEvent(name_2));
                    }
                }
            }
        }
        ConditionalEvent.prototype.apply = function (world, x, y) {
            for (var _i = 0, _a = this.events; _i < _a.length; _i++) {
                var e = _a[_i];
                e.apply(world, x, y);
            }
        };
        return ConditionalEvent;
    }());
    Talakat.ConditionalEvent = ConditionalEvent;
})(Talakat || (Talakat = {}));
/// <reference path="ConditionalEvent.ts"/>
var Talakat;
(function (Talakat) {
    var GameScript = (function () {
        function GameScript() {
        }
        GameScript.prototype.initialize = function (script) {
            this.currentIndex = 0;
            this.events = [];
            for (var _i = 0, script_1 = script; _i < script_1.length; _i++) {
                var s = script_1[_i];
                this.events.push(new Talakat.ConditionalEvent(s));
            }
        };
        GameScript.prototype.clone = function () {
            var script = new GameScript();
            script.events = this.events;
            script.currentIndex = this.currentIndex;
            return script;
        };
        GameScript.prototype.update = function (world, x, y, health) {
            if (this.currentIndex >= this.events.length) {
                return;
            }
            if (health <= this.events[this.currentIndex].health) {
                this.events[this.currentIndex].apply(world, x, y);
                this.currentIndex += 1;
            }
        };
        return GameScript;
    }());
    Talakat.GameScript = GameScript;
})(Talakat || (Talakat = {}));
/// <reference path="Entity.ts"/>
/// <reference path="../Events/GameScript.ts"/>
var Talakat;
(function (Talakat) {
    var Boss = (function () {
        function Boss() {
            this.script = new Talakat.GameScript();
        }
        Boss.prototype.initialize = function (width, height, script) {
            this.x = width / 2;
            this.y = height / 4;
            this.maxHealth = 3000;
            if ("health" in script) {
                this.maxHealth = parseInt(script["health"]);
            }
            if ("position" in script) {
                var parts = script["position"].split(",");
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
        Boss.prototype.update = function (world) {
            this.health -= 1;
            if (this.health < 0) {
                this.health = 0;
            }
            if (!world.hideUnknown) {
                this.script.update(world, this.x, this.y, 100 * this.health / this.maxHealth);
            }
        };
        return Boss;
    }());
    Talakat.Boss = Boss;
})(Talakat || (Talakat = {}));
