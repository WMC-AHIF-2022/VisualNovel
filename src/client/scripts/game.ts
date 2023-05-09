import {GameInfo} from "./game-info.js";
import {Scene} from "./scene.js";
import {ScenePictures} from "./scene-pics";
export class Game{
    private readonly id: number; // must stay readonly, due to saving in database and identification
    private pronouns: string[]; // index 1 = they|he|she index 2 = Them|him|her index 3 = theirs|his|hers
    private scenes: Scene[];
    private infos: GameInfo; // description might get changed
    //private loggedIn: boolean; TODO! check if needed when accounts exist
    private playerName: string;
    constructor() {
        this.scenes = [];
        this.infos = new GameInfo();
    }


    /**
     *  playGame: function for starting the game
     *  return: false = if game not finished true = if game is finished
     */
    public playGame():boolean{
        let nextID:number = 0;
        while (nextID != -1){ // TODO!! check if the last nextID is gonna be -1
            nextID = this.scenes[nextID].playScene(this.pronouns,this.playerName);
        }
        return true;
    }

    /**
     * saveGame: function for saving the game (if Account exists & isLoggedIn)
     * return: false = if saving failed true = if saving successful
     */
    public saveGame():boolean{
        return false;
    }

    /**
     * function to add a scene to the scene[] liss just deleted it bad liss
     * @param newScene
     */
    public addScene(newScene: Scene){
        this.scenes.push(newScene);
    }
    /**
     * changeDescription: function to change game description
     * @param newDescription: the new description which is going to be saved
     */
    public changeDescription( newDescription:string):void{
        this.infos.setDescription(newDescription);
    }
    public setPronouns(newPronouns : string[]){
        this.pronouns = newPronouns;
    }
    public setPlayerName(newPlayerName:string){
        this.playerName = newPlayerName;
    }
    //getters
    public getGameID():number{
        return this.id;
    }
    public getGameInfo():GameInfo{
        return this.infos;
    }
    public getPronouns():string[]{
        return this.pronouns;
    }
    public getScenes():Scene[]{
        return  this.scenes;
    }
}