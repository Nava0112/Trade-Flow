import {
    createOrderController,
    getAllOrdersController,
    getOrderByIdController,
    updateOrderStatusController,
    getOrdersBySymbolController
} from "../controllers/order.controllers.js";

import express from "express";

export const router = express.Router();

router.get("/", getAllOrdersController);
router.get("/:id", getOrderByIdController);
router.post("/", createOrderController);
router.put("/:id/status", updateOrderStatusController);
router.get("/symbol/:symbol", getOrdersBySymbolController);