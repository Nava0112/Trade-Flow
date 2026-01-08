import db from '../db/knex.js';

export const getOrders = async () => {
    return await db('orders').select('*');
};

export const getOrderById = async (id) => {
    return await db('orders').where({ id }).first();
}

export const createOrder = async (order) => {
    const newOrder = {
        user_id: order.user_id,
        symbol: order.symbol,
        quantity: order.quantity,
        price: order.price,
        order_type: order.order_type,
        status: order.status
    };
    const [createdOrder] = await db('orders').insert(newOrder).returning('*');
    return createdOrder;
}

export const updateOrderStatus = async (id, status) => {
    const [updatedOrderStatus] = await db('orders').where({ id }).update({ status }).returning('*');
    return updatedOrderStatus;
}

export const deleteOrder = async (id) => {
    return await db('orders').where({ id }).del();
}

export const getPendingOrders = async () => {
    return await db('orders').where({ status: 'PENDING' })
        .groupBy('symbol')
        .count('id as count');
}

export const getOrdersByUserId = async (user_id) => {
    return await db('orders').where({ user_id });
};

export const getOrdersBySymbol = async (symbol) => {
    return await db('orders').where({ symbol });
};

export const getOrdersByUserIdAndSymbol = async (user_id, symbol) => {
    return await db('orders').where({ user_id, symbol });
};

export const updateOrder = async (id, order) => {
    const payload = {
        user_id: order.user_id,
        symbol: order.symbol,
        quantity: order.quantity,
        price: order.price,
        order_type: order.order_type,
        status: order.status,
        filled_quantity: order.filled_quantity,
        filled_at: order.filled_at
    };
    const [updatedOrder] = await db('orders').where({ id }).update(payload).returning('*');
    return updatedOrder;
}