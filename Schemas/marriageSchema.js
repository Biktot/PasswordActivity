const { model, Schema } = require('mongoose');

let marriageSchema = new Schema({
    marriedUser: String,
    marriedTo: String
})

module.exports = model('MarriageSchema', marriageSchema);