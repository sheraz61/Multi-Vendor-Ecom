import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
const app = express()
const server = http.createServer(app)
// ✅ create socket server
const io = new Server(server, {
    cors: {
        origin: "*", // or your frontend URL
        methods: ["GET", "POST"],
    },
});


dotenv.config({
    path: './.env'
})
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello  world')
})

let users = []
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({
        userId, socketId
    })
}
// remove user 
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
    return users.find((user) => user.userId === receiverId);
};


// define a message object with  a seen token 
const createMessage = ({ senderId, receiverId, text, images }) => ({
    senderId,
    receiverId,
    text,
    images,
    seen: false,
});


//  socket connection
io.on("connection", (socket) => {
    //when connect
    console.log("User connected:", socket.id);
    // take userId and socketId from user
    socket.on('addUser', (userId) => {
        addUser(userId, socket.id)
        io.emit('getUsers', users)
    })
    // send and get message
    const messages = {} // object to track messages sent to each user
    socket.on('sendMessage', ({ senderId, receiverId, text, images }) => {
        const message = createMessage({ senderId, receiverId, text, images });

        const user = getUser(receiverId);

        // Store the messages in the `messages` object
        if (!messages[receiverId]) {
            messages[receiverId] = [message];
        } else {
            messages[receiverId].push(message);
        }

        // send the message to the recevier
        io.to(user?.socketId).emit("getMessage", message);
    })


    socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
        const user = getUser(senderId);

        // update the seen flag for the message
        if (messages[senderId]) {
            const message = messages[senderId].find(
                (message) =>
                    message.receiverId === receiverId && message.id === messageId
            );
            if (message) {
                message.seen = true;

                // send a message seen event to the sender
                io.to(user?.socketId).emit("messageSeen", {
                    senderId,
                    receiverId,
                    messageId,
                });
            }
        }
    });

    // update and get last message
    socket.on("updateLastMessage", ({ lastMessage, lastMessagesId }) => {
        io.emit("getLastMessage", {
            lastMessage,
            lastMessagesId,
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});


server.listen(process.env.PORT || 4000, () => {
    console.log(`server is runing on port ${process.env.PORT || 4000}`)
})