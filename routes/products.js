const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// CREATE a new product
// POST /api/products
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all products
// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("createdBy").sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a product
// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
