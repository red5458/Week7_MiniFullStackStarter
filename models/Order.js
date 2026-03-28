const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  // Reference to the user who made the order
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // Array of product references
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],

  // Total price of the order
  totalAmount: {
    type: Number,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
