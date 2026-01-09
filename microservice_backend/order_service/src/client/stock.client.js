import axios from 'axios';

const stockClient = axios.create({
    baseURL: process.env.STOCK_SERVICE_URL || 'http://localhost:2006',
    timeout: 5000
});

export const getStockBySymbol = async (symbol) => {
    try {
        const response = await stockClient.get(`/stocks/symbol/${symbol}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get stock: ${error.message}`);
    }
};
