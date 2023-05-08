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
        this.curScene = new Scene(this.game.getScenes().length);
        let list = document.getElementById("sceneOverview");
        let html = '<li><p id="' + `${this.game.getScenes().length}`+'" class="clickable">Scene ';
        this.game.addScene(this.curScene)
        html += this.game.getScenes().length;
        html += '</p></li>';
        list.innerHTML += html;
        document.getElementById(`${this.game.getScenes().length-1}`).style.color= "pink";

        const leftChar = <HTMLInputElement>document.getElementById("file-upload");

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
            console.log(base64);
            let char = <HTMLImageElement>document.getElementById("char");
            // @ts-ignore
            char.src = base64;
            char.style.display = 'block';
            //"url(\"../img/backgrounds/wald2_5.png\")"


            console.log("should have changed");
        });
    }

    setPlaygroundBack() {
            document.getElementById(`${this.curScene.getId()}`).style.color= "#CCE8E1";
            this.curScene.setTalkingCharacter((<HTMLInputElement>document.getElementById("povName")).value);
            this.curScene.setText((<HTMLInputElement>document.getElementById("playgroundTextbox")).value);
        (<HTMLInputElement>document.getElementById("playgroundTextbox")).value = 'Enter text here';
        (<HTMLInputElement>document.getElementById("povName")).value = 'Name';
        console.log("weg");
        for(let i = 0;i < this.game.getScenes().length;i++){
            console.log(i);
            console.log(this.game.getScenes()[i].getTalkingCharacter());
            console.log(this.game.getScenes()[i].getText());
        }
        
    }

    switchScene() {
        const scenes = document.getElementsByClassName("clickable");
        for(let i = 0;i < scenes.length;i++){
            scenes[i].addEventListener("click",()=>{
                console.log("test");
                document.getElementById(`${this.curScene.getId()}`).style.color= "#CCE8E1";
                this.curScene.setTalkingCharacter((<HTMLInputElement>document.getElementById("povName")).value) ;
                this.curScene.setText((<HTMLInputElement>document.getElementById("playgroundTextbox")).value) ;
                this.curScene = this.game.getScenes()[i];
                console.log(this.game.getScenes()[i]);
                (<HTMLInputElement>document.getElementById("playgroundTextbox")).value = this.curScene.getText();
                (<HTMLInputElement>document.getElementById("povName")).value = this.curScene.getTalkingCharacter();
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