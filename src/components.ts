import { 
    EffectKind, 
    EffectDirection, 
    EffectStrength ,
    StrengthValues
} from "./enumerations";

export class EffectComponent{
    private _kind: EffectKind;
    private _direction: EffectDirection;
    private _strength: EffectStrength;

    constructor(kind: EffectKind, direction: EffectDirection, strength: EffectStrength){
        this._kind = kind;
        this._direction = direction;
        this._strength = strength;
    }

    get kind(){
        return this._kind;
    }

    get direction(){
        return this._direction;
    }

    get strength(){
        return this._strength;
    }

    get value(): number{
        return this._direction == EffectDirection.Neutral
            ? 0
            : this._direction == EffectDirection.Positive
                ? StrengthValues[this._strength]
                : StrengthValues[this._strength] * -1;
    }

    get directionVector(): number{
        return this._direction === EffectDirection.Negative
            ? -1
            : this._direction === EffectDirection.Positive
                ? 1
                : 0;
    }

    get isNeutral(): boolean{
        return this._kind == EffectKind.None
        && this._direction == EffectDirection.Neutral
        && this._strength == EffectStrength.Null;
    }

    static neutral(): EffectComponent{
        return new EffectComponent(EffectKind.None, EffectDirection.Neutral, EffectStrength.Null);
    }

    static positive(kind: EffectKind, strength: EffectStrength): EffectComponent{
        if(kind === EffectKind.None)
            throw new Error("Kind cannot be None if positive.");

        return new EffectComponent(kind, EffectDirection.Positive, strength);
    }

    static negative(kind: EffectKind, strength: EffectStrength): EffectComponent{
        if(kind === EffectKind.None)
            throw new Error("Kind cannot be None if negative.");
        
        return new EffectComponent(kind, EffectDirection.Negative, strength);
    }

    static metric(kind: EffectKind, metric: number): EffectComponent{
        if(kind === EffectKind.None)
            throw new Error("Kind cannot be None if metric.");
        
        let component = EffectComponent.neutral();
        component._kind = kind;
        component._direction = metric > 55
            ? EffectDirection.Positive
            : metric < 45
                ? EffectDirection.Negative
                : EffectDirection.Neutral;

        if (component._direction == EffectDirection.Positive)
        {
            if (metric > 55 && metric <= 75) component._strength = EffectStrength.Low;
            else if (metric > 75 && metric <= 90) component._strength = EffectStrength.Medium;
            else if (metric > 90) component._strength = EffectStrength.High;
        }
        else if (component._direction == EffectDirection.Negative)
        {
            if (metric < 45 && metric >= 25) component._strength = EffectStrength.Low;
            else if (metric < 25 && metric >= 10) component._strength = EffectStrength.Medium;
            else if (metric < 10) component._strength = EffectStrength.High;
        }
        else
        {
            component._strength = EffectStrength.Null;
        }

        return component;
    }
}