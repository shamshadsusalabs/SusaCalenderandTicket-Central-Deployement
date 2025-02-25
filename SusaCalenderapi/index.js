
const express_ = require('express');
const mongoose = require('mongoose');
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require('cors');
const bodyParser = require("body-parser");
const http = require('http');
const socketIO = require('socket.io');
const Chat = require('./schema/Chat'); 
const Group= require('./schema/Group'); // Ensure the message schema is imported
const Ticket = require('./schema/Kanbans');
const cron = require('node-cron');
const updateLatestSprintBacklogs = require('./api/Backlog');
// MongoDB URI
const uri = "mongodb+srv://susalabs:susalabs@cluster0.mnsuewf.mongodb.net/SusaCalender"; // Replace with your actual connection string

// Connect to MongoDB
const connectToDatabase = async () => {
    try {
        await mongoose.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log("MongoDB is connected");
    } catch (error) {
        console.log("MongoDB connection error:", error);
        process.exit(1);
    }
};
connectToDatabase();

// Security and middlewares
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500,
    message: "Too many requests from this IP, please try again after 15 minutes"
});

const app = express_();
app.use(apiLimiter); // Protect against DOS attacks
app.use(cors());
app.use(xss());
app.use(helmet());
app.use(mongoSanitize());
app.use(express_.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API routes
app.use('/api/event', require('./api/events'));
app.use('/api/schedule', require('./api/schedule'));
app.use('/api/shared', require('./api/shared'));
app.use('/api/user', require('./api/user'));
app.use('/api/kanban', require('./api/kanbans'));
app.use('/api/kanbandata', require('./api/kanbandata'));
app.use('/api/themes', require('./api/themes'));
app.use('/api/standups', require('./api/standup'));
app.use('/api/upload', require('./api/upload'));
app.use('/api/sprint', require('./api/sprint'));
app.use('/api/Project', require('./api/Project'));
const backlogsRouter = require('./api/Backlog'); // Adjust the path based on your folder structure
app.use('/api/backlogs', backlogsRouter);
// Import and mount chat and group routes
const userRoutes = require('./api/user');
const chatRoutes = require('./api/Chat');
const groupRoutes = require('./api/Group');
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/groups', groupRoutes);

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = socketIO(server, {
    cors: {
        origin:[ "http://localhost:4200","https://susacalenderweb.web.app"],// Allow requests from Angular app
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join one-to-one chat room
    socket.on('joinChat', (chatId) => {
        const roomName = `private-${chatId}`;
        socket.join(roomName);
        console.log(`User ${socket.id} joined chat room: ${roomName}`);
    });

    // Switch chat type (private or group)
    socket.on('switchChat', (chatId, groupId) => {
        if (chatId) {
            // Leave any group rooms
            if (groupId) {
                const roomName = `group-${groupId}`;
                socket.leave(roomName);
                console.log(`User ${socket.id} left group room: ${roomName}`);
            }

            // Join the private chat room
            socket.join(`private-${chatId}`);
            console.log(`User ${socket.id} joined chat room: private-${chatId}`);
        } else if (groupId) {
            // Leave any private rooms
            const roomName = `private-${chatId}`;
            socket.leave(roomName);
            console.log(`User ${socket.id} left chat room: ${roomName}`);

            // Join the group chat room
            socket.join(`group-${groupId}`);
            console.log(`User ${socket.id} joined group room: group-${groupId}`);
        }
    });

    // Send one-to-one message
    socket.on('sendMessage', async (chatId, messageData) => {
        console.log('Message sent:', messageData);
        
        const { sender, receiver, content, fileUrl, messageType, sentAt } = messageData;

        if (!sender || !receiver || !sentAt || (!content && !fileUrl)) {
            console.error('Message data is missing required fields:', messageData);
            return;
        }

        try {
            const chat = await Chat.findById(chatId);
            if (!chat) {
                console.error('Chat not found:', chatId);
                return;
            }

            const newMessage = {
                sentAt,
                sender,
                receiver,
                messageType,
            };

            if (messageType === 'file') {
                newMessage.fileUrl = fileUrl;
            } else {
                newMessage.content = content;
            }

            chat.messages.push(newMessage);
            await chat.save();
            console.log('Message saved:', newMessage);

            // Emit the message to the one-to-one chat room
            const roomName = `private-${chatId}`;
            socket.to(roomName).emit('receiveMessage', messageData);
            console.log(`Emitted message to chat room: ${roomName}`);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    // Join group chat room
    socket.on('joinGroup', (groupId) => {
        if (!groupId) {
            console.error('Group ID is missing:', groupId);
            return;
        }

        const roomName = `group-${groupId}`;
        socket.join(roomName);
        console.log(`User ${socket.id} joined group: ${roomName}`);
    });

    // Send group message
    socket.on('sendGroupMessage', async (groupId, messageData) => {
        console.log('Group message sent:', messageData);
        
        const { senderId, senderName, content, fileUrl, messageType, sentAt } = messageData;

        if (!senderId || !senderName || !sentAt || (!content && !fileUrl)) {
            console.error('Group message data is missing required fields:', messageData);
            return;
        }

        try {
            const group = await Group.findById(groupId);
            if (!group) {
                console.error('Group not found:', groupId);
                return;
            }

            const newGroupMessage = {
                senderName,
                senderId,
                messageType,
                sentAt
            };

            if (messageType === 'file') {
                newGroupMessage.fileUrl = fileUrl;
            } else {
                newGroupMessage.content = content;
            }

            group.messages.push(newGroupMessage);
            await group.save();
            console.log('Group message saved:', newGroupMessage);

            // Emit the message to the group chat room
            const roomName = `group-${groupId}`;
            io.to(roomName).emit('receiveGroupMessage', { ...newGroupMessage, groupId });
            console.log(`Emitted group message to group: ${roomName}`);
        } catch (error) {
            console.error('Error saving group message:', error);
        }
    });
});


cron.schedule('0 17 * * 6', async () => {
    console.log("Running weekly backlog update...");
    const result = await updateLatestSprintBacklogs();
    console.log("Weekly Backlog Update Result:", result);
});


// Define root route
app.get('/', (req, res) => {
    res.json('Server is working 2 .0');
}); 

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});
