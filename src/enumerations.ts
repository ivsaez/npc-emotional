export enum EffectDirection
{
    Neutral,
    Positive,
    Negative
}

export enum EffectKind
{
    None,
    Happiness,
    Friend,
    Sex,
    Love
}

export enum EffectStrength
{
    Null,
    Low,
    Medium,
    High
}

export enum EffectReaction
{
    VeryPositive,
    Positive,
    Negative,
    VeryNegative
}

export const StrengthValues = {
    [EffectStrength.Null]: 0,
    [EffectStrength.Low]: 5,
    [EffectStrength.Medium]: 10,
    [EffectStrength.High]: 25
}