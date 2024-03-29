import { Game } from "./game.js";
import { Scene } from "./scene.js";
import { fetchRestEndpoint } from "../utils/client-server.js";
import {getAllGames, IGame} from "../../server/data/game-repository.js";
import {ScenePictures} from "./scene-pics";

async function init() {
  let getGames = await fetchRestEndpoint(
    "http://localhost:3000/api/games",
    "GET"
  );
  console.log(getGames);
  let games: IGame[] = await getGames.json();
  let list = document.getElementById("gameOverview");
  list.innerHTML = "";
  console.log("html games");

  for(let game of games){
    console.log(game.gameName);
    let html =
        `<li id="game${game.id}" class="clickable"><table><tr><td>
                  <div>
                    <img src="${game.thumbnailURL}" onerror="this.onerror=null;this.src='../img/backgrounds/blackScreen.png'" height="150em" width="215em">
                  </div>
                </td>
        <td>
        <article class="margin"><h3>${game.gameName}</h3>
        <p>${game.description}</p><p>Created by: ${game.creator}, Last Updated: ${new Date(game.creationDate).getDate()}.${new Date(game.creationDate).getMonth()+1}.${new Date(game.creationDate).getFullYear()}</p></article></tr></table></li>`;
    list.innerHTML += html;
  }

  const gamelinks = document.getElementsByClassName("clickable");
  console.log(gamelinks);
  for(let i = 0;i < gamelinks.length;i++){
    gamelinks[i].addEventListener("click",()=>{
      let id = `${games[i].id}`
      sessionStorage.setItem('gameID',id);
      console.log(games[i].id);
      window.location.href = `../html/play-game.html`;
    })
  }
}

window.addEventListener("load", init);