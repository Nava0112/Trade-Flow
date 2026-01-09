import {
    createOrderController,
    getAllOrdersController,
    getOrderByIdController,
    updateOrderStatusController,
    updateOrderController,
    getOrdersBySymbolController,
    deleteOrderController
} from "../controllers/order.controllers.js";

import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

export const router = express.Router();

router.get("/", verifyToken, getAllOrdersController);
router.get("/:id", verifyToken, getOrderByIdController);
import { validateCreateOrder } from "../middleware/validation.middleware.js";

router.post("/", verifyToken, validateCreateOrder, createOrderController);
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatusController);
router.get("/symbol/:symbol", verifyToken, getOrdersBySymbolController);
router.put("/:id", verifyToken, updateOrderController)
router.delete("/:id", verifyToken, deleteOrderController)
