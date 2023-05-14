import {ScenePictures} from "./scene-pics";

export class Scene{
    //TODO!! delete clickable and add prev and next buttons in html
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
        return this.playPrevOrNextScene();

    }

    private playPrevOrNextScene():number {
        let nextSceneId = -1;
        document.getElementById('btnNext').addEventListener('click', ()=>{
            alert('you clicked next');
            nextSceneId = this.nextId;
        });
        document.getElementById('btnPrevious').addEventListener('click',()=>{
            nextSceneId = this.prevId;
        })
        return nextSceneId;
    }

    private playNormalScene(pronouns: string[], playerName: string) {
        let textField = document.getElementById("txtTextInTheBox");
        let talkingPerson = document.getElementById("txtName");

        if(this.talkingCharacter === "::name"){
            this.talkingCharacter = playerName;
        }

        talkingPerson.innerText = this.talkingCharacter;
        textField.innerText = this.replacePronounsAndPlayerName(pronouns, playerName);
    }

    /**
     * helper function for replacing the player name and pronouns
     * @param pronouns the pronouns which are going to be inserted
     * @param playerName the player name which is going to be inserted
     * @return the replaced string
     * ::name -> player name
     * ::they -> he, she, they
     * ::them -> him, her, them
     * ::theirs -> his, hers, theirs
     */
    private replacePronounsAndPlayerName(pronouns: string[], playerName: string):string {
        this.text = this.text.replace("::name", playerName);
        this.text = this.text.replace("::they",pronouns[1]);
        this.text = this.text.replace("::them",pronouns[2]);
        this.text = this.text.replace("::theirs",pronouns[3]);

        return this.text;
    }

    /**
     * handle decision
     * @return: number for next scene nextId if button 1 was pressed nextId2 if button 2 was pressed
     */
    private handleDecision() :number {
        this.resetTextFields();

        let firstButton:HTMLElement = document.getElementById('btnOpt1');
        let secondButton:HTMLElement = document.getElementById('btnOpt2');
        firstButton.innerText = this.buttonName1;
        secondButton.innerText = this.buttonName2;

        //TODO!! check if button is visible
        firstButton.style.display = "inline-block";
        secondButton.style.display = "inline-block";
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
        firstButton.style.display = 'none';
        secondButton.style.display = 'none';
        return nextSceneToBePlayed;
    }

    /**
     * small helper function for resetting the content in the text fields talking person and text
     */
    private resetTextFields() {
        document.getElementById("pTalkingPerson").textContent = " ";
        document.getElementById("pText").textContent = " ";
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
    public setButton1(value: string){
        this.buttonName1 = value;
    }
    public setButton2(value: string){
        this.buttonName2 = value;
    }
}

