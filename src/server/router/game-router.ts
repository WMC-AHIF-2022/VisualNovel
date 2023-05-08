import express from "express";
import {addScene, IScene} from "../data/scene-repository";
import {StatusCodes} from "http-status-codes";
import {addGame, IGame} from "../data/game-repository";


export const GameRouter = express.Router();

GameRouter.post("/",async (request,response)=>{
    let infoId : number | undefined = request.body.infoId;

    if (typeof infoId !== "number") {
        response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
        return;
    }



    const game : IGame ={
        id: -1,
        scenes: [],
        infoId : infoId
    }

    try {
        await addGame(game);
        response.status(StatusCodes.CREATED).send(game);
    }
    catch (e) {
        response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

})

