import { Happiness } from "npc-mind";
import { Relation, RelationSet } from "npc-relations";
import { Situation } from "../situation";
import { apply } from "../applier";
import { IEmotional } from "../interfaces";
import { Effect } from "../effects";
import { EffectComponent, EffectKind, EffectReaction, EffectStrength } from "..";

describe("Applier should", () => {
  it("apply reactions to npcs depending on the effect", () => {
    let performer: IEmotional = {
        Name: "Performer",
        Aspect: null,
        Likes: null,
        Happiness: new Happiness(),
        Personality: null,
        Relations: new RelationSet()
    };

    let target: IEmotional = {
        Name: "Target",
        Aspect: null,
        Likes: null,
        Happiness: new Happiness(),
        Personality: null,
        Relations: new RelationSet()
    };

    let crowd1: IEmotional = {
        Name: "Crowd1",
        Aspect: null,
        Likes: null,
        Happiness: new Happiness(),
        Personality: null,
        Relations: new RelationSet()
    };

    let crowd2: IEmotional = {
        Name: "Crowd2",
        Aspect: null,
        Likes: null,
        Happiness: new Happiness(),
        Personality: null,
        Relations: new RelationSet()
    };

    performer.Relations.add("Target", new Relation(90, 50, 50));
    target.Relations.add("Performer", new Relation(90, 50, 50));
    crowd1.Relations.add("Target", new Relation(90, 90, 90));

    let effect = new Effect("Target", [
        EffectComponent.positive(EffectKind.Sex, EffectStrength.High)
    ]);
    let situation = new Situation(performer, target, [crowd1, crowd2]);
    let reactions = apply(effect, situation, false);

    expect(reactions.any).toBe(true);
    expect(reactions.elements.length).toBe(2);
    expect(reactions.elements[0].name).toBe("Target");
    expect(reactions.elements[0].reaction).toBe(EffectReaction.VeryPositive);
    expect(reactions.elements[1].name).toBe("Crowd1");
    expect(reactions.elements[1].reaction).toBe(EffectReaction.Negative);
  });

  it("apply reactions to npcs depending on the intimate effect", () => {
    let performer: IEmotional = {
        Name: "Performer",
        Aspect: null,
        Likes: null,
        Happiness: new Happiness(),
        Personality: null,
        Relations: new RelationSet()
    };

    let target: IEmotional = {
        Name: "Target",
        Aspect: null,
        Likes: null,
        Happiness: new Happiness(),
        Personality: null,
        Relations: new RelationSet()
    };

    let crowd1: IEmotional = {
        Name: "Crowd1",
        Aspect: null,
        Likes: null,
        Happiness: new Happiness(),
        Personality: null,
        Relations: new RelationSet()
    };

    let crowd2: IEmotional = {
        Name: "Crowd2",
        Aspect: null,
        Likes: null,
        Happiness: new Happiness(),
        Personality: null,
        Relations: new RelationSet()
    };

    performer.Relations.add("Target", new Relation(90, 50, 50));
    target.Relations.add("Performer", new Relation(90, 50, 50));
    crowd1.Relations.add("Target", new Relation(90, 90, 90));

    let effect = new Effect("Target", [
        EffectComponent.positive(EffectKind.Sex, EffectStrength.High)
    ]);
    let situation = new Situation(performer, target, [crowd1, crowd2]);
    let reactions = apply(effect, situation, true);

    expect(reactions.any).toBe(true);
    expect(reactions.elements.length).toBe(1);
    expect(reactions.elements[0].name).toBe("Target");
    expect(reactions.elements[0].reaction).toBe(EffectReaction.VeryPositive);
  });
});