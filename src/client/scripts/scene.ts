import { ScenePictures } from "./scene-pics.js";
import {removeAllEventListeners} from "./extra/tools.js";
import {fetchRestEndpoint} from "../utils/client-server.js";
import {IPicture, IScene} from "../utils/interfaces.js";

export class Scene {
  private isDecision: boolean;
  private buttonName1: string; //button name for nextId1
  private buttonName2: string; // button name for nextId2

  private readonly id: number;
  private nextId1: number;
  private nextId2: number;
  private prevId: number;
  private talkingCharacter: string;
  private text: string;
  private pictures: ScenePictures;

  constructor(id: number, isDecision?: boolean) {
    this.id = id;
    if (isDecision) {
      this.isDecision = isDecision;
    } else {
      this.isDecision = false;
    }
  }

  public static async convertISceneToScene(scene : IScene):Promise<Scene>{
    let decision = false;
    if(scene.button1 !== ''){
      decision = true;
    }
    let newScene = new Scene(scene.id,decision);
    newScene.setText(scene.text);
    newScene.setPrevId(scene.prevId);
    newScene.setNextId(scene.nextId1);
    newScene.setNextId2(scene.nextId2);
    newScene.setButton1(scene.button1);
    newScene.setButton2(scene.button2);
    newScene.setTalkingCharacter(scene.talkingChar);

    let leftPic= '';
    let rightPic = '';
    let background = '';

    if(scene.picLeft !== -1){
      let left = await fetchRestEndpoint(`http://localhost:3000/api/pics/getWithBody/${scene.picLeft}`,'POST', {gameID: scene.gameId});
      let leftPicture:IPicture = await left.json();
      leftPic = leftPicture.url;
    }
    if(scene.picRight !== -1){
      let right = await fetchRestEndpoint(`http://localhost:3000/api/pics/getWithBody/${scene.picRight}`,'POST', {gameID: scene.gameId});
      let rightPicture:IPicture = await right.json();
      rightPic = rightPicture.url;
    }
    if(scene.picBackground !== -1){
      let bg = await fetchRestEndpoint(`http://localhost:3000/api/pics/getWithBody/${scene.picBackground}`,'POST', {gameID: scene.gameId});
      let bgPicture:IPicture = await bg.json();
      background = bgPicture.url;
    }
    let scenePics :ScenePictures = new ScenePictures(leftPic,rightPic,background);
    newScene.setPictures(scenePics);
    return newScene;
  }
  public async playScene(pronouns: string[], playerName: string): Promise<number> {
    console.log('me in function: playScene');

    this.displayCharactersAndBackground();
    console.log('finished displaying scene');
    if (this.isDecision) {
      return await this.handleDecision();
    }
    this.playNormalScene(pronouns, playerName);
    let nextIDNew: number = await this.playPrevOrNextScene();
    console.log(`next id: ${nextIDNew}`);
    return nextIDNew;
  }

  /**
   * function for displaying characters and background as saved in the scene
   * @private
   */
  private displayCharactersAndBackground() {
    console.log('me in function: displayCharactersAndBackground');

    const charLeft = <HTMLImageElement>document.getElementById("imgLeftChar");
    charLeft.src = this.pictures.getLeftChar();
    const charRight = <HTMLImageElement>document.getElementById("imgRightChar");
    charRight.src = this.pictures.getRightChar();

    const div = document.getElementById("imgBackground");
    div.style.backgroundImage = `url('${this.pictures.getBackground()}')`;
  }

  /**
   * function for deciding to play the next or the previous scene (with the buttons on the bottom)
   * @private
   */
  // do not delete the promise, it is needed to wait for the button click
  private playPrevOrNextScene(): Promise<number> {
    console.log('me in function: playPrevOrNextScene');

    let nextButton = document.getElementById('btnNext');
    let prevButton = document.getElementById('btnPrevious');

    const removeEventListeners = () => {
      removeAllEventListeners(nextButton);
      removeAllEventListeners(prevButton);
    }
    return  new Promise<number>((resolve) => {
      nextButton.addEventListener("click", () => {
        //alert("you clicked next");
        removeEventListeners();
        console.log(`next scene will be ${this.nextId1}`);
        resolve(this.nextId1);
      });
      prevButton.addEventListener("click", () => {
        //alert("you clicked prev");
        removeEventListeners();
        console.log(`next scene will be ${this.prevId}`);
        resolve(this.prevId);
      });
    });
  }

  /**
   * helper function for playScene, when the scene is a normal non-decision scene, the text boxes need to get
   * checked for replacement strings like ::name which doesn't need to be done with a decision
   * @param pronouns
   * @param playerName
   * @private
   */
  private playNormalScene(pronouns: string[], playerName: string) {
    this.resetTextFields();
    console.log('me in function: playNormalScene');

    let textField = document.getElementById("txtTextInTheBox");
    let talkingPerson = document.getElementById("txtTalkingPerson");

    if (this.talkingCharacter === "::name") {
      this.talkingCharacter = playerName;
    }

    talkingPerson.innerHTML = this.talkingCharacter;
    textField.innerHTML = this.replacePronounsAndPlayerName(pronouns, playerName);
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
  private replacePronounsAndPlayerName(
      pronouns: string[],
      playerName: string
  ): string {
    console.log(`text: ${this.text}`);
    this.text = this.text
        .replace("::name", playerName)
        .replace("::they", pronouns[0])
        .replace("::them", pronouns[1])
        .replace("::theirs", pronouns[2]);
    return this.text;
  }

  /**
   * handle decision
   * @return: number for next scene nextId1 if button 1 was pressed nextId2 if button 2 was pressed
   */
  // do not delete the promise, it is needed to wait for the button click
  private async handleDecision(): Promise<number> {
    this.resetTextFields();
    console.log('me in function: handleDecision');
    let firstButton: HTMLElement = document.getElementById("btnOpt1");
    let secondButton: HTMLElement = document.getElementById("btnOpt2");
    firstButton.innerText = this.buttonName1;
    secondButton.innerText = this.buttonName2;

    firstButton.style.display = "inline-block";
    secondButton.style.display = "inline-block";
    console.log("set buttons onto visible");

    // Remove the event listeners created by this function -> will be removed once the promise is resolved
    const removeEventListeners = () => {
      console.log('removing events');
      removeAllEventListeners(firstButton);
      removeAllEventListeners(secondButton);
      document.getElementById('btnOpt2').style.display = 'none';
      document.getElementById('btnOpt1').style.display = 'none';

    }

    return  await new Promise<number>((resolve) => {
      console.log('waiting for button click');
      firstButton.addEventListener('click',  () => {
        console.log('added event listener to button 1')
        console.log(
            `clicked button: ${this.buttonName1} next scene is: ${this.nextId1}`
        );

        // Resolve promise and remove the event listeners
        removeEventListeners();
        resolve(this.nextId1);
      });

      secondButton.addEventListener("click",  () => {
        console.log(
            `clicked button: ${this.buttonName2} next scene is: ${this.nextId2}`
        );
        // Resolve promise and remove the event listeners
        removeEventListeners();
        resolve(this.nextId2);
      });
    });
  }

  /**
   * small helper function for resetting the content in the text fields talking person and text
   */
  private resetTextFields() {
     document.getElementById("txtTextInTheBox").innerHTML = " ";
     document.getElementById("txtTalkingPerson").innerHTML = " ";
  }

  //Getters + Setters
  public getId(): number {
    return this.id;
  }

  public getNextId(): number {
    return this.nextId1;
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
    this.nextId1 = value;
  }

  public setButton1(value: string) {
    this.buttonName1 = value;
  }

  public setButton2(value: string) {
    this.buttonName2 = value;
  }

  public setDecision(value: boolean) {
    this.isDecision = value;
  }

  public getDecision() {
    return this.isDecision;
  }
  public getButton1() {
    return this.buttonName1;
  }

  public getButton2() {
    return this.buttonName2;
  }
}