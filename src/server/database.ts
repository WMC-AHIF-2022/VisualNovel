import { Database as Driver } from "sqlite3";
import { open, Database } from "sqlite";

export const dbFileName = 'database.db';

export class DB{

    public static async createDBConnection(): Promise<Database> {
        const dbConnection = await open({
            filename: `./${dbFileName}`,
            driver: Driver
        });
        await DB.ensureTablesCreated(dbConnection);
        return dbConnection;
    }

    private static async ensureTablesCreated(connection: Database): Promise<void> {
        await connection.run(`
            create table if not exists Scenes (
                id INTEGER NOT NULL PRIMARY KEY,
                nextId INTeger,
                choiceId Integer,
                prevId INTEGER,
                talkingChar Text NOT NULL,
                text TEXT NOT NULL,
                ScenePicsId Integer
            )strict;`
        );
    }
}