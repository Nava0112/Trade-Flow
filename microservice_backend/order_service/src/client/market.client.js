import axios from 'axios';

const marketClient = axios.create({
    baseURL: process.env.MARKET_SERVICE_URL || 'http://localhost:2003',
    timeout: 5000
});

export const addBuyOrderToBook = async (order) => {
    try {
        const response = await marketClient.post('/market/order-book/buy', order);
        return response.data;
    } catch (error) {
        console.error('Failed to add buy order to market:', error.message);
        // Don't throw - market service failure shouldn't block order creation
    }
};

export const addSellOrderToBook = async (order) => {
    try {
        const response = await marketClient.post('/market/order-book/sell', order);
        return response.data;
    } catch (error) {
        console.error('Failed to add sell order to market:', error.message);
    }
};

export const triggerMatchingEngine = async (symbol) => {
    try {
        const response = await marketClient.post('/market/matching-engine/trigger', { symbol });
        return response.data;
    } catch (error) {
        console.error('Failed to trigger matching engine:', error.message);
    }
};
