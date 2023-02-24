const socket = io();


const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;



function postMsg(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.append(li);
}


function handleMsgSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        postMsg(`You: ${value}`);
    });
    input.value = "";
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMsgSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
};

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    const value = input.value;
    socket.emit("nickname", input.value);
}


form.addEventListener("submit", handleRoomSubmit);
form.addEventListener("submit", handleMsgSubmit);

socket.on("welcome", (user) => {
    postMsg(`here comes new challenger: ${user}`);
});

socket.on("bye", (left)=> {
    postMsg(`Another One Bites the Dust: ${left}`);
});

socket.on("new_message", postMsg);