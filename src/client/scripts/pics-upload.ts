
import {fetchRestEndpoint} from "../utils/client-server.js";
import {IPicture} from "../../server/data/pictures-repository";

export class UploadPics{
    private pic: IPicture;
    private gameId: number;
    private picName: string;
    private url: string;
    private id: number = +sessionStorage.getItem('last-picId');

    constructor() {
        this.pic = null;
        this.picName = "Unnamed";
        sessionStorage.clear();
    }

    getPic() {
        return this.pic;
    }

    createPic(): IPicture{
        console.log("Create Pic in Pic-upload");
        let name: HTMLInputElement = <HTMLInputElement>document.getElementById("nameInput");
        let url: HTMLImageElement = <HTMLImageElement>document.getElementById("pic");
        this.picName = name.value;
        this.url = url.src;
        this.id = this.id++;
        sessionStorage.setItem('pic-id', this.id.toString());
        this.gameId = +sessionStorage.getItem('game-id');

        let pic: IPicture ={
            picId: this.id,
            picName: this.picName.toString(),
            url: this.url.toString(),
            gameId: this.gameId
        }
        sessionStorage.setItem("debug-pic", JSON.stringify(pic));
        this.pic = pic;
        return pic;
    }
}

async function init(){
    let Upic: UploadPics = new UploadPics();

    let pic = <HTMLInputElement> document.getElementById("file-upload");
    let publishBtn = <HTMLButtonElement>document.getElementById("uploadButton");

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

    pic.addEventListener("change", async()=>{
        let file = pic.files[0];
        const base64 = await convertBase64(file);
        let img = <HTMLImageElement>document.getElementById("pic");
        if (typeof base64 === "string") {
            img.src = base64;
        }
        img.style.display = 'block';
        img.style.width = '26.3em';
        img.style.height = '15em';
        document.getElementById("plus").style.display = 'none';
        document.getElementById("file-label").style.backgroundColor = 'transparent';
        document.getElementById("pgItem1").style.justifySelf = 'left';
        console.log("pic in upload");
    });


    publishBtn.addEventListener("click",async()=>{
        let pic: IPicture= await Upic.createPic();
        console.log(pic);
        let createPic = await fetchRestEndpoint(
            `http://localhost:3000/api/pics/`,"POST", pic
        );
        console.log(createPic);
        const picId = await createPic.json();
        sessionStorage.setItem("pic-id", picId.id);
        console.log(sessionStorage.getItem("pic-id"));
        sessionStorage.setItem("uploaded-pic", picId.toString());
        console.log(sessionStorage.getItem("uploaded-pic"));
        window.location.href = "../html/upload.html";
    });
}

window.addEventListener("load", init);
