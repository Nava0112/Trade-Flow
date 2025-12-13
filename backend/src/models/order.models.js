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
    const [updatedOrder] = await db('orders').where({ id }).update({ status }).returning('*');
    return updatedOrder;
}

export const deleteOrder = async (id) => {
    return await db('orders').where({ id }).del();
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