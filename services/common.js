exports.isAuth = (req, res, next)=>{
    if(req.user){
      console.log("isAuth inside", req.user);
       next() 
    }else{
      res.sendStatus(401);
    }
}

exports.sanitizeUser = (user)=>{
    return {id:user.id, role: user.role}
}