import express from "express";
import {StatusCodes} from "http-status-codes";
import {addUser, isAuthorized, User} from "../data/user-repository";

export const UserRouter = express.Router();

UserRouter.post("/register" ,async (req, res)=>{
    const username: string = req.body.username;
    const password: string = req.body.password;

    if (password.trim().length === 0){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const user: User ={
        id : -1,
        username: username,
        password: password
    }

    try {
        await addUser(user);
        res.sendStatus(StatusCodes.OK);
    }
    catch (e) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }

});
UserRouter.post("/login" ,async (req, res)=>{
    const username: string = req.body.username;
    const password: string = req.body.password;

    const user: User = {
        id: -1,
        username: username,
        password: password,
    }

    const isUserAuthorized: boolean = await isAuthorized(user);
    if (isUserAuthorized) {
        const user = {username: username};
        res.status(StatusCodes.OK).json({user});
    }
    else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

});