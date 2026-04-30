const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

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
        const safeUser = user.toObject();
        delete safeUser.password;

        return res.status(201).json(safeUser);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

// READ ALL
router.get("/", async (req, res) => {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
});

// UPDATE
router.put("/:id", async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        return res.json({ message: "User deleted" });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

module.exports = router;
