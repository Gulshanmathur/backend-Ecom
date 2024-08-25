const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products")
const categoriesRouter = require("./routes/Categories")
const brandRouter = require("./routes/Brands")
const usersRouter = require("./routes/User")
const authRouter = require("./routes/Auth");
const cartRouter = require('./routes/Cart')
const ordersRouter = require('./routes/Order')
const server = express();

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
  console.log("database connected");  
}
//middleware
server.use(cors(
  {exposedHeaders : ['X-Total-Count']}
))
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use('/products',productsRouter)
server.use('/categories',categoriesRouter)
server.use('/brands',brandRouter)
server.use('/users',usersRouter)
server.use('/auth',authRouter)
server.use('/cart',cartRouter)
server.use('/orders',ordersRouter)


server.get("/",(req,res)=>{
    res.json({status:'success'});
})

server.listen(8000,()=>{
    console.log("server started");
}) 
