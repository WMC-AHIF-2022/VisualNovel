import {DB} from "../database";
import {IScene} from "./scene-repository";

export interface IGame {
  id: number,
  creator: string,
  description: string,
  creationDate: number,
  gameName:string
}

export interface IGameinfo {
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

export async function getAllGames(): Promise<IGame[]> {
  console.log("getAllGames");
  const db = await DB.createDBConnection();
  const games = await db.all<IGame[]>('select * from Games');
  console.log(games);
  await db.close();
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
  await db.get('PRAGMA foreign_keys = ON');
  const stmt = await db.prepare('insert into Games (creator,description, creationDate,gameName)values(?1,?2, ?3,?4)');
  await stmt.bind({1:game.creator, 2:game.description, 3:game.creationDate, 4:game.gameName});
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
