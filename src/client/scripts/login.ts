import {fetchRestEndpoint} from "../utils/client-server.js";

const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");

btnRegister.addEventListener("click", async () => await register());
btnLogin.addEventListener("click", async () => await login());

window.onload = async ()=>{
    console.log("loggin");
    if(sessionStorage.getItem('username') !== null){
        console.log("there is a username");
        window.location.href = "../html/loggedIn.html";
    }

}
async function login() {
    try {
        const inputUsername = <HTMLInputElement>document.getElementById("inputUsername");
        const username = inputUsername.value;
        const inputPassword = <HTMLInputElement>document.getElementById("inputPassword");
        const password = inputPassword.value;

        const data = JSON.parse(`{"username": "${username}", "password": "${password}"}`);
        await fetchRestEndpoint("http://localhost:3000/api/user/login", "POST", data);
        sessionStorage.setItem("username", username);
        document.getElementById("loginBox").style.display = "none";
        alert("logged in successfully");
        window.location.href = "../html/loggedIn.html";
    } catch (e) {
        alert(`couldn't login! cause: ${e}`);
    }
}

async function register() {
    try {
        const elementUsername = <HTMLInputElement>document.getElementById("inputUsername");
        const username = elementUsername.value;
        const elementPassword = <HTMLInputElement>document.getElementById("inputPassword");
        const password = elementPassword.value;

        const data = JSON.parse(`{"username": "${username}", "password": "${password}"}`);
        await fetchRestEndpoint("http://localhost:3000/api/user/register", "POST", data);
        sessionStorage.setItem("username", username);
        window.location.href = "../html/loggedIn.html.html";
    } catch (e) {
        alert(`Signup failed: ${e}`);
    }
}