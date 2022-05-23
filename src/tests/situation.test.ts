import { IEmotional } from "..";
import { Situation } from "../situation";

describe("Situation should", () => {
  it("create a new situation", () => {
    let performer: IEmotional = {
        Name: "performer",
        Aspect: null,
        Likes: null,
        Happiness: null,
        Personality: null,
        Relations: null,
        IsActive: true
    }

    let target: IEmotional = {
        Name: "target",
        Aspect: null,
        Likes: null,
        Happiness: null,
        Personality: null,
        Relations: null,
        IsActive: true
    }

    let other: IEmotional[] = [
        {
            Name: "first",
            Aspect: null,
            Likes: null,
            Happiness: null,
            Personality: null,
            Relations: null,
            IsActive: true
        },
        {
            Name: "second",
            Aspect: null,
            Likes: null,
            Happiness: null,
            Personality: null,
            Relations: null,
            IsActive: true
        }
    ];

    let situation = new Situation(performer, target, other);

    expect(situation.performer.Name).toBe(situation.performer.Name);
    expect(situation.target.Name).toBe(situation.target.Name);
    expect(situation.crowd.length).toBe(2);
    expect(situation.crowd[0].Name).toBe("first");
    expect(situation.crowd[1].Name).toBe("second");
    expect(situation.all.length).toBe(4);
    expect(situation.all[0].Name).toBe("first");
    expect(situation.all[1].Name).toBe("second");
    expect(situation.all[2].Name).toBe("performer");
    expect(situation.all[3].Name).toBe("target");
  });

  it("throw an error if performer is null", () => {
    let exceptionThrown: boolean = false;

    let target: IEmotional = {
        Name: "performer",
        Aspect: null,
        Likes: null,
        Happiness: null,
        Personality: null,
        Relations: null,
        IsActive: true
    }

    let other: IEmotional[] = [
        {
            Name: "first",
            Aspect: null,
            Likes: null,
            Happiness: null,
            Personality: null,
            Relations: null,
            IsActive: true
        },
        {
            Name: "second",
            Aspect: null,
            Likes: null,
            Happiness: null,
            Personality: null,
            Relations: null,
            IsActive: true
        }
    ];

    try{
        let situation = new Situation(null, target, other);
    }catch(error){
        exceptionThrown = true;
    }

    expect(exceptionThrown).toBe(true);
  });

  it("create a situation with default null crowd", () => {
    let performer: IEmotional = {
        Name: "performer",
        Aspect: null,
        Likes: null,
        Happiness: null,
        Personality: null,
        Relations: null,
        IsActive: true
    }

    let target: IEmotional = {
        Name: "target",
        Aspect: null,
        Likes: null,
        Happiness: null,
        Personality: null,
        Relations: null,
        IsActive: true
    }

    let situation = new Situation(performer, target);

    expect(situation.performer.Name).toBe(situation.performer.Name);
    expect(situation.target.Name).toBe(situation.target.Name);
    expect(situation.crowd.length).toBe(0);
    expect(situation.all.length).toBe(2);
    expect(situation.all[0].Name).toBe("performer");
    expect(situation.all[1].Name).toBe("target");
  });

  it("allow create with null target", () => {
    let performer: IEmotional = {
        Name: "performer",
        Aspect: null,
        Likes: null,
        Happiness: null,
        Personality: null,
        Relations: null,
        IsActive: true
    }

    let other: IEmotional[] = [
        {
            Name: "first",
            Aspect: null,
            Likes: null,
            Happiness: null,
            Personality: null,
            Relations: null,
            IsActive: true
        },
        {
            Name: "second",
            Aspect: null,
            Likes: null,
            Happiness: null,
            Personality: null,
            Relations: null,
            IsActive: true
        }
    ];

    let situation = new Situation(performer, null, other);

    expect(situation.performer.Name).toBe(situation.performer.Name);
    expect(situation.target).toBe(null);
    expect(situation.crowd.length).toBe(2);
    expect(situation.crowd[0].Name).toBe("first");
    expect(situation.crowd[1].Name).toBe("second");
    expect(situation.all.length).toBe(3);
    expect(situation.all[0].Name).toBe("first");
    expect(situation.all[1].Name).toBe("second");
    expect(situation.all[2].Name).toBe("performer");
  });
});