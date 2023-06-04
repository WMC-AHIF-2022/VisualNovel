import {open,Database} from "sqlite";
import {Database as Driver} from "sqlite3";
import {StatusCodes} from "http-status-codes";
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

  private static async ensureTablesCreated(
    connection: Database
  ): Promise<void> {
    await connection.run(`
      create table if not exists Account (
          accountId INTEGER NOT NULL PRIMARY KEY,
          name TEXT NOT NULL,
          password TEXT NOT NULL
          )strict;`
    );
    await connection.run(`
      create table if not exists Scenes (
          id INTEGER NOT NULL PRIMARY KEY,
          nextId1 INTEGER,
          nextId2 INTEGER,
          prevId INTEGER,
          talkingChar TEXT NOT NULL,
          text TEXT NOT NULL,
          button1 TEXT,
          button2 TEXT,
          picLeft INTEGER,
          picRight INTEGER,
          picBackground INTEGER,
          gameId INTEGER,
          FOREIGN KEY (gameId) REFERENCES Games(gameId),
          FOREIGN KEY (picLeft) REFERENCES Picture(picId),
          FOREIGN KEY (picRight) REFERENCES Picture(picId),
          FOREIGN KEY (picBackground) REFERENCES Picture(picId)
      )strict;`
    );
    await connection.run(`
      create table if not exists Games (
         gameId INTEGER NOT NULL PRIMARY KEY,
         creationDate DATE,
         creator TEXT DEFAULT "Guest",
         gameName TEXT  DEFAULT "Visual Novel",
         description TEXT DEFAULT "This game has no description yet!"
      )strict;`
    );
    await connection.run(`
      create table if not exists Picture (
         picId INTEGER NOT NULL PRIMARY KEY,
         url TEXT NOT NULL,
         gameId INTEGER NOT NULL,
         FOREIGN KEY (gameId) REFERENCES Games(gameId)
      )strict;`
    );
  }
}
