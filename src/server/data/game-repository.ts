
import {DB} from "../database";
import {IScene} from "./scene-repository";

export interface IGame {
    id: number,
    scenes: IScene[],
    infoId: number
}

export interface IGameinfo{
    infoId: number,
    creator: string,
    description: string,
    releaseDate: Date,
    name:string
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

export async function addGame(game:IGame): Promise<void> {
    const db = await DB.createDBConnection();
    const stmt = await db.prepare('insert into Games (infoId)values(?1)');
    await stmt.bind({1:game.infoId});
    const operationResult =await stmt.run();
    await stmt.finalize();
    await db.close();

    if (typeof operationResult.changes !== "number" || operationResult.changes !== 1) {
        throw new Error("DB Error");
    }
    else {
        game.id = operationResult.lastID!;
    }

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
