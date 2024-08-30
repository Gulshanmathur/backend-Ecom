const Order = require("../model/Order");

exports.fetchOrdersByUser = async (req,res)=>{
  const {userId} = req.params;
  // console.log({userId});
  
    try {
        const orders = await Order.find({user:userId})  //.populate('product');
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
    console.log(id);
       
    try {
      const order = await Order.findById(id);  
      if(!order){
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

  exports.fetchAllOrders = async (req, res) => {
  // sort = {_sort :"price",_order:"desc"}
  // pagination = {_page:1, _limit: 10} //_page=1&_limit=10

  // Initialize an empty filter object
  let filter = { deleted: { $ne: true } };

     // Initialize the query with the filter 
      let query = Order.find(filter);
      
      const totalDocs = await Order.countDocuments(query).exec();
      console.log({totalDocs});
      
   //TODO : How to get sort on discounted Price not on actual price
  // Check for sorting parameters
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  // Check for pagination parameters
  // console.log(req.query._per_page);
  
  if (req.query._page && req.query._per_page) {
    const pageSize = parseInt(req.query._per_page); // items per page
    const page = parseInt(req.query._page); 
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  // Count total documents matching the filter
  // Use countDocuments on the model 
  // console.log({totalDocs});
  
  try {
    const docs = await query.exec();
    res.set('X-Total-Count',totalDocs)
    res.status(200).json(docs);
  } catch (error) {
    res.status(400).json(error);
  } 
};