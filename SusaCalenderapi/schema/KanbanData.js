const mongoose = require('mongoose');


let KanbanDataSchemas = mongoose.Schema({

    name: {
        type : String,
        required : false 
    },
    kanbanFields: [],
    sharedKanban: [],
    sharedKanbanData : []
   
});

module.exports = KanbanDataSchemas = mongoose.model('kanbandatas',KanbanDataSchemas);