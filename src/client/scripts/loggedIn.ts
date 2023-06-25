
let logOutButton = document.getElementById("btnLogOut");


window.onload = async () =>{
    const username = sessionStorage.getItem('username');
    document.getElementById("loggedInMessage").innerText = `Successfully logged in as ${username}`;
}

logOutButton.addEventListener("click",async ()=>{
    sessionStorage.clear();
    window.location.href = "../html/login.html";
});