const { model, Schema } = require('mongoose');

let boosterschema = new Schema ({
  Guild : String,
  Channel1 : String,
  Channel2 : String,

});

module.exports = model('boosterschema', boosterschema);