export class GameInfo {
    private readonly creator: string;
    private gameDescription:string;
    private readonly releaseDate: Date;

    constructor(creator: string, releaseDate:Date) {
        this.releaseDate = releaseDate;
        this.creator = creator;
    }
    public getCreator():string{
        return this.creator;
    }
    public getGameDescription():string{
        return this.gameDescription;
    }    public getReleaseData():Date{
        return this.releaseDate;
    }
    public setDescription(newDescription: string){
        this.gameDescription = newDescription;
    }
}