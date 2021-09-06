const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bookdb', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

const bookSchema=new mongoose.Schema({
title :String,
subtitle :String,
price :String,
image :String,
email:String
})

const bookModel=mongoose.model('book',bookSchema)

module.exports=bookModel