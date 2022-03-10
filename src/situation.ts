import { IEmotional } from "./interfaces"

export class Situation{
    private _performer: IEmotional;
    private _target: IEmotional;
    private _crowd: Set<IEmotional>;

    constructor(performer: IEmotional, target: IEmotional, crowd: IEmotional[] = null){
        if(performer === undefined || performer === null)
            throw new Error("Performer cannot be null");

        this._performer = performer;

        this._target = target === undefined || target === null 
            ? null 
            : target;

        this._crowd = new Set<IEmotional>();
        if(crowd !== null){
            for(let emotional of crowd.values()){
                this._crowd.add(emotional);
            }
        }
    }

    get performer(){
        return this._performer;
    }

    get target(){
        return this._target;
    }

    get crowd(): IEmotional[]{
        let result: IEmotional[] = [];
        this._crowd.forEach(emotional => result.push(emotional));
        return result;
    }

    get all(): IEmotional[]{
        let total = this.crowd;
        total.push(this._performer);
        if(this._target !== undefined && this._target !== null){
            total.push(this._target);
        }

        return total;
    }
}