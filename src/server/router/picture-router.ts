import express, { response } from "express";
import {StatusCodes} from "http-status-codes";
import {addPicture, getPicByName, getPictureById, IPicture} from "../data/pictures-repository";

export const PictureRouter = express.Router();

PictureRouter.post("/",async (request,response)=>{
    let picId = request.body.picId;
    let url = request.body.url;
    let picName = request.body.picName;
    let gameId = request.body.gameId;

    if(typeof picId !== "number"){
        response.status(StatusCodes.BAD_REQUEST).send("Picture needs an Id");
    }

    if(typeof url !== "string" || url === ""){
        response.status(StatusCodes.BAD_REQUEST).send("Url needs a non empty string");
    }

    if(typeof picName != "string" || picName == ""){
        response.status(StatusCodes.BAD_REQUEST).send("PicName needs a non empty string");
    }

    if(typeof gameId !== "number"){
        response.status(StatusCodes.BAD_REQUEST).send("GameId is invalid");
    }

    let pic : IPicture = {
        picId: picId,
        picName: picName,
        url: url,
        gameId: gameId
    }

    try{
        await addPicture(pic);
    }catch(ex){
        response.status(StatusCodes.BAD_REQUEST).send(`${ex}`);

    }

})

PictureRouter.get("/:picName",async (request,response)=>{
    let picName = request.params.picName;
    let pic: IPicture | undefined = await getPicByName(picName);
    response.status(StatusCodes.OK).send(pic);

});

PictureRouter.post("/:id",async (request,response)=>{
    let picId = +request.params.id;
    let gameId = request.body.gameId;
    let pic: IPicture | undefined = await getPictureById(picId,gameId);
    response.status(StatusCodes.OK).send(pic);

});
PictureRouter.post("/getWithBody/:picID", async (req, res) => {
    if(req.body.hasOwnProperty('gameID')){
        let pic = req.params.picID;
        let gameID = req.body.gameID;

        if(!isNaN(Number(pic))&&!isNaN(Number(gameID))){
            let picture = await getPictureById(Number(pic),Number(gameID));
            if(pic === undefined){
                console.log('pic undefined');
                res.sendStatus(StatusCodes.NOT_FOUND);
                return;
            }
            res.status(StatusCodes.OK).json(picture);
            return;
        }
    }
    console.log('no game id');
    res.sendStatus(StatusCodes.BAD_REQUEST);
});
