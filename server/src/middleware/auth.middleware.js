const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config/env");

const requireAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired authentication token"
        });
    }
};

module.exports = requireAuth;