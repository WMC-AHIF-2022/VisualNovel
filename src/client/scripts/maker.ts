import {fetchRestEndpoint} from "../utils/client-server.js";
import {IPicture, IScene} from "../utils/datamodels.js";
import {removeAllEventListeners} from "./extra/tools.js";
import {event} from "jquery";


/*Todo:  1. make the game editable
         4. improve sceneOverview

 */


export class Maker{
    private scenes : IScene[];
    private curScene :IScene;
    private idCounter: number = 0;
    private displayedSceneNum = 1;
    private listDisplayIdCounter = 0;
    private selectingChar = false;

    constructor() {
        this.scenes = [];
        this.curScene = null;
    }

    public getScenes (){
        return this.scenes;
    }

    createScene() {
        if(this.curScene === null){
            this.curScene = {id:this.idCounter++, nextId1: -1,nextId2:-1,button1:"",button2:"",prevId:-1,text: "Enter text here",talkingChar:"Name",picLeft:-1,picRight:-1,picBackground:-1,gameId:+sessionStorage.getItem('game-id')}
            let list = document.getElementById("sceneOverview");
            let html = '<li id="li ' + `${this.curScene.id}`+'"><p id="' + `${this.curScene.id}`+'" class="clickable">Scene ';
            this.scenes.push(this.curScene);
            html += this.displayedSceneNum++;
            html += '</p></li>';
            list.innerHTML += html;
        }
        else{
            let item = document.getElementById(`li ${this.curScene.id}`);
            this.curScene = {id:this.idCounter++, nextId1: -1,nextId2:-1,button1:"",button2:"",prevId:-1,text: "Enter text here",talkingChar:"Name",picLeft:-1,picRight:-1,picBackground:-1,gameId:+sessionStorage.getItem('game-id')}
            let SiblingItem = "";
            SiblingItem += '<li id="li ' + `${this.curScene.id}`+'"><p id="' + `${this.curScene.id}`+'" class="clickable">Scene ';
            SiblingItem += this.displayedSceneNum++;
            SiblingItem += '</p></li>';
            this.scenes.push(this.curScene);
            item.insertAdjacentHTML("afterend",SiblingItem);
        }

        document.getElementById(`${this.curScene.id}`).style.color= "pink";

        const leftChar = document.getElementById("file-upload");
        const rightChar = document.getElementById("file-upload2");
        const background = document.getElementById("background-upload");

        leftChar.addEventListener("click", async() => {
            this.selectingChar = true;
            let pic:IPicture|undefined = await this.showPictureInput();
            if(pic !== undefined){
                let char = <HTMLImageElement>document.getElementById("leftChar");
                // @ts-ignore
                char.src = pic.url;
                char.style.display = 'block';
                char.style.width = '18em';
                char.style.height = 'auto';
                document.getElementById("leftPlus").style.display = 'none';
                document.getElementById("file-upload").style.backgroundColor = 'transparent';
                document.getElementById("pgItem1").style.justifySelf = 'center';
                this.curScene.picLeft = pic.picId;
            }

            this.selectingChar = false;
        });


        rightChar.addEventListener("click",async()=>{
            this.selectingChar = true;
            let pic = await this.showPictureInput();
            let char = <HTMLImageElement>document.getElementById("rightChar");
            char.src = pic.url;
            char.style.display = 'block';
            char.style.width = '18em';
            char.style.height = 'auto';
            document.getElementById("rightPlus").style.display = 'none';
            document.getElementById("file-upload2").style.backgroundColor = 'transparent';
            document.getElementById("pgItem3").style.justifySelf = 'left';
            this.curScene.picRight = pic.picId;
            this.selectingChar = false;
        });

        background.addEventListener("click",async ()=>{

            console.log("trying background");
            console.log(this.selectingChar);
            if( !this.selectingChar && !(document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT')){
                console.log("background");
                this.selectingChar = true;
                let pic:IPicture|undefined = await this.showPictureInput();
                if(pic !== undefined){
                    console.log("went back");
                    let char = <HTMLLabelElement>document.getElementById("background-upload");
                    // @ts-ignore
                    char.style.backgroundImage = "url('" + pic.url.replace(/(\r\n|\n|\r)/gm, "") + "')";
                    char.style.backgroundSize = "cover";
                    this.curScene.picBackground = pic.picId;
                }
                this.selectingChar = false;
            }

        });
    }

     async showPictureInput():Promise<IPicture|undefined>{
        let picNameImp = document.getElementById("picNameInp");
        picNameImp.style.display = "flex";
        let returnPic : IPicture;
        await new Promise<void>( (resolve) => {
            let addButton = document.getElementById("addBtn");
            addButton.addEventListener("click",async ()=>{
                picNameImp.style.display = "none";
                try{
                    let picInput = <HTMLInputElement>document.getElementById("picName");
                    const response = await fetchRestEndpoint(`http://localhost:3000/api/pics/${picInput.value}`,"GET");
                    returnPic = await response.json();
                }catch(ex){
                    alert("Picture doesn't exist");

                }
                removeAllEventListeners(addButton);
                resolve();
            })
        });

        return returnPic;
    }

    saveSceneElements() {
        document.getElementById("picNameInp").style.display = "none"
        if(this.curScene.nextId2 !== -1){
            let btnName = <HTMLInputElement>document.getElementById("btn1");
            this.curScene.button1 = btnName.value;
            btnName = <HTMLInputElement>document.getElementById("btn2");
            this.curScene.button2 = btnName.value;
            document.getElementById("btn1").style.display ="none" ;
            document.getElementById("btn2").style.display = "none";
            this.DisableButtons(false);
        }
        document.getElementById(`${this.curScene.id}`).style.color= "#CCE8E1";
        this.curScene.talkingChar = (<HTMLInputElement>document.getElementById("povName")).value;
        this.curScene.text = (<HTMLInputElement>document.getElementById("playgroundTextbox")).value;

    }

    switchScene() {
        const scenes = document.getElementsByClassName("clickable");
        for(let i = 0;i < scenes.length;i++){
            scenes[i].addEventListener("click",async () => {
                this.saveSceneElements();
                this.curScene = this.scenes.find(s => s.id === +scenes[i].id)
                await this.loadScene();
                document.getElementById(`${scenes[i].id}`).style.color = "pink";
            })
        }

    }

    createOptions() {
        document.getElementById("btn1").style.display = "block";
        document.getElementById("btn2").style.display = "block";
        this.DisableButtons(true)
        this.displayedSceneNum++;
        document.getElementById(`${this.curScene.id}`).innerText += " *"
    }

    private async loadScene() {
        if (this.curScene.nextId2 !== -1) {
            let btn1 = <HTMLInputElement>document.getElementById("btn1");
            btn1.style.display = "block";
            btn1.value = this.curScene.button1;
            let btn2 = <HTMLInputElement>document.getElementById("btn2");
            btn2.style.display = "block";
            btn2.value = this.curScene.button2;
            this.DisableButtons(true);

        }
        if (document.getElementById(`li ${this.curScene.id}`).nextElementSibling === null) {
            let btnDecision = <HTMLButtonElement>document.getElementById("makeDecision");
            btnDecision.disabled = false;
        } else {
            console.log("button not clickable")
            let btnDecision = <HTMLButtonElement>document.getElementById("makeDecision");
            btnDecision.disabled = true;
        }
        (<HTMLInputElement>document.getElementById("playgroundTextbox")).value = this.curScene.text;
        (<HTMLInputElement>document.getElementById("povName")).value = this.curScene.talkingChar;
        if (this.curScene.picBackground === -1) {
            document.getElementById("background-upload").style.backgroundImage = "none";
            document.getElementById("background-upload").style.backgroundColor = "white";

        } else {
            let background = document.getElementById("background-upload");
            background.style.backgroundSize = "cover";
            let bgResponse = await fetchRestEndpoint(`http://localhost:3000/api/pics/${this.curScene.picBackground}`, "POST", {gameId: this.curScene.gameId});
            let bgpic: IPicture | undefined = await bgResponse.json();
            background.style.backgroundImage = `url('${bgpic.url}')`;
        }
        let leftChar = <HTMLImageElement>document.getElementById("leftChar");
        if (this.curScene.picLeft === -1) {
            document.getElementById("leftChar").style.display = "none";
            document.getElementById("pgItem1").style.justifySelf = "right";
            document.getElementById("leftPlus").style.display = "block";
            document.getElementById("file-upload").style.backgroundColor = 'gainsboro';
        } else {
            let leftPicResponse = await fetchRestEndpoint(`http://localhost:3000/api/pics/${this.curScene.picLeft}`, "POST", {gameId: this.curScene.gameId});
            let leftPic: IPicture | undefined = await leftPicResponse.json();
            leftChar.src = leftPic.url;
            leftChar.style.display = 'block';
            leftChar.style.width = '18em';
            leftChar.style.height = 'auto';
            document.getElementById("leftPlus").style.display = 'none';
            document.getElementById("file-upload").style.backgroundColor = 'transparent';
            document.getElementById("pgItem1").style.justifySelf = 'center';
        }
        let rightChar = <HTMLImageElement>document.getElementById("rightChar");
        if (this.curScene.picRight === -1) {
            document.getElementById("rightChar").style.display = "none";
            document.getElementById("rightPlus").style.display = "block";
            document.getElementById("file-upload2").style.backgroundColor = 'gainsboro';
        } else {
            let rightPicResponse = await fetchRestEndpoint(`http://localhost:3000/api/pics/${this.curScene.picRight}`, "POST", {gameId: this.curScene.gameId});
            let rightPic: IPicture | undefined = await rightPicResponse.json();
            rightChar.src = rightPic.url;
            rightChar.style.display = 'block';
            rightChar.style.width = '18em';
            rightChar.style.height = 'auto';
            document.getElementById("rightPlus").style.display = 'none';
            document.getElementById("file-upload2").style.backgroundColor = 'transparent';
            document.getElementById("pgItem3").style.justifySelf = 'left';
        }

    }

    async setPlaygroundBack() {
        if(this.curScene.nextId2 !== -1){
            document.getElementById("btn1").style.display = "none";
            document.getElementById("btn2").style.display = "none";
        }
        (<HTMLInputElement>document.getElementById("playgroundTextbox")).value = 'Enter text here';
        (<HTMLInputElement>document.getElementById("povName")).value = 'Name';
        document.getElementById("file-upload2").style.backgroundColor = 'gainsboro';
        document.getElementById("rightPlus").style.display = "block";
        let leftChar = <HTMLImageElement>document.getElementById("leftChar");
        leftChar.src = "";
        document.getElementById("leftChar").style.display = "none";
        let rightChar = <HTMLImageElement>document.getElementById("rightChar");
        rightChar.src = "";
        document.getElementById("rightChar").style.display = "none";
        document.getElementById("pgItem1").style.justifySelf = "right";
        document.getElementById("file-upload").style.backgroundColor = 'gainsboro';
        document.getElementById("leftPlus").style.display = "block";
        document.getElementById("background-upload").style.backgroundImage = "none";
        document.getElementById("background-upload").style.backgroundColor = "white";
    }

    async createDecisionScene(num: Number) {
        console.log("Lege neue Decision Szene an");//Todo: from itemStorage
        console.log(`Id Counter = ${this.idCounter}`);
        let scene :IScene = {id:this.idCounter++, nextId1: -1,nextId2:-1,button1:"",button2:"",prevId:-1,text: "Enter text here",talkingChar:"Name",picLeft:-1,picRight:-1,picBackground:-1,gameId:+sessionStorage.getItem('game-id')}
        scene.prevId = this.curScene.id;
        let item = document.getElementById(`li ${this.curScene.id}`);
        let html = '<li> <ul class="childList"><li id="li ' + `${scene.id}` + '">  <p id="' + `${scene.id}` + '" class="clickable">Scene ';
        this.scenes.push(scene);
        html += this.displayedSceneNum;
        html += `.${num}`
        html += '</p><p id="ld ' + `${this.listDisplayIdCounter}` + '" class="listViewClickable">v</p></li></ul></li>';
        if (num == 1) {
            console.log(`nextId1 = ${scene.id}`);
            this.curScene.nextId1 = scene.id;
            item.insertAdjacentHTML("afterend", html);
        } else {
            console.log(`nextId2 = ${scene.id}`);
            this.curScene.nextId2 = scene.id;
            console.log(item.nextElementSibling);
            item.nextElementSibling.insertAdjacentHTML("afterend", html);
        }

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
                if (btn.innerText === "v") {
                    closeListPart(btn);
                } else {
                    expandListPart(btn);
                }
            })

        function closeListPart(btn: HTMLElement) {
            btn.innerText = "<";
            console.log("should close and set expand");
            btn = <HTMLElement>btn.parentElement.nextElementSibling;
            while(btn !== null){
                btn.style.display = "none";
                btn = <HTMLElement>btn.nextElementSibling;
            }
        }

        function expandListPart(btn: HTMLElement) {
            btn.innerText = "v"
            console.log("should expand and set close");
            btn = <HTMLElement>btn.parentElement.nextElementSibling;
            while(btn !== null){
                btn.style.display = "flex";
                btn = <HTMLElement>btn.nextElementSibling;
            }

        }


    }


    async loadSceneOverview(scenes: IScene[]) {
        this.scenes = scenes;
        this.curScene = scenes[0];
        console.log(this.scenes);
        if(this.curScene.nextId2 !== -1){

        }else{
            let list = document.getElementById("sceneOverview");
            let html = '<li id="li ' + `${this.curScene.id}`+'"><p id="' + `${this.curScene.id}`+'" class="clickable">Scene ';
            html += this.displayedSceneNum++;
            html += '</p></li>';
            list.innerHTML += html;
            this.loadSingleSceneInOverview(scenes,scenes.find(s=> s.id ==+this.curScene.nextId1),0);
        }
        await this.loadScene();



    }

    private loadSingleSceneInOverview(scenes: IScene[], scene: IScene,decisionNum:number) {
        let item = document.getElementById(`li ${this.curScene.id}`);
        this.curScene = scene;
        if(this.curScene.nextId2 !== -1){
            console.log(scene)
            console.log("decision");
            console.log(this.curScene.nextId1);
            console.log(this.curScene.nextId2);
            let SiblingItem = "";
            SiblingItem += '<li id="li ' + `${this.curScene.id}`+'"><p id="' + `${this.curScene.id}`+'" class="clickable">Scene ';
            SiblingItem += this.displayedSceneNum++;
            SiblingItem += '*</p></li>';
            item.insertAdjacentHTML("afterend",SiblingItem);
            let displayId = this.displayedSceneNum;
            this.loadSingleDecisionSceneInOverview(scenes,scenes.find(s=> s.id == +this.curScene.nextId1),1);
            this.curScene = scene;
            this.displayedSceneNum = displayId;
            this.loadSingleDecisionSceneInOverview(scenes,scenes.find(s=> s.id == +this.curScene.nextId2),2);
        }else{
            let SiblingItem = "";
            SiblingItem += '<li id="li ' + `${this.curScene.id}`+'"><p id="' + `${this.curScene.id}`+'" class="clickable">Scene ';
            SiblingItem += this.displayedSceneNum++;
            SiblingItem += '</p></li>';
            item.insertAdjacentHTML("afterend",SiblingItem);
            if(this.curScene.nextId1 !== -1){
                this.loadSingleSceneInOverview(scenes,scenes.find(s=> s.id ==+this.curScene.nextId1), 0);
            }

        }
    }

    private loadSingleDecisionSceneInOverview(scenes: IScene[], iScene: IScene, decisionNum: number) {
        let item = document.getElementById(`li ${this.curScene.id}`);
        if(decisionNum != 0){
            console.log("descision zweig");
            console.log(iScene);
            let html = '<li> <ul class="childList"><li id="li ' + `${iScene.id}` + '">  <p id="' + `${iScene.id}` + '" class="clickable">Scene ';
            html += this.displayedSceneNum;
            html += `.${decisionNum}`
            html += '</p><p id="ld ' + `${this.listDisplayIdCounter}` + '" class="listViewClickable">v</p></li></ul></li>';
            if(decisionNum == 1){
                item.insertAdjacentHTML("afterend", html);
                this.displayedSceneNum++;
            }else{
                item.nextElementSibling.insertAdjacentHTML("afterend", html);

            }
            this.curScene = iScene;
            if(this.curScene.nextId2 !== -1){
                this.loadSingleDecisionSceneInOverview(scenes,scenes.find(s=> s.id == +this.curScene.nextId1),1);
                this.curScene = iScene;
                this.loadSingleDecisionSceneInOverview(scenes,scenes.find(s=> s.id == +this.curScene.nextId2),2);
            }else if(this.curScene.nextId1 !== -1){
                this.loadSingleSceneInOverview(scenes,scenes.find(s=> s.id ==+this.curScene.nextId1), 0);
            }
        }
    }
}

async function init() {
    let maker:Maker = new Maker();
    //sessionStorage.clear();
   /* if(sessionStorage.getItem("gameId") !== null){
        let gameId = +sessionStorage.getItem("gameId");
        let scenesResponse = await fetchRestEndpoint(`http://localhost:3000/api/scenes/ByGameId/${gameId}`,"GET");
        let scenes : IScene[] = await scenesResponse.json();
        if(scenes.length === 0){
            await maker.loadSceneOverview(scenes);
        }else{
            await maker.createScene();
        }

    }else{
        await maker.createScene();
    }*/
    await maker.createScene();
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
    document.getElementById("uploadButton").addEventListener("click",async () => {
        await maker.saveSceneElements();
        let scenes = maker.getScenes();

        for (let scene of scenes) { //connecting scenes, by giving them their nextId's and prevId's through the HTML List
            let sceneElement = document.getElementById(`li ${scene.id}`);
            if(scene.nextId2 === -1 && sceneElement.nextElementSibling !== null){
                    scene.nextId1 = +sceneElement.nextElementSibling.id.substring(3);
            }
            if (sceneElement.previousElementSibling !== null) {
                scene.prevId = +sceneElement.previousElementSibling.id.substring(3);
            }

            try{
                await fetchRestEndpoint("http://localhost:3000/api/scenes","POST",scene);
            }
            catch(ex){

            }

        }
        window.location.href="../html/upload.html";

    })

}

window.addEventListener("load",init);