const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const cache = require("../utils/cache");

const USERS_CACHE_KEY = "users";

// CREATE
router.post("/", async (req, res) => {
    try {
        if (!req.body.username && req.body.name) {
            req.body.username = req.body.name.toLowerCase().replace(/\s+/g, "");
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const user = await User.create(req.body);
        cache.del(USERS_CACHE_KEY);

        const safeUser = user.toObject();
        delete safeUser.password;

        return res.status(201).json(safeUser);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

// READ ALL
router.get("/", async (req, res) => {
    const start = Date.now();
    const cachedUsers = cache.get(USERS_CACHE_KEY);

    if (cachedUsers) {
        return res.json({
            source: "cache",
            durationMs: Date.now() - start,
            data: cachedUsers
        });
    }

    const users = await User.find()
        .select("username name email role age createdAt")
        .sort({ createdAt: -1 })
        .lean();

    cache.set(USERS_CACHE_KEY, users);

    return res.json({
        source: "database",
        durationMs: Date.now() - start,
        data: users
    });
});

// UPDATE
router.put("/:id", async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        cache.del(USERS_CACHE_KEY);

        if (updated) {
            updated.password = undefined;
        }

        return res.json(updated);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        cache.del(USERS_CACHE_KEY);

        return res.json({ message: "User deleted" });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

module.exports = router;
