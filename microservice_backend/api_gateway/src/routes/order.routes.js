import express from "express";
import { forwardRequest } from "../utils/proxy";
import { verifyToken, isAdmin } from "../middleware/auth.middleware";
export const router = express.Router();

router.get("/", verifyToken, isAdmin, forwardRequest("order", "getAllOrders"));
router.get("/:id", verifyToken, forwardRequest("order", "getOrderById"));
router.post("/", verifyToken, forwardRequest("order", "createOrder"));
router.get("/symbol/:symbol", verifyToken, forwardRequest("order", "getOrdersBySymbol"));
router.put("/:id/status", verifyToken, isAdmin, forwardRequest("order", "updateOrderStatus"));