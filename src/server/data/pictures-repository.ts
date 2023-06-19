import {DB} from "../database";

export interface IPicture {
  picId: number;
  picName : string,
  url: string;
  gameId: number;
}

export async function addPicture(pic : IPicture){
  const db = await DB.createDBConnection();
  let stmt = await db.prepare('insert into Picture values (?1,?2,?3,?4)');
  await stmt.bind({1:pic.picId,2:pic.url,3:pic.picName,4:pic.gameId});
  await stmt.run();
  await stmt.finalize();
  await db.close();
}



export async function getPicByName(picName: string):Promise<IPicture|undefined>{
  const db = await DB.createDBConnection();
  let stmt = await db.prepare('Select * from Picture where picName = ?1');
  await stmt.bind({1:picName});
  let picture = await stmt.get<IPicture>();
  await stmt.finalize();
  await db.close();
  return picture;
}
/**
 * this function gets a picture by the game and pic id
 * @param picId
 * @param gameID
 */
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