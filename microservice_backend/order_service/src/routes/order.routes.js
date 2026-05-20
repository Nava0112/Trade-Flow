// routes/order.routes.js
import express from "express";
import { verifyToken, isAdmin, isOwnerOrAdmin } from "../middleware/auth.middleware.js";
import { validateCreateOrder } from "../middleware/validation.middleware.js";
import {
    createOrderController,
    getAllOrdersController,
    getOrderByIdController,
    updateOrderStatusController,
    updateOrderController,
    getOrdersBySymbolController,
    deleteOrderController,
    getOrdersByUserIdController,
    getPendingOrdersController,
    healthCheckController,
    cancelOrderController
} from "../controllers/order.controller.js";

const router = express.Router();

// Public routes
router.get("/health", healthCheckController);

// Protected routes
router.get("/", verifyToken, getAllOrdersController);
router.get("/pending", verifyToken, getPendingOrdersController);
router.post("/", verifyToken, validateCreateOrder, isOwnerOrAdmin, createOrderController);
router.get("/user/:userId", verifyToken, getOrdersByUserIdController);

// Order-specific routes
router.get("/:id", verifyToken, getOrderByIdController);
router.put("/:id", verifyToken, isOwnerOrAdmin, updateOrderController);
router.delete("/:id", verifyToken, isOwnerOrAdmin, deleteOrderController);
router.put("/:id/cancel", verifyToken, isOwnerOrAdmin, cancelOrderController);
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatusController);

// Symbol-based routes
router.get("/symbol/:symbol", verifyToken, getOrdersBySymbolController);

export default router;
