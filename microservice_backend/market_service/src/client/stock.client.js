import axios from 'axios';

const stockClient = axios.create({
    baseURL: process.env.STOCK_SERVICE_URL ? `${process.env.STOCK_SERVICE_URL}/stocks` : 'http://localhost:2006/stocks',
    timeout: 5000,
    headers: {
        'x-user-id': 'market-service-system',
        'x-user-role': 'admin'
    }
});

export const getStocks = async () => {
    try {
        const response = await stockClient.get('/');
        // Controller returns: { success: true, count: ..., data: stocks }
        return response.data.data;
    } catch (error) {
        throw new Error(`Failed to get stocks: ${error.message}`);
    }
}

export const getStockBySymbol = async (symbol) => {
    try {
        const response = await stockClient.get(`/symbol/${symbol}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get stock by symbol: ${error.message}`);
    }
};

export const updateStock = async (symbol, data) => {
    try {
        const response = await stockClient.put(`/${symbol}`, data);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to update stock: ${error.message}`);
    }
};
