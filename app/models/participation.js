//Load the things we need 
var mongoose = require("mongoose");

//Schema =======================================================================
var participationSchema = mongoose.Schema({
    id_user:String,
    ip_address:String,
    id_answer:String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Participation', participationSchema);