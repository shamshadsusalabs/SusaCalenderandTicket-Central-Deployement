const mongoose = require('mongoose');


let UserSchemas = mongoose.Schema({

    userName: {
        type : String,
        required : false 
    },
    password : {
        type : String,
        required : false 
    },
    isVerified :{
        type : Boolean,
        default: true,
    },
    email : {
        type : String,
        required : false    },
        
        profilePicture: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            default: 'Hey there! I am using WhatsApp.',
        },
        online: {
            type: Boolean,
            default: false,
        },
        lastSeen: {
            type: Date,
            default: Date.now,
        },
        groups: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Group',
            }
        ],
});

module.exports = UserSchemas = mongoose.model('users',UserSchemas);