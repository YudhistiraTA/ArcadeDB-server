const {verifyToken} = require('../helpers/jwt')

const User = require('../models/User')


async function authentication(req,res,next){
    try {
        
        const {access_token} = req.headers
        
       
        if(!access_token){
            throw {name: "Unauthenticated", message: "Unauthenticated"}
        }
        const payload = verifyToken(access_token)
        let user = {}
        console.log(payload);
        user = await User.findByPk(payload.id)
        if(!user){
            throw {name: 'Unauthenticated', message: "Unauthenticated"}
        }
        console.log(user);
        req.additionalData = {
            id : user.id ,
            username : user.username,
            premium: user.premium
        }
        next()
    } 
    catch (err) {
        next(err)
    }
}



module.exports = {authentication}