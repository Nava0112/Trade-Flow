// models/order.models.js
import db from '../db/knex.js';

export const getOrders = async (limit = 100, offset = 0) => {
    try {
        return await db('orders')
            .select('*')
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset);
    } catch (error) {
        console.error("Get orders model error:", error.message);
        throw error;
    }
};

export const getOrderById = async (id) => {
    try {
        return await db('orders')
            .where({ id })
            .first();
    } catch (error) {
        console.error("Get order by ID model error:", error.message);
        throw error;
    }
};

export const createOrder = async (order) => {
    try {
        const newOrder = {
            user_id: order.user_id,
            symbol: order.symbol,
            quantity: order.quantity,
            price: order.price,
            order_type: order.order_type,
            status: order.status || 'PENDING',
            filled_quantity: order.filled_quantity || 0,
            created_at: db.fn.now(),
            updated_at: db.fn.now()
        };
        
        const [createdOrder] = await db('orders')
            .insert(newOrder)
            .returning('*');
        
        return createdOrder;
    } catch (error) {
        console.error("Create order model error:", error.message);
        throw error;
    }
};

export const updateOrderStatus = async (id, status) => {
    try {
        const updates = {
            status: status,
            updated_at: db.fn.now()
        };
        
        // If order is filled, set filled_at
        if (status === 'FILLED') {
            updates.filled_at = db.fn.now();
        }
        
        const [updatedOrder] = await db('orders')
            .where({ id })
            .update(updates)
            .returning('*');
        
        return updatedOrder;
    } catch (error) {
        console.error("Update order status model error:", error.message);
        throw error;
    }
};

export const deleteOrder = async (id) => {
    try {
        const result = await db('orders')
            .where({ id })
            .del();
        
        return result > 0;
    } catch (error) {
        console.error("Delete order model error:", error.message);
        throw error;
    }
};

export const getPendingOrders = async () => {
    try {
        return await db('orders')
            .whereIn('status', ['PENDING', 'PARTIAL'])
            .orderBy('created_at', 'asc');
    } catch (error) {
        console.error("Get pending orders model error:", error.message);
        throw error;
    }
};

export const getOrdersByUserId = async (user_id) => {
    try {
        return await db('orders')
            .where({ user_id })
            .orderBy('created_at', 'desc');
    } catch (error) {
        console.error("Get orders by user ID model error:", error.message);
        throw error;
    }
};

export const getOrdersBySymbol = async (symbol) => {
    try {
        return await db('orders')
            .where({ symbol })
            .orderBy('created_at', 'desc');
    } catch (error) {
        console.error("Get orders by symbol model error:", error.message);
        throw error;
    }
};

export const getOrdersByUserIdAndSymbol = async (user_id, symbol) => {
    try {
        return await db('orders')
            .where({ user_id, symbol })
            .orderBy('created_at', 'desc');
    } catch (error) {
        console.error("Get orders by user ID and symbol model error:", error.message);
        throw error;
    }
};

export const updateOrder = async (id, orderData) => {
    try {
        const updates = {
            ...orderData,
            updated_at: db.fn.now()
        };
        
        // Remove fields that shouldn't be updated
        delete updates.id;
        delete updates.created_at;
        
        const [updatedOrder] = await db('orders')
            .where({ id })
            .update(updates)
            .returning('*');
        
        return updatedOrder;
    } catch (error) {
        console.error("Update order model error:", error.message);
        throw error;
    }
};

export const getActiveOrdersBySymbol = async (symbol) => {
    try {
        return await db('orders')
            .where({ 
                symbol,
                status: ['PENDING', 'PARTIAL']
            })
            .orderBy('created_at', 'asc');
    } catch (error) {
        console.error("Get active orders by symbol model error:", error.message);
        throw error;
    }
};

export const getOrdersByStatus = async (status) => {
    try {
        return await db('orders')
            .where({ status })
            .orderBy('created_at', 'desc');
    } catch (error) {
        console.error("Get orders by status model error:", error.message);
        throw error;
    }
};