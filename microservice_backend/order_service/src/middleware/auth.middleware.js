// middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { getOrderById } from '../models/order.models.js';

export const verifyToken = (req, res, next) => {
    try {
        const internalSecret = req.headers['x-internal-secret'];
        const userId = req.headers['x-user-id'];
        const userRole = req.headers['x-user-role'];

        if (
            internalSecret &&
            process.env.INTERNAL_SERVICE_SECRET &&
            internalSecret === process.env.INTERNAL_SERVICE_SECRET &&
            userId &&
            userRole
        ) {
            req.user = { id: userId, role: userRole };
            return next();
        }

        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access token required'
            });
        }

        if (!process.env.ACCESS_TOKEN_SECRET) {
            return res.status(500).json({
                success: false,
                error: 'Server token configuration missing'
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
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

export const isOwnerOrAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        let resourceUserId = req.params.userId || req.body.user_id;
        if (!resourceUserId && req.params.id) {
            const order = await getOrderById(req.params.id);
            resourceUserId = order?.user_id;
            if (!resourceUserId) {
                return res.status(404).json({
                    success: false,
                    error: 'Order not found'
                });
            }
        }

        resourceUserId = parseInt(resourceUserId);
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
