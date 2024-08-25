const mongoose = require("mongoose");

const orderSchema  = new mongoose.Schema({
    items:{type:[mongoose.Schema.Types.Mixed], required:true},
    totalAmount : {type:Number},
    totalItems:{type:Number},
    user : {type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    paymentMethod:{type:String, required:true},
    status: {type:String, default:"pending"},
    selectedAddress :{type:[mongoose.Schema.Types.Mixed],required:true}
})

orderSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  
  orderSchema.set('toJSON',{
      virtuals: true,       // includes virtual fields like id in the JSON output.
      versionKey: false,     //removes the __v field from the JSON output.
      transform: function (doc,ret){
          delete ret._id
      }  //function removes the _id field from the returned object,
  })
  
  const Order = mongoose.model("Order", orderSchema);
  module.exports = Order;