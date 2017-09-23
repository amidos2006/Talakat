/// <reference path="ConditionalEvent.ts"/>

class GameScript{
    private events:ConditionalEvent[];
    private currentIndex:number;

    constructor(){
    }

    initialize(script:any):void{
        this.currentIndex = 0;
        this.events = [];
        for(let s of script){
            this.events.push(new ConditionalEvent(s));
        }
    }

    clone():GameScript{
        let script:GameScript = new GameScript();
        script.events = this.events;
        script.currentIndex = this.currentIndex;
        return script;
    }

    update(x:number, y:number, health:number):void{
        if(this.currentIndex >= this.events.length){
            return;
        }
        if(health <= this.events[this.currentIndex].health){
            this.events[this.currentIndex].apply(x, y);
            this.currentIndex += 1;
        }
    }
}