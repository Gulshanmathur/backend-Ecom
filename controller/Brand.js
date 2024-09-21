const Brand = require("../model/Brand")

exports.fetchBrands = async (req,res)=>{
    try {
        const brands = await Brand.find({});
        res.status(200).json(brands)
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.createBrand = async (req, res) => {
    try {  
      const newBrand = new Brand(req.body);
      const savedBrand = await newBrand.save();
  
      res.status(201).json(savedBrand); // Return created product with status 201 (Created)
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(400).json({ message: "Error creating product", error }); // Provide a user-friendly error message
    }
  };