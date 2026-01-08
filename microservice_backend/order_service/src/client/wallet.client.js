import axios from 'axios';

const walletClient = axios.create({
    baseURL: process.env.WALLET_SERVICE_URL || 'http://localhost:2008',
    timeout: 10000  
});

export const lockUserBalance = async (userId, amount) => {
    try {
        const response = await walletClient.post('/wallet/lock-balance', {
            user_id: userId,
            amount
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to lock balance: ${error.message}`);
    }
};

export const unlockUserBalance = async (userId, amount) => {
    try {
        const response = await walletClient.post('/wallet/unlock-balance', {
            user_id: userId,
            amount
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to unlock balance: ${error.message}`);
    }
};
