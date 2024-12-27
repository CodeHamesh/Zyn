const bcrypt = require("bcrypt");
const User = require("../models/User");
const joi = require('joi')
let signupSchema = joi.object({
  name:joi.string().required().min(3),
  username:joi.string().required().min(3),
  email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password:joi.string().pattern(new RegExp('^[a-zA-Z0-9]'))
})


async function signupPage(req,res,next){
  try {
    return res.render("signup.ejs",{title:"Zyn.Signup",stylepath:"/css/signupandlogin.css"})
  } catch (err) {
    next(err)
  }
}
async function userSignup(req, res, next) {
  try {
    let {error} = signupSchema.validate(req.body)
    if (error) {
      return res 
      .cookie('flasherr',`${error.details[0].message}`)
      .redirect('/api/auth/signup')
    }
    let { name, username, email, password } = req.body;
    let hashPassword = bcrypt.hashSync(password, 10);
    let allReadyUserRegister = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (allReadyUserRegister) {
      return res.status(500).json({ message: "Email already registered." });
    } else {
      let createdUser = new User({
        name,
        username,
        email,
        password: hashPassword,
      });
      await createdUser.save();
      return res
      .cookie("flashmsg",'User created successfully!')
      .redirect("/home")
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { userSignup , signupPage};
