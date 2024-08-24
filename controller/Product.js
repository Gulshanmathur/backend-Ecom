const Product = require("../model/Product");

exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct); // Return created product with status 201 (Created)
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(400).json({ message: "Error creating product", error }); // Provide a user-friendly error message
  }
};

exports.fetchAllProducts = async (req, res) => {
    // filter ={"category":["smartPhone","laptops","beauty",...]}
  // sort = {_sort :"price",_order:"desc"}
  // pagination = {_page:1, _limit: 10} //_page=1&_limit=10

  // Initialize an empty filter object
  let filter = {};

  // Check for category and brand in the request query and add to the filter
  if (req.query.category) {
    filter.category = { $in: req.query.category }; // Use $in for array of categories
    //the $in operator is always used with an array of values
  }
  if (req.query.brand) {
    filter.brand = req.query.brand;
  }
     // Initialize the query with the filter 
      let query = Product.find(filter);

  // Check for sorting parameters
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  // Check for pagination parameters
  if (req.query._page && req.query._limit) {
    const pageSize = parseInt(req.query._limit); // items per page
    const page = parseInt(req.query._page);
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  // Count total documents matching the filter
  const totalDocs = await Product.countDocuments(query).exec(); // Use countDocuments on the model 

  try {
    const docs = await query.exec();
    res.set('X-Total-Count',totalDocs)
    res.status(200).json(docs);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.fetchProductById = async(req,res) =>{
   const {id} = req.params;
   try {
     const product = await Product.findById(id);
     res.status(200).json(product);
   } catch (error) {
       res.status(400).json(error);
   }
}

