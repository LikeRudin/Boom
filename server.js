import http from "http";
// import WebSocket from "ws";
import SocketIO from "socket.io";
import express from "express";


const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));


console.log("hello");

const handleListen = () => console.log("Listening on http://localhost:3000");

const httpserver = http.createServer(app);
// const wss = new WebSocket.Server({ server });
const ioServer = SocketIO(httpserver);

//listen for client connection
// done(); is amazing part of socket io
//it is operating method in app.js

ioServer.on("connection", (socket) => {
    socket["nickname"] = "someone";
    socket.onAny((event) => {
      console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
      socket.join(roomName);
      done();
      socket.to(roomName, socket.nickname).emit("welcome", socket.nickname);
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) =>
        socket.to(room).emit("bye", `see you agian :${socket.nickname}`)
      );
    });

    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});



httpserver.listen(3000, handleListen);

// const sockets = [];

// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Someone";
//     console.log("Connected to Browser ❤");
//     socket.on("close", () => {
//         console.log("Disconnected from Browser 💔")
//     });
//     socket.on("message", (JSONedMsg) => {
//        const message = JSON.parse(JSONedMsg);
//        console.log(message)
//        switch (message.type) {
//         case "newMsg":
//             sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}: ${message.payload} \n time: ${message.time}`)
    
//         );
//         break
//         case "nickname":
//             socket["nickname"] = message.payload;
//             sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname} is new Nickname \n time: ${message.time}`)
    
//         );
//         break
//        }
       
//     });
// });
