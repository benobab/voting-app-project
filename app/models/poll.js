//Load the things we need 
var mongoose = require("mongoose");

//Schema =======================================================================
var pollSchema = mongoose.Schema({
    title:String,
    id_creator:String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Poll', pollSchema);