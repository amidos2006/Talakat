namespace Talakat {
    export interface MovementPattern {
        adjustParameters(newValues: any[]): void;
        getParameters(): any[];
        getNextValues(x: number, y: number, diameter: number, color: number): any;
    }
}