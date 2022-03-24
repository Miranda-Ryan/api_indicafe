const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, maxlength: 25 },
    description: { type: String, required: true, maxlength: 200 },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    addedBy: {
      type: String,
      required: true
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    __v: {
      type: String,
      select: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Dish", dishSchema);
