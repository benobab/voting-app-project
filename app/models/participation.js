//Load the things we need 
var mongoose = require("mongoose");

//Schema =======================================================================
var participationSchema = mongoose.Schema({
    id_poll:String,
    id_user:String,
    id_address:String,
    id_answer:String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Answer', participationSchema);