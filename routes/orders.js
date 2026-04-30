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
      .select("user products totalAmount createdAt")
      .populate("user", "username name email role")        // replaces user ID with selected user data
      .populate("products", "name price description")    // replaces product IDs with selected product data
      .sort({ createdAt: -1 })
      .lean();
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
