const express = require("express");
const booksRouter = express.Router();
const multer = require('multer');
const bookdata  = require('../model/bookdata');

//define storage location for uploaded files
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'public/images');
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);

    }
});

store = multer({storage:storage});

function router(navbar,login,logout,isAuth){

booksRouter.get('/',isAuth,function(req,res){
    bookdata.find()
    .then(function(books){
        res.render("books",{
            navbar,
            login:logout,
            title:"Books",////
            books,
        });

    })
   
});

booksRouter.get('/:id',isAuth,function(req,res){
    const id = req.params.id;
    bookdata.findOne({_id:id})
    .then(function(book){
        res.render("book",{
            navbar,
            login:logout,
            title:"Books",
            book
        });
    })
    
});

booksRouter.get('/x/addbook',isAuth,function(req,res){
    res.render("addbook",{
        navbar,
        login:logout,
        title:"Add Books"
    });
});

booksRouter.post('/x/addbook/submit',store.single('image'),function(req,res){
    var item = {
    title:  req.body.title,
    author: req.body.author,
    genre:  req.body.genre,
    description:    req.body.description,
    image: req.file.filename,
    }
    console.log(req.body);
    var book = bookdata(item);
    book.save(); //save to db
    res.redirect('/books');

});
//route to go to update page
booksRouter.get('/updatebook/:id',isAuth,async(req,res)=>{
    const id = req.params.id;
    let book = await bookdata.findOne({_id:id});
    // res.send("Reached book update page");
    res.render("updatebook",{
        navbar,
        login:logout,
        title:"Update Book",
        book:book
    });
    // console.log(book);

});

//route to handle update request
booksRouter.post('/updatebook/:id',store.single('image'),async(req,res)=>{
    req.book = await bookdata.findOne({_id:req.params.id});
    let book = req.book;
    book.title = req.body.title;
    book.author = req.body.author;
    book.genre = req.body.genre;
    book.description = req.body.description;
    book.image = req.file.filename
    book = await book.save();
    // console.log(book._id);
    res.redirect('/books');
    
});

//route to handle delete operation
booksRouter.delete('/:id',async(req,res)=>{
    await bookdata.findByIdAndDelete(req.params.id);
    res.redirect('/books');
});
return booksRouter;
}
// module.exports = returnbooks;
module.exports = router;

