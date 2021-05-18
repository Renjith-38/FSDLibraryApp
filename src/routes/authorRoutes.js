const express = require('express');
const authorRouter = express.Router();
const multer = require('multer');
const authordata = require('../model/authordata');

//define file storage for multer
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, 'public/images');
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);
    }
});

const store = multer({storage:storage});

function authroute(navbar,login,logout,isAuth){
    
    authorRouter.get('/',isAuth,function(req,res){
        authordata.find()
        .then(function(authors){
            res.render("authors",{
                navbar,
                login:logout,
                title:"Authors",
                authors
            });
        });
        
    });
    authorRouter.get('/:id',isAuth,function(req,res){
        const id = req.params.id;
        authordata.findOne({_id:id})
        .then(function(author){
            res.render('author',{
                navbar,
                login:logout,
                title:"Author",
                author
            });
        });
        
    });
    authorRouter.get('/x/addauthor',isAuth,function(req,res){
        res.render("addauthor",{
            navbar,
            login:logout,
            title:"Add Author"
        });
    });

    //route for adding author
    authorRouter.post('/x/addauthor/submit',store.single('image'),function(req,res){
        var item = {
            name: req.body.name,
            description: req.body.description,
            image: req.file.filename
        }
        var author = authordata(item);
        author.save();
        res.redirect('/authors');
    });

    //route for update author page
    authorRouter.get('/updateauthor/:id',isAuth,async(req,res)=>{
        let author = await authordata.findOne({_id:req.params.id});
        res.render('updateauthor',{
           navbar,
           login:logout,
           title:'Update Author' ,
           author:author
        });
    });

    //route to handle update request
    authorRouter.post('/updatebook/:id',store.single('image'),async(req,res)=>{
        req.author = await authordata.findOne({_id:req.params.id});
        let author = req.author;
        author.name = req.body.name;
        author.description = req.body.description;
        author.image = req.file.filename;
        author = author.save();
        console.log(req.file.filename);
        res.redirect('/authors');
    });

    //router to handle delete request
    authorRouter.delete('/:id',async (req,res)=>{
        await authordata.findByIdAndDelete({_id:req.params.id});
        res.redirect('/authors');
    });


    return authorRouter;
}

module.exports = authroute;