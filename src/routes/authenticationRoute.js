const express = require('express');
const authRoute = express.Router();
const mongoose = require('mongoose');
const userdata = require('../model/userdata');
const bcrypt = require('bcryptjs');


function authenticationRoute(navbar,login,isAuth){

    //route for login page
    authRoute.get('/login',function(req,res){
        res.render('login',{
            navbar,
            login,
            value:"",
            title: "Login"
        });
    });

    //route for validating user login
    authRoute.post('/login',async (req,res)=>{
        const {email, password} = req.body;
        const user = await userdata.findOne({email});
        if(!user){
            return res.render('login',{
                title:'Login',
                navbar,
                login,
                value: "!Wrong Email or Password!"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.render('login',{
                title:'Login',
                navbar,
                login,
                value: "!Wrong Email or Password!"
            });
        }
        req.session.isAuth = true;
        res.redirect("/home");

    })

    //route for signup page
    authRoute.get('/signup',function(req,res){
        res.render('signup',{
            navbar,
            login,
            value:"",
            title: "SignUp"
        });
    });

    //route to save user signup data
    authRoute.post('/signup', async function(req,res){
        const {name, email, password, mobile} = req.body;

        let user = await userdata.findOne({email});
        if(user){
            return res.render('signup',{
                navbar,
                login,
                value:"!Email already Exist!",
                title: "SignUp"
            });
        }

        const hasPass = await bcrypt.hash(password,12);

        user = new userdata({
            name,
            email,
            password: hasPass,
            mobile,
        });

        await user.save();

        res.redirect('/login');

    })

    //route for hadnling logout session
    authRoute.post('/logout',(req,res)=>{
        req.session.destroy((err)=>{
            if(err) throw err;
            res.redirect('/');
        })
    });
    return authRoute;
    
}

module.exports = authenticationRoute;
