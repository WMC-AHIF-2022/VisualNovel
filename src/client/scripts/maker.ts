import {Game} from "./game.js";
import {Scene} from "./scene.js";
import {ScenePictures} from "./scene-pics.js";

export class Maker{
    private game: Game;
    private curScene :Scene;
    private idCounter: number = 0;
    private displayedSceneNum = 1;
    private listDisplayIdCounter = 0;

    constructor() {
        this.game = new Game();
        this.curScene = null;
    }

    public getGame (){
        return this.game;
    }

    createScene() {
        console.log("Lege neue Szene an");
        if(this.curScene === null){
            this.curScene = new Scene(this.idCounter++);
            let list = document.getElementById("sceneOverview");
            let html = '<li id="li ' + `${this.curScene.getId()}`+'"><p id="' + `${this.curScene.getId()}`+'" class="clickable">Scene ';
            this.game.addScene(this.curScene);
            html += this.displayedSceneNum++;
            html += '</p></li>';
            list.innerHTML += html;
        }
        else{
            let item = document.getElementById(`li ${this.curScene.getId()}`);
            this.curScene = new Scene(this.idCounter++);
            let SiblingItem = "";
            SiblingItem += '<li id="li ' + `${this.curScene.getId()}`+'"><p id="' + `${this.curScene.getId()}`+'" class="clickable">Scene ';
            SiblingItem += this.displayedSceneNum++;
            SiblingItem += '</p></li>';
            this.game.addScene(this.curScene);
            item.insertAdjacentHTML("afterend",SiblingItem);
        }

        document.getElementById(`${this.curScene.getId()}`).style.color= "pink";

        const leftChar = <HTMLInputElement>document.getElementById("file-upload");
        const rightChar = <HTMLInputElement>document.getElementById("file-upload2");
        const background = <HTMLInputElement>document.getElementById("background-upload");

        const convertBase64 =(file: File)=>{
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);

                fileReader.onload = () => {
                    resolve(fileReader.result);
                };

                fileReader.onerror = (error) => {
                    reject(error);
                };
            });

        }

        leftChar.addEventListener("change", async() => {

            let file = leftChar.files[0];
            console.log("file:");
            console.log(file);
            const base64 = await convertBase64(file);
            let char = <HTMLImageElement>document.getElementById("leftChar");
            // @ts-ignore
            char.src = base64;
            char.style.display = 'block';
            char.style.width = '18em';
            char.style.height = 'auto';
            document.getElementById("leftPlus").style.display = 'none';
            document.getElementById("file-label").style.backgroundColor = 'transparent';
            document.getElementById("pgItem1").style.justifySelf = 'center';

            //"url(\"../img/backgrounds/wald2_5.png\")"
            console.log("should have changed");
        });

        rightChar.addEventListener("change",async()=>{
            let file = rightChar.files[0];
            console.log("file:");
            console.log(file);
            const base64 = await convertBase64(file);
            let char = <HTMLImageElement>document.getElementById("rightChar");
            // @ts-ignore
            char.src = base64;
            char.style.display = 'block';
            char.style.width = '18em';
            char.style.height = 'auto';
            document.getElementById("rightPlus").style.display = 'none';
            document.getElementById("file-label2").style.backgroundColor = 'transparent';
            document.getElementById("pgItem3").style.justifySelf = 'left';
        });

        background.addEventListener("change",async ()=>{
            let file = background.files[0];
            console.log("file:");
            console.log(file);
            const base64 = await convertBase64(file);
            let char = <HTMLLabelElement>document.getElementById("bgLabel");
            // @ts-ignore
            char.style.backgroundImage = "url('" + base64.replace(/(\r\n|\n|\r)/gm, "") + "')";
            char.style.backgroundSize = "cover";


        });
    }

    saveSceneElements() {
        if(this.curScene.getDecision()){
            let btnName = <HTMLInputElement>document.getElementById("btn1");
            this.curScene.setButton1(btnName.value);
            btnName = <HTMLInputElement>document.getElementById("btn2");
            this.curScene.setButton2(btnName.value);
            document.getElementById("btn1").style.display = "none";
            document.getElementById("btn2").style.display = "none";
            this.DisableButtons(false);
        }
        console.log(this.curScene);
        document.getElementById(`${this.curScene.getId()}`).style.color= "#CCE8E1";
        this.curScene.setTalkingCharacter((<HTMLInputElement>document.getElementById("povName")).value);
        this.curScene.setText((<HTMLInputElement>document.getElementById("playgroundTextbox")).value);
        let leftChar = <HTMLImageElement>document.getElementById("leftChar");
        let rightChar = <HTMLImageElement>document.getElementById("rightChar");
        let background = <HTMLInputElement>document.getElementById("bgLabel");
        let leftUrl;
        let rightUrl;
        if(!leftChar.src.startsWith("data")){
             leftUrl = "";
        }
        else{
            leftUrl = leftChar.src;
        }
        if(!rightChar.src.startsWith("data")){
            rightUrl = "";
        }
        else{
            rightUrl = rightChar.src;
        }
        let pics = new ScenePictures(leftUrl,rightUrl,background.style.backgroundImage);
        this.curScene.setPictures(pics);
        console.log(this.curScene.getPictures());
        console.log("Szene gespeichert");
    }

    switchScene() {
        const scenes = document.getElementsByClassName("clickable");
        console.log(scenes);
        for(let i = 0;i < scenes.length;i++){
            scenes[i].addEventListener("click",()=>{
                console.log("szene switched");
                this.saveSceneElements();
                console.log(`clicked id ${i}`);
                this.curScene = this.game.getScene(+scenes[i].id);
                console.log("new scene");
                console.log(this.curScene);
                console.log(`clicked id ${i}`);
                this.loadScene(this.game.getScene(+scenes[i].id));
                document.getElementById(`${scenes[i].id}`).style.color = "pink";
            })
        }

    }

    createOptions() {
        document.getElementById("btn1").style.display = "block";
        document.getElementById("btn2").style.display = "block";
        this.DisableButtons(true)
        this.curScene.setDecision(true);
        this.displayedSceneNum++;
        document.getElementById(`${this.curScene.getId()}`).innerText += " <"
    }

    private loadScene(scene: Scene) {
        console.log("Zu Ladende szene:");
        console.log(scene);
        if(this.curScene.getDecision()){
            let btn1 = <HTMLInputElement>document.getElementById("btn1");
            btn1.style.display = "block";
            btn1.value = this.curScene.getButton1();
            let btn2 = <HTMLInputElement>document.getElementById("btn2");
            btn2.style.display = "block";
            btn2.value = this.curScene.getButton2();
            this.DisableButtons(true);

        }
        if(document.getElementById(`li ${scene.getId()}`).nextElementSibling === null){
            let btnDecision = <HTMLButtonElement>document.getElementById("makeDecision");
            btnDecision.disabled = false;
            console.log("button clickable");
        }else{
            console.log("button not clickable")
            let btnDecision = <HTMLButtonElement>document.getElementById("makeDecision");
            btnDecision.disabled = true;
        }
        (<HTMLInputElement>document.getElementById("playgroundTextbox")).value = this.curScene.getText();
        (<HTMLInputElement>document.getElementById("povName")).value = this.curScene.getTalkingCharacter();
        document.getElementById("bgLabel").style.backgroundImage = this.curScene.getPictures().getBackground();
        if(this.curScene.getPictures().getBackground() === "none"){
            console.log("Kein Hintergrund");
            document.getElementById("bgLabel").style.backgroundImage = "none";
            document.getElementById("bgLabel").style.backgroundColor = "white";
        }
        else{
            console.log("Hintergrund");
            document.getElementById("bgLabel").style.backgroundSize = "cover";
        }
        let leftChar = <HTMLImageElement>document.getElementById("leftChar");
        // @ts-ignore
        leftChar.src = this.curScene.getPictures().getLeftChar();
        if(this.curScene.getPictures().getLeftChar() === ""){
            console.log("Kein Linker");
            document.getElementById("leftChar").style.display = "none";
            document.getElementById("pgItem1").style.justifySelf = "right";
            document.getElementById("leftPlus").style.display = "block";
            document.getElementById("file-label").style.backgroundColor = 'gainsboro';
        }
        else{
            leftChar.style.display = 'block';
            leftChar.style.width = '18em';
            leftChar.style.height = 'auto';
            document.getElementById("leftPlus").style.display = 'none';
            document.getElementById("file-label").style.backgroundColor = 'transparent';
            document.getElementById("pgItem1").style.justifySelf = 'center';
        }
        let rightChar = <HTMLImageElement>document.getElementById("rightChar");
        // @ts-ignore
        rightChar.src = this.curScene.getPictures().getRightChar();
        if(this.curScene.getPictures().getRightChar() === ""){
            console.log("Kein Rechter");
            document.getElementById("rightChar").style.display = "none";
            document.getElementById("rightPlus").style.display = "block";
            document.getElementById("file-label2").style.backgroundColor = 'gainsboro';
        }
        else{
            console.log("rechter");
            rightChar.style.display = 'block';
            rightChar.style.width = '18em';
            rightChar.style.height = 'auto';
            document.getElementById("rightPlus").style.display = 'none';
            document.getElementById("file-label2").style.backgroundColor = 'transparent';
            document.getElementById("pgItem3").style.justifySelf = 'left';
        }

    }

    async setPlaygroundBack() {
        if(this.curScene.getDecision()){
            document.getElementById("btn1").style.display = "none";
            document.getElementById("btn2").style.display = "none";
        }
        (<HTMLInputElement>document.getElementById("playgroundTextbox")).value = 'Enter text here';
        (<HTMLInputElement>document.getElementById("povName")).value = 'Name';
        document.getElementById("file-label2").style.backgroundColor = 'gainsboro';
        document.getElementById("rightPlus").style.display = "block";
        let leftChar = <HTMLImageElement>document.getElementById("leftChar");
        leftChar.src = "";
        document.getElementById("leftChar").style.display = "none";
        let rightChar = <HTMLImageElement>document.getElementById("rightChar");
        rightChar.src = "";
        document.getElementById("rightChar").style.display = "none";
        document.getElementById("pgItem1").style.justifySelf = "right";
        document.getElementById("file-label").style.backgroundColor = 'gainsboro';
        document.getElementById("leftPlus").style.display = "block";
        document.getElementById("bgLabel").style.backgroundImage = "none";
        document.getElementById("bgLabel").style.backgroundColor = "white";
    }

    async createDecisionScene(num: Number) {
        console.log("Lege neue Decision Szene an");
        let scene = new Scene(this.idCounter++);
        scene.setPrevId(this.curScene.getId());
        let item = document.getElementById(`li ${this.curScene.getId()}`);
        let html = '<li> <ul class="childList"><li id="li ' + `${scene.getId()}` + '">  <p id="' + `${scene.getId()}` + '" class="clickable">Scene ';
        this.game.addScene(scene);
        html += this.displayedSceneNum;
        html += `.${num}`
        html += '</p><p id="ld ' + `${this.listDisplayIdCounter}` + '" class="listViewClickable">[close]</p></li></ul></li>';
        if (num == 1) {
            this.curScene.setNextId(scene.getId());
            item.insertAdjacentHTML("afterend", html);
        } else {
            this.curScene.setNextId2(scene.getId());
            console.log(item.nextElementSibling);
            item.nextElementSibling.insertAdjacentHTML("afterend", html);
        }

        scene.setText("Enter text here");
        scene.setTalkingCharacter("Name");
        let pics = new ScenePictures("", "", "none");
        scene.setPictures(pics);
        console.log(this.listDisplayIdCounter);
        console.log(document.getElementById(`ld ${this.listDisplayIdCounter}`));
        this.changeListDisplay(document.getElementById(`ld ${this.listDisplayIdCounter++}`));

    }

    private DisableButtons(disable: boolean) {
        let btnDecision = <HTMLButtonElement>document.getElementById("makeDecision");
        btnDecision.disabled = disable;
        let btnScene = <HTMLButtonElement>document.getElementById("makeScene");
        btnScene.disabled = disable;
    }

    changeListDisplay(btn: HTMLElement) {
            btn.addEventListener("click",()=> {
                if (btn.innerText === "[close]") {
                    closeListPart(btn);
                } else {
                    expandListPart(btn);
                }
            })



        function closeListPart(btn: HTMLElement) {
            btn.innerText = "[expand]"
            console.log("should close and set expand");
            btn = <HTMLElement>btn.parentElement.nextElementSibling;
            while(btn !== null){
                btn.style.display = "none";
                btn = <HTMLElement>btn.nextElementSibling;
            }
        }

        function expandListPart(btn: HTMLElement) {
            btn.innerText = "[close]"
            console.log("should expand and set close");
            btn = <HTMLElement>btn.parentElement.nextElementSibling;
            while(btn !== null){
                btn.style.display = "flex";
                btn = <HTMLElement>btn.nextElementSibling;
            }

        }


    }
}

async function init() {
    let maker:Maker = await new Maker();
    await maker.createScene()
    document.getElementById("makeScene").addEventListener("click",async()=>{
        await maker.saveSceneElements();
        await maker.setPlaygroundBack();
        await maker.createScene();
        await maker.switchScene();
    });
    document.getElementById("makeDecision").addEventListener("click",async ()=>{
        await maker.createDecisionScene(1);
        await maker.createDecisionScene(2);
        await maker.createOptions();
        await maker.switchScene();

    });
    document.getElementById("uploadButton").addEventListener("click",()=>{
        maker.saveSceneElements();
        let scenes = maker.getGame().getScenes();
        for(let scene of scenes){ //connecting scenes, by giving them their nextId's and prevId's through the HTML List
            let sceneElement = document.getElementById(`li ${scene.getId()}`);
            if(sceneElement.nextElementSibling !== null){
                scene.setNextId(+sceneElement.nextElementSibling.id.substring(3));
            }
            if(sceneElement.previousElementSibling !== null){
                scene.setPrevId(+sceneElement.previousElementSibling.id.substring(3));
            }
            console.log(scene);
        }
    })

}

window.addEventListener("load",init);