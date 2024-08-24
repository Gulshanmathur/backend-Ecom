const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
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

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

categorySchema.set('toJSON',{
    virtuals: true,       // includes virtual fields like id in the JSON output.
    versionKey: false,     //removes the __v field from the JSON output.
    transform: function (doc,ret){
        delete ret._id
    }  //function removes the _id field from the returned object,
})

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
