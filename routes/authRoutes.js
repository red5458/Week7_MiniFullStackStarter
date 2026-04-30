const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { register, login, profile } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

const registerValidation = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .escape(),
    body("name")
        .optional({ values: "falsy" })
        .trim()
        .escape(),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must include an uppercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must include a number"),
    body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required"),
    body("role")
        .optional()
        .isIn(["user", "admin"])
        .withMessage("Role must be user or admin")
];

const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
];

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/profile", protect, profile);
router.get("/admin", protect, authorize("admin"), (req, res) => {
    res.json({ message: "Admin access granted" });
});
router.get("/secure-data", protect, (req, res) => {
    res.json({
        message: "Secure data access granted",
        data: {
            course: "IT 112",
            lab: "Week 13 Security Implementation",
            role: req.user.role
        }
    });
});

module.exports = router;
