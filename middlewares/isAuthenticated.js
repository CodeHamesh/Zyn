const jwt = require('jsonwebtoken')
let User = require('../models/User')
async function isAuthenticated(req,res,next){
    try {
     let {loginToken} = req.cookies
     if (!loginToken) {
        res.locals.isAuthenticated = false
        return next()
     }
    let decodedData = jwt.verify(loginToken, process.env.JWT);
    if (!decodedData) {
       res.locals.isAuthenticated = false
       return next()
    }else{
     res.locals.isAuthenticated = true
     res.locals.userInfo = decodedData
     let photo = await User.findById(decodedData.userId).select('profilePicture')
     res.locals.userid = decodedData.userId
     res.locals.profile = photo
     req.userid = decodedData
     next()
    }
    } catch (err) {
     next(err)
    }
 }

 module.exports = isAuthenticated