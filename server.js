const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { clean } = require("xss-clean/lib/xss");
require("dotenv").config();

const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products"); // NEW: Week 10
const ordersRouter = require("./routes/orders");     // NEW: Week 10
const authRoutes = require("./routes/authRoutes");    // NEW: Week 11

const app = express();

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return res.status(429).json({ message: "Too many login attempts, try again later" });
    }
});

app.use(helmet());

// Body parsers (required so req.body will not be undefined)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    if (req.body) {
        req.body = clean(req.body);
    }

    if (req.params) {
        req.params = clean(req.params);
    }

    next();
});

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/auth/login", loginLimiter);
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
