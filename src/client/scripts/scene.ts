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


}

export function playScene(): number{
    return;
}