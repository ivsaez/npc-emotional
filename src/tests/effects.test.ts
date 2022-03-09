import { EffectDirection, EffectKind, EffectStrength } from "../enumerations";
import { EffectComponent } from "../components";
import { Effect } from "../effects";
import { RelationMetrics } from "npc-relations";

describe("Effect should", () => {
  it("create a new instance", () => {
    let effect = new Effect("target", [
        EffectComponent.positive(EffectKind.Friend, EffectStrength.Medium),
        EffectComponent.positive(EffectKind.Love, EffectStrength.High)
    ]);

    expect(effect.target).toBe("target");
    expect(effect.isTargeted).toBe(true);
    expect(effect.isNull).toBe(false);
    expect(effect.isThirdPerson).toBe(false);
    expect(effect.direction).toBe(EffectDirection.Positive);
    expect(effect.componentsValue).toBe(35);
    expect(effect.components.length).toBe(2);
    expect(effect.components[0].kind).toBe(EffectKind.Friend);
    expect(effect.components[0].strength).toBe(EffectStrength.Medium);
    expect(effect.components[1].kind).toBe(EffectKind.Love);
    expect(effect.components[1].strength).toBe(EffectStrength.High);
  });

  it("create with fluent methods", () => {
    let effect = new Effect("target", [
        EffectComponent.positive(EffectKind.Friend, EffectStrength.Medium)
    ])
    .forThirdPerson()
    .withNegative(EffectKind.Friend, EffectStrength.Medium)
    .withPositive(EffectKind.Love, EffectStrength.Low);

    expect(effect.target).toBe("target");
    expect(effect.isTargeted).toBe(true);
    expect(effect.isNull).toBe(false);
    expect(effect.isThirdPerson).toBe(true);
    expect(effect.direction).toBe(EffectDirection.Positive);
    expect(effect.componentsValue).toBe(5);
    expect(effect.components.length).toBe(3);
    expect(effect.components[0].kind).toBe(EffectKind.Friend);
    expect(effect.components[0].strength).toBe(EffectStrength.Medium);
    expect(effect.components[1].kind).toBe(EffectKind.Friend);
    expect(effect.components[1].strength).toBe(EffectStrength.Medium);
    expect(effect.components[2].kind).toBe(EffectKind.Love);
    expect(effect.components[2].strength).toBe(EffectStrength.Low);
  });

  it("combine a component", () => {
    let effect = new Effect("target", [
        EffectComponent.positive(EffectKind.Friend, EffectStrength.Medium)
    ])
    .withPositive(EffectKind.Friend, EffectStrength.High)
    .withPositive(EffectKind.Love, EffectStrength.Low);

    let friendComponent = effect.kindComponent(EffectKind.Friend);

    expect(friendComponent.kind).toBe(EffectKind.Friend);
    expect(friendComponent.direction).toBe(EffectDirection.Positive);
    expect(friendComponent.strength).toBe(EffectStrength.High);
  });

  it("create a null effect", () => {
    let effect = Effect.null();

    expect(effect.isNull).toBe(true);
  });

  it("create a neutral effect", () => {
    let effect = Effect.neutral("target");

    expect(effect.target).toBe("target");
    expect(effect.components.length).toBe(1);
    expect(effect.components[0].direction).toBe(EffectDirection.Neutral);
  });

  it("create an empty effect", () => {
    let effect = Effect.empty([
        EffectComponent.positive(EffectKind.Friend, EffectStrength.Medium)
    ]);

    expect(effect.isTargeted).toBe(false);
    expect(effect.components.length).toBe(1);
    expect(effect.components[0].kind).toBe(EffectKind.Friend);
    expect(effect.components[0].direction).toBe(EffectDirection.Positive);
    expect(effect.components[0].strength).toBe(EffectStrength.Medium);
  });

  it("create from metrics", () => {
    let metrics = new RelationMetrics(95, 95, 95);
    let effect = Effect.fromMetrics("target", metrics);

    expect(effect.isTargeted).toBe(true);
    expect(effect.components.length).toBe(3);
    expect(effect.components[0].kind).toBe(EffectKind.Friend);
    expect(effect.components[0].direction).toBe(EffectDirection.Positive);
    expect(effect.components[0].strength).toBe(EffectStrength.High);
    expect(effect.components[1].kind).toBe(EffectKind.Love);
    expect(effect.components[1].direction).toBe(EffectDirection.Positive);
    expect(effect.components[1].strength).toBe(EffectStrength.High);
    expect(effect.components[2].kind).toBe(EffectKind.Sex);
    expect(effect.components[2].direction).toBe(EffectDirection.Positive);
    expect(effect.components[2].strength).toBe(EffectStrength.High);
  });
});