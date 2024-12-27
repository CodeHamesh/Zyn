let User = require('../models/User')
async function findFriends(req,res,next){
    try {
       let loginUser = req.userInfo.userId
       let queryvalue = req.query.queryvalue || ''
       let allUser = await User.find({ $and: [
           { _id: { $ne: loginUser } }, // hume login user search me nhi chiye 
           { username: { $regex: `^${queryvalue}`, $options: 'i' } }  // baki sabhi users 
       ]})
       return res.json(allUser)
    } catch (err) {
       next(err)
    }
}
module.exports = {findFriends}