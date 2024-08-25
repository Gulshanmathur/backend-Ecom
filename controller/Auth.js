// information related login and signUp
const User = require("../model/User");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user); // Return created product with status 201 (Created)
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(400).json({ message: "Error signing up user", error }); // Provide a user-friendly error message
  }
};

exports.loginUser = async (req, res) => {
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
    const { _id, name, role, addresses } = user; // Destructure the needed fields
    res.status(200).json({ id: _id, name, email:user.email, role, addresses});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
