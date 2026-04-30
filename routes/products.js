const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const cache = require("../utils/cache");

const PRODUCTS_CACHE_KEY = "products";

// CREATE a new product
// POST /api/products
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    cache.del(PRODUCTS_CACHE_KEY);

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all products
// GET /api/products
router.get("/", async (req, res) => {
  try {
    const start = Date.now();
    const cachedProducts = cache.get(PRODUCTS_CACHE_KEY);

    if (cachedProducts) {
      return res.json({
        source: "cache",
        durationMs: Date.now() - start,
        data: cachedProducts
      });
    }

    const products = await Product.find()
      .select("name price description createdBy createdAt")
      .populate("createdBy", "username name email role")
      .sort({ createdAt: -1 })
      .lean();

    cache.set(PRODUCTS_CACHE_KEY, products);

    res.json({
      source: "database",
      durationMs: Date.now() - start,
      data: products
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a product
// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    cache.del(PRODUCTS_CACHE_KEY);

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
