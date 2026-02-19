// controllers/order.controller.js
import {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    getOrdersBySymbol,
    getPendingOrders,
    getOrdersByUserId
} from "../models/order.models.js";
import { getUserById } from "../client/user.client.js";
import { getStockBySymbol } from "../client/stock.client.js";
import { addBuyOrderToBook, addSellOrderToBook, triggerMatchingEngine } from "../client/market.client.js";

export const createOrderController = async (req, res) => {
    try {
        const { user_id, symbol, quantity, price, order_type } = req.body;

        // Validation
        if (!user_id || !symbol || !quantity || !price || !order_type) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: user_id, symbol, quantity, price, order_type"
            });
        }

        // Validate data types
        const parsedQuantity = parseInt(quantity);
        const parsedPrice = parseFloat(price);

        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({
                success: false,
                error: "Quantity must be a positive integer"
            });
        }

        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({
                success: false,
                error: "Price must be a positive number"
            });
        }

        // Check if user exists
        const user = await getUserById(user_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        // Check if symbol exists
        const stock = await getStockBySymbol(symbol);
        if (!stock) {
            return res.status(404).json({
                success: false,
                error: "Symbol not found"
            });
        }

        // Validate order type
        if (!["BUY", "SELL"].includes(order_type.toUpperCase())) {
            return res.status(400).json({
                success: false,
                error: "Invalid order type. Must be 'BUY' or 'SELL'"
            });
        }

        // Create order object
        const orderData = {
            user_id,
            symbol,
            quantity: parsedQuantity,
            price: parsedPrice,
            order_type: order_type.toUpperCase(),
            status: "PENDING",
            filled_quantity: 0
        };

        // Save to database
        const order = await createOrder(orderData);

        // Push order to market service order book & trigger matching (fire-and-forget)
        try {
            if (order.order_type === 'BUY') {
                await addBuyOrderToBook(order);
            } else {
                await addSellOrderToBook(order);
            }
            await triggerMatchingEngine(symbol);
            console.log(`Order ${order.id} pushed to market service order book`);
        } catch (marketError) {
            console.error(`Failed to push order ${order.id} to market service:`, marketError.message);
            // Don't fail the order creation — market service may be temporarily unavailable
        }

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });

    } catch (error) {
        console.error("Create order controller error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Failed to create order",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await getOrders();
        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error("Get all orders controller error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch orders"
        });
    }
};

export const getOrderByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Order ID is required"
            });
        }

        const order = await getOrderById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error("Get order by ID controller error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch order"
        });
    }
};

export const updateOrderStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Order ID is required"
            });
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                error: "Status is required"
            });
        }

        const validStatuses = ["PENDING", "PARTIAL", "FILLED", "CANCELLED", "REJECTED"];
        if (!validStatuses.includes(status.toUpperCase())) {
            return res.status(400).json({
                success: false,
                error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
            });
        }

        const updatedOrder = await updateOrderStatus(id, status.toUpperCase());

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                error: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: updatedOrder
        });
    } catch (error) {
        console.error("Update order status controller error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Failed to update order status"
        });
    }
};

export const getOrdersBySymbolController = async (req, res) => {
    try {
        const { symbol } = req.params;

        if (!symbol) {
            return res.status(400).json({
                success: false,
                error: "Symbol is required"
            });
        }

        const orders = await getOrdersBySymbol(symbol);

        return res.status(200).json({
            success: true,
            symbol,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error("Get orders by symbol controller error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch orders for symbol"
        });
    }
};

export const updateOrderController = async (req, res) => {
    try {
        const { id } = req.params;
        const orderData = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Order ID is required"
            });
        }

        if (!orderData || Object.keys(orderData).length === 0) {
            return res.status(400).json({
                success: false,
                error: "No update data provided"
            });
        }

        // Check if order exists
        const existingOrder = await getOrderById(id);
        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                error: "Order not found"
            });
        }

        // Prevent updating filled or cancelled orders
        if (["FILLED", "CANCELLED"].includes(existingOrder.status)) {
            return res.status(400).json({
                success: false,
                error: `Cannot update order with status: ${existingOrder.status}`
            });
        }

        const updatedOrder = await updateOrder(id, orderData);

        return res.status(200).json({
            success: true,
            message: "Order updated successfully",
            data: updatedOrder
        });
    } catch (error) {
        console.error("Update order controller error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Failed to update order"
        });
    }
};

export const deleteOrderController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Order ID is required"
            });
        }

        // Check if order exists
        const order = await getOrderById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: "Order not found"
            });
        }

        // Prevent deletion of filled orders
        if (order.status === "FILLED") {
            return res.status(400).json({
                success: false,
                error: "Cannot delete filled order"
            });
        }

        const deleted = await deleteOrder(id);

        if (!deleted) {
            return res.status(500).json({
                success: false,
                error: "Failed to delete order"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully",
            data: order
        });
    } catch (error) {
        console.error("Delete order controller error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Failed to delete order"
        });
    }
};

export const getOrdersByUserIdController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, symbol } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required"
            });
        }

        // Get all orders for user
        let orders = await getOrdersByUserId(userId);

        // Apply filters if provided
        if (status) {
            orders = orders.filter(order => order.status === status.toUpperCase());
        }

        if (symbol) {
            orders = orders.filter(order => order.symbol === symbol.toUpperCase());
        }

        return res.status(200).json({
            success: true,
            userId,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error("Get orders by user ID controller error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch user orders"
        });
    }
};

export const getPendingOrdersController = async (req, res) => {
    try {
        const pendingOrders = await getPendingOrders();

        return res.status(200).json({
            success: true,
            count: pendingOrders.length,
            data: pendingOrders
        });
    } catch (error) {
        console.error("Get pending orders controller error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch pending orders"
        });
    }
};

export const healthCheckController = async (req, res) => {
    try {
        // Test database connection
        await getOrders();

        return res.status(200).json({
            success: true,
            status: "healthy",
            service: "order-service",
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    } catch (error) {
        console.error("Health check controller error:", error.message);
        return res.status(503).json({
            success: false,
            status: "unhealthy",
            service: "order-service",
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
};

export const cancelOrderController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Order ID is required"
            });
        }

        const order = await getOrderById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: "Order not found"
            });
        }

        // Check if order can be cancelled
        if (["FILLED", "CANCELLED"].includes(order.status)) {
            return res.status(400).json({
                success: false,
                error: `Cannot cancel order with status: ${order.status}`
            });
        }

        const cancelledOrder = await updateOrderStatus(id, "CANCELLED");

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: cancelledOrder
        });
    } catch (error) {
        console.error("Cancel order controller error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Failed to cancel order"
        });
    }
};