import {ScenePictures} from "./scene-pics";

export class Scene{
    constructor(id: number) {
        this.id = id;

    }

    id: number;
    nextId: number;
    nextId2: number;
    prevId: number;
    talkingCharacter: string;
    text: string;
    pictures: ScenePictures;
    public playScene(pronouns: string[]): number{
        return;
    }

    public getId(): number {
        return this.id;
    }

    public getNextId(): number {
        return this.nextId;
    }

    public getNextId2(): number {
        return this.nextId2;
    }

    public getPrevId(): number {
        return this.prevId;
    }

    public getTalkingCharacter(): string {
        return this.talkingCharacter;
    }

    public getText(): string {
        return this.text;
    }

    public getPictures(): ScenePictures {
        return this.pictures;
    }

}

