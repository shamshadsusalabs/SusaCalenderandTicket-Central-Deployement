const mongoose = require('mongoose');

const groupMessageSchema = new mongoose.Schema({
    senderName:{
        type: String,
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    content: {
        type: String,
        required: false,
    },
    messageType: {
        type: String, // text, image, video, file
        default: 'text',
    },
    fileUrl:{
        type:String,
        default: '', 
    },
    isReadBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        }
    ],
    sentAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        }
    ],
    messages: [groupMessageSchema],
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
