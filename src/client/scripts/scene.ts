import {ScenePictures} from "./scene-pics";

export class Scene{
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