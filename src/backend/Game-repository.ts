import {IScene, IScenePictures} from "./Scene-repository";

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

let nextId = 0;

let games:IGame[] = [];

function findGameIndex(id: number) {
    for (let i = 0; i < games.length; i++) {
        if (games[i].id === id) {
            return i;
        }
    }
    return -1;
}

export function getAllGames() {
    return games;
}

export function getGameById(id: number): IGame|undefined {
    const index: number = findGameIndex(id);
    if (index < 0) {
        return undefined;
    }
    return games[index];
}

export function addGame(nextId: number, scenes: IScene[],infos: IGameinfo): IGame {
    const game: IGame = { id: nextId++, scenes: scenes, infos: infos};
    games.push(game);
    return game;
}

export function removeAllGames(): void {
    games.splice(0);
}

export function removeGame(game: IGame): void {
    const index: number = findGameIndex(game.id);
    if (index < 0) {
        return;
    }
    games.splice(index, 1);
}
