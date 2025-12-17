import {
    createOrderController,
    getAllOrdersController,
    getOrderByIdController,
    updateOrderStatusController,
    getOrdersBySymbolController
} from "../controllers/order.controllers.js";

import express from "express";
import { onlyVerifyToken, isAdminRoute } from "../middleware/auth.middleware.js";

export const router = express.Router();

router.get("/", onlyVerifyToken, getAllOrdersController);
router.get("/:id", onlyVerifyToken, getOrderByIdController);
router.post("/", isAdminRoute, createOrderController);
router.put("/:id/status", isAdminRoute, updateOrderStatusController);
router.get("/symbol/:symbol", onlyVerifyToken, getOrdersBySymbolController);