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

function startRandomGame():void{
    let spawner:any = {
        "origin": ["{#patternParam#, #timeParam#, #repeatParam#}", "{#patternParam#, #timeParam#, #repeatParam#, #sPhaseParam#, #sRadiusParam#}", "{#patternParam#, #timeParam#, #repeatParam#, #sPhaseParam#, #sRadiusParam#, #numberParam#, #angleParam#, #speedParam#, #radiusParam#}"],
        "patternParam": ["\"pattern\": \\[#patternNames#\\]"],
        "timeParam": ["\"patternTime\": \"#timeNumber#\""],
        "repeatParam": ["\"patternRepeat\":\"#repeatNumber#\""],
        "sPhaseParam": ["\"spawnerPhase\":\"#angleModifier#\""],
        "sRadiusParam": ["\"spawnerRadius\": \"#radiusModifier#\""],
        "numberParam": ["\"spawnedNumber\": \"#numberModifier#\""],
        "angleParam": ["\"spawnedAngle\": \"#angleModifier#\""],
        "speedParam": ["\"spawnedSpeed\": \"#numberModifier#\""],
        "radiusParam": ["\"bulletRadius\": \"#radiusModifier#\""],
    
        "patternNames": ["\"#name#\"", "#patternNames#, \"#name#\""],
        "angleModifier": ["#angleNumber#", "#smallAngleNumber#, #largeAngleNumber#, #largeRateNumber#, #timeNumber#, #bounds#"],
        "radiusModifier": ["#radiusNumber#", "#smallRadiusNumber#, #largeRadiusNumber#, #largeRateNumber#, #timeNumber#, #bounds#"],
        "numberModifier": ["#number#", "#smallNumber#, #largeNumber#, #smallRateNumber#, #timeNumber#, #bounds#"],
    
        "name": ["bullet", "bullet", "bullet", "bullet", "bullet", "bullet", "bullet", "wait", "wait", "wait", "first", "second", "third", "fourth", "fifth"],
        "number": ["1", "2", "3", "4", "5", "6"],
        "smallNumber": ["1", "2", "3"],
        "largeNumber": ["4", "5", "6"],
        "timeNumber": ["2", "3", "4", "5", "6"],
        "repeatNumber": ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "1", "2", "3", "4", "5"],
        "angleNumber": ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100", "110", "120", "130", "140", "150", "160", "170", "180", "190", "200", "210", "220", "230", "240", "250", "260", "270", "280", "290", "300", "310", "320", "330", "340", "350"],
        "smallAngleNumber": ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100", "110", "120", "130", "140", "150", "160", "170"],
        "largeAngleNumber": ["180", "190", "200", "210", "220", "230", "240", "250", "260", "270", "280", "290", "300", "310", "320", "330", "340", "350"],
        "radiusNumber": ["0", "20", "40", "60", "80", "100"],
        "smallRadiusNumber": ["0", "10", "20", "30", "40", "50"],
        "largeRadiusNumber": ["60", "70", "80", "90", "100"],
        "smallRateNumber": ["-1", "-0.8", "-0.7", "-0.6", "-0.5", "-0.4", "-0.3", "-0.2", "-0.1", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1"],
        "largeRateNumber": ["-5", "-4", "-3", "-2", "-1", "1", "2", "3", "4", "5"],
        "bounds": ["circle", "reverse"]
    };
    
    let boss:any = {
        "origin": ["\\[#script#\\]"],
        "script": ["#condEvent#", "#script#, #condEvent#"],
        "condEvent": ["{\"health\":\"#percent#\", \"events\":\\[#events#\\]}"],
        "percent": ["1", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1"],
        "events": ["\"#event#\"", "#events#, \"#event#\""],
        "event": ["#type#, #name#, #radiusNumber#, #angleNumber#, #speedNumber#, #angleNumber#", "#type#, #name#", "#type#, #name#, #radiusNumber#, #angleNumber#"],
        "type": ["clear", "spawn", "spawn", "spawn", "spawn", "spawn"],
        "name": ["first", "second", "third", "fourth", "fifth"],
        "radiusNumber":["0", "20", "40", "60", "80", "100"],
        "angleNumber":["0", "10" ,"20", "30", "40", "50", "60", "70", "80", "90", "100", "110", "120", "130", "140", "150", "160", "170", "180", "190", "200", "210", "220", "230", "240", "250", "260", "270", "280", "290", "300", "310", "320", "330", "340", "350"],
        "speedNumber": ["1", "2", "3", "4"]
    };

    let input:string = "{\"spawners\":{";
    for(let name of boss.name){
        spawner.name.splice(spawner.name.indexOf(name),1);
        let spawnerGrammar:tracery.Grammar = tracery.createGrammar(spawner);
        input += "\"" + name + "\":" + spawnerGrammar.flatten("#origin#") + ",";
        spawner.name.push(name);
    }
    let bossGrammar:tracery.Grammar = tracery.createGrammar(boss);
    input = input.substring(0, input.length - 1) + "}, \"boss\":{\"script\":[";
    for(let p of boss.percent){
        input += "{\"health\":" + "\"" + p + "\",\"events\":[" + bossGrammar.flatten("#events#") + "]},";
    }
    input = input.substring(0, input.length - 1) + "]}}";

    document.getElementById('inputtext').innerText = input;
    startGame(input);
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
        
        background(0,0,0);
        currentWorld.draw();
    }

    if(newWorld != null){
        currentWorld = newWorld;
        newWorld = null;
    }
}