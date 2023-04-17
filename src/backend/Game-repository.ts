import {IScene} from "./Scene-repository";

export interface IGame {
    id: number,
    scenes: IScene[],
    //TODO!! player
    infos: IGameinfo
}

export interface IGameinfo{
    creator: string,
    description: string,
    releaseDate: Date
}

let IGame