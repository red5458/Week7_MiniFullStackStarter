const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.register = async (req, res) => {
    try {
        const { username, name, email, password, confirmPassword, role } = req.body;

        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Username, email, password, and confirmPassword are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({ message: "Username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            name: name || username,
            email,
            password: hashedPassword,
            role: role === "admin" ? "admin" : "user"
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.profile = async (req, res) => {
    return res.json({
        message: "Profile access granted",
        user: req.user
    });
};
