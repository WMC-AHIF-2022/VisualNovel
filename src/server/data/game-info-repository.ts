import {IGame, IGameinfo} from "./game-repository";
import {DB} from "../database";


let gameinfos: IGameinfo[] = [];

export async function getAllGameInfos() {
    const db = await DB.createDBConnection();
    gameinfos = await db.all<IGameinfo[]>('select * from IGameinfo');
    await db.close();
    return gameinfos;
}

export async function addGameInfo(info:IGameinfo): Promise<void> {
    const db = await DB.createDBConnection();
    await db.get('PRAGMA foreign_keys = ON');
    const stmt = await db.prepare('insert into IGameinfo(infoId, creator, description, releaseDate, name)values(?1, ?2, ?3, ?4, ?5)');
    await stmt.bind({1:info.infoId, 2:info.creator, 3:info.description, 4:info.releaseDate, 5:info.name});
    const operationResult = await stmt.run();
    await stmt.finalize();
    await db.close();

    if (typeof operationResult.changes !== "number" || operationResult.changes !== 1) {
        throw new Error("DB Error");
    }
    else {
        info.infoId = operationResult.lastID!;
    }

}
