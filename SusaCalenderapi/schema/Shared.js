const mongoose = require('mongoose');


let SharedSchemas = mongoose.Schema({

    sendTo: {
        type : String,
        required : false 
    },
    scheduleOf: {
        type : String,
        required : false 
    },
    schedules: [],
    sharedDate: {
        type : String,
        required : false 
    },
   
});

module.exports = SharedSchemas = mongoose.model('shareds',SharedSchemas);