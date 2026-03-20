const db = require('../database/sqlite');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token.startsWith("mock-jwt-token-")) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const userId = token.split("-")[3];
    try {
        const user = db.prepare("SELECT role FROM users WHERE id = ?").get(userId);
        if (user && user.role === 'admin') {
            req.userId = userId;
            next();
        } else {
            res.status(403).json({ success: false, message: "Unauthorized. Admin access required." });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// General Auth Middleware
const isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token.startsWith("mock-jwt-token-")) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const userId = token.split("-")[3];
    req.userId = userId;
    next();
};

// Role-based Authorization Middleware
const authorize = (requiredRole) => {
    return (req, res, next) => {
        const userId = req.userId;
        try {
            const user = db.prepare("SELECT role FROM users WHERE id = ?").get(userId);
            if (user && user.role === requiredRole) {
                next();
            } else {
                res.status(403).json({ success: false, message: `Access denied. ${requiredRole} role required.` });
            }
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    };
};

module.exports = { isAdmin, isAuth, authenticate: isAuth, authorize };
