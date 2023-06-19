export interface IGame {
    id: number,
    creator: string,
    description: string,
    creationDate: number,
    gameName:string
}

export interface IPicture {
    picId: number;
    url: string;
    gameId: number;
}

export interface IScene {
    id: number;
    nextId1: number;
    nextId2: number;
    prevId: number;
    talkingChar: string;
    text: string;
    button1: string;
    button2: string;
    picLeft: number;
    picRight: number;
    picBackground: number;
    gameId: number;
}
