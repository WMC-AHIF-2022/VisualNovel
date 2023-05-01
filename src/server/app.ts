import express from "express";
import { join } from "path"
import {SceneRouter} from "./router/Scene-router";

const app = express();

const path = join(__dirname, "../client");
const options = { extensions: ["html"] };
app.use(express.json())
app.use(express.static(path, options));
app.use("/api/scenes",SceneRouter);

const port = 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});