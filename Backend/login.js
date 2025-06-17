import { fetchUrl } from "./config.js";

async function createEventListenerLogin() {
    const formLogin = document.querySelector('.login');
    formLogin.addEventListener("submit", async function (event) {
        event.preventDefault();

        const emailRecupere = document.querySelector('[name=email]').value;
        const passwordRecupere = document.querySelector('[name=password]').value;

        const response = await fetch(fetchUrl + '/api/users/login', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "email": emailRecupere,
                "password": passwordRecupere
            })
        })
        if (response.ok == false) {
            checkEmail();
            checkPassword()
        } else if (response.ok == true) {
            const responseApi = await response.json();
            const token = responseApi.token;
            localStorage.setItem("token", token);
            window.location.href = 'index.html'
        }
    })
}

function checkEmail() {
    const emailRecupere = document.querySelector('[name=email]').value;
    if (emailRecupere == "") {
        const enterEMail = document.getElementById('email')
        enterEMail.value = "Entrez votre email";
    } else {
        document.querySelector('.wrongLogin').style.display = null;
    }
    document.getElementById('email').addEventListener('click', function () {
        document.getElementById('email').value = "";
        document.querySelector('.wrongLogin').style.display = 'none'
    });
}

function checkPassword() {
    document.getElementById('password').addEventListener('click', function () {
        document.querySelector('.wrongLogin').style.display = 'none';
        document.getElementById('password').value = ""
    })
}
createEventListenerLogin();