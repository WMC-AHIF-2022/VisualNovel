import {fetchRestEndpoint} from "../utils/client-server.js";

const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");

btnRegister.addEventListener("click", async () => await register());
btnLogin.addEventListener("click", async () => await login());

//TODO!!-1  if wanted, change href to account.html (needs to be created!) check if login + register is wanted like this
//TODO!!-5 add an account or login button to navbar!! (depends on what is needed after finishing TODO!!-1)
async function login() {
    try {
        const inputUsername = <HTMLInputElement>document.getElementById("username");
        const username = inputUsername.value;
        const inputPassword = <HTMLInputElement>document.getElementById("password");
        const password = inputPassword.value;

        const data = JSON.parse(`{"username": "${username}", "password": "${password}"}`);
        await fetchRestEndpoint("http://localhost:3000/api/user/login", "POST", data);
        sessionStorage.setItem("username", username);
        window.location.href = "../html/games.html"; //TODO!! here is the href
    } catch (e) {
        alert(`couldn't login! cause: ${e}`);
    }
}

async function register() {
    try {
        //loginError.innerHTML = "";
        const elementUsername = <HTMLInputElement>document.getElementById("username");
        const username = elementUsername.value;
        const elementPassword = <HTMLInputElement>document.getElementById("password");
        const password = elementPassword.value;

        const data = JSON.parse(`{"username": "${username}", "password": "${password}"}`);
        await fetchRestEndpoint("http://localhost:3000/api/register", "POST", data);
        //loginStatus.innerHTML = "Signup successful, please login to continue";
        sessionStorage.setItem("username", username);
        window.location.href = "../html/games.html"; //TODO!! here is the href
    } catch (e) {
        alert(`Signup failed: ${e}`);
        //loginError.innerHTML = `Signup failed: ${e}`;
    }
}