import { EffectDirection, EffectKind, EffectStrength } from "../enumerations";
import { EffectComponent } from "../components";

describe("Effect component should", () => {
  it("create a component", () => {
    let component = new EffectComponent(EffectKind.Love, EffectDirection.Positive, EffectStrength.High);

    expect(component.kind).toBe(EffectKind.Love);
    expect(component.direction).toBe(EffectDirection.Positive);
    expect(component.strength).toBe(EffectStrength.High);
    expect(component.isNeutral).toBe(false);
    expect(component.value).toBe(25);
    expect(component.directionVector).toBe(1);
  });

  it("create a neutral component", () => {
    let component = EffectComponent.neutral();

    expect(component.kind).toBe(EffectKind.None);
    expect(component.direction).toBe(EffectDirection.Neutral);
    expect(component.strength).toBe(EffectStrength.Null);
    expect(component.isNeutral).toBe(true);
    expect(component.value).toBe(0);
    expect(component.directionVector).toBe(0);
  });

  it("create a positive component", () => {
    let component = EffectComponent.positive(EffectKind.Friend, EffectStrength.Low);

    expect(component.kind).toBe(EffectKind.Friend);
    expect(component.direction).toBe(EffectDirection.Positive);
    expect(component.strength).toBe(EffectStrength.Low);
    expect(component.isNeutral).toBe(false);
    expect(component.value).toBe(5);
    expect(component.directionVector).toBe(1);
  });

  it("create a negative component", () => {
    let component = EffectComponent.negative(EffectKind.Sex, EffectStrength.Medium);

    expect(component.kind).toBe(EffectKind.Sex);
    expect(component.direction).toBe(EffectDirection.Negative);
    expect(component.strength).toBe(EffectStrength.Medium);
    expect(component.isNeutral).toBe(false);
    expect(component.value).toBe(-10);
    expect(component.directionVector).toBe(-1);
  });

  it("create a metric component", () => {
    let component = EffectComponent.metric(EffectKind.Happiness, 95);

    expect(component.kind).toBe(EffectKind.Happiness);
    expect(component.direction).toBe(EffectDirection.Positive);
    expect(component.strength).toBe(EffectStrength.High);
    expect(component.isNeutral).toBe(false);
    expect(component.value).toBe(25);
    expect(component.directionVector).toBe(1);
  });

  it("throw an exception when invalid none kinds passed", () => {
    let positiveErrorThrown = false;
    let negativeErrorThrown = false;
    let metricErrorThrown = false;
    
    try{
        EffectComponent.positive(EffectKind.None, EffectStrength.Low);
    }catch(error){
        positiveErrorThrown = true;
    }

    try{
        EffectComponent.negative(EffectKind.None, EffectStrength.Low);
    }catch(error){
        negativeErrorThrown = true;
    }

    try{
        EffectComponent.metric(EffectKind.None, 50);
    }catch(error){
        metricErrorThrown = true;
    }

    expect(positiveErrorThrown).toBe(true);
    expect(negativeErrorThrown).toBe(true);
    expect(metricErrorThrown).toBe(true);
  });
});