import {ScenePictures} from "./scene-pics";

export class Scene{

    private id: number;
    private nextId: number;
    private nextId2: number; //if the scene has no decisions => nextId2 = null
    private prevId: number;
    private talkingCharacter: string;
    private text: string;
    private pictures: ScenePictures;

    constructor(id: number, nextId: number, nextId2: number, prevId: number, talkingCharacter: string, text: string, pictures: ScenePictures) {
        this.id = id;
        this.nextId = nextId;
        this.nextId2 = nextId2;
        this.prevId = prevId;
        this.talkingCharacter = talkingCharacter;
        this. text = text;
        this.pictures = pictures;
    }
    public playScene(): number{
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

