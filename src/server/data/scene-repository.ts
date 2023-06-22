import { DB } from "../database";
import {IGame} from "./game-repository";
import {getPictureById} from "./pictures-repository";

export interface IScene {
  id: number;
  nextId1: number;
  nextId2: number;
  prevId: number;
  talkingChar: string;
  text: string;
  button1: string;
  button2: string;
  picLeft: number;
  picRight: number;
  picBackground: number;
  gameId: number;
}

/**
 * this function checks if the pictures in a scene exist
 * @param picBackground bg id
 * @param picLeft picLeft id
 * @param picRight picRight id
 * @param gameID game id
 */
async function checkIfPicsExist(picBackground: number, picLeft: number, picRight: number, gameID : number):Promise<boolean> {
  console.log('bg: '+ picBackground+'pl: '+picLeft+'pr: '+picRight);
  if(picBackground !== -1){
    if(await getPictureById(picBackground, gameID)=== undefined){
      return false;
    }
  }
  if(picLeft !== -1){
    if(await getPictureById(picLeft,gameID)=== undefined){
      return false;
    }
  }
  if(picRight !== -1){
    if(await getPictureById(picRight,gameID)=== undefined){
      return false;
    }
  }
  return true;
}


export async function addScene(scene: IScene): Promise<void> {
  console.log("trying to add scene");
  // check if game and pics exist
  const db = await DB.createDBConnection();
  let stmtCheckGame = await db.prepare('select * from Games where gameId = ?1');
  await stmtCheckGame.bind({1: scene.gameId});
  let game =  await stmtCheckGame.get<IGame>();
  await stmtCheckGame.finalize();
  if(game === undefined){
    throw new Error('There is no game with given ID, could not add scene!');
  }
  let picsExist = await checkIfPicsExist(scene.picBackground,scene.picLeft,scene.picRight,scene.gameId);
  if(!picsExist){
    throw new Error('This scenes pictures are not defined!');
  }
  console.log('text: '+scene.text);
  // insert scene into database
  const stmtInsert = await db.prepare(
    "insert into Scenes (id, nextId1, nextId2, prevId, talkingChar, text, button1, button2, picLeft, picRight, picBackground, gameId) values(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12)"
  );
  await stmtInsert.bind({
    1: scene.id,
    2: scene.nextId1,
    3: scene.nextId2,
    4: scene.prevId,
    5: scene.talkingChar,
    6: scene.text,
    7: scene.button1,
    8: scene.button2,
    9: scene.picLeft,
    10: scene.picRight,
    11: scene.picBackground,
    12: scene.gameId,
  });
  await stmtInsert.run();
  await stmtInsert.finalize();
  await db.close();
}

export async function getAllScenesFromGame(gameID:number):Promise<IScene[]>{
  let scenes:IScene[]=[];
  const db = await DB.createDBConnection();
  try{
    let stmtGetAllScenes = await db.prepare('Select * from Scenes where gameId = ?1');
    await stmtGetAllScenes.bind({1: gameID});
    scenes = await stmtGetAllScenes.all<IScene[]>();
    await stmtGetAllScenes.finalize();
  }finally {
    await db.close();
  }
  return scenes;
}
