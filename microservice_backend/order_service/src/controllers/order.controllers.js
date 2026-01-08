import {
    getOrders,
    getOrderById,
    getOrdersBySymbol,
    updateOrderStatus,
    updateOrder,
    deleteOrder
} from "../models/order.models.js";
import { getUserById } from "../client/user.client.js";
import { getStockBySymbol } from "../client/stock.client.js";
import { createBuyOrderService, createSellOrderService } from "../services/order.services.js";

export const createOrderController = async (req, res) => {
    try {
        const { user_id, symbol, quantity, price, order_type } = req.body;

        if (!user_id || !symbol || !quantity || !price || !order_type) {
            return res.status(400).json({
                error: "Missing required fields"
            });
        }

        const user = await getUserById(user_id);
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }
        const symbolExists = await getStockBySymbol(symbol);
        if (!symbolExists) {
            return res.status(404).json({
                error: "Symbol not found"
            });
        }
        if (!["BUY", "SELL"].includes(order_type)) {
            return res.status(400).json({
                error: "Invalid order type"
            });
        }

        let order;

        if (order_type === "BUY") {
            order = await createBuyOrderService({
                user_id,
                symbol,
                quantity,
                price
            });
        } else {
            order = await createSellOrderService({
                user_id,
                symbol,
                quantity,
                price
            });
        }

        return res.status(201).json(order);

    } catch (error) {
        console.error("Create order error:", error.message);
        return res.status(500).json({ error: error.message });
    }
};


export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await getOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOrderByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await getOrderById(id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateOrderStatusController = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedOrder = await updateOrderStatus(id, status);
        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOrdersBySymbolController = async (req, res) => {
    const { symbol } = req.params;
    try {
        const orders = await getOrdersBySymbol(symbol);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateOrderController = async (req, res) => {
    const { id } = req.params;
    const { order } = req.body;
    try {
        const updatedOrder = await updateOrder(id, order);
        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteOrderController = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrder = await deleteOrder(id);
        if (!deletedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json(deletedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};