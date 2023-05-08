import {Game} from "./game.js";
import {Scene} from "./scene.js";

export class Maker{
    private game: Game;
    private curScene :Scene;

    constructor() {
        this.game = new Game();
        this.curScene = null;
    }

    createScene() {
        this.curScene = new Scene(this.game.scenes.length);
        let list = document.getElementById("sceneOverview");
        let html = '<li><p id="' + `${this.game.scenes.length}`+'" class="clickable">Scene ';
        this.game.scenes.push(this.curScene);
        html += this.game.scenes.length;
        html += '</p></li>';
        list.innerHTML += html;
        document.getElementById(`${this.game.scenes.length-1}`).style.color= "pink";

        /*const leftChar = <HTMLInputElement>document.getElementById("file-upload");
        leftChar.addEventListener("change", () => {
            let file = leftChar.files[0];
            console.log("file:");
            console.log(file);
            let reader = new FileReader();
            let imageBG = document.getElementById("imageBG");
            reader.onloadend = function () {
                let urlData = reader.result.toString().split(";");
                urlData[1].split(",");
                console.log( urlData[1].split(","));
                let url = urlData[1].split(",");
                imageBG.style.backgroundImage = "url(" + url[1] + ")";
                console.log("tried url");
            };

            if (file)
            {
                reader.readAsDataURL(file)
            }
            console.log("should have changed");
        });*/
    }

    setPlaygroundBack() {
            document.getElementById(`${this.curScene.id}`).style.color= "#CCE8E1";
            this.curScene.talkingCharacter = (<HTMLInputElement>document.getElementById("povName")).value;
            this.curScene.text = (<HTMLInputElement>document.getElementById("playgroundTextbox")).value;
        (<HTMLInputElement>document.getElementById("playgroundTextbox")).value = 'Enter text here';
        (<HTMLInputElement>document.getElementById("povName")).value = 'Name';
        console.log("weg");
        for(let i = 0;i < this.game.scenes.length;i++){
            console.log(i);
            console.log(this.game.scenes[i].talkingCharacter);
            console.log(this.game.scenes[i].text);
        }
        
    }

    switchScene() {
        const scenes = document.getElementsByClassName("clickable");
        for(let i = 0;i < scenes.length;i++){
            scenes[i].addEventListener("click",()=>{
                console.log("test");
                document.getElementById(`${this.curScene.id}`).style.color= "#CCE8E1";
                this.curScene.talkingCharacter = (<HTMLInputElement>document.getElementById("povName")).value;
                this.curScene.text = (<HTMLInputElement>document.getElementById("playgroundTextbox")).value;
                this.curScene = this.game.scenes[i];
                console.log(this.game.scenes[i]);
                (<HTMLInputElement>document.getElementById("playgroundTextbox")).value = this.curScene.text;
                (<HTMLInputElement>document.getElementById("povName")).value = this.curScene.talkingCharacter;
                document.getElementById(`${i}`).style.color= "pink";
            })
        }

    }

    createOptions() {
        let html = '<button id="btn1">Option 1</button><button id="btn2 ">Option 2</button>'
        let place = document.getElementById("btnsAndName");
    }
}

async function init() {
    let maker:Maker = await new Maker();
    await maker.createScene()
    document.getElementById("makeScene").addEventListener("click",async()=>{
        await maker.setPlaygroundBack();
        await maker.createScene();
        await maker.switchScene();
    });
    document.getElementById("makeDecision").addEventListener("click",()=>{
        maker.setPlaygroundBack();
        maker.createScene();
        maker.setPlaygroundBack()
        maker.createScene();
        maker.switchScene();
        maker.createOptions();

    })

}



window.addEventListener("load",init);