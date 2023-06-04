import express, { response } from "express";
import { addScene, IScene } from "../data/scene-repository";
import { StatusCodes } from "http-status-codes";

export const SceneRouter = express.Router();

SceneRouter.post("/", async (request, response) => {
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

  if (typeof nextId !== "number") {
    response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
    return;
  }
  if (typeof choiceId !== "number") {
    response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
    return;
  }
  if (typeof prevId !== "number") {
    response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
    return;
  }
  if (typeof text !== "string" || text.trim().length === 0) {
    response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
    return;
  }
  if (typeof talkingChar !== "string" || talkingChar.trim().length === 0) {
    response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
    return;
  }
  if (typeof button1 !== "string") {
    response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
    return;
  }
  if (typeof button2 !== "string") {
    response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
    return;
  }
  if (typeof picLeft !== "number") {
    response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
    return;
  }
  if (typeof picRight !== "number") {
    response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
    return;
  }
  if (typeof picBackground !== "number") {
    response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
    return;
  }
  if (typeof gameId !== "number") {
    response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
    return;
  }
  const scene: IScene = {
    id: -1,
    nextId1: nextId,
    nextId2: choiceId,
    prevId: prevId,
    talkingChar: talkingChar,
    text: text,
    button1: button1,
    button2: button2,
    picLeft: picLeft,
    picRight: picRight,
    picBackground: picBackground,
    gameId: gameId
  };

  try {
    await addScene(scene);
    response.status(StatusCodes.CREATED).send(scene);
  } catch (e) {
    response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

SceneRouter.get("/", async (request, response) => {
  console.log();
});
