namespace Talakat {
    export class ValueModifier {
        public minValue: number;
        public maxValue: number;
        public timeBetween: number;
        public rate: number;
        public type: string;

        public currentValue: number;
        public currentRate: number;
        public currentTimer: number;

        constructor(minValue: number = 0, maxValue: number = 0, rate: number = 0, timeBetween: number = 0, type: string = "none") {
            this.minValue = minValue;
            this.maxValue = maxValue;
            if(this.minValue > this.maxValue){
                this.minValue = maxValue;
                this.maxValue = minValue;
            }
            this.rate = rate;
            this.timeBetween = timeBetween;
            this.type = type;
        }

        initialize(): void {
            this.currentValue = this.minValue;
            this.currentRate = this.rate;
            this.currentTimer = 0;
        }

        clone(): ValueModifier {
            let temp: ValueModifier = new ValueModifier();
            temp.minValue = this.minValue;
            temp.maxValue = this.maxValue;
            temp.rate = this.rate;
            temp.timeBetween = this.timeBetween;
            temp.type = this.type;
            temp.currentValue = this.currentValue;
            temp.currentRate = this.currentRate;
            temp.currentTimer = this.currentTimer;
            return temp;
        }

        update(): void {
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
        }
    }
}