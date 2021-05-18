//Access mongoose package
const mongoose = require('mongoose');

//schema defintiion
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    name: String,
    description: String,
    image: String
});



//model creation
var authordata = mongoose.model('authordata',AuthorSchema);

module.exports = authordata;