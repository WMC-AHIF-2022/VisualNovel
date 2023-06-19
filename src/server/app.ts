import express from "express";
import { join } from "path";
import { SceneRouter } from "./router/scene-router";
import { GameRouter } from "./router/game-router";
import {DB} from "./database";
import {pictureRouter} from "./router/picture-router";

const app = express();

const path = join(__dirname, "../client");
const options = { extensions: ["html"] };
app.use(express.json());
app.use(express.static(path, options));
app.use("/api/scenes", SceneRouter);
app.use("/api/games", GameRouter);
app.use("/api/pics", pictureRouter);

const port = 3000;

app.listen(port, async () => {
  const db = await DB.createDBConnection();
  await DB.ensureSampleDataInserted(db);
  console.log(`Server listening on port ${port}`);
});
