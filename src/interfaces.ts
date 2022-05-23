import { RelationSet } from "npc-relations";
import { Happiness, Personality } from "npc-mind";
import { Aspect, Likes } from "npc-aspect";

export interface IEmotional{
    Name: string,
    Relations: RelationSet,
    Happiness: Happiness,
    Personality: Personality,
    Aspect: Aspect,
    Likes: Likes,
    IsActive: boolean
}