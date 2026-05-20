import axios from 'axios';

const portfolioClient = axios.create({
    baseURL: process.env.PORTFOLIO_SERVICE_URL || 'http://localhost:2005',
    timeout: 5000,
    headers: {
        'x-internal-secret': process.env.INTERNAL_SERVICE_SECRET || '',
        'x-user-id': 'user-service-system',
        'x-user-role': 'admin'
    }
});

export const getPortfoliosByUserId = async (userId) => {
    try {
        const response = await portfolioClient.get(`/portfolio/user/${userId}`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        throw new Error(`Failed to get portfolios: ${error.message}`);
    }
}

export const deletePortfolio = async (userId, symbol) => {
    try {
        const response = await portfolioClient.delete(`/portfolio/user/${userId}/symbol/${symbol}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to delete portfolio: ${error.message}`);
    }
}
