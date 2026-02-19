import axios from 'axios';

const marketClient = axios.create({
    baseURL: process.env.MARKET_SERVICE_URL || 'http://localhost:2003',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': process.env.INTERNAL_SERVICE_SECRET || ''
    }
});

export const addBuyOrderToBook = async (order) => {
    try {
        const response = await marketClient.post('/market/order-book/buy', order);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to add buy order to market:', error.message);
        return { success: false, error: error.message };
    }
};

export const addSellOrderToBook = async (order) => {
    try {
        const response = await marketClient.post('/market/order-book/sell', order);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Failed to add sell order to market:', error.message);
        return { success: false, error: error.message };
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
