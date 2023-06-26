import {Game} from "./game";
import {ScenePictures} from "./scene-pics";
import {fetchRestEndpoint} from "../utils/client-server.js";
import {IGame} from "../../server/data/game-repository";
import {userInfo} from "os";
import {response} from "express";

export class UploadGame{
    private game: IGame;
    private desc: string;
    private title: string;
    private creator: string;
    private thumbnailURL: string;
    //private img
    private id: number = 0;

    constructor() {
        this.game = null;
        this.desc = "this game has no description yet!";
        this.title = "Game Title";
        this.creator = "Guest";
        this.thumbnailURL = "../img/backgrounds/blackScreen.png";
        sessionStorage.clear();
    }

    getGame() {
        return this.game;
    }

    createGame(): IGame{
        console.log("Create Game in Upload");
        let desc: HTMLInputElement = <HTMLInputElement>document.getElementById("descInput");
        let title: HTMLInputElement = <HTMLInputElement>document.getElementById("titleInput");
        let url: HTMLImageElement = <HTMLImageElement>document.getElementById("thumbnail");
        this.desc = desc.value;
        this.title = title.value;
        this.thumbnailURL = url.src;
        this.id = this.id++;
        sessionStorage.setItem('game-id', this.id.toString());

        let game: IGame ={
            id: this.id,
            creator: "Guest",
            description: this.desc.toString(),
            creationDate: new Date().getTime(),
            gameName: this.title.toString(),
            thumbnailURL: this.thumbnailURL.toString()
        }
        sessionStorage.setItem("debug-game", JSON.stringify(game));
        this.game = game;
        return game;
    }
}

async function init(){
    let Ugame: UploadGame = new UploadGame();

    let thumbnail = <HTMLInputElement> document.getElementById("file-upload");
    let publishBtn = <HTMLButtonElement>document.getElementById("uploadButton");
    let editBtn = <HTMLButtonElement>document.getElementById("editButton");
    let picsBtn = <HTMLButtonElement>document.getElementById("picsButton");


    const convertBase64 =(file: File)=>{
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    }

    thumbnail.addEventListener("change", async()=>{
        let file = thumbnail.files[0];
        console.log("thumbnail in upload (Anfang)");
        const base64 = await convertBase64(file);
        let img = <HTMLImageElement>document.getElementById("thumbnail");
        if (typeof base64 === "string") {
            img.src = base64;
        }
        img.style.display = 'block';
        img.style.width = '26.3em';
        img.style.height = '15em';
        document.getElementById("plus").style.display = 'none';
        document.getElementById("file-label").style.backgroundColor = 'transparent';
        document.getElementById("pgItem1").style.justifySelf = 'left';
        console.log("thumbnail in upload");
    });


    publishBtn.addEventListener("click",async()=>{
        let game: IGame = await Ugame.createGame();
        console.log(game);

        let createGame = await fetchRestEndpoint(
            `http://localhost:3000/api/games/`,"PUT", game
        );
        console.log(createGame);
        const gameId = await createGame.json();
        sessionStorage.setItem("game-id", gameId.id);
        console.log(sessionStorage.getItem("game-id"));
        sessionStorage.setItem("uploaded-game", gameId);
        window.location.href = "http://localhost:3000/html/games.html";
    });

    editBtn.addEventListener("click",async()=>{
        let game: IGame = await Ugame.createGame();

        /*let editGame = await fetchRestEndpoint(
            `http://localhost:3000/html/maker.html/${game.id}`,"GET", game
        );
        console.log(editGame);*/
        window.location.href = "http://localhost:3000/html/maker.html";
    });

    picsBtn.addEventListener("click",async()=>{
        let game: IGame = await Ugame.createGame();
        window.location.href = "http://localhost:3000/html/pics-upload.html";
    });
}

window.addEventListener("load", init);
