const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const productsRouter = require("./routes/Products")
const categoriesRouter = require("./routes/Categories")
const brandRouter = require("./routes/Brands")
const usersRouter = require("./routes/User")
const authRouter = require("./routes/Auth");
const cartRouter = require('./routes/Cart')
const ordersRouter = require('./routes/Order');
const User = require("./model/User");
const { isAuth, sanitizeUser } = require("./services/common");
const SECRET_KEY = 'SECRET_KEY';

const server = express();

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
  console.log("database connected");  
}
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from the Authorization header
  secretOrKey:SECRET_KEY ,
};
//middleware
server.use(session({
  secret: 'keyboard cat',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  // store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));
server.use(passport.initialize());
server.use(passport.session());
server.use(passport.authenticate('session'));

server.use(cors(
  {exposedHeaders : ['X-Total-Count']}
))
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use('/products',isAuth,productsRouter)  //we can also use JWT token for client-only auth
server.use('/categories',categoriesRouter)
server.use('/brands',brandRouter)
server.use('/users',usersRouter)
server.use('/auth',authRouter)
server.use('/cart',cartRouter)
server.use('/orders',ordersRouter)

//pasport strategies
passport.use('local',new LocalStrategy(
  async (username, password, done) => {
    try {
      console.log("inside local",username,password)
      const user = await User.findOne({ email:username }); 
      if (!user) {
        return done(null, false, { message: 'Invalid Credentials' }); 
      }
      // const isMatch = await bcrypt.compare(password, user.password);
      const isMatch = await bcrypt.compare(password, user.password.toString('utf8'));
      if (!isMatch) {
        return done(null, false, { message: 'Invalid Credentials' });
      }
      const token = jwt.sign(sanitizeUser(user),SECRET_KEY , { expiresIn: '1h' });
      return done(null, token);  // this line send to serializer
    } catch (err) {
      return done(err);
    }
  }
));

passport.use('jwt',
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      console.log("inside jwt",jwt_payload);
      
      const user = await User.findOne({id:jwt_payload.sub}); // Assuming the ID is stored in the token
      if (user) {
        return done(null,sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false); // User not found
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// this create session variable req.user on being called from callbacks
passport.serializeUser((user, done) => {
  console.log("serialize",user);
  done(null,{id:user.id,role:user.role});  // here session has created   //{id:user.id,role:user.role}
  //after above done() function end here login api called
});

//this change session variable req.user when called from  authorized request
passport.deserializeUser(async (user, done) => {
  // const user = await User.findById(user);
  console.log("De-serialize",user);
  done(null, user);
});
 

server.listen(8000,()=>{
    console.log("server started");
}) 
