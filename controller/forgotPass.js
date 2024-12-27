const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const nodeMailer = require('nodemailer');
require('dotenv').config()
async function sendForgotPassLink(req,res,next){
    try {
        let {email} = req.body
        let findUserInDb = await User.findOne({email})
        if (!findUserInDb) {
            return res
            .cookie("flasherr",'User not found')
            .status(500).redirect("/api/auth/login")
        }
        const resetToken = jwt.sign(
            { id: findUserInDb._id },          
            process.env.JWT_P,   
            { expiresIn: '10m'}      
        );
        const resetUrl = `http://localhost:3000/api/auth/restpass/${resetToken}`;
        let transporter = nodeMailer.createTransport({
            service:"gmail",
            auth:{
                user:'hameshphy@gmail.com',
                pass:"clnu yqvb mixv xgze"
            }
        })
       await transporter.sendMail({
            to:findUserInDb.email,
            subject: 'Password Reset Request',
            text: `Click here to reset your password: ${resetUrl}`
        })
        res
        .cookie('flashmsg','Password reset link sent to email!')
        .status(200).redirect('/api/auth/login')
    } catch (err) {
        next(err)
    }
}
async function resetPass(req,res,next){
    try {
   let {token} = req.params;
   let {password} = req.body;
   let decodeData =  jwt.verify(token,process.env.JWT_P)
   let findUser = await User.findOne({_id:decodeData.id})
   if (!findUser) {
   return res
   .cookie("flasherr",'User not found')
   .status(500).redirect("/api/auth/login")
   }
   let hashPassword = bcrypt.hashSync(password,10)
   findUser.password = hashPassword
   await findUser.save()
   return res
   .cookie("flashmsg",'Password reset successful!')
   .status(200).redirect("/api/auth/login")
    } catch (err) {
       next(err)
    }
}

function renderForgotPassTemplate(req,res,next){
    try {
    let {token} = req.params 
    return res
    .render('newpassword.ejs',{title:"new pass",stylepath:"/css/newpassword.css",token})
    } catch (err) {
        next(err)
    }
}


module.exports = {
    sendForgotPassLink,
    resetPass,
    renderForgotPassTemplate
}