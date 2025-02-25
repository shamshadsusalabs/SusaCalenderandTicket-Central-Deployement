const mongoose = require('mongoose');


let StandupSchemas = mongoose.Schema({

    name: {
        type : String,
        required : false 
    },
    popupDate:{
        type : String,
        required : false 
    },
    tasks :[]

   
});

module.exports = StandupSchemas = mongoose.model('standups',StandupSchemas);