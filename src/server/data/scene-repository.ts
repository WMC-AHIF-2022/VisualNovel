import { DB } from "../database";

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

let nextId = 0;
let scenes: IScene[] = [];

function findSceneIndex(id: number) {
  for (let i = 0; i < scenes.length; i++) {
    if (scenes[i].id === id) {
      return i;
    }
  }
  return -1;
}

export function getAllScenes() {
  return scenes;
}

export function getSceneById(id: number): IScene | undefined {
  const index: number = findSceneIndex(id);
  if (index < 0) {
    return undefined;
  }
  return scenes[index];
}

//TODO!! check if game and pics exist
export async function addScene(scene: IScene): Promise<void> {
  const db = await DB.createDBConnection();
  const stmt = await db.prepare(
    "insert into Scenes (nextId1,nextId2,prevId,talkingChar,text,button1,button2,picLeft,picRight,picBackground,gameId)values(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)"
  );
  await stmt.bind({
    1: scene.nextId1,
    2: scene.nextId2,
    3: scene.prevId,
    4: scene.talkingChar,
    5: scene.text,
    6: scene.button1,
    7: scene.button2,
    8: scene.picLeft,
    9: scene.picRight,
    10: scene.picBackground,
    11: scene.gameId,
  });
  const operationResult = await stmt.run();
  await stmt.finalize();
  await db.close();

  if (
    typeof operationResult.changes !== "number" ||
    operationResult.changes !== 1
  ) {
    throw new Error("DB Error");
  } else {
    scene.id = operationResult.lastID!;
  }
}

export function removeAllScenes(): void {
  scenes.splice(0);
}

export function removeScene(scene: IScene): void {
  const index: number = findSceneIndex(scene.id);
  if (index < 0) {
    return;
  }
  scenes.splice(index, 1);
}
