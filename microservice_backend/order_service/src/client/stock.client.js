// client/stock.client.js
import axios from 'axios';

const stockClient = axios.create({
    baseURL: process.env.STOCK_SERVICE_URL || 'http://localhost:3001',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'x-service-name': 'order-service'
    }
});

export const getStockBySymbol = async (symbol) => {
    try {
        const response = await stockClient.get(`/stocks/${symbol}`);
        return response.data.data || response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error("Get stock by symbol client error:", error.message);
        throw error;
    }
};

export const getStocks = async () => {
    try {
        const response = await stockClient.get('/stocks');
        return response.data.data || response.data;
    } catch (error) {
        console.error("Get stocks client error:", error.message);
        throw error;
    }
};

export const updateStock = async (symbol, updates) => {
    try {
        const response = await stockClient.put(`/stocks/${symbol}`, updates);
        return response.data.data || response.data;
    } catch (error) {
        console.error("Update stock client error:", error.message);
        throw error;
    }
};

export const healthCheck = async () => {
    try {
        const response = await stockClient.get('/health');
        return {
            healthy: response.status === 200,
            service: 'stock-service',
            data: response.data
        };
    } catch (error) {
        return {
            healthy: false,
            service: 'stock-service',
            error: error.message
        };
    }
};