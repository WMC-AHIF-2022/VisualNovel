import {DB} from "../database";

export interface IPicture {
  picId: number;
  url: string;
  gameId: number;
}

export async function getPictureById(picId: number, gameID :number):Promise<IPicture | undefined> {
  const db = await DB.createDBConnection();
  let picture;
  try{
    let stmtGetPic = await db.prepare('Select * from Picture where picId = ?1 and gameId = ?2');
    await stmtGetPic.bind({1: picId, 2:gameID});
    picture = await stmtGetPic.get<IPicture>();
    await stmtGetPic.finalize();
  }finally {
    await db.close();
  }
  return picture;
}