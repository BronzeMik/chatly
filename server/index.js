
import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messagesRoute.js";
import { Server } from "socket.io";

const app = express();
dotenv.config();

const port = process.env.PORT;
const URI = process.env.MONGO_URL;
app.use(cors());
app.use(express.json());
app.use("/api/auth", userRouter)
app.use("/api/message", messageRouter);


mongoose.connect(URI)
.then(() => console.log('Connected to db'))
.catch((err) => console.log('Error: ', err));

const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
})

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id)
    })

    socket.on("send-msg", (data)=> {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message)
        }
    })
})
