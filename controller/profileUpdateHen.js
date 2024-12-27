const User = require('../models/User');

async function updateProfile(req,res,next){
    try {
        let {userId} = req.params;
        let {name,bio,link} = req.body;
        const updateData = { name, bio, link };
        if (req.file) {
            updateData.profilePicture = `/uploads/${req.file.filename}`;
        }
        await User.findByIdAndUpdate(userId,updateData)
        return res
        .cookie("flashmsg",'Profile Updated')
        .redirect("/api/auth/profile")
    } catch (err) {
        next(err)
    }
}

module.exports = {
    updateProfile
}