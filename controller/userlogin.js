const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()
// userLogin

async function loginPage(req,res,next){
    try {
      return res.render("login.ejs",{title:"Zyn.Login",stylepath:"/css/signupandlogin.css"})
    } catch (err) {
      next(err)
    }
  }

async function userLogin(req,res,next){
    try {
    let {username,password} = req.body;
    let findUserRegister = await User.findOne({username})
    if (!findUserRegister) {
        return res
        .cookie("flasherr",'user not registered')
        .status(500).redirect("/api/auth/login")
    }else{
        let planPassword = bcrypt.compareSync(password,findUserRegister.password)
        if (!planPassword) {
            return res
            .cookie("flasherr",'password worng')
            .redirect("/api/auth/login")
        }
        let jwtToken = jwt.sign({userId:findUserRegister._id,profile:findUserRegister.profilePicture,username:findUserRegister.username},process.env.JWT,{expiresIn:"7d"})
        res.cookie("loginToken",jwtToken,{httpOnly:true,expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)})
        //imp from
        let redirectTo = req.cookies.redirectTo || '/home'
        return res
        .clearCookie("redirectTo")
        .cookie('flashmsg','Login Successful!')
        .status(200).redirect(redirectTo)
        // to
    }
    } catch (err) {
        next(err)
    }
}

module.exports = {userLogin,loginPage}