const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to Server")
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server")
});

socket.addEventListener("message", (message) => {console.log("just got this : " + message + "from Server")});


setTimeout(()=> {
    socket.send("Hello from server")
}, 10000);