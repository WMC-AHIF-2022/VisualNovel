import {Game} from "./game";

export class GameInfo {
    private readonly creator: string; // creator doesn't change
    private gameDescription:string; // description might change in a later point of time
    private readonly creationDate: Date; // creation date won't change

    constructor(creator: string, releaseDate:Date) {
        this.creationDate = releaseDate;
        this.creator = creator;
    }
    // getters + setters
    public getCreator():string{
        return this.creator;
    }
    public getDescription():string{
        return this.gameDescription;
    }    public getReleaseData():Date{
        return this.creationDate;
    }
    public setDescription(newDescription: string){
        this.gameDescription = newDescription;
    }
}