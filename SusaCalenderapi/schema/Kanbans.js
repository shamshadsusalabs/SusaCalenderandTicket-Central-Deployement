const mongoose = require('mongoose');

const KanbanSchemas = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    statusId: {
        type: Number,
        required: false,
    },
    index: {
        type: Number,
        required: false,
    },
    title: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    imageURL: {
        type: String,
        required: false,
    },
    priority: {
        type: String,
        required: false,
    },
    modifiedDate: {
        type: Date, // Changed to Date type
        required: false,
    },
    closingDate: {
        type: Date, // Changed to Date type
        required: false,
    },
    creationDate: {
        type: Date, // Changed to Date type
        required: false,
    },
    progressDate: {
        type: Date, // Changed to Date type
        required: false,
    },
    ticketId: {
        type: String, // Changed to String to match generated ticket ID format
        required: false,
    },
    projectOwner: {
        type: String,
        required: false,
    },
   
    tickethours: {
        type: Number, // Changed to Number if you want to store hours as a number
        required: false,
    },
   

  
   
    comment: [{
        userId: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        creationDate: {
            type: Date,
            default: Date.now,
        },
        ticketId: {
            type: String, // Link to the Kanban ticket
            required: true,
        },
        replies: [{ // Array to hold replies to the comment
            userId: {
                type: String,
                required: true,
            },
            userName: {
                type: String,
                required: true,
            },
            reply: {
                type: String,
                required: true,
            },
            creationDate: {
                type: Date,
                default: Date.now,
            },
        }],
    }],
    ticketowner: {
        type: String,
        required: false,
    },
    sprintId:{
        type:String,
    },
    projectId:{
        type:String,
    },
    status:{
        type:String
    },
    selectedUsers: [
        {
          type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for each selected user
          ref: 'users', // Reference to the User model for each selected user
        }
      ],
});


module.exports = mongoose.model('kanbans', KanbanSchemas);
