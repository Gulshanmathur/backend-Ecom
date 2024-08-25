const Order = require("../model/Order");

exports.fetchOrdersByUser = async (req,res)=>{
  const {user} = req.query;
  console.log({user});
  
    try {
        const orders = await Order.find({user:user})  //.populate('product');
        res.status(200).json(orders)
    } catch (error) {
        res.status(400).json(err)
    }
}

exports.createOrder = async (req, res) => {
    try {
      const order = new Order(req.body);
      const savedOrder = await order.save(); 
      // const result = await savedOrder.populate('product')
      res.status(201).json(savedOrder); // Return created product with status 201 (Created)
    } catch (error) {
      console.error(error.message); // Log the error for debugging purposes
      res.status(400).json({ message: "Error creating cart", error }); // Provide a user-friendly error message
    }
  };

  exports.deleteOrder = async (req, res) => {
    const {id} =req.params;
    try {
      const doc = await Order.findByIdAndDelete(id);
      res.status(200).json(doc);
    } catch (error) {
      console.error(error.message); // Log the error for debugging purposes
      res.status(400).json({ message: "Error creating cart", error }); // Provide a user-friendly error message
    }
  };

  exports.updateOrder = async(req,res) =>{
    const {id} = req.params;
    try {
      const order = await Order.findById(id);
      if(!cart){
        return res.status(404).json({message:'Product not found'});
      }
      Object.keys(req.body).forEach((key)=>{
        order[key] = req.body[key];
      })
      const updatedCart = await order.save();
      res.status(200).json(updatedCart);
      
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
    
  } 