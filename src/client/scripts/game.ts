import { GameInfo } from "./game-info.js";
import { Scene } from "./scene.js";
import { removeAllEventListeners } from "./extra/tools.js";
import { ScenePictures } from "./scene-pics.js";
import {map} from "jquery";

export class Game {
  //TODO!! get one scene or a limited scene array of xx scenes instead of all
  private readonly id: number; // must stay readonly, due to saving in database and identification
  private pronouns: string[] = []; // index 1 = they|he|she index 2 = Them|him|her index 3 = theirs|his|hers
  private scenes: Map<number, Scene>;
  private infos: GameInfo; // description might get changed
  //private loggedIn: boolean; TODO! check if needed when accounts exist
  private playerName: string;
  constructor() {
    this.scenes = new Map<number, Scene>();
    this.infos = new GameInfo();
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
  //TODO!! check why next scene doesn't get played, might have something todo with the scene class or this one
  private async playScenes(): Promise<void> {
    //console.log(`name: ${this.playerName} pronouns: ${this.pronouns[0]}`);
    let nextID: number = 0;

    while (nextID != -1) {
      // TODO!! check if the last nextID is gonna be -1

      console.log(nextID);
      console.log(`scene text: ${this.scenes.get(nextID).getDecision()}`);
      nextID = await this.scenes.get(nextID).playScene(this.pronouns, this.playerName);
    }
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
   * function to add a scene to the scene[] liss just deleted it bad liss
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
}
// TODO!! once the server runs and we have some games in the db, fetch them from there with the
//  id being stored in the session storage when a game gets clicked on the overview
async function init() {
  // first prototype for the fetching
  /*let gameId:string = sessionStorage.getItem('gameId');
    const data = JSON.parse(`{"username": "${gameId}"}`);
    const game:Game = await fetchRestEndpoint('', 'GET',data);*/

  //test data
  //window location search
  const game = new Game();
  let scene: Scene = new Scene(0, false);
  scene.setText("::name said that ::they like cats");
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

  game.addScene(scene);
  game.addScene(scene2);
  game.addScene(scene3);

  await game.playGame();
}

window.addEventListener("load", init);
