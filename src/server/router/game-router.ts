import express from "express";
import {addScene, IScene} from "../data/scene-repository";
import {StatusCodes} from "http-status-codes";
import {addGame, getAllGames, IGame} from "../data/game-repository";


export const GameRouter = express.Router();

GameRouter.get("/", async (request, response) => {
  const games = getAllGames();
  response.status(StatusCodes.OK).json(games);
});

GameRouter.post("/",async (request, response)=>{
  let creator: string | undefined = request.body.creator;
  let desc: string | undefined = request.body.description;
  let gameName: string | undefined = request.body.name;

  if (typeof creator !== "string") {
    response.status(StatusCodes.BAD_REQUEST).send("done missing or not ok");
    return
  }
  if (typeof desc !== "string") {
    response.status(StatusCodes.BAD_REQUEST).send("done missing or not ok");
    return
  }
  if (typeof gameName !== "string") {
    response.status(StatusCodes.BAD_REQUEST).send("done missing or not ok");
    return
  }

  const game : IGame ={
    id: -1,
    scenes: [],
    creator: creator.toString(),
    description: desc.toString(),
    creationDate: new Date(),
    name:gameName.toString()
  }

  try {
    await addGame(game);
    response.status(StatusCodes.CREATED).send(game);
  }
  catch (e) {
    response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

})