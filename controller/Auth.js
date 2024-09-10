// information related login and signUp
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sanitizeUser } = require("../services/common");
const { findOne } = require("../model/Product");
const SECRET_KEY = "SECRET_KEY";
exports.createUser = async (req, res) => {
  try {
    const salt = 10;
    console.log("line 10",req.body);
    
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, salt); //salt = 10
    const doc = await User.create({
      email: email,
      password: hashedPassword,
      salt,
    });

    req.login(sanitizeUser(doc), (err) => {
      // this is also call serializer and adds to session
      if (err) {
        res.status(400).json(err);
      } else {
        const token = jwt.sign(sanitizeUser(doc), SECRET_KEY, {
          expiresIn: "1h",
        });
        res
          .cookie("jwt", token, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true
          })
          .status(201)
          .json(token);
        // Return created product with status 201 (Created)
      }
    });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(400).json({ message: "Error signing up user", error }); // Provide a user-friendly error message
  }
};

exports.loginUser = async (req, res) => {
  const {email, password} =  req.body;
  const doc = await User.findOne({email:email});
  const isMatch = await bcrypt.compare(password,doc.password.toString('utf-8'));
  if (!isMatch) {
     res.status(401).json({message:"unauthorized user"})
  }
  else{
    req.login(sanitizeUser(doc), (err) => {
      // this is also call serializer and adds to session
      if (err) {
        res.status(400).json(err);
      } else {
        const token = jwt.sign(sanitizeUser(doc), SECRET_KEY, {
          expiresIn: "1h",
        });
        res
          .cookie("jwt", token, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true
          })
          .status(201)
          .json(token);
        // Return created product with status 201 (Created)
      }
    });
  }
  
  
  /*
  const { email, password } = req.body;
  try {
    // Validate the input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    //User.findOne({ email }, "id role password email"); // optional fields are projections
    // Find the user by email
    const user = await User.findOne({ email });
   
    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Return the user data with projection
    //TODO: we will make addresses independent from login()
    const { _id, name, role } = user; // Destructure the needed fields
    res.status(200).json({ id: _id, name, role});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
    */
  // const token = jwt.sign(sanitizeUser(req.user), SECRET_KEY, { expiresIn: '1h' });
  // req.user is a special object created by passport when user authenticated
};

exports.checkUser = async (req, res) => {
  // res.json(req.user)
  console.log("inside check", req.user);

  res.json(req.user);
};
