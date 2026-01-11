import axios from 'axios';

const orderClient = axios.create({
    baseURL: process.env.ORDER_SERVICE_URL ? `${process.env.ORDER_SERVICE_URL}/orders` : 'http://localhost:2004/orders',
    timeout: 10000,
    headers: {
        'x-user-id': 'market-service-system',
        'x-user-role': 'admin'
    }
});

export const createBuyOrderService = async ({ user_id, symbol, quantity, price }) => {
    try {
        const response = await orderClient.post('/', {
            user_id,
            symbol,
            quantity,
            price,
            order_type: 'BUY'
        });
        return response.data.data || response.data;
    } catch (error) {
        throw new Error(`Failed to create buy order: ${error.message}`);
    }
};

export const createSellOrderService = async ({ user_id, symbol, quantity, price }) => {
    try {
        const response = await orderClient.post('/', {
            user_id,
            symbol,
            quantity,
            price,
            order_type: 'SELL'
        });
        return response.data.data || response.data;
    } catch (error) {
        throw new Error(`Failed to create sell order: ${error.message}`);
    }
};

export const updateOrder = async (id, data) => {
    try {
        const response = await orderClient.put(`/${id}`, { order: data });
        return response.data.data || response.data;
    } catch (error) {
        throw new Error(`Failed to update order: ${error.message}`);
    }
};

export const updateOrderStatus = async (id, status) => {
    try {
        const response = await orderClient.put(`/${id}/status`, { status });
        return response.data.data || response.data;
    } catch (error) {
        throw new Error(`Failed to update order status: ${error.message}`);
    }
};

export const getOrdersBySymbol = async (symbol) => {
    try {
        const response = await orderClient.get(`/symbol/${symbol}`);
        return response.data.data || response.data;
    } catch (error) {
        throw new Error(`Failed to get orders by symbol: ${error.message}`);
    }
};

export const getAllOrders = async () => {
    try {
        const response = await orderClient.get('/');
        return response.data.data || response.data;
    } catch (error) {
        throw new Error(`Failed to get all orders: ${error.message}`);
    }
};
