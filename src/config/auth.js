const jwt = require('express-jwt');



const authentication = (options) => { 

  const {secret, repo} = options
  const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;
    console.log("header? 1"+ authorization && authorization.split(' ')[0] === 'Bearer')
    console.log("header? 2 "+ authorization )
    console.log("header? 3"+ uthorization.split(' ')[1])
    con
    if(authorization && authorization.split(' ')[0] === 'Bearer') {
      return authorization.split(' ')[1];
    }
    return null;
  };

  var  isFarmAdmin = (req,res,next) => {
    var farmId = req.user.farm
    farmId == req.params.farmID ?
      next()
    :
      res.status(401).send()

  }
  return {
    required: jwt({
      secret: secret,
      userProperty: 'user',
      getToken: getTokenFromHeaders,
    }),
    optional: jwt({
      secret: secret,
      userProperty: 'user',
      getToken: getTokenFromHeaders,
      credentialsRequired: false,
    }),
    isFarmAdmin
  };

}
const start = (secret) => {
  return new Promise((resolve, reject) => {
    if (!secret) {
      reject(new Error('secret not supplied!'))
    }
    
    resolve(authentication(secret))
  })
}

module.exports = Object.assign({}, {start})

