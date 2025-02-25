const mongoose = require('mongoose');


let EventSchemas = mongoose.Schema({

    title: {
        type : String,
        required : false 
    },
    start:{
        type : String,
        required : false 
    },
    end: {
        type : String,
        required : false 
    },
    color: {
        type : String,
        required : false 
    },
    details: {
        type : String,
        required : false 
    },  
   
});

module.exports = EventSchemas = mongoose.model('events',EventSchemas);