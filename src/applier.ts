import { Effect } from "./effects";
import { Situation } from "./situation";
import { Reactions, Reaction } from "./reactions";
import { IEmotional } from "./interfaces";
import { EffectReaction, EffectKind, EffectDirection, StrengthValues, EffectStrength } from "./enumerations";
import { EffectComponent } from "./components";
import { Relation, RelationFactory, RelationKind } from "npc-relations";

export function apply(effect: Effect, situation: Situation, intimate: boolean): Reactions{
    var reactions = new Reactions();

    if (!effect.isTargeted)
    {
        reactions.append(applyBroadcastEffect(effect, situation.performer, situation.crowd));
        return reactions;
    }

    if (!effect.isThirdPerson || !intimate)
    {
        var reaction = applyInvolvedsEffect(effect, situation.performer, situation.target);
        reactions.add(reaction.name, reaction.reaction);
    }

    if (situation.crowd.length > 0 && !intimate)
        reactions.append(applyCrowdEffect(effect, situation.performer, situation.target, situation.crowd));

    return reactions;
}

function applyBroadcastEffect(effect: Effect, performer: IEmotional, crowd: IEmotional[]): Reactions
{
    var reactions = new Reactions();

    crowd.forEach(npc =>{
        let overallImpression: number = applyBroadcastEffectTo(effect, performer, npc);
        if (overallImpression > 0) reactions.add(npc.Name, EffectReaction.VeryPositive);
        else if (overallImpression < 0) reactions.add(npc.Name, EffectReaction.VeryNegative);
    });

    return reactions;
}

function applyBroadcastEffectTo(effect: Effect, performer: IEmotional, npc: IEmotional): number{
    let sum: number = 0;
    effect.components.forEach(component => {
        sum += component.directionVector;
        applyBroadcastComponent(component, performer, npc);
    });
    return sum;
}

function applyBroadcastComponent(component: EffectComponent, performer: IEmotional, npc: IEmotional): void
{
    if (component.isNeutral || component.kind === EffectKind.None) 
        return;

    if(component.kind === EffectKind.Happiness) 
    {
        npc.Happiness.increase(component.value);
        return;
    }

    applyBroadcastComponentRelation(component, performer, npc);
}

function applyBroadcastComponentRelation(component: EffectComponent, performer: IEmotional, npc: IEmotional): void{
    var relation = npc.Relations.get(performer.Name);
    
    component.kind == EffectKind.Friend
        ? applyBroadcastComponentFriendship(component, relation)
        : component.kind == EffectKind.Love
            ? applyBroadcastComponentLove(component, relation)
            : applyBroadcastComponentSex(component, performer, npc, relation);
}

function applyBroadcastComponentFriendship(component: EffectComponent, relation: Relation): void
{
    if ((component.direction == EffectDirection.Positive && !relation.isEnemy)
        || (component.direction == EffectDirection.Negative && !relation.isFriend))
    {
        relation.metrics.increaseFriendship(component.value);
    }
}

function applyBroadcastComponentLove(component: EffectComponent, relation: Relation): void
{
    if ((component.direction == EffectDirection.Positive && !relation.isExlover)
        || (component.direction == EffectDirection.Negative && !relation.isLover))
    {
        relation.metrics.increaseLove(component.value);
    }
}

function applyBroadcastComponentSex(component: EffectComponent, performer: IEmotional, npc: IEmotional, relation: Relation): void
{
    var sexFactor = npc.Likes.Eval(performer.Aspect);

    if ((component.direction == EffectDirection.Positive && sexFactor > 50)
        || (component.direction == EffectDirection.Negative && sexFactor < 50))
    {
        relation.metrics.increaseSex(component.value);
    }
}

function applyInvolvedsEffect(effect: Effect, performer: IEmotional, target: IEmotional): Reaction
{
    var relation = target.Relations.get(performer.Name);

    effect.components.forEach(component => applyComponent(target, relation, component));

    if (effect.direction == EffectDirection.Positive)
        return new Reaction(target.Name, EffectReaction.VeryPositive);
    else
        return new Reaction(target.Name, EffectReaction.VeryNegative);
}

function applyComponent(target: IEmotional, relation: Relation, component: EffectComponent): void
{
    if (component.isNeutral || component.kind === EffectKind.None) 
        return;

    if (component.kind === EffectKind.Happiness)
    {
        target.Happiness.increase(component.value);
    }
    else{
        applyComponentToRelation(relation, component);
    }
}

function applyComponentToRelation(relation: Relation, component: EffectComponent): void
{
    if (component.kind === EffectKind.Friend)
        relation.metrics.increaseFriendship(component.value);
    else if (component.kind === EffectKind.Sex)
        relation.metrics.increaseSex(component.value);
    else if (component.kind === EffectKind.Love)
        relation.metrics.increaseLove(component.value);
}

function applyCrowdEffect(effect: Effect, performer: IEmotional, target: IEmotional, crowd: IEmotional[]): Reactions
{
    var reactions = new Reactions();

    var direction = effect.direction;

    for (let npc of crowd)
    {
        if (npc.Relations.knows(target.Name))
        {
            var targetRelation = npc.Relations.get(target.Name);
            reactions.append(applyToKnownTarget(effect, performer, targetRelation, direction, npc));
        }
        else
        {
            reactions.append(applyToUnknownTarget(effect, performer, target, direction, npc));
        }
    }

    return reactions;
}

function applyToKnownTarget(effect: Effect, performer: IEmotional, targetRelation: Relation, direction: EffectDirection, npc: IEmotional): Reactions
{
    if (npc.Relations.knows(performer.Name))
    {
        var performerRelation = npc.Relations.get(performer.Name);

        return applyWhenAllKnown(effect, targetRelation, direction, npc, performerRelation);
    }

    return applyToOnlyKnownTarget(effect, performer, targetRelation, direction, npc);
}

function applyWhenAllKnown(effect: Effect, targetRelation: Relation, direction: EffectDirection, npc: IEmotional, performerRelation: Relation): Reactions
{
    if (direction == EffectDirection.Negative)
    {
        return applyWhenAllKnownNegative(targetRelation, npc, performerRelation);
    }

    return applyWhenAllKnownPositive(effect, targetRelation, npc, performerRelation);
}

function applyWhenAllKnownNegative(targetRelation: Relation, npc: IEmotional, performerRelation: Relation): Reactions
{
    var reactions = new Reactions();

    if (targetRelation.isFriend && performerRelation.isFriend
        || targetRelation.isLover && performerRelation.isLover
        || targetRelation.isFriend && performerRelation.isLover)
    {
        npc.Happiness.decrease(StrengthValues[EffectStrength.Medium]);

        reactions.add(npc.Name, EffectReaction.Negative);
    }
    else if (targetRelation.isLover && performerRelation.isFriend)
    {
        npc.Happiness.decrease(StrengthValues[EffectStrength.Medium]);
        performerRelation.metrics.decreaseFriendship(StrengthValues[EffectStrength.Medium]);

        reactions.add(npc.Name, EffectReaction.Negative);
    }
    else if (targetRelation.isEnemy || targetRelation.isExlover)
    {
        npc.Happiness.increase(StrengthValues[EffectStrength.Medium]);

        if (performerRelation.isFriend || performerRelation.isLover
            || (!performerRelation.isEnemy && !performerRelation.isExlover))
        {
            performerRelation.metrics.increaseFriendship(StrengthValues[EffectStrength.Medium]);
        }

        reactions.add(npc.Name, EffectReaction.Positive);
    }

    return reactions;
}

function applyWhenAllKnownPositive(effect: Effect, targetRelation: Relation, npc: IEmotional, performerRelation: Relation): Reactions
{
    var loveComponent = effect.kindComponent(EffectKind.Love);
    var sexComponent = effect.kindComponent(EffectKind.Sex);

    if ((loveComponent.isNeutral && sexComponent.isNeutral)
        || (loveComponent.direction != EffectDirection.Positive
            && sexComponent.direction != EffectDirection.Positive))
    {
        return applyWhenAllKnownPositiveNoLove(targetRelation, npc, performerRelation);
    }

    return applyWhenAllKnownPositiveLoveAndSex(targetRelation, npc, performerRelation);
}

function applyWhenAllKnownPositiveNoLove(targetRelation: Relation, npc: IEmotional, performerRelation: Relation): Reactions
{
    var reactions = new Reactions();

    if (targetRelation.isFriend || targetRelation.isLover)
    {
        performerRelation.metrics.increaseFriendship(StrengthValues[EffectStrength.Medium]);
        reactions.add(npc.Name, EffectReaction.Positive);
    }
    else if (targetRelation.isEnemy || targetRelation.isExlover)
    {
        if (performerRelation.isEnemy || performerRelation.isExlover)
        {
            performerRelation.metrics.decreaseFriendship(StrengthValues[EffectStrength.Medium]);
            reactions.add(npc.Name, EffectReaction.Negative);
        }
        else if (performerRelation.isFriend || performerRelation.isLover)
        {
            npc.Happiness.decrease(StrengthValues[EffectStrength.Medium]);
            performerRelation.metrics.decreaseFriendship(StrengthValues[EffectStrength.Medium]);
            reactions.add(npc.Name, EffectReaction.VeryNegative);
        }
    }

    return reactions;
}

function applyWhenAllKnownPositiveLoveAndSex(targetRelation: Relation, npc: IEmotional, performerRelation: Relation): Reactions
{
    var reactions = new Reactions();

    if (targetRelation.isEnemy || targetRelation.isExlover)
    {
        if ((performerRelation.isEnemy || performerRelation.isExlover)
            || (performerRelation.isFriend && !performerRelation.isLover))
        {
            performerRelation.metrics.decreaseFriendship(StrengthValues[EffectStrength.Medium]);
            reactions.add(npc.Name, EffectReaction.Negative);
        }
        else if (performerRelation.isLover)
        {
            npc.Happiness.decrease(StrengthValues[EffectStrength.High]);

            performerRelation.metrics.decreaseLove(StrengthValues[EffectStrength.High]);

            targetRelation.metrics.decreaseFriendship(StrengthValues[EffectStrength.High]);
            reactions.add(npc.Name, EffectReaction.VeryNegative);
        }
    }
    else if (targetRelation.isFriend && !targetRelation.isLover)
    {
        if ((performerRelation.isEnemy || performerRelation.isExlover)
            || (performerRelation.isFriend && !performerRelation.isLover))
        {
            performerRelation.metrics.increaseFriendship(StrengthValues[EffectStrength.Medium]);
            reactions.add(npc.Name, EffectReaction.Positive);
        }
        else if (performerRelation.isLover)
        {
            npc.Happiness.decrease(StrengthValues[EffectStrength.High]);

            performerRelation.metrics.decreaseLove(StrengthValues[EffectStrength.High]);

            targetRelation.metrics.decreaseFriendship(StrengthValues[EffectStrength.High]);

            reactions.add(npc.Name, EffectReaction.VeryNegative);
        }
    }
    else if (targetRelation.isLover)
    {
        if (performerRelation.isEnemy || performerRelation.isExlover)
        {
            performerRelation.metrics.decreaseFriendship(StrengthValues[EffectStrength.Medium]);
            reactions.add(npc.Name, EffectReaction.Negative);
        }
        else if (performerRelation.isFriend || performerRelation.isLover)
        {
            npc.Happiness.decrease(StrengthValues[EffectStrength.High]);
            performerRelation.metrics.decreaseFriendship(StrengthValues[EffectStrength.High]);
            reactions.add(npc.Name, EffectReaction.VeryNegative);
        }
    }

    return reactions;
}

function applyToOnlyKnownTarget(effect: Effect, performer: IEmotional, targetRelation: Relation, direction: EffectDirection, npc: IEmotional): Reactions
{
    if (direction == EffectDirection.Negative)
    {
        return applyToOnlyKnownTargetNegative(performer, targetRelation, npc);
    }

    return applyToOnlyKnownTargetPositive(effect, performer, targetRelation, npc);
}

function applyToOnlyKnownTargetNegative(performer: IEmotional, targetRelation: Relation, npc: IEmotional): Reactions
{
    var reactions = new Reactions();

    if (targetRelation.isEnemy || targetRelation.isExlover)
    {
        var relation = RelationFactory.get(RelationKind.Neutral);
        relation.metrics.increaseFriendship(StrengthValues[EffectStrength.Medium]);

        npc.Relations.add(performer.Name, relation);

        reactions.add(npc.Name, EffectReaction.Positive);
    }
    else if (targetRelation.isFriend || targetRelation.isLover)
    {
        var relation = RelationFactory.get(RelationKind.Neutral);
        relation.metrics.decreaseFriendship(StrengthValues[EffectStrength.Medium]);
        npc.Relations.add(performer.Name, relation);

        reactions.add(npc.Name, EffectReaction.Negative);
    }

    return reactions;
}

function applyToOnlyKnownTargetPositive(effect: Effect, performer: IEmotional, targetRelation: Relation, npc: IEmotional): Reactions
{
    var reactions = new Reactions();

    if (targetRelation.isLover)
    {
        var loveComponent = effect.kindComponent(EffectKind.Love);
        var sexComponent = effect.kindComponent(EffectKind.Sex);

        if (loveComponent.direction == EffectDirection.Positive
            || sexComponent.direction == EffectDirection.Positive)
        {
            var relation = RelationFactory.get(RelationKind.Enemy);
            npc.Relations.add(performer.Name, relation);

            reactions.add(npc.Name, EffectReaction.Negative);
        }
    }

    return reactions;
}

function applyToUnknownTarget(effect: Effect, performer: IEmotional, target: IEmotional, direction: EffectDirection, npc: IEmotional): Reactions
{
    if (npc.Relations.knows(performer.Name))
    {
        var performerRelation = npc.Relations.get(performer.Name);

        return applyWhenOnlyKnownPerformer(effect, target, direction, npc, performerRelation);
    }

    return applyWhenAllUnknown(performer, direction, npc);
}

function applyWhenOnlyKnownPerformer(effect: Effect, target: IEmotional, direction: EffectDirection, npc: IEmotional, performerRelation: Relation): Reactions
{
    if (direction == EffectDirection.Negative)
    {
        return applyWhenOnlyKnownPerformerNegative(performerRelation, npc);
    }

    return applyWhenOnlyKnownPerformerPositive(effect, target, npc, performerRelation);
}

function applyWhenOnlyKnownPerformerNegative(performerRelation: Relation, npc: IEmotional): Reactions
{
    var reactions = new Reactions();

    if (performerRelation.isEnemy)
        performerRelation.metrics.decreaseFriendship(StrengthValues[EffectStrength.Medium]);
    if (performerRelation.isExlover)
        performerRelation.metrics.decreaseLove(StrengthValues[EffectStrength.Medium]);

    if (performerRelation.isEnemy || performerRelation.isExlover)
        reactions.add(npc.Name, EffectReaction.Negative);

    return reactions;
}

function applyWhenOnlyKnownPerformerPositive(effect: Effect, target: IEmotional, npc: IEmotional, performerRelation: Relation): Reactions
{
    var reactions = new Reactions();

    if (performerRelation.isLover)
    {
        var loveComponent = effect.kindComponent(EffectKind.Love);
        var sexComponent = effect.kindComponent(EffectKind.Sex);

        if (loveComponent.direction == EffectDirection.Positive
            || sexComponent.direction == EffectDirection.Positive)
        {
            var relation = RelationFactory.get(RelationKind.Enemy);
            npc.Relations.add(target.Name, relation);

            npc.Happiness.decrease(Math.max(StrengthValues[loveComponent.strength], StrengthValues[sexComponent.strength]));

            performerRelation.metrics.decreaseLove(StrengthValues[loveComponent.strength]);

            reactions.add(npc.Name, EffectReaction.VeryNegative);
        }
    }

    return reactions;
}

function applyWhenAllUnknown(performer: IEmotional, direction: EffectDirection, npc: IEmotional): Reactions
{
    var reactions = new Reactions();

    if (direction == EffectDirection.Negative)
    {
        var relation = RelationFactory.get(RelationKind.Neutral);
        relation.metrics.decreaseFriendship(StrengthValues[EffectStrength.Low]);

        npc.Relations.add(performer.Name, relation);

        reactions.add(npc.Name, EffectReaction.Negative);
    }

    return reactions;
}