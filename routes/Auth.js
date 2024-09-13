const express = require("express");
const router = express.Router(); 
const { loginUser,createUser,checkUser } = require("../controller/Auth");
const  Passport  = require("passport");


router.post('/signup',createUser)
      .post("/login",loginUser)
      .get('/check',Passport.authenticate('jwt'),checkUser)

module.exports = router;  