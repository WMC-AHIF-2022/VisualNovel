import express from "express";
import { join } from "path";
import { SceneRouter } from "./router/scene-router";
import { GameRouter } from "./router/game-router";
import {DB} from "./database";
import {PictureRouter} from "./router/picture-router";

const app = express();

const path = join(__dirname, "../client");
const options = { extensions: ["html"] };
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }))
app.use(express.static(path, options));
app.use("/api/scenes", SceneRouter);
app.use("/api/games", GameRouter);
app.use("/api/pics", PictureRouter);

const port = 3000;

app.listen(port, async () => {
  const db = await DB.createDBConnection();
  await DB.ensureSampleDataInserted(db);
  console.log(`Server listening on port ${port}`);
});
