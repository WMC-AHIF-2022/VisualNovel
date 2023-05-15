import {ScenePictures} from "./scene-pics";

export class Scene{
    private isDecision:boolean;
    private buttonName1 : string; //button name for nextId
    private buttonName2:string; // button name for nextId2

    private readonly id: number;
    private nextId: number;
    private nextId2: number;
    private prevId: number;
    private talkingCharacter: string;
    private text: string;
    private pictures: ScenePictures;
    private static idCount: number = 0;

    constructor();
    constructor(isDecision? : boolean) {
        this.id = Scene.idCount++;
        if(isDecision){
            this.isDecision = isDecision;
        }
        else{
            this.isDecision = false;
        }
    }

    public playScene(pronouns: string[]): number{
        if(this.isDecision){
            return this.showDecision();
        }
        return;
    }

    /**
     * shows decision
     * return: number for next scene nextId if button 1 was pressed nextId2 if button 2 was pressed
     */
    private showDecision() :number {
        return 0;
    }

    //Getters + Setters
    public getId(): number {
        return this.id;
    }

    public getNextId(): number {
        return this.nextId;
    }

    public getNextId2(): number {
        return this.nextId2;
    }

    public getPrevId(): number {
        return this.prevId;
    }

    public getTalkingCharacter(): string {
        return this.talkingCharacter;
    }

    public getText(): string {
        return this.text;
    }

    public getPictures(): ScenePictures {
        return this.pictures;
    }

    public setPictures(value: ScenePictures) {
        this.pictures = value;
    }
    public setText(value: string) {
        this.text = value;
    }
    public setTalkingCharacter(value: string) {
        this.talkingCharacter = value;
    }
    public setPrevId(value: number) {
        this.prevId = value;
    }
    public setNextId2(value: number) {
        this.nextId2 = value;
    }
    public setNextId(value: number) {
        this.nextId = value;
    }

    public setDecison(value: boolean){
        this.isDecision = value;
    }
}

