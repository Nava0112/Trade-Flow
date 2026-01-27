// middleware/validation.middleware.js
import { body, param, validationResult } from 'express-validator';

export const validateCreateOrder = [
    body('user_id')
        .notEmpty().withMessage('User ID is required')
        .isInt().withMessage('User ID must be an integer')
        .toInt(),
    
    body('symbol')
        .notEmpty().withMessage('Symbol is required')
        .isString().withMessage('Symbol must be a string')
        .isLength({ min: 1, max: 10 }).withMessage('Symbol must be 1-10 characters')
        .trim()
        .toUpperCase(),
    
    body('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
        .toInt(),
    
    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0.01 }).withMessage('Price must be a positive number greater than 0.01')
        .toFloat(),
    
    body('order_type')
        .notEmpty().withMessage('Order type is required')
        .isString().withMessage('Order type must be a string')
        .isIn(['BUY', 'SELL']).withMessage('Order type must be either BUY or SELL')
        .toUpperCase(),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => ({
                    field: err.param,
                    message: err.msg
                }))
            });
        }
        next();
    }
];

export const validateUpdateOrder = [
    param('id')
        .notEmpty().withMessage('Order ID is required')
        .isInt().withMessage('Order ID must be an integer'),
    
    body('quantity')
        .optional()
        .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    
    body('price')
        .optional()
        .isFloat({ min: 0.01 }).withMessage('Price must be a positive number greater than 0.01'),
    
    body('status')
        .optional()
        .isIn(['PENDING', 'PARTIAL', 'FILLED', 'CANCELLED', 'REJECTED'])
        .withMessage('Invalid status'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];

export const validateOrderId = [
    param('id')
        .notEmpty().withMessage('Order ID is required')
        .isInt().withMessage('Order ID must be an integer'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];

export const validateSymbol = [
    param('symbol')
        .notEmpty().withMessage('Symbol is required')
        .isString().withMessage('Symbol must be a string')
        .isLength({ min: 1, max: 10 }).withMessage('Symbol must be 1-10 characters')
        .toUpperCase(),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];