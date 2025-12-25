import {
    createOrderController,
    getAllOrdersController,
    getOrderByIdController,
    updateOrderStatusController,
    getOrdersBySymbolController
} from "../controllers/order.controllers.js";

import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

export const router = express.Router();

router.get("/", verifyToken, getAllOrdersController);
router.get("/:id", verifyToken, getOrderByIdController);
router.post("/", verifyToken, createOrderController);
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatusController);
router.get("/symbol/:symbol", verifyToken, getOrdersBySymbolController);