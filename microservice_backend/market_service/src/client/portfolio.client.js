import axios from 'axios';

const portfolioClient = axios.create({
    baseURL: process.env.PORTFOLIO_SERVICE_URL ? `${process.env.PORTFOLIO_SERVICE_URL}/portfolio` : 'http://localhost:2005/portfolio',
    timeout: 10000,
    headers: {
        'x-user-id': 'market-service-system',
        'x-user-role': 'admin'
    }
});

export const updatePortfolioForBuy = async (userId, symbol, quantity, price) => {
    try {
        const response = await portfolioClient.post('/buy', {
            user_id: userId,
            symbol,
            quantity,
            price
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to update portfolio for buy: ${error.message}`);
    }
};

export const updatePortfolioForSell = async (userId, symbol, quantity, price) => {
    try {
        const response = await portfolioClient.post('/sell', {
            user_id: userId,
            symbol,
            quantity,
            price
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to update portfolio for sell: ${error.message}`);
    }
};

export const getPortfolioByUserIdAndSymbol = async (userId, symbol) => {
    try {
        const response = await portfolioClient.get(`/user/${userId}/symbol/${symbol}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get portfolio: ${error.message}`);
    }
};

export const lockStockQuantity = async (userId, symbol, quantity) => {
    try {
        const response = await portfolioClient.post('/lock', {
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
        const response = await portfolioClient.post('/unlock', {
            user_id: userId,
            symbol,
            quantity
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to unlock stock quantity: ${error.message}`);
    }
};
