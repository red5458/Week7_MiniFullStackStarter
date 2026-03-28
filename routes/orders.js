const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// CREATE a new order
router.post("/", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all orders
// GET /api/orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")        // replaces user ID with actual user data
      .populate("products")    // replaces product IDs with actual product data
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE an order
// DELETE /api/orders/:id
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
