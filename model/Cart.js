const mongoose = require("mongoose");

const cartSchema  = new mongoose.Schema({
    quantity : {type:Number, required: true, default:1},
    product : {type:mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    user : {type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
})

cartSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  cartSchema.set('toJSON',{
      virtuals: true,       // includes virtual fields like id in the JSON output.
      versionKey: false,     //removes the __v field from the JSON output.
      transform: function (doc,ret){
          delete ret._id
      }  //function removes the _id field from the returned object,
  })
  
  const Cart = mongoose.model("Cart", cartSchema);
  module.exports = Cart;