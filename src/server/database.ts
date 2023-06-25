import {open,Database} from "sqlite";
import {Database as Driver, verbose} from "sqlite3";
import {IGame} from "./data/game-repository";
export const dbFileName = 'database.db';

export class DB {
  public static async createDBConnection(): Promise<Database> {
    const dbConnection = await open({
      filename: `./${dbFileName}`,
      driver: Driver,
    });
    await DB.ensureTablesCreated(dbConnection);
    console.log("dbConnection");
    return dbConnection;
  }

  private static async ensureTablesCreated(
    connection: Database
  ): Promise<void> {
    await connection.run(`
      create table if not exists Account (
          accountId INTEGER NOT NULL PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
          )strict;`
    );
      await connection.run(`
          create table if not exists Games (
           gameId INTEGER NOT NULL PRIMARY KEY,
           creationDate INTEGER,
           creator TEXT DEFAULT 'Guest',
           gameName TEXT DEFAULT 'Visual Novel',
           description TEXT DEFAULT 'This game has no description yet!'
          )strict;`
      );
      await connection.run(`
          create table if not exists Picture (
             picId INTEGER NOT NULL ,
             url TEXT NOT NULL,
             picName Text NOT NULL Unique,
             gameId INTEGER NOT NULL,
             FOREIGN KEY (gameId) REFERENCES Games(gameId),
             PRIMARY KEY (picId,gameId)

          )strict;`
      );
    await connection.run(`
      create table if not exists Scenes (
          id INTEGER NOT NULL,
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
          FOREIGN KEY (picBackground) REFERENCES Picture(picId),
          PRIMARY KEY (id,gameId)                
      )strict;`
    );
  }
    public static async ensureSampleDataInserted(connection: Database): Promise<void> {

        const games = [
            [2, 1685910718329, 'DatabaseCreator', 'DBname', 'DBdesc'],
            [3, 1685910718349, 'DatabaseCreator2', 'DBname2', 'DBdesc2'],
            [5, 1685910738349, '','DBname3', 'A longer description to see what will happen and to see how the formatting will look like, abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc']
        ];

        await connection.get('PRAGMA foreign_keys = ON');

        for(let i = 0; i < games.length; i++){
            let getStmt= await connection.prepare('Select * from Games where gameId = ?1');
            await getStmt.bind({1:games[i][0]});
            const result = await getStmt.get<IGame>();
            await getStmt.finalize();

            if(result === undefined) {
                if(games[i][2] === ''){
                    const stmt = await connection.prepare('insert into Games(gameId,creationDate,gameName,description)values(?1,?2, ?3,?4)');
                    await stmt.bind({1: games[i][0], 2: games[i][1], 3: games[i][3], 4: games[i][4]});
                    await stmt.run();
                    await stmt.finalize();
                    await stmt.reset();
                }
                else {
                    const stmt = await connection.prepare('insert into Games(gameId,creationDate,creator,gameName,description)values(?1,?2, ?3,?4,?5)');
                    await stmt.bind({1: games[i][0], 2: games[i][1], 3: games[i][2], 4: games[i][3], 5: games[i][4]});
                    await stmt.run();
                    await stmt.finalize();
                    await stmt.reset();
                }

            }
        }
        await connection.close();

        verbose();
    }
}
