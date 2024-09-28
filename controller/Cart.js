const Cart = require("../model/Cart");

exports.fetchCartByUser = async (req,res)=>{
  const {id} = req.params;  
    try {
        const cartItems = await Cart.find({user:id}).populate('product');
        res.status(200).json(cartItems)
    } catch (error) { 
        res.status(400).json(error) 
    }
}

exports.addToCart = async (req, res) => {
  console.log("inside add to cart req.body",req.body);
  
  const {id} = req.params; 
    try {
      const newCart = new Cart({...req.body});
      const savedCart = await newCart.save(); 
      const result = await savedCart.populate('product')
      res.status(201).json(result); // Return created product with status 201 (Created)
    } catch (error) {
      console.error(error.message); // Log the error for debugging purposes
      res.status(400).json({ message: "Error creating cart", error }); // Provide a user-friendly error message
    }
  };

  exports.deleteFromCart = async (req, res) => {
    const {id} =req.params;
    try {
      const doc = await Cart.findByIdAndDelete(id);
      res.status(200).json(doc);
    } catch (error) {
      console.error(error.message); // Log the error for debugging purposes
      res.status(400).json({ message: "Error creating cart", error }); // Provide a user-friendly error message
    }
  };

  exports.updateCart = async(req,res) =>{
    const {id} = req.params;
    try {
      const cart = await Cart.findById(id);
      if(!cart){
        return res.status(404).json({message:'Product not found'});
      }
      Object.keys(req.body).forEach((key)=>{
        cart[key] = req.body[key];
      })
      const updatedCart = await cart.save();
      const result = await updatedCart.populate('product')
      
      res.status(200).json(result);
      
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
    
  } 