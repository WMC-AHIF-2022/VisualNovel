import {GameInfo} from "./game-info";
import {Scene} from "./scene";
import {ScenePictures} from "./scene-pics";
export class Game{
    private readonly id: number; // must stay readonly, due to saving in database and identification
    private name: string; // game name might get changed later on, so it's not read only
    private pronouns: string[]; // TODO!! create setter
    private scenes: Scene[];
    private infos: GameInfo; // description might get changed
    //private loggedIn: boolean; TODO! check if needed when accounts exist

    constructor() {
        this.name = "Visual Novel";
        this.scenes = [];
    }


    /**
     *  playGame: function for starting the game
     *  return: false = if game not finished true = if game is finished
     */
    public playGame():boolean{
        let nextID:number = 0;
        while (nextID != -1){ // TODO!! check if the last nextID is gonna be -1
            //nextID = this.scenes[nextID].playScene(this.pronouns);
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
     * addScene: function for adding a scene to the scene Array
     * @param id scene id
     * @param nextId id of the following scene
     * @param nextId2 id of the following scene if a certain decision was made
     * @param prevId id of the previous scene
     * @param talkingCharacter the name of the talking character
     * @param text displayed text
     * @param pictures pictures being used in the scene
     */
    public addScene( id: number, nextId: number, nextId2: number, prevId: number, talkingCharacter: string, text: string, pictures: ScenePictures):void{
        //let newScene: Scene = new Scene(id,nextId,nextId2,prevId,talkingCharacter,text,pictures);
        //this.scenes.push(newScene);
    }
    /**
     * changeDescription: function to change game description
     * @param newDescription: the new description which is going to be saved
     */
    public changeDescription( newDescription:string):void{
        this.infos.setDescription(newDescription);
    }

    //getters
    public getGameID():number{
        return this.id;
    }
    public getGameInfo():GameInfo{
        return this.infos;
    }
    public getGameName():string{
        return this.name;
    }
    public getPronouns():string[]{
        return this.pronouns;
    }
}