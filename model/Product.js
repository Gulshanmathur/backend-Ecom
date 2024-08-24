const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [1, "wrong minimum price"],
      max: [10000, "wrong max price"],
    },
    discountPercentage: {
      type: Number,
      min: [1, "wrong minimum discount"],
      max: [99, "wrong max discount"],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: { type: [String], required: true }, // Array of image URLs
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  // { timestamps: true }
);

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set('toJSON',{
    virtuals: true,       // includes virtual fields like id in the JSON output.
    versionKey: false,     //removes the __v field from the JSON output.
    transform: function (doc,ret){
        delete ret._id
    }  //function removes the _id field from the returned object,
})

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
