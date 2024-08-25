const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
  
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
    addresses: { 
      type: [mongoose.Schema.Types.Mixed],
   // any data types
    },
    name: String,
    orders: { type: [mongoose.Schema.Types.Mixed] },
  },
  { timestamps: true }
  );

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true, // includes virtual fields like id in the JSON output.
  versionKey: false, //removes the __v field from the JSON output.
  transform: function (doc, ret) {
    delete ret._id;
  }, //function removes the _id field from the returned object,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
