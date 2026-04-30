const express = require("express");
const router = express.Router();

const { register, login, profile } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, profile);
router.get("/admin", protect, authorize("admin"), (req, res) => {
    res.json({ message: "Admin access granted" });
});

module.exports = router;
