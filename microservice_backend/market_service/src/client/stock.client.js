import axios from 'axios';

const stockClient = axios.create({
    baseURL: process.env.STOCK_SERVICE_URL || 'http://localhost:2006',
    timeout: 5000
});

export const getStocks = async () => {
    try {
        const response = await stockClient.get('/');
        // Controller returns: { success: true, data: users } (wait check stock controller)
        // Stock controller: res.status(200).json({ success: true, data: stocks });
        return response.data.data;
    } catch (error) {
        throw new Error(`Failed to get stocks: ${error.message}`);
    }
}
