import { EffectReaction } from "./enumerations";

export class Reaction{
    private _name: string;
    private _reaction: EffectReaction;

    constructor(name: string, reaction: EffectReaction){
        if(name === undefined || name === null)
            throw new Error("Name cannot be null.");

        this._name = name;
        this._reaction = reaction;
    }

    get name(){
        return this._name;
    }

    get reaction(){
        return this._reaction;
    }
}

export class Reactions{
    private _elements: Reaction[];

    constructor(){
        this._elements = [];
    }

    get elements(){
        return this._elements;
    }

    get any(): boolean{
        return this._elements.length > 0;
    }

    add(name: string, reaction: EffectReaction){
        this._elements.push(new Reaction(name, reaction));
    }

    append(reaction: Reaction){
        if(reaction === undefined || reaction === null)
            throw new Error("Reaction cannot be null.");
        
        this._elements.push(reaction);
    }
}