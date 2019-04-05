const secret = require('../api/secret.js').jwtSecret;
const jwt = require('jsonwebtoken')

module.exports = {
    generateToken
}
function generateToken(user){
    const payload = {
        subject: user.id, 
        username: user.username,
    }
    const option = {
        expiresIn: '1d',
    }
    return jwt.sign(payload, secret, option);
  }
  