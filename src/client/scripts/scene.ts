import {ScenePictures} from "./scene-pics";

export class Scene{
    private readonly isDecision:boolean;
    private buttonName1 : string; //button name for nextId
    private buttonName2:string; // button name for nextId2

    private readonly id: number;
    private nextId: number;
    private nextId2: number;
    private prevId: number;
    private talkingCharacter: string;
    private text: string;
    private pictures: ScenePictures;

    constructor(id:number);
    constructor(id: number, isDecision? : boolean) {
        this.id = id;
        if(isDecision){
            this.isDecision = isDecision;
        }
        else{
            this.isDecision = false;
        }
    }

    public playScene(pronouns: string[], playerName:string): number{
        if(this.isDecision){
            return this.handleDecision();
        }
        this.playNormalScene(pronouns,playerName);
        return this.nextId;
    }

    private playNormalScene(pronouns: string[], playerName: string) {

    }

    /**
     * handle decision
     * return: number for next scene nextId if button 1 was pressed nextId2 if button 2 was pressed
     */
    private handleDecision() :number {
        let firstButton:HTMLElement = document.getElementById('btnOpt1');
        let secondButton:HTMLElement = document.getElementById('btnOpt2');
        firstButton.innerText = this.buttonName1;
        secondButton.innerText = this.buttonName2;
        //TODO!! check if button is visible
        firstButton.style.display = "block";
        secondButton.style.display = "block";
        console.log("set buttons onto visible");

        let nextSceneToBePlayed:number = -1; // in case something goes wrong, return -1
        firstButton.addEventListener('click',()=>{
            console.log(`clicked button: ${this.buttonName1} next scene is: ${this.nextId}`);
            nextSceneToBePlayed = this.nextId;
        });
        secondButton.addEventListener('click',()=>{
            console.log(`clicked button: ${this.buttonName2} next scene is: ${this.nextId2}`);
            nextSceneToBePlayed =  this.nextId2;
        });
        return nextSceneToBePlayed;
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
}

