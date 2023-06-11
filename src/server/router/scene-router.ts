import express, { response } from "express";
import { addScene, IScene } from "../data/scene-repository";
import { StatusCodes } from "http-status-codes";

export const SceneRouter = express.Router();

// in case scene is not a decision nextID2 = -1 every text field is '' in case no text was entered and the
// picture ids are -1 in case none were entered
SceneRouter.post("/", async (request, response) => {
  let sceneID : number|undefined = request.body.id;
  let nextId: number | undefined = request.body.nextId1;
  let choiceId: number | undefined = request.body.nextId2;
  let prevId: number | undefined = request.body.prevId;
  let talkingChar: string | undefined = request.body.talkingChar;
  let text: string | undefined = request.body.text;
  let button1: string | undefined = request.body.button1;
  let button2: string | undefined = request.body.button2;
  let picLeft: number | undefined = request.body.picLeft;
  let picRight: number | undefined = request.body.picRight;
  let picBackground: number | undefined = request.body.picBackground;
  let gameId: number | undefined = request.body.gameId;

  if (typeof nextId !== "number" || typeof prevId !== "number" || typeof gameId !== "number" || typeof sceneID !== "number" || typeof  picBackground !== "number") {
    response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
    return;
  }

  let scene: IScene = {id: sceneID, prevId: prevId, gameId:gameId, nextId1 :nextId, talkingChar: '', text: '', button1: '', button2:'', picBackground:picBackground, nextId2:-1, picLeft: -1, picRight: -1}

  if(typeof choiceId === "number"){
    scene.nextId2 = choiceId;
    if(typeof button1 !== "string" || typeof button2 !== "string"){
      response.status(StatusCodes.BAD_REQUEST).send("If scene is a decision, it needs button names!");
      return;
    }
    scene.button1 = button1;
    scene.button2 = button2;
  }
  else{
    if(typeof  talkingChar === "string"){
      scene.talkingChar = talkingChar;
    }
    if(typeof text === "string"){
      scene.text = text;
    }
  }
  if(typeof  picLeft === "number"){
    scene.picLeft = picLeft;
  }
  if(typeof  picRight === "number"){
    scene.picRight = picRight;
  }
  try{
    await addScene(scene);
    response.sendStatus(StatusCodes.OK);
  }
  catch (ex){
    if (ex instanceof Error) {
      response.status(StatusCodes.BAD_REQUEST).send(ex.message);
      return;
    }
    response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

SceneRouter.get("/", async (request, response) => {
  console.log();
});
