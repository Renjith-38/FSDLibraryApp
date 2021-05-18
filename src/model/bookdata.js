//Access mongoose package
const mongoose = require('mongoose'); 



//schema defintiion
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: String,
    author: String,
    genre: String,
    description: String,
    image: String
});



//model creation
var bookdata = mongoose.model('bookdata',BookSchema);

module.exports = bookdata;