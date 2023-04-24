
export interface IScene {
    id: number,
    nextId : number,
    choiceId: number,
    beforeId : number,
    talkingChar: string,
    text: string,
    scenePics: IScenePictures
}

export interface IScenePictures{
    /*leftChar: string,
    rightChar: string,
    background: string*/
}

let nextId = 0;
let scenes: IScene[] = [];

function findSceneIndex(id: number) {
    for (let i = 0; i < scenes.length; i++) {
        if (scenes[i].id === id) {
            return i;
        }
    }
    return -1;
}

export function getAllScenes() {
    return scenes;
}

export function getSceneById(id: number): IScene|undefined {
    const index: number = findSceneIndex(id);
    if (index < 0) {
        return undefined;
    }
    return scenes[index];
}

export function addScene(nextId: number,choiceId: number,beforeId: number,talkingChar:string,text:string,pics:IScenePictures): IScene {
    const scene: IScene = { id: nextId++, nextId: nextId, choiceId: choiceId,beforeId: beforeId,talkingChar: talkingChar,text:text,scenePics: pics};
    scenes.push(scene);
    return scene;
}

export function removeAllScenes(): void {
    scenes.splice(0);
}

export function removeScene(scene: IScene): void {
    const index: number = findSceneIndex(scene.id);
    if (index < 0) {
        return;
    }
    scenes.splice(index, 1);
}
