const mongoose = require('mongoose');


let ScheduleSchemas = mongoose.Schema({

    title: {
        type : String,
        required : false 
    },
    color:{
        type : String,
        required : false 
    },
    schedules : []
   
});

module.exports = ScheduleSchemas = mongoose.model('schedules',ScheduleSchemas);