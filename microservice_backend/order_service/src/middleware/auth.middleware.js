// middleware/auth.middleware.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
        
        return res.status(500).json({
            success: false,
            error: 'Authentication failed'
        });
    }
};

export const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Admin access required'
            });
        }

        next();
    } catch (error) {
        console.error("Admin check error:", error.message);
        return res.status(500).json({
            success: false,
            error: 'Authorization failed'
        });
    }
};

export const isOwnerOrAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const resourceUserId = parseInt(req.params.userId || req.body.user_id);
        const currentUserId = parseInt(req.user.id);

        if (req.user.role !== 'admin' && currentUserId !== resourceUserId) {
            return res.status(403).json({
                success: false,
                error: 'Access denied. You can only access your own resources'
            });
        }

        next();
    } catch (error) {
        console.error("Owner/Admin check error:", error.message);
        return res.status(500).json({
            success: false,
            error: 'Authorization failed'
        });
    }
};