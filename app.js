const { render } = require("ejs");
const express = require("express");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const methodOverride = require('method-override');
const app = express();
const port = process.env.PORT || 2000;


const navbar = [
    {link:'/books',title:'Books'
    },
    {link:'/authors',title:'Authors'
    }
]
const login = [
    {link:'/login',title:'Log In'
    },
    {link:'/signup',title:'Sign Up'
    }
]
const logout = [
    {
        link:'/logout',title:'Log Out'
    }
]

global.isAuth = (req,res,next)=>{
    if(req.session.isAuth){
        next();
    }
    else{
         res.redirect('/error')
    }
}

const booksRouter = require("./src/routes/bookRoutes")(navbar,login,logout,isAuth);
const authorRouter = require("./src/routes/authorRoutes")(navbar,login,logout,isAuth);
const authenticationRouter = require('./src/routes/authenticationRoute')(navbar,login);

//connect to mongodb database
mongoose.connect('mongodb+srv://userrenjith:userrenjith@projectfiles.dmtoz.mongodb.net/LIBRARY?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})
 .then((res)=>{
     console.log('Mongodb Connected!');
 });

 const store = new MongoDBSession({
     uri:'mongodb+srv://userrenjith:userrenjith@projectfiles.dmtoz.mongodb.net/LIBRARY?retryWrites=true&w=majority',
     collection:'mySessions',
 });


 app.use(session({
    secret:'Very Secret Key',
    resave:false,
    saveUninitialized:false,
    store: store
}));



app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.set('views','./src/views');
app.use('/books',booksRouter);
app.use('/authors',authorRouter);
app.use('/',authenticationRouter);

app.get('/',function(req,res){
    // req.session.isAuth = true;
    res.render("index",
    {   
        navbar,
        login,
        title:"Library"
    });
});
app.get('/home',isAuth,function(req,res){
    res.render("home",
    {   
        navbar,
        login:logout,
        title:"Library"
    });
});

app.get('/error',(req,res)=>{
    res.render('error')
})

app.listen(port,()=>{console.log("Server ready at:"+port)});

