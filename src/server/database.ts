import {open,Database} from "sqlite";
import {Database as Driver} from "sqlite3";
export const dbFileName = 'database.db';

export class DB {
  public static async createDBConnection(): Promise<Database> {
    const dbConnection = await open({
      filename: `./${dbFileName}`,
      driver: Driver,
    });
    await DB.ensureTablesCreated(dbConnection);
    return dbConnection;
  }

  //TODO!! create table pic every url should get saved in there with id
    // table pic( PK id number, url Text);
  private static async ensureTablesCreated(
    connection: Database
  ): Promise<void> {
    await connection.run(`
        create table if not exists Scenes (
            id INTEGER NOT NULL PRIMARY KEY,
            nextId INTeger,   -- TODO!! rename to nextID1
            choiceId Integer, -- TODO!! rename to nextID2
            prevId INTEGER,
            talkingChar Text NOT NULL,
            text TEXT NOT NULL,
            -- TODO!! add button1 and button2 (Text)
            ScenePicsId Integer, --TODO!! delete and change to left, right, background as FK to new table pics
            gameId Integer Primary Key                      
        )strict;`
    );
    await connection.run(`
       create table if not exists Games (
            gameId INTEGER NOT NULL PRIMARY KEY
       )strict;
    `);
    await connection.run(`
        create table if not exists GameInfos (
            gameInfoId INTEGER PRIMARY KEY,
            gameId INTEGER not null,
            gameName TEXT  DEFAULT "Visual Novel",

            FOREIGN KEY(gameId) REFERENCES Game(gameId)
        )strict;`
    );
    await connection.run(`
        ALTER TABLE Games ADD COLUMN gameInfoId INTEGER REFERENCES GameInfos(gameInfoId);
    `);
  }
}
