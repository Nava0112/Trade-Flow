import axios from 'axios';

const portfolioClient = axios.create({
    baseURL: process.env.PORTFOLIO_SERVICE_URL || 'http://localhost:2008',
    timeout: 5000
});

export const deletePortfolio = async (id) => {
    try {
        const response = await portfolioClient.delete(`/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to delete portfolio: ${error.message}`);
    }
}