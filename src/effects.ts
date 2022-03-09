import { RelationMetrics } from "npc-relations";
import { EffectComponent } from "./components";
import { 
    EffectKind, 
    EffectDirection, 
    EffectStrength
} from "./enumerations";

export class Effect{
    _components: EffectComponent[];
    _target: string;
    _isThirdPerson: boolean;

    constructor(target:string, components: EffectComponent[]){
        if(!components || components === null || components.length === 0)
            throw new Error("There must be almost one component.");

        this._target = target;
        this._components = components;
        this._isThirdPerson = false;
    }

    get components(){
        return this._components;
    }

    get target(){
        return this._target;
    }

    get isTargeted(): boolean{
        return this._target !== undefined && this._target !== null;
    }

    get isThirdPerson(){
        return this._isThirdPerson;
    }

    get isNull(): boolean{
        return !this.isTargeted && this.direction === EffectDirection.Neutral;
    }

    get componentsValue(){
        let sum: number = 0;
        for(let component of this.components){
            sum += component.value;
        }

        return sum;
    }

    get direction(): EffectDirection{
        let totalValues: number = this.componentsValue;
        return totalValues == 0
            ? EffectDirection.Neutral
            : totalValues > 0
                ? EffectDirection.Positive
                : EffectDirection.Negative;
    }

    forThirdPerson(): Effect{
        this._isThirdPerson = true;
        return this;
    }

    withPositive(kind: EffectKind, strength: EffectStrength): Effect{
        this.components.push(EffectComponent.positive(kind, strength));
        return this;
    }

    withNegative(kind: EffectKind, strength: EffectStrength): Effect{
        this.components.push(EffectComponent.negative(kind, strength));
        return this;
    }

    kindComponent(kind: EffectKind): EffectComponent
    {
        let totalValue: number = 0;
        for(let component of this._components.filter(x => x.kind === kind)){
            totalValue += component.value;
        }
        
        let absValue = totalValue;
        if(absValue < 0) absValue = absValue * -1;

        var strength = absValue > 10
            ? EffectStrength.High
            : absValue > 5
                ? EffectStrength.Medium
                : absValue > 1
                    ? EffectStrength.Low
                    : EffectStrength.Null;

        return totalValue == 0
            ? EffectComponent.neutral()
            : totalValue > 0
                ? EffectComponent.positive(kind, strength)
                : EffectComponent.negative(kind, strength);
    }

    static fromMetrics(target: string, metrics: RelationMetrics): Effect{
        if (metrics === undefined || metrics === null)
            throw new Error("Metrics must have a value.");

        let components = [
            EffectComponent.metric(EffectKind.Friend, metrics.friendship),
            EffectComponent.metric(EffectKind.Love, metrics.love),
            EffectComponent.metric(EffectKind.Sex, metrics.sex)
        ];

        return new Effect(target, components);
    }

    static null(): Effect{
        return new Effect(null, [ EffectComponent.neutral() ]);
    }

    static neutral(target: string): Effect{
        return new Effect(target, [ EffectComponent.neutral() ]);
    }

    static empty(components: EffectComponent[]): Effect{
        return new Effect(null, components);
    }
}