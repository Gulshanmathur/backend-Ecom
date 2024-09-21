const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const path = require('path');
const serveStatic = require('serve-static');
const session = require('express-session');
const cookieParser = require('cookie-parser');
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
const dotenv = require('dotenv');
dotenv.config()
const { isAuth, sanitizeUser, cookieExtracter } = require("./services/common");
const { Server } = require("http");
//webhook
const endpointSecret = process.env.ENDPOINT_SECRET;
const server = express();

main().catch(err => console.log(err)); 
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("database connected");   
} 
const opts = {
  // ExtractJwt.fromAuthHeaderAsBearerToken(),
  jwtFromRequest:  cookieExtracter,
  secretOrKey:process.env.SECRET_KEY ,
};
// CORS configuration
const corsOptions = {
  origin: 'http://localhost:8001', // Your React app's URL
  credentials: true, // Allow credentials (cookies)
  exposedHeaders : ['X-Total-Count']
};

server.use(cors(corsOptions))

// server.use(cors(
//   {}
// ))

server.post('/stripe-webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      console.log({paymentIntentSucceeded})
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`); 
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send(); 
});
 
//middleware
server.use('/', serveStatic(path.join(__dirname, '../Frontend/dist')));
// server.use(express.static('dist'))
server.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  // store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));
// server.use(cors({
//   origin: 'http://localhost:8001', // React app's URL
//   credentials: true // Allow credentials (cookies)
// }));

server.use(cookieParser());
server.use(passport.initialize());
server.use(passport.session());
server.use(passport.authenticate('session'));
server.use(express.json());
server.use(express.urlencoded({extended:false}));
// server.use(express.raw({type: 'application/json'}));
server.use('/products',isAuth,productsRouter)  //we can also use JWT token for client-only auth
server.use('/categories',isAuth,categoriesRouter)
server.use('/brands',isAuth,brandRouter)
server.use('/users',isAuth,usersRouter)
server.use('/auth',authRouter)
server.use('/cart',isAuth,cartRouter)
server.use('/ordersnow',isAuth,ordersRouter) 

server.get('*', (req,res)=>res.sendFile(path.resolve(__dirname, '..', 'Frontend', 'dist', 'index.html')));
//pasport strategies
passport.use('local',new LocalStrategy(
  {usernameField: 'email'},
  async (email, password, done) => {
    try {
      
      const user = await User.findOne({ email:email }); 
      // console.log({user})
      if (!user) { 
        return done(null, false, { message: 'Invalid Credentials' }); 
      }
      // const isMatch = await bcrypt.compare(password, user.password);
      const isMatch = await bcrypt.compare(password, user.password.toString('utf8'));
      if (!isMatch) {
        return done(null, false, { message: 'Invalid Credentials' });
      }
      const token = jwt.sign(sanitizeUser(user),process.env.SECRET_KEY , { expiresIn: '1h' });
      return done(null, {id:user.id,role:user.role});  // this line send to serializer
    } catch (err) {
      return done(err);
    }
  }
));

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {  
    try {     
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
  done(null,{id:user.id,role:user.role});  // here session has created   //{id:user.id,role:user.role}
  //after above done() function end here login api called
});

//this change session variable req.user when called from  authorized request
passport.deserializeUser(async (user, done) => {
  // const user = await User.findById(user);
  done(null, user);
});

//Payment
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use your secret key

server.post('/create-payment-intent', async (req, res) => {
  try {
    
    const { totalAmount, orderId } = req.body; // Amount should be in cents
      // Validate amount
      if (!totalAmount || isNaN(totalAmount)) { 
        return res.status(400).send({ error: 'Invalid amount' });
      }
    const paymentIntent = await stripe.paymentIntents.create({
      amount:totalAmount*100,
      currency: 'inr',
      automatic_payment_methods:{
        enabled: true,
      }
    });    
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});




const port = process.env.PORT || 8000;
server.listen(port,()=>{
    console.log("server started");
})  
