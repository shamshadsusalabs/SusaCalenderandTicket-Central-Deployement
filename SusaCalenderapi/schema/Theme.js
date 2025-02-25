const mongoose = require('mongoose');


let ThemeSchemas = mongoose.Schema({

    name: {
        type : String,
        required : false 
    }

   
});

module.exports = ThemeSchemas = mongoose.model('themes',ThemeSchemas);