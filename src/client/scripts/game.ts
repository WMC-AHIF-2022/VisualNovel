import {GameInfo} from "./game-info.js";
import {Scene} from "./scene.js";
import {ScenePictures} from "./scene-pics";
import {Maker} from "./maker";
import {fetchRestEndpoint} from "../utils/client-server";
export class Game{
    //TODO!! get one scene or a limited scene array of xx scenes instead of all
    private readonly id: number; // must stay readonly, due to saving in database and identification
    private pronouns: string[] = []; // index 1 = they|he|she index 2 = Them|him|her index 3 = theirs|his|hers
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
    async  playGame(){
        console.log('length'+ this.scenes.length);
        await this.getNameAndPronouns();
        console.log(`name asdad: ${this.playerName} pronouns: ${this.pronouns[0]}`);
        let nextID:number = 0;
        while (nextID != -1){ // TODO!! check if the last nextID is gonna be -1
            nextID = this.scenes[nextID].playScene(this.pronouns,this.playerName);
        }
    }

     async getNameAndPronouns(){

        document.getElementById("lblName").addEventListener("input", ()=>{
            let name =<HTMLInputElement> document.getElementById('lblName');
            this.playerName = name.value;
            if(this.playerName != ""){
                document.getElementById("btnFemale").addEventListener("click", () => {
                    this.pronouns = ['she','her','hers'];
                    console.log('Chosen gender: female');
                    this.hideGenderElements();
                });
                document.getElementById("btnMale").addEventListener("click", () => {
                    this.pronouns = ['he','him','his'];
                    console.log('Chosen gender: male');
                    this.hideGenderElements();
                });
                document.getElementById("btnDiv").addEventListener("click", () => {
                    this.pronouns = ['they','them','theirs'];
                    console.log('Chosen gender: diverse');
                    this.hideGenderElements();
                });
            }
            console.log(`name: ${this.playerName} pronouns: ${this.pronouns[0]}`);
        });
    }

    private hideGenderElements():void {
        //hide gender elements
        document.getElementById("txtGender").style.display = "none";
        document.getElementById("btnFemale").style.display = "none";
        document.getElementById("btnMale").style.display = "none";
        document.getElementById("btnDiv").style.display = "none";
        document.getElementById("txtEnterName").style.display = "none";
        document.getElementById("lblName").style.display = "none";
        //show text box and talking person
        document.getElementById("txtBox").style.display = "inline-block";
        document.getElementById("txtName").style.display = "inline-block";
        document.getElementById("imgLeftChar").style.display = "inline-block";
        document.getElementById("imgRightChar").style.display = "inline-block";
        //alert('decided on gender');
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
        return this.scenes;
    }

    public getScene(id:number):Scene{
        for(let scene of this.scenes){
            if(scene.getId()==id){
                return scene;
            }
        }
        return null;
    }
}

async function init() {
    /*let gameId:string = sessionStorage.getItem('gameId');
    const data = JSON.parse(`{"username": "${gameId}"}`);
    const game:Game = await fetchRestEndpoint('', 'GET',data);*/
    const game = new Game();
    let scene:Scene = new Scene(0, false);
    scene.setText('text');
    scene.setTalkingCharacter('::name');
    scene.setNextId(1);
    game.addScene(scene);
    let scene2: Scene = new Scene(1,true);
    scene2.setButton1('mew');
    scene2.setButton2('wuff');
    scene2.setNextId(2);
    scene2.setNextId2(3);
    scene2.setPrevId(0);
    let scene3:Scene = new Scene( 2,false);
    scene3.setText('yayy scene3 ::they');
    scene3.setTalkingCharacter('::name');
    scene3.setPrevId(1);
    scene3.setNextId(-1);
    game.addScene(scene);
    game.addScene(scene2);
    game.addScene(scene3);

    game.playGame();
}


window.addEventListener("load",init);
