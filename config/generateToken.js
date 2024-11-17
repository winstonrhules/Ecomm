const jwt = require("jsonwebtoken")

const generateToken = (id)=>{
 return jwt.sign({id}, process.env.JWT_PASS_SEC, {expiresIn:"1d"})
}

module.exports = generateToken