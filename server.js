const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products"); // NEW: Week 10
const ordersRouter = require("./routes/orders");     // NEW: Week 10
const authRoutes = require("./routes/authRoutes");    // NEW: Week 11

const app = express();

// Body parsers (required so req.body will not be undefined)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter); // NEW: Week 10
app.use("/api/orders", ordersRouter);     // NEW: Week 10

// Test route
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Deployment status route
app.get("/status", (req, res) => {
    res.json({
        status: "running",
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Mongo connect + start server
async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("Startup error:", err.message);
        process.exit(1);
    }
}

start();
