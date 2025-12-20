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
    const { user_id, symbol, quantity, price, order_type } = req.body;
    try {
        if (!user_id || !symbol || !quantity || !price || !order_type) {
            return res.status(400).json({ 
                error: "Missing required fields" 
            });
        }
        const newOrder = await createOrder(orderData);
        const transactionType = orderData.order_type === 'BUY' ? 'BUY' : 'SELL';
        if (transactionType === 'BUY') {
            await createTransaction({
                user_id: orderData.user_id,
                type: transactionType,
                amount: orderData.quantity * orderData.price,
                status: 'PENDING',
                order_id: newOrder.id
            });
            try {
                await createBuyOrderService(newOrder);
            } catch (err) {
                console.error(`❌ Logging error for order ${newOrder.id}:`, err.message);
            }
        } else {
            await createTransaction({
                user_id: orderData.user_id,
                type: transactionType,
                amount: orderData.quantity * orderData.price,
                status: 'PENDING',
                order_id: newOrder.id
            });
            try {
                await createSellOrderService(newOrder);
            } catch (err) {
                console.error(`❌ Logging error for order ${newOrder.id}:`, err.message);
            }
        }
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

