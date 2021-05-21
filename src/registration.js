// Евент листенер на действия в тексте
let user = document.getElementById('username');
user.addEventListener("input", valid(user.value, user));

let nickname = document.getElementById('nickname');
nickname.addEventListener("input", valid(nickname.value, nickname));

let login = document.getElementById('login');
login.addEventListener("input", valid(login.value, login));

let password = document.getElementById("password");

let passwordConfirm = document.getElementById("passwordConfirm");
passwordConfirm.addEventListener("input", passValidator(password.Value, passwordConfirm.value));

// Проверка на валидность
const regex = /^[A-Za-z-]{2,20}$/;

function valid(value, formId) {
    let regexTest = regex.test(value);
    if (regexTest === false) {
        document.getElementById(formId).style.border = "1px solid red";
    } else {
        document.getElementById(formId).style.border = "1px solid green";
    }
}

//
function passValidator(pass, passConfirm) {
    if (pass === passConfirm && pass.length > 4) {
        password.style.border = "1px solid green";
        passwordConfirm.style.border = "1px solid green";
        return true;
    } else {
        password.style.border = "1px solid red";
        passwordConfirm.style.border = "1px solid red";
        return false;
    }
}

// эта функция сработает при нажатии на кнопку
function registration() {

    let nickname = document.querySelector('#nickname');
    let first_name = document.querySelector('#first_name');
    let last_name = document.querySelector('#last_name');
    let login = document.querySelector('#login');
    let password = document.querySelector('#password');
    let passwordConfirm = document.querySelector('#passwordConfirm');
    let email = document.querySelector('#email');
    let contact = document.querySelector('#contact');
    if (passValidator(password.value, passwordConfirm.value)) {
        let xhr = new XMLHttpRequest();
        let url = window.location.href;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            //   if (xhr.readyState === 4 && xhr.status === 200) {
            //     //url = "http://localhost:8081/chat/auth";
            //     xhr.innerHTML = this.responseText;
            //   }
            // };

            if (xhr.readyState === XMLHttpRequest.DONE) {
                xhr.innerHTML = this.responseText;
                url = "http://localhost:8081/chat/auth";
                xhr.setRequestHeader("Content-Type", "application/json");
                switch (xhr.status) {
                    case 200:
                        currentUser = null;

                        document.getElementById("authentication-error").innerHTML = "Registration is successful! Please Sign in!";
                        break;
                    case 403:
                        currentUser = null;

                        document.getElementById("authentication-error").innerHTML = "Oops... Registration failed. User is already exist!";
                        break;
                    default:
                        document.getElementById("authentication-error").innerHTML = "Oops... Looks like something is broken.";
                }
            }
        };
        var data = JSON.stringify({
            "nickname": nickname.value,
            "firstName": first_name.value,
            "lastName": last_name.value,
            "login": login.value,
            "password": password.value,
            "passwordConfirm": passwordConfirm.value,
            "email": email.value,
            "phone": contact.value,
            "role": "1"
        });
        xhr.send(data);
    }
}