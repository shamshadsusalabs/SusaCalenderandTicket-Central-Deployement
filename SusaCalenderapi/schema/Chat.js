const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    content: {
        type: String,
        required: false,
    },
    messageType: {
        type: String, // text, image, video, file
        default: 'text',
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    fileUrl:{
        type:String,
        default: '', 
    },
    sentAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        }
    ],
    messages: [messageSchema],
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
