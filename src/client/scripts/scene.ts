import { ScenePictures } from "./scene-pics.js";
import {removeAllEventListeners} from "./extra/tools.js";

export class Scene {
  private isDecision: boolean;
  private buttonName1: string; //button name for nextId
  private buttonName2: string; // button name for nextId2

  private readonly id: number;
  private nextId: number;
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

  // TODO!! check why next scene doesn't get played and fix every bug that occurs after the first fix
  public async playScene(
      pronouns: string[],
      playerName: string
  ): Promise<number> {
    this.displayCharactersAndBackground();
    console.log('finished displaying scene');
    if (this.isDecision) {
      return this.handleDecision();
    }
    this.playNormalScene(pronouns, playerName);
    let nextIDnew: number = await this.playPrevOrNextScene();
    console.log(`next id: ${nextIDnew}`);
    return nextIDnew;
  }

  /**
   * function for displaying characters and background as saved in the scene
   * @private
   */
  //TODO!! add a clause where one character is not given and fill it in as empty
  // be careful, this can be either the left or the right character, might even be the background
  // in case of not being able to fetch it!!! So check both cases!!
  // 1. not given
  // 2. not able to fetch / broken picture or url
  private displayCharactersAndBackground() {
    const charLeft = <HTMLImageElement>document.getElementById("imgLeftChar");
    charLeft.src = this.pictures.getleftChar();
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
    let nextButton = document.getElementById('btnNext');
    let prevButton = document.getElementById('btnPrevious');

    const removeEventListeners = () => {
      removeAllEventListeners(nextButton);
      removeAllEventListeners(prevButton);
    }
    let id: Promise<number> = new Promise<number>((resolve) => {
      nextButton.addEventListener("click", () => {
        alert("you clicked next");
        removeEventListeners();
        resolve(this.nextId);
      });
      prevButton.addEventListener("click", () => {
        alert("you clicked prev");
        removeEventListeners();
        resolve(this.prevId);
      });
    });
    console.log(`next id after resolving promise: ${id}`);
    return id;
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
    let textField = document.getElementById("txtTextInTheBox");
    let talkingPerson = document.getElementById("txtName");

    if (this.talkingCharacter === "::name") {
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
  private replacePronounsAndPlayerName(
      pronouns: string[],
      playerName: string
  ): string {
    console.log(`text: ${this.text}`);
    this.text = this.text
        .replace("::name", playerName)
        .replace("::they", pronouns[1])
        .replace("::them", pronouns[2])
        .replace("::theirs", pronouns[3]);
    return this.text;
  }

  /**
   * handle decision
   * @return: number for next scene nextId if button 1 was pressed nextId2 if button 2 was pressed
   */
  // do not delete the promise, it is needed to wait for the button click
  private async handleDecision(): Promise<number> {
    this.resetTextFields();

    let firstButton: HTMLElement = document.getElementById("btnOpt1");
    let secondButton: HTMLElement = document.getElementById("btnOpt2");
    firstButton.innerText = this.buttonName1;
    secondButton.innerText = this.buttonName2;

    //TODO!! check if button is visible
    firstButton.style.display = "inline-block";
    secondButton.style.display = "inline-block";
    console.log("set buttons onto visible");

    // Remove the event listeners created by this function -> will be removed once the promise is resolved
    const removeEventListeners = () => {
      removeAllEventListeners(firstButton);
      removeAllEventListeners(secondButton);
    }

    let nextSceneToBePlayed: number = -1; // in case something goes wrong, return -1
    nextSceneToBePlayed = await new Promise<number>((resolve) => {
      firstButton.addEventListener("click", () => {
        console.log(
            `clicked button: ${this.buttonName1} next scene is: ${this.nextId}`
        );

        // Resolve promise and remove the event listeners
        removeEventListeners();
        resolve(this.nextId);
      });
      secondButton.addEventListener("click", () => {
        console.log(
            `clicked button: ${this.buttonName2} next scene is: ${this.nextId2}`
        );

        // Resolve promise and remove the event listeners
        removeEventListeners();
        resolve(this.nextId2);
      });
    });
    firstButton.style.display = "none";
    secondButton.style.display = "none";
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