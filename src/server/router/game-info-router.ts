import express, {response} from "express";
import {StatusCodes} from "http-status-codes";
import {IGameinfo} from "../data/game-repository";
import {addGameInfo, getAllGameInfos} from "../data/game-info-repository";

export const InfoRouter = express.Router();

InfoRouter.post("/",async (request,response)=>{
    let infoId : number | undefined = request.body.infoId;
    let description: string | undefined = request.body.description;
    let releaseDate: Date | undefined = request.body.creationDate;
    let title: string | undefined = request.body.name;
    let creator: string |undefined = request.body.creator;

    if (typeof infoId !== "number") {
        response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
        return;
    }
    if (typeof creator !== "string") {
        response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
        return;
    }
    if (typeof description !== "string") {
        response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
        return;
    }
    if (!(releaseDate instanceof Date)) {
        response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
        return;
    }
    if (typeof title !== "string") {
        response.status(StatusCodes.BAD_REQUEST).send("action missing or not ok");
        return;
    }

    const gameInfo : IGameinfo ={
        infoId: infoId,
        creator: creator,
        description: description,
        releaseDate: releaseDate,
        name: title,
    }

    try {
        await addGameInfo(gameInfo);
        response.status(StatusCodes.CREATED).send(gameInfo);
    }
    catch (e) {
        response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})

InfoRouter.get("/",async (request,response)=>{
    try{
        await getAllGameInfos();
    }
    catch(e){
        response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
})