const mongoose = require("mongoose");

// Product Schema defines what a product looks like in the database
const productSchema = new mongoose.Schema({

  // Name of the product
  name: {
    type: String,
    required: true
  },

  // Price of the product
  price: {
    type: Number,
    required: true
  },

  // Description of the product
  description: {
    type: String
  },


  // Reference to the user who created the product
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
