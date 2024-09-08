const express = require("express");
const router = express.Router(); 
const { loginUser, checkUser,createUser } = require("../controller/Auth");
const  Passport  = require("passport");


router.post('/signup',createUser)
      .post("/login",Passport.authenticate('local'),loginUser)
      .get('/check',Passport.authenticate('jwt'),checkUser)

module.exports = router;  