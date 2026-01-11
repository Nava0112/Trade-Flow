import axios from 'axios';

const portfolioClient = axios.create({
    baseURL: process.env.PORTFOLIO_SERVICE_URL || 'http://localhost:2005',
    timeout: 5000
});

export const lockStockQuantity = async (userId, symbol, quantity) => {
    try {
        const response = await portfolioClient.post('/portfolio/lock', {
            user_id: userId,
            symbol,
            quantity
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to lock stock quantity: ${error.message}`);
    }
};

export const unlockStockQuantity = async (userId, symbol, quantity) => {
    try {
        const response = await portfolioClient.post('/portfolio/unlock', {
            user_id: userId,
            symbol,
            quantity
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to unlock stock quantity: ${error.message}`);
    }
};

export const updatePortfolioForBuy = async (userId, symbol, quantity, price) => {
    try {
        const response = await portfolioClient.post('/portfolio/buy', {
            user_id: userId,
            symbol,
            quantity,
            pricePerUnit: price
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to update portfolio for buy: ${error.message}`);
    }
};

export const updatePortfolioForSell = async (userId, symbol, quantity) => {
    try {
        const response = await portfolioClient.post('/portfolio/sell', {
            user_id: userId,
            symbol,
            quantity
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to update portfolio for sell: ${error.message}`);
    }
};
