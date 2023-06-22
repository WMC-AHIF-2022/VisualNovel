import {DB} from "../database";

export interface IGame {
  id: number,
  creator: string,
  description: string,
  creationDate: number,
  gameName:string
}

export interface IGameinfo {
}

export async function getAllGames(): Promise<IGame[]> {
  console.log("getAllGames");
  const db = await DB.createDBConnection();
  const games = await db.all<IGame[]>('select * from Games');
  console.log(games);
  await db.close();
  return games;
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


