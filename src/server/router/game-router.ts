import express, {response} from "express";
import {addScene, IScene} from "../data/scene-repository";
import {StatusCodes} from "http-status-codes";
import {addGame, getAllGames, IGame, updateGame} from "../data/game-repository";
import {DB} from "../database";


export const GameRouter = express.Router();

GameRouter.get("/", async (request, response) => {
  const games = await getAllGames();
  response.status(StatusCodes.OK).json(games);
});

GameRouter.post("/",async (request, response)=>{
  //let creator: string | null = sessionStorage.getItem('username');
  let creator: string | undefined = request.body.creator;
  let desc: string | undefined = request.body.description;
  let gameName: string | undefined = request.body.gameName;
  let thumbnail: string | undefined = request.body.thumbnailURL;

  /*if(creator === null){
    creator = "Guest";
  }*/
  if(typeof creator !== "string"){
      creator = "";
  }
  if (typeof desc !== "string") {
    desc = "";
  }
  if (typeof gameName !== "string") {
    gameName = "";
  }
  if (typeof thumbnail !== "string") {
    thumbnail = "";
  }


  const game : IGame ={
    id: -1,
    creator: creator.toString(),
    description: desc.toString(),
    creationDate: new Date().getTime(),
    gameName:gameName.toString(),
    thumbnailURL: thumbnail.toString()
  }

  try {
    await addGame(game);
    response.status(StatusCodes.CREATED).send(game);
  }
  catch (e) {
    response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

})

GameRouter.put("/",async (request, response)=> {
    //let creator: string | null = sessionStorage.getItem('username');
    let creator: string | undefined = request.body.creator;
    let desc: string | undefined = request.body.description;
    let gameName: string | undefined = request.body.gameName;
    let thumbnail: string | undefined = request.body.thumbnailURL;

    /*if(creator === null){
      creator = "Guest";
    }*/
    if (typeof creator !== "string") {
      creator = "";
    }
    if (typeof desc !== "string") {
      desc = "";
    }
    if (typeof gameName !== "string") {
      gameName = "";
    }
    if (typeof thumbnail !== "string") {
      thumbnail = "";
    }


    const game: IGame = {
      id: -1,
      creator: creator.toString(),
      description: desc.toString(),
      creationDate: new Date().getTime(),
      gameName: gameName.toString(),
      thumbnailURL: thumbnail.toString()
    }

    try {
      const db = await DB.createDBConnection();
      await db.get('PRAGMA foreign_keys = ON');
      const getStmt = await db.get('SELECT * FROM Games where id = ?1');
      let alreadyExists = await getStmt.bind({1:game.id});
      await getStmt.finalize();
      await db.close();

      if(alreadyExists == null){
        await addGame(game);
      }
      else{
        await updateGame(game);
      }
      response.status(StatusCodes.CREATED).send(game);
    } catch (e) {
      response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }

})