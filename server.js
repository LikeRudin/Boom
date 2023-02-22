import http from "http";
import WebSocket from "ws";
import express from "express";


const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));


console.log("hello");

const handleListen = () => console.log("Listening on ws://localhost:3000");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];


wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Someone";
    console.log("Connected to Browser ❤");
    socket.on("close", () => {
        console.log("Disconnected from Browser 💔")
    });
    socket.on("message", (JSONedMsg) => {
       const message = JSON.parse(JSONedMsg);
       console.log(message)
       switch (message.type) {
        case "newMsg":
            sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload} \n time: ${message.time}`)
    
        );
        break
        case "nickname":
            socket["nickname"] = message.payload;
            sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname} is new Nickname \n time: ${message.time}`)
    
        );
        break
       }
       
    });
});


server.listen(3000, handleListen);
