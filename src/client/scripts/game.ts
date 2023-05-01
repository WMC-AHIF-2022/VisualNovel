import {GameInfo} from "./game-info";
export class Game{
    private readonly id: number; // must stay readonly, due to saving in database and identification
    private name: string; // game name might get changed later on, so it's not read only
    private pronouns: string[]; // TODO!! ask liss when this is gonna get set
    //private scenes: Scene[]; TODO! merge with Mia
    private infos: GameInfo; // description might get changed
    //private loggedIn: boolean; TODO! check if needed when accounts exist

    constructor(id:number,name:string,gameInfo: GameInfo) {
        this.id = id;
        this.name = name;
        this.infos = gameInfo;
    }

    /**
     *  playGame: function for starting the game
     *  return: false = if game not finished true = if game is finished
     */
    public playGame():boolean{
        return false;
    }

    /**
     * saveGame: function for saving the game (if Account exists & isLoggedIn)
     * return: false = if saving failed true = if saving successful
     */
    public saveGame():boolean{
        return false;
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