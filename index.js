const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const route = require("./route");
const { addUser, findUser, getRoomUsers, removeUser } = require("./users");

const app = express();

app.use(cors({ origin: "*" }));
app.use(route);

const server = http.createServer(app);

const io = new Server( server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
        socket.on("join", ({ username, room} ) => {
        socket.join(room);

    const { user, isExist } = addUser({ username, room });

    const userMessage = isExist ? `${user.username}, here you go again!` : `Hey, my dear ${user.username}`;

    socket.emit("message", {
        data: { user: { username: "Admin" }, message: userMessage },
    });
 /// in the room sending message from server to client
    socket.broadcast.to(user.room).emit("message", {
        data: { user: { username: "Admin" }, message: `Hey, ${user.username} has joined` },
    });

    io.to(user.room).emit("joinRoom", { 
        data: { users: getRoomUsers(user.room) },
    });
});
 
socket.on( "sendMessage", ({ message, params }) => {
    const user = findUser(params);

        if (user) {
            io.to(user.room).emit("message", { data: { user, message } });
        }
});

socket.on( "leftRoom", ({ params }) => {
    const user = removeUser(params);

        if (user) {
            const { room, username } = user;
            io.to(room).emit("message", { data: { user: { username: "Admin" }, message: `${username} has left` },
        });

            io.to(room).emit("room", {
                data: { users: getRoomUsers(room) },
             });
        }
});

io.on("disconnection", () => {
    console.log("Disconnecting");
  });
});

server.listen(5000, () => {
    console.log("Server is running");
});