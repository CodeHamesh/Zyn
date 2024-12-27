const { acceptConnectionReq, deleteConnectionReq } = require('../controller/sendConnectionreq');
const { Auth } = require('../middlewares/auth')
const activityRouter = require('express').Router()
const Connection = require('../models/Connection');


activityRouter.get("/",Auth,async(req,res,next)=>{
  try {
   
   let allReq = await Connection.find({touserid:req.userInfo.userId,status:"pending"}).populate('fromuserid',["username",'profilePicture'])
   return res.render("activity.ejs",{title:"Zyn.Activity",stylepath:'/css/activity.css',allReq});
  } catch (err) {
   next(err)
  }
})

activityRouter.post("/connection/req/accept/:connectionId",Auth,acceptConnectionReq) //accept connection req hendeler
activityRouter.post("/connection/req/delete/:connectionId",Auth,deleteConnectionReq) //delete connection req hendeler

module.exports = activityRouter