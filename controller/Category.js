const Category = require("../model/Category");

exports.fetchCategories = async (req,res)=>{
    try {
        const categories = await Category.find({});
        res.status(200).json(categories)
    } catch (error) {
        res.status(400).json(err)
    }
}

exports.createCategory = async (req, res) => {
    try {
      const newCategory = new Category(req.body);
      const savedCategory = await newCategory.save();
  
      res.status(201).json(savedCategory); // Return created product with status 201 (Created)
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(400).json({ message: "Error creating product", error }); // Provide a user-friendly error message
    }
  };