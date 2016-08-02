//Load the things we need 
var mongoose = require("mongoose");

//Schema =======================================================================
var answerSchema = mongoose.Schema({
    title:String,
    id_poll:String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Answer', answerSchema);