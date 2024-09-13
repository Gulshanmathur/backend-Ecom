exports.isAuth = (req, res, next) => {
  try {
    if (req.user) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error in isAuth middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.sanitizeUser = (user) => {  
  return { id: user.id, role: user.role };
};

exports.cookieExtracter = (req) => { 
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"]; // Extracting the JWT from cookies
  }
  // token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZGViN2Q4YzhmNmJjNTAwZmJjNzM3OSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNTk4OTM3MiwiZXhwIjoxNzI1OTkyOTcyfQ.bi5NP2oyljme9G2VNLIv3TjSG04NDs6Tjcw6IB8VY0c`;
  return token;  
};
