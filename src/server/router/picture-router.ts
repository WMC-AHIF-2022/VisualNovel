import express from "express";
import {StatusCodes} from "http-status-codes";
import {getPictureById} from "../data/pictures-repository";

export const pictureRouter = express.Router();

pictureRouter.post("/getWithBody/:picID", async (req, res) => {
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