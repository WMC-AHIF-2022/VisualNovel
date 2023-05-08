import {Game} from "./game.js";
import {Scene} from "./scene.js";
import {GameInfo} from "./game-info";
import {fetchRestEndpoint} from "../utils/client-server";
import {getAllGameInfos} from "../../server/data/game-info-repository";

async function init() {
    await fetchRestEndpoint("http://localhost:63342/VisualNovel/src/client/html/games.html", "GET");
    let gameinfo = getAllGameInfos();
    let list = document.getElementById("gameOverview");
    let html = '<li><h4 id="'+'" class="clickable">`${gameinfo.getGameName()}` ';
    html += '</h4><p>`${gameinfo.getDescription()} ${gameinfo.getCreator()}`</p></li>';
    list.innerHTML += html;
    document.getElementById(`${gameinfo}`).style.color= "pink";
}



window.addEventListener("load",init);