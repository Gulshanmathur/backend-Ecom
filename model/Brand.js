const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    value: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

brandSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

brandSchema.set('toJSON',{
    virtuals: true,       // includes virtual fields like id in the JSON output.
    versionKey: false,     //removes the __v field from the JSON output.
    transform: function (doc,ret){
        delete ret._id
    }  //function removes the _id field from the returned object,
})

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
