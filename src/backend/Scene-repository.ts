
export interface IScene {
    id: number,
    nextId : number,
    ChoiceId: number,
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