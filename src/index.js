import _ from 'lodash';
import './style.css';
import Icon from './bg.jpeg';

var socket;
var currentUser;
var Token

function component() {
    const element = document.createElement('div');

    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    // Add the image to our existing div.
    const myIcon = new Image();
    myIcon.src = Icon;

    element.appendChild(myIcon);

    return element;
}

document.body.appendChild(component());
// эта функция сработает при нажатии на кнопку
function signIn() {
    console.log("zashlo");
    let login = document.querySelector('#login');
    let password = document.querySelector('#password');
    let result = document.querySelector('.result');
    let xhr = new XMLHttpRequest();
    let url = window.location.href;
    //url = window.location.replace("http://localhost:8081/chat/auth");
    if (loginValidator(login.value, password.value)){
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function (){
            if (xhr.readyState === XMLHttpRequest.DONE) {
                switch (xhr.status) {
                    case 200:
                        currentUser = login;
                        var webSocketAccessToken = xhr.responseText;
                        Token = webSocketAccessToken.token;
                        console.log(webSocketAccessToken.token);
                        openSocket(webSocketAccessToken.token);
                        break;
                    case 403:
                        console.log("Lox");
                        break;
                    default:
                        document.getElementById("authentication-error").innerHTML = "Oops... Looks like something is broken.";
                }
            }
        };

        var data = JSON.stringify({ "login": login.value, "password": password.value });
        xhr.send(data);
        console.log(xhr.readyState);
    }
}

function loginValidator(login, pass){
    if (login === "") {
        document.getElementById("login").style.border = "1px solid red";
        return false;
    } else if (pass === "" || pass.length < 4) {
        document.getElementById("password").style.border = "1px solid red";
        return false;
    } else {
        console.log(login,pass);
        return true;
    }

}


function connectTo(){
    console.log(JSON.stringify({"topic":"auth","payload":"" + Token }));
    socket.send(JSON.stringify({"topic":"auth","payload":"" + Token }));
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
    var data = JSON.stringify({ "login": login.value, "password": password.value });
    console.log(data);
    currentUser = login.value;
    xhrs.send(data);
    xhrs.onerror = function (){
        console.log("ошибочка произошшла");
    }
    console.log("responseXML "+xhrs.responseXML);
    console.log("resp "+xhrs.response);
    console.log("openSocket");

    if (socket) {
        socket.close();
    }


    socket = new WebSocket("ws://localhost:8081/chat");
    xhrs.onload = function () {
        if (xhrs.status === 200 ){
            var au = JSON.stringify({"topic":"auth","payload":xhrs.response});
            console.log("au ksta" + au);
            socket.send(au);
        }
        else {
            alert("неправильный логин и/или пароль");
        }
    }

    socket.onopen = function (event) {
        console.log("Да блять а тут я то чо делаю.")
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