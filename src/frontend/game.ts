import {GameInfo} from "./game-info";
export class Game{
    id: number;
    name: string;
    pronouns: string[];
    //scenes: Scene; TODO! merge with Mia
    infos: GameInfo;
    //loggedIn: boolean; TODO! check if needed when accounts exist

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

}