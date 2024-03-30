const {model, Schema} = require('mongoose');
 
let votesetup = new Schema({
    Guild: String,
    Channel: String
});
 
module.exports = model("votesetup", votesetup);