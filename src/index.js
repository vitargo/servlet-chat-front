
import Icon from './img/logo.png';
import './style.css';
import axios from 'axios';

let socket;
let currentUser;
let Token;

const root = document.getElementById('root');

let div_logo_container = document.createElement('div');
div_logo_container.setAttribute('name', 'logo_container');
div_logo_container.setAttribute('class', 'logo_container');

let logo_place = document.createElement('div');
logo_place.setAttribute('name', 'logo');
logo_place.setAttribute('class', 'logo');

const myIcon = new Image();
myIcon.src = Icon;
logo_place.appendChild(myIcon);

let name_place = document.createElement('span');

let name_h1 = document.createElement('h1');
let name_text = document.createTextNode('PinkLink Chat');
name_h1.appendChild(name_text);
name_place.appendChild(name_h1);

let div_form_container = document.createElement('div');
div_form_container.setAttribute('name', 'form_container');
div_form_container.setAttribute('class', 'form_container');

let br = document.createElement('br');

let form = document.createElement('form');
form.setAttribute('name', 'AuthForm')
form.setAttribute('class', 'form');
form.setAttribute('method', 'post');
form.setAttribute('autocomplete', 'off');
// form.setAttribute('onsubmit', 'signIn()');

let login = document.createElement('input');
login.setAttribute('type', 'text');
login.setAttribute('class', 'form__input');
login.setAttribute('name', 'login');
login.setAttribute('placeholder', 'Enter login or email');
login.setAttribute('maxlength', '10');
login.setAttribute('required', '');

let error_login = document.createElement('div');
error_login.setAttribute('class', 'error');
error_login.setAttribute('name', 'error_login');

// let span_sp = document.createElement('span');
// span_sp.setAttribute('class', 'inline');

let PSW = document.createElement('input');
PSW.setAttribute('type', 'password');
PSW.setAttribute('class', 'form__input');
PSW.setAttribute('name', 'password');
PSW.setAttribute('placeholder', 'Password');
PSW.setAttribute('maxlength', '10');
PSW.setAttribute('required', '');
PSW.setAttribute('style', 'margin-left: 0px');

// let checkbox = document.createElement('input');
// checkbox.setAttribute('id', 'checkbox');
// checkbox.setAttribute('type', 'checkbox');
// checkbox.setAttribute('onclick', 'showPassword()');
//
// let label = document.createElement('label');
// label.setAttribute('class', 'checkbox__label');
// label.setAttribute('for','checkbox');
// label.appendChild(document.createTextNode('Show password'));


let error_PSW = document.createElement('div');
error_PSW.setAttribute('class', 'error');
error_PSW.setAttribute('name', 'error_password');

let btn = document.createElement('button');
btn.setAttribute('type', 'submit');
btn.setAttribute('class', 'form__btn');
btn.textContent = 'SIGN IN';

root.appendChild(div_logo_container);
root.appendChild(div_form_container);
div_logo_container.appendChild(logo_place);
div_logo_container.appendChild(name_place);
form.appendChild(login);
form.appendChild(error_login);
form.appendChild(br.cloneNode());
//form.appendChild(span_sp);
// span_sp.appendChild(PSW);
// span_sp.appendChild(checkbox);
// span_sp.appendChild(label);
form.appendChild(PSW);
form.appendChild(error_PSW);
form.appendChild(br.cloneNode());
form.appendChild(btn);

div_form_container.appendChild(form);

// let log = document.forms['AuthForm']['login'];
// let pass = document.forms['AuthForm']['password'];

//login.addEventListener('input', validateLogin);
// PSW.addEventListener('input', validatePSW);

btn.addEventListener('click', signIn);

function signIn() {
    let login = document.forms['AuthForm']['login'].value;
    let password = document.forms['AuthForm']['password'].value;
    // let xhr = new XMLHttpRequest();
    // let url = "http://localhost:8081/chat/auth";
    // xhr.open("POST", url);
    // xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    //         switch (xhr.status) {
    //             case 200:
    //                 currentUser = login;
    //                 var webSocketAccessToken = xhr.responseText;
    //                 Token = webSocketAccessToken.token;
    //                 console.log(webSocketAccessToken.token);
    //                 openSocket(webSocketAccessToken.token);
    //                 break;
    //             case 403:
    //                 currentUser = null;
    //                 document.getElementById("error_login").innerHTML = "Oops... These credentials are invalid.";
    //                 break;
    //             default:
    //                 document.getElementById("error_login").innerHTML = "Oops... Looks like something is broken.";
    //         }
    //         }
    //     };
    //
    //     let data = JSON.stringify({"login": login, "password": password});
    //     xhr.send(data);

        axios({
            method: 'post',
            url: "http://localhost:8081/chat/auth",
            data: {
                login: login,
                password: password,
            }
        })
            .then((response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
            });

}

    function openSocket(accessToken) {
        let login = document.querySelector('#login');
        let password = document.querySelector('#password');
        let xhrs = new XMLHttpRequest();
        xhrs.open("POST", "http://localhost:8081/chat/auth", true);
        xhrs.setRequestHeader("Content-Type", "application/json");
        xhrs.onreadystatechange = function () {
            if (xhrs.readyState === 4 && xhrs.status === 200) {
                result.innerHTML = this.responseText;
                console.log(this.responseText);
            }
        };
        var data = JSON.stringify({"login": login.value, "password": password.value});
        console.log(data);
        currentUser = login.value;
        xhrs.send(data);
        console.log("responseXML" + xhrs.responseXML);
        console.log("resp  " + xhrs.response.token);
        console.log("openSocket");

        if (socket) {
            socket.close();
        }
        socket = new WebSocket("ws://localhost:8081/chat");
        xhrs.onload = function () {
            var au = JSON.stringify({"topic": "auth", "payload": xhrs.response});
            console.log(au);
            socket.send(au);
        }

        socket.onopen = function (event) {
            document.getElementById("authentication").style.display = "none";
            document.getElementById("contacts").style.display = "block";
            document.getElementById("chat").style.display = "block";
            document.getElementById("message").focus();
        };


        socket.onmessage = onMessage;
    }
    var onMessage = function(event) {
        var webSocketMessage = JSON.parse(event.data);
        switch (webSocketMessage.topic) {
            case "auth":
                displayConnectedUserMessage(currentUser);
                break;
            case "sendTextMessage":
                displayMessage(currentUser,webSocketMessage.payload);
                break;
        }
    };

    function sendMessage() {

        var text = document.getElementById("message").value;
        document.getElementById("message").value = "";

        var payload = text;

        var webSocketMessage = {
            topic: "sendTextMessage"
        };

        webSocketMessage.payload = payload;

        socket.send(JSON.stringify(webSocketMessage));
        socket.onmessage = onMessage;
    }

    function displayMessage(username, text) {

        var sentByCurrentUer = currentUser === username;

        var message = document.createElement("div");
        message.setAttribute("class", sentByCurrentUer === true ? "message sent" : "message received");
        message.dataset.sender = username;

        var sender = document.createElement("span");
        sender.setAttribute("class", "sender");
        sender.appendChild(document.createTextNode(sentByCurrentUer === true ? "You" : username));
        message.appendChild(sender);

        var content = document.createElement("span");
        content.setAttribute("class", "content");
        content.appendChild(document.createTextNode(text));
        message.appendChild(content);

        var messages = document.getElementById("messages");
        var lastMessage = messages.lastChild;
        if (lastMessage && lastMessage.dataset.sender && lastMessage.dataset.sender === username) {
            message.className += " same-sender-previous-message";
        }

        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

    function displayConnectedUserMessage(username) {

        var sentByCurrentUer = currentUser === username;

        var message = document.createElement("div");
        message.setAttribute("class", "message event");

        var text = sentByCurrentUer === true ? "Welcome " + username : username + " joined the chat";
        var content = document.createElement("span");
        content.setAttribute("class", "content");
        content.appendChild(document.createTextNode(text));
        message.appendChild(content);

        var messages = document.getElementById("messages");
        messages.appendChild(message);
    }

    function displayDisconnectedUserMessage(username) {

        var message = document.createElement("div");
        message.setAttribute("class", "message event");

        var text = username + " left the chat";
        var content = document.createElement("span");
        content.setAttribute("class", "content");
        content.appendChild(document.createTextNode(text));
        message.appendChild(content);

        var messages = document.getElementById("messages");
        messages.appendChild(message);
    }

    function addAvailableUsers(username) {

        var contact = document.createElement("div");
        contact.setAttribute("class", "contact");

        var status = document.createElement("div");
        status.setAttribute("class", "status");
        contact.appendChild(status);

        var content = document.createElement("span");
        content.setAttribute("class", "name");
        content.appendChild(document.createTextNode(username));
        contact.appendChild(content);

        var contacts = document.getElementById("contacts");
        contacts.appendChild(contact);
    }

    function cleanAvailableUsers() {
        var contacts = document.getElementById("contacts");
        while (contacts.hasChildNodes()) {
            contacts.removeChild(contacts.lastChild);
        }
}

