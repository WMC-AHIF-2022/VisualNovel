import { DB } from "../database";
export interface User {
    id:number,
    username:string,
    password:string
}

export async function addUser(user: User){
    const db = await DB.createDBConnection();
    const stmt = await db.prepare('INSERT INTO account(NAME, PASSWORD) VALUES (?1, ?2)');
    await stmt.bind({1: user.username, 2: user.password});
    const operationResult = await stmt.run();
    await stmt.finalize();
    await db.close();

    if (typeof operationResult.changes !== "number" || operationResult.changes !== 1) {
        throw new Error("Username is already known");
    }
    else {
        user.id = operationResult.lastID!;
    }
}

export async function isAuthorized(user: User): Promise<boolean>{
    const db = await  DB.createDBConnection();
    const stmt = await db.prepare(`SELECT * FROM account WHERE name = ?1`);
    await stmt.bind({1: user.username});
    const result: User | undefined = await stmt.get<User>();
    await stmt.finalize();
    await db.close();

    if(result === undefined){
        return false;
    }

   return result.password === user.password;



}
