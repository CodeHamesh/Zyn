const User = require('../models/User');
const cloudinary = require('cloudinary').v2
// const cloudinary = require('cloudinary')

async function updateProfile(req,res,next){
    try {
        let {userId} = req.params;
        let {name,bio,link} = req.body;
        const updateData = { name, bio, link };
        if (req.file) {
            // updateData.profilePicture = `/uploads/${req.file.filename}`;
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "profile_pictures" }, 
                    (error, result) => {
                        if (error) {
                            return reject(error); 
                        }
                        resolve(result); 
                    }
                );
                uploadStream.end(req.file.buffer); 
            });

            updateData.profilePicture = result.secure_url;
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