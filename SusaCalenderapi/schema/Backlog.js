const mongoose = require('mongoose');

const backlogSchema = new mongoose.Schema({
    ticketId: {
       type:String,
       trim: true
       
    },
    ticketOwner: {
       type:String,
       trim: true
    },
   
});

const Backlog = mongoose.model('Backlog', backlogSchema);

module.exports = Backlog;
