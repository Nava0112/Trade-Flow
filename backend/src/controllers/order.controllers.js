import { 
    getOrders, 
    getOrderById, 
    getOrdersBySymbol, 
    createOrder, 
    updateOrderStatus 
} from "../models/order.models.js";
import { createTransaction } from "../models/transaction.models.js";
import { createBuyOrderService, createSellOrderService } from "../services/order.services.js";

export const createOrderController = async (req, res) => {
    try {
        const { user_id, symbol, quantity, price, order_type } = req.body;

        if (!user_id || !symbol || !quantity || !price || !order_type) {
            return res.status(400).json({
                error: "Missing required fields"
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