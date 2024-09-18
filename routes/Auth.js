const express = require("express");
const router = express.Router(); 
const { loginUser,createUser,checkUser, signOut } = require("../controller/Auth");
const  Passport  = require("passport");


router.post('/signup',createUser)
      .post("/login",loginUser)
      .get('/check',Passport.authenticate('jwt'),checkUser)
      .post('/signout',signOut)

module.exports = router;  