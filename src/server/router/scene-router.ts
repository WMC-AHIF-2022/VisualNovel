import express, {response} from "express";
import {addScene, IScene} from "../data/scene-repository";
import {StatusCodes} from "http-status-codes";

export const SceneRouter = express.Router();

SceneRouter.post("/",async (request,response)=>{
    let nextId : number | undefined = request.body.nextId;
    let choiceId : number | undefined = request.body.choiceId;
    let prevId: number | undefined = request.body.prevId;
    let talkingChar : string | undefined = request.body.talkingChar;
    let text : string | undefined = request.body.text;
    let scenePicsId : number | undefined = request.body.scenePicsId;
    let gameId : number | undefined = request.body.gameId;

    if (typeof choiceId !== "number") {
        response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
        return;
    }
    if (typeof prevId !== "number") {
        response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
        return;
    }
    if (typeof nextId !== "number") {
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
    if (typeof scenePicsId !== "number") {
        response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
        return;
    }
    if (typeof gameId !== "number") {
        response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
        return;
    }
    const scene: IScene= {
        id: -1,
        nextId: nextId,
        choiceId: choiceId,
        prevId: prevId,
        talkingChar: talkingChar,
        text: text,
        scenePicsId: scenePicsId,
        gameId: gameId
    }

    try {
        await addScene(scene);
        response.status(StatusCodes.CREATED).send(scene);
    }
    catch (e) {
        response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

})

SceneRouter.get("/",async (request,response) =>{
    console.log();
})



