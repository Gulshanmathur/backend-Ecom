const express = require("express");
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products")
const categoriesRouter = require("./routes/Categories")
const brandRouter = require("./routes/Brands")
const server = express();

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
  console.log("database connected");  
}
//middleware
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use('/products',productsRouter)
server.use('/categories',categoriesRouter)
server.use('/brands',brandRouter)


server.get("/",(req,res)=>{
    res.json({status:'success'});
})

server.listen(8080,()=>{
    console.log("server started");
})
