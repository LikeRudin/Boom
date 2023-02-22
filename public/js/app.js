const socket = new WebSocket(`ws://${window.location.host}`);

const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nickname");
const utilForm = document.querySelector("#util #broom");


function JSONingMsg (type, payload, time) {
    const msg = {type, payload, time};
    return JSON.stringify(msg);
}

// clean the chat log
function broomClearing(event){
    event.preventDefault();

    messageList.innerHTML ="";
}

//create timelog
function showTime(){
    const chatTime = new Date();
    const sendingtime =  chatTime.getHours().toString()+ ":" + chatTime.getMinutes().toString() +":" + chatTime.getSeconds().toString();
    return sendingtime
}

socket.addEventListener("open", () => {
    console.log("Connected to Server")
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server")
});

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});



//remember, input value be the innerText
function handleMessage(event) {
    event.preventDefault();
    const messageInput = messageForm.querySelector("input");
    
    socket.send(JSONingMsg("newMsg", messageInput.value, showTime()));
    messageInput.value ="";

}

function handleNickname(event) {
    event.preventDefault();
    const nickInput = nickForm.querySelector("input");
    const chatTime = new Date();
    
    socket.send(JSONingMsg("nickname", nickInput.value, showTime()));
    nickInput.value ="";
}

messageForm.addEventListener("submit", handleMessage);
nickForm.addEventListener("submit", handleNickname);
utilForm.addEventListener("click", broomClearing);