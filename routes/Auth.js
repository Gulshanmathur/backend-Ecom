const express = require("express");
const router = express.Router();
const { createUser, } = require("../controller/User");
const { loginUser } = require("../controller/Auth");


router.post('/signup',createUser).post("/login",loginUser)

module.exports = router; 