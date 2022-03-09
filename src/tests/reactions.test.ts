import { EffectReaction } from "../enumerations";
import { Reaction, Reactions } from "../reactions";

describe("Reactions should", () => {
  it("create a list of reactions", () => {
    let reactions = new Reactions();

    expect(reactions.any).toBe(false);

    let reaction = new Reaction("name", EffectReaction.Negative);
    reactions.append(reaction);

    reactions.add("other", EffectReaction.VeryNegative);

    expect(reactions.elements.length).toBe(2);
    expect(reactions.elements[0].name).toBe("name");
    expect(reactions.elements[0].reaction).toBe(EffectReaction.Negative);
    expect(reactions.elements[1].name).toBe("other");
    expect(reactions.elements[1].reaction).toBe(EffectReaction.VeryNegative);
  });
});