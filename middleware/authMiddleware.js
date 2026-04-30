exports.protect = (req, res, next) => {
    const userId = req.headers["user-id"];
    const userRole = req.headers.role;

    if (!userRole) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    req.user = {
        id: userId || null,
        role: userRole
    };

    next();
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    };
};
