import { GameInfo } from "./game-info.js";
import { Scene } from "./scene.js";
import { removeAllEventListeners } from "./extra/tools.js";
import {fetchRestEndpoint} from "../utils/client-server.js";
import {IScene} from "../utils/interfaces.js";

export class Game {
  //TODO!! get one scene or a limited scene array of xx scenes instead of all
  private readonly id: number; // must stay readonly, due to saving in database and identification
  private pronouns: string[] = []; // index 1 = they|he|she index 2 = Them|him|her index 3 = theirs|his|hers
  private scenes: Map<number, Scene>;
  private infos: GameInfo; // description might get changed
  //private loggedIn: boolean; TODO! check if needed when accounts exist
  private playerName: string;
  constructor(gameID?:number) {
    this.scenes = new Map<number, Scene>();
    this.infos = new GameInfo();
    if(gameID){
      this.id = gameID;
    }
  }

  /**
   *  playGame: function for starting the game
   */
  async playGame() {
    console.log("length: " + this.scenes.size);
    await this.prepareForGame();
    await this.playScenes();
  }

  /**
   * function for waiting for the user to decide what gender they want to have
   * @private
   */
  // do not delete the promise, it is needed to wait for the button click
  private async handlePronounsAndGenderInput(): Promise<void> {
    let name = <HTMLInputElement>document.getElementById("lblName");
    console.log(`name: ${name}`);

    // Handle the selection of the gender and pronouns :D
    return await new Promise<void>( (resolve) => {
      name.addEventListener('keyup',async ()=>{
        await this.waitForUserToChoosePronouns();
        this.playerName = name.value;
        console.log(`name: ${this.playerName} pronouns: ${this.pronouns[0]}`);
        resolve();
      });
    });
  }

  private async waitForUserToChoosePronouns(){
    return await new Promise<void>((resolve) => {
      const btnFemale = document.getElementById("btnFemale");
      const btnMale = document.getElementById("btnMale");
      const btnDiv = document.getElementById("btnDiv");

      // Remove all even listeners once a single event listener was triggered
      const removeAllListeners = () => {
        removeAllEventListeners(btnFemale);
        removeAllEventListeners(btnMale);
        removeAllEventListeners(btnDiv);
      };

      btnFemale.addEventListener("click", async () => {
        this.pronouns = ["she", "her", "hers"];
        console.log("Chosen gender: female");
        this.hideGenderElements();

        removeAllListeners();
        resolve();
      });
      btnMale.addEventListener("click", async () => {
        this.pronouns = ["he", "him", "his"];
        console.log("Chosen gender: male");

        this.hideGenderElements();
        removeAllListeners();
        resolve();
      });
      btnDiv.addEventListener("click", async () => {
        this.pronouns = ["they", "them", "theirs"];
        console.log("Chosen gender: diverse");
        this.hideGenderElements();

        removeAllListeners();
        resolve();
      });
    });
  }
  /**
   * function for waiting until text gets entered into the text field, before making buttons clickable
   * @private
   */
  // do not delete the promise, it is needed to wait for the text input
  private async prepareForGame() {
    return await new Promise<void>((resolve) => {
      document.getElementById("lblName").addEventListener("input", async () => {
        await this.handlePronounsAndGenderInput();
        resolve();
      });
    });
  }

  /**
   * function for playing all the scenes in the scene []
   * @private
   */
  private async playScenes(): Promise<void> {
    //console.log(`name: ${this.playerName} pronouns: ${this.pronouns[0]}`);
    let nextID: number = 0;

    while (nextID != -1) {

      console.log(nextID);
      console.log(`scene text: ${this.scenes.get(nextID).getDecision()}`);
      nextID = await this.scenes.get(nextID).playScene(this.pronouns, this.playerName);
    }
    document.getElementById("imgLeftChar").style.display = 'none';
    document.getElementById("imgRightChar").style.display = 'none';
    document.getElementById("txtTextInTheBox").style.display = 'none';
    document.getElementById("txtName").style.display = 'none';
    //document.getElementById("imgBackground").style.backgroundColor = 'rgb(0, 0, 0)';
  }

  /**
   * function to hide the gender elements after the gender gets chosen
   * @private
   */
  private hideGenderElements(): void {
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
   * @return false = if saving failed true = if saving successful
   */
  public saveGame(): boolean {
    return false;
  }

  /**
   * function to add a scene to the scene[]
   * @param newScene
   */
  public addScene(newScene: Scene) {
    this.scenes.set(newScene.getId(), newScene);
  }
  /**
   * changeDescription: function to change game description
   * @param newDescription: the new description which is going to be saved
   */
  public changeDescription(newDescription: string): void {
    this.infos.setDescription(newDescription);
  }
  public setPronouns(newPronouns: string[]) {
    this.pronouns = newPronouns;
  }
  public setPlayerName(newPlayerName: string) {
    this.playerName = newPlayerName;
  }
  //getters
  public getGameID(): number {
    return this.id;
  }
  public getGameInfo(): GameInfo {
    return this.infos;
  }
  public getPronouns(): string[] {
    return this.pronouns;
  }
  public getScene(id:number):Scene{
      return this.scenes.get(id);
  }
  public getScenes(): Scene[] {
    let arr:Scene[] = [];
    for (const scene of this.scenes.values()) {
      arr.push(scene);
    }
    return arr;
  }

  public async createSceneMap(scenes: any) {
    let sceneArr: IScene[] = await scenes.json();

    for (const scene of sceneArr) {
      let newScene =await Scene.convertISceneToScene(scene);
      this.scenes.set(newScene.getId(),newScene);
    }
    console.log(sceneArr);
  }
}
// TODO!! once the server runs and we have some games in the db, fetch them from there with the
//  id being stored in the session storage when a game gets clicked on the overview
async function init() {
  // first prototype for the fetching
  /*let gameId:string = sessionStorage.getItem('gameID');
    const data = JSON.parse(`{"username": "${gameId}"}`);
    const game:Game = await fetchRestEndpoint('', 'GET',data);*/
  //test data
  //window location search
  console.log('loaded page');
  let gameID = 6;
  const game = new Game(gameID);
  let scene = await fetchRestEndpoint(`http://localhost:3000/api/scenes/byGameID/${gameID}`, "GET");
  await game.createSceneMap(scene);

  console.log('ready to play game');
  await game.playGame();
  document.getElementById('btnBackToGamesPage').style.display = 'inline-block';
  document.getElementById('btnBackToGamesPage').addEventListener('click', ()=>{
    //sessionStorage.removeItem('gameID');
    window.location.href = '../html/games.html';
  });
}

window.addEventListener("load", init);

/*
  let scene: Scene = new Scene(0, false);
  scene.setText("You slowly awake from your sleep, still feeling a little bit tired. <br> Something feels off...<br> " +
      "Your gut feeling doesn't trick you, as, when you open your eyes, you realize that you aren't in your bedroom. " +
      "The room you are currently in seems odd to you. Apart from the bed you woke up in and a shelf next to the window, " +
      "the only things filling the room are spiderwebs and dust. <br> For a second, you feel like you’re only imagining things, " +
      "maybe you’re still dreaming… You wait for a short moment, but the scenery around you doesn’t change. <br> A loud BANG! <br> " +
      "From outside the room makes you jolt up. You quickly push down the fear that starts to build inside you and decide, " +
      "to search for the noise’s origin.");
  scene.setTalkingCharacter("::name");
  scene.setPictures(
    new ScenePictures(
      "../img/Characters/vita.png",
      "../img/Characters/vita.png",
      "../img/backgrounds/baum.png"
    )
  );
  scene.setNextId(1);
  game.addScene(scene);
  let scene2: Scene = new Scene(1, true);
  scene2.setButton1("mew");
  scene2.setButton2("wuff");
  scene2.setNextId(2);
  scene2.setNextId2(2);
  scene2.setPrevId(0);
  scene2.setPictures(
    new ScenePictures(
      "../img/Characters/Steak.png",
      "../img/Characters/Steak.png",
      "../img/backgrounds/baum.png"
    )
  );

  let scene3: Scene = new Scene(2, false);
  scene3.setText("yayy scene3 ::they");
  scene3.setTalkingCharacter("::name");
  scene3.setPrevId(1);
  scene3.setNextId(-1);
  scene3.setPictures(
    new ScenePictures(
      "../img/Characters/vita.png",
      "../img/Characters/vita.png",
      "../img/backgrounds/baum.png"
    )
  );
 */
