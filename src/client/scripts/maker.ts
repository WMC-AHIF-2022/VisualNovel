import {Game} from "./game.js";
import {Scene} from "./scene.js";
import {ScenePictures} from "./scene-pics.js";
import {fetchRestEndpoint} from "../utils/client-server.js";
import {IPicture, IScene} from "../utils/datamodels.js";

/*Todo:  6. make the game editable
        //: after talking with the others
        7. see if showing base64 pic works, if not,then make it work --normal pics work :)
        4. make the pop up look fancy (picture Name in line with checking if exists)
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
        console.log("Lege neue Szene an");
        if(this.curScene === null){
            this.curScene = {id:this.idCounter++, nextId1: -1,nextId2:-1,button1:"",button2:"",prevId:-1,text: "Enter text here",talkingChar:"Name",picLeft:-1,picRight:-1,picBackground:-1,gameId:2}
            let list = document.getElementById("sceneOverview");
            let html = '<li id="li ' + `${this.curScene.id}`+'"><p id="' + `${this.curScene.id}`+'" class="clickable">Scene ';
            this.scenes.push(this.curScene);
            html += this.displayedSceneNum++;
            html += '</p></li>';
            list.innerHTML += html;
        }
        else{
            let item = document.getElementById(`li ${this.curScene.id}`);
            this.curScene = {id:this.idCounter++, nextId1: -1,nextId2:-1,button1:"",button2:"",prevId:-1,text: "Enter text here",talkingChar:"Name",picLeft:-1,picRight:-1,picBackground:-1,gameId:2}
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

        leftChar.addEventListener("click", async() => {
            this.selectingChar = true;
            console.log("clicked leftChar");
            let pic = await showPictureInput();
            console.log("pic returned");
            let char = <HTMLImageElement>document.getElementById("leftChar");
            // @ts-ignore
            char.src = pic.url;
            char.style.display = 'block';
            char.style.width = '18em';
            char.style.height = 'auto';
            document.getElementById("leftPlus").style.display = 'none';
            document.getElementById("file-upload").style.backgroundColor = 'transparent';
            document.getElementById("pgItem1").style.justifySelf = 'center';

            //"url(\"../img/backgrounds/wald2_5.png\")"
            console.log("should have changed");
            this.selectingChar = false;
            this.curScene.picLeft = pic.picId;
        });

        async function showPictureInput():Promise<IPicture> {
            let picNameImp = document.getElementById("picNameInp");
            picNameImp.style.display = "flex";
            let returnPic;
            console.log("should appear");
            await new Promise<void>( (resolve) => {
                document.getElementById("addBtn").addEventListener("click",async ()=>{
                    picNameImp.style.display = "none";
                    let picInput = <HTMLInputElement>document.getElementById("picName");
                    const response = await fetchRestEndpoint(`http://localhost:3000/api/pics/${picInput.value}`,"GET");
                    let pic : IPicture = await response.json();
                    console.log(pic);
                    picNameImp.style.display = "none";
                    returnPic = pic;
                    resolve();
                })
            });

            return returnPic;
        }

        rightChar.addEventListener("click",async()=>{
            this.selectingChar = true;
            console.log("clicked rightChar");
            let pic = await showPictureInput();
            console.log("pic returned");
            console.log(pic.url);
            let char = <HTMLImageElement>document.getElementById("rightChar");
            char.src = pic.url;
            console.log(char.src);
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
            if(!this.selectingChar && !(document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT')){
                this.selectingChar = true;
                console.log("clicked background");
                let pic = await showPictureInput();
                console.log("pic returned");
                let char = <HTMLLabelElement>document.getElementById("background-upload");
                // @ts-ignore
                char.style.backgroundImage = "url('" + pic.url.replace(/(\r\n|\n|\r)/gm, "") + "')";
                char.style.backgroundSize = "cover";
                this.selectingChar = false;
                this.curScene.picBackground = pic.picId;
            }

        });
    }

    saveSceneElements() {
        document.getElementById("picNameInp").style.display = "none"
        if(this.curScene.nextId2 !== -1){
            console.log("btns should dissapear");
            let btnName = <HTMLInputElement>document.getElementById("btn1");
            this.curScene.button1 = btnName.value;
            btnName = <HTMLInputElement>document.getElementById("btn2");
            this.curScene.button2 = btnName.value;
            document.getElementById("btn1").style.display ="none" ;
            document.getElementById("btn2").style.display = "none";
            console.log(btnName.style.display);
            this.DisableButtons(false);
        }
        console.log(this.curScene);
        document.getElementById(`${this.curScene.id}`).style.color= "#CCE8E1";
        this.curScene.talkingChar = (<HTMLInputElement>document.getElementById("povName")).value;
        this.curScene.text = (<HTMLInputElement>document.getElementById("playgroundTextbox")).value;

        console.log("Szene gespeichert");
    }

    switchScene() {
        const scenes = document.getElementsByClassName("clickable");
        console.log(scenes);
        for(let i = 0;i < scenes.length;i++){
            scenes[i].addEventListener("click",async () => {
                console.log("szene switched");
                this.saveSceneElements();
                console.log(`clicked position ${i} with id ${scenes[i].id}`);
                this.curScene = this.scenes.find(s => s.id === +scenes[i].id)
                console.log("cur scene: ");
                console.log(this.curScene.id);
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
        console.log("Zu Ladende szene:");
        console.log(this.curScene);
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
            console.log("button clickable");
        } else {
            console.log("button not clickable")
            let btnDecision = <HTMLButtonElement>document.getElementById("makeDecision");
            btnDecision.disabled = true;
        }
        (<HTMLInputElement>document.getElementById("playgroundTextbox")).value = this.curScene.text;
        (<HTMLInputElement>document.getElementById("povName")).value = this.curScene.talkingChar;
        if (this.curScene.picBackground === -1) {
            console.log("Kein Hintergrund");
            document.getElementById("background-upload").style.backgroundImage = "none";
            document.getElementById("background-upload").style.backgroundColor = "white";

        } else {
            console.log("Hintergrund");
            let background = document.getElementById("background-upload");
            background.style.backgroundSize = "cover";
            let bgResponse = await fetchRestEndpoint(`http://localhost:3000/api/pics/${this.curScene.picBackground}`, "POST", {gameId: this.curScene.gameId});
            let bgpic: IPicture | undefined = await bgResponse.json();
            background.style.backgroundImage = `url('${bgpic.url}')`;
            console.log(`Hi bg: `+ bgpic.url);
        }
        let leftChar = <HTMLImageElement>document.getElementById("leftChar");
        if (this.curScene.picLeft === -1) {
            console.log("Kein Linker");
            document.getElementById("leftChar").style.display = "none";
            document.getElementById("pgItem1").style.justifySelf = "right";
            document.getElementById("leftPlus").style.display = "block";
            document.getElementById("file-upload").style.backgroundColor = 'gainsboro';
        } else {
            let leftPicResponse = await fetchRestEndpoint(`http://localhost:3000/api/pics/${this.curScene.picLeft}`, "POST", {gameId: this.curScene.gameId});
            let leftPic: IPicture | undefined = await leftPicResponse.json();
            console.log(leftPic);
            console.log(`Darstellurl: ${leftChar.src}`);
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
            console.log("Kein Rechter");
            document.getElementById("rightChar").style.display = "none";
            document.getElementById("rightPlus").style.display = "block";
            document.getElementById("file-upload2").style.backgroundColor = 'gainsboro';
        } else {
            let rightPicResponse = await fetchRestEndpoint(`http://localhost:3000/api/pics/${this.curScene.picRight}`, "POST", {gameId: this.curScene.gameId});
            let rightPic: IPicture | undefined = await rightPicResponse.json();
            rightChar.src = rightPic.url;
            console.log("rechter");
            rightChar.style.display = 'block';
            rightChar.style.width = '18em';
            rightChar.style.height = 'auto';
            document.getElementById("rightPlus").style.display = 'none';
            document.getElementById("file-upload2").style.backgroundColor = 'transparent';
            document.getElementById("pgItem3").style.justifySelf = 'left';
        }

    }

    async setPlaygroundBack() {
        console.log(`Scene nextId2 = ${this.curScene.nextId2}`);
        if(this.curScene.nextId2 !== -1){
            console.log("btn names should dissapear");
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
        let scene :IScene = {id:this.idCounter++, nextId1: -1,nextId2:-1,button1:"",button2:"",prevId:-1,text: "Enter text here",talkingChar:"Name",picLeft:-1,picRight:-1,picBackground:-1,gameId:2}
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
    document.getElementById("uploadButton").addEventListener("click",async () => {
        console.log("Speichern der letzten Szenenelemente")
        await maker.saveSceneElements();
        console.log("bereit zum speicher");
        let scenes = maker.getScenes();
        console.log(scenes.length);
        console.log("saving scenes now");

        for (let scene of scenes) { //connecting scenes, by giving them their nextId's and prevId's through the HTML List
            let sceneElement = document.getElementById(`li ${scene.id}`);
            console.log("Szene:");
            console.log(scene);
            if(scene.nextId2 === -1){
                if (sceneElement.nextElementSibling !== null) {
                    scene.nextId1 = +sceneElement.nextElementSibling.id.substring(3);
                }
                if (sceneElement.previousElementSibling !== null) {
                    scene.prevId = +sceneElement.previousElementSibling.id.substring(3);
                }
            }


            await fetchRestEndpoint("http://localhost:3000/api/scenes","POST",scene);
            console.log(scene);
        }

    })

}

window.addEventListener("load",init);