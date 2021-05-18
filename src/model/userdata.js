const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
    name:String,
    email:String,
    password:String,
    mobile:Number,
});

var userdata = mongoose.model('userdata',userSchema);

module.exports = userdata;