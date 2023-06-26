import {DB} from "../database";

export interface IGame {
  thumbnailURL: string;
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
  const stmt = await db.prepare('insert into Games (creator,description, creationDate,gameName, thumbnailURL)values(?1,?2, ?3,?4,?5)');
  await stmt.bind({1:game.creator, 2:game.description, 3:game.creationDate, 4:game.gameName, 5:game.thumbnailURL});
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

export async function updateGame(game:IGame): Promise<void> {
  const db = await DB.createDBConnection();
  await db.get('PRAGMA foreign_keys = ON');
  const stmt = await db.prepare('UPDATE Games SET creator=?1,description=?2, creationDate=?3,gameName=?4, thumbnailURL=?5 WHERE id = ?6');
  await stmt.bind({1:game.creator, 2:game.description, 3:game.creationDate, 4:game.gameName, 5:game.thumbnailURL, 6:game.id});
  await stmt.finalize();
  await db.close();
}


