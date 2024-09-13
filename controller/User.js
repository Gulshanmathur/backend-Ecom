const Category = require("../model/Category");
const User = require("../model/User");

exports.fetchUserById = async (req,res)=>{
    const {id} = req.user;
    try {
        const user = await User.findById(id);    
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json(error.message)
    }
}

exports.createUser = async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user); // Return created product with status 201 (Created)
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(400).json({ message: "Error creating user", error }); // Provide a user-friendly error message
    }
  };

  exports.updateUser  = async(req,res) =>{
    const {id} = req.params;
    try {
      const user = await User.findById(id);
      if(!user){
        return res.status(404).json({message:'User not found'});
      }
      Object.keys(req.body).forEach((key)=>{
        user[key] = req.body[key];
      })
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
      
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
    
  } 