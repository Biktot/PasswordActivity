const { model, Schema } = require('mongoose');
 
let phoneschema = new Schema ({
    Guild: String,
    Channel: String,
    Setup: String
})
 
module.exports = model('phoneschema', phoneschema);