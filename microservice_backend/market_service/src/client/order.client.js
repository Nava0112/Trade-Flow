import axios from 'axios';

const orderClient = axios.create({
    baseURL: process.env.ORDER_SERVICE_URL || 'http://localhost:2004',
    timeout: 10000
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
        // API returns the order object directly or wrapped? 
        // Controller returns res.status(201).json(order);
        return response.data;
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
        return response.data;
    } catch (error) {
        throw new Error(`Failed to create sell order: ${error.message}`);
    }
};
