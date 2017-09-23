let keys:any = {
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    left: false,
    right: false,
    up: false,
    down: false
}
let newWorld:World = null;
let currentWorld:World = null;
let action:Point = null;

function preload():void{
    
}

function setup():void{
    let canvas = createCanvas(400, 640);
    canvas.parent("game");
    action = new Point();
}

function startGame(input:string):void{
    newWorld = new GameWorld();
    let script:any = JSON.parse(input);
    (<GameWorld>newWorld).initialize(script);
}

function setKey(key:number, down:boolean):void{
    if(key == keys.LEFT_ARROW){
        keys.left = down;
    }
    if(key == keys.RIGHT_ARROW){
        keys.right = down;
    }
    if(key == keys.UP_ARROW){
        keys.up = down;
    }
    if(key == keys.DOWN_ARROW){
        keys.down = down;
    }
}

function keyPressed():void{
    setKey(keyCode, true);
}

function keyReleased():void{
    setKey(keyCode, false);
}

function draw():void{
    background(0,0,0);

    action.x = 0;
    action.y = 0;
    if(currentWorld != null){
        if(keys.left){
            action.x -= 1;
        }
        if(keys.right){
            action.x += 1;
        }
        if(keys.up){
            action.y -= 1;
        }
        if(keys.down){
            action.y += 1;
        }
        currentWorld.update(action);
        currentWorld.draw();
    }

    if(newWorld != null){
        currentWorld = newWorld;
        newWorld = null;
    }
}