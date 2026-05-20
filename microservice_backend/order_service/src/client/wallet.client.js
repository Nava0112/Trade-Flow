import axios from 'axios';

const walletClient = axios.create({
    baseURL: process.env.WALLET_SERVICE_URL || 'http://localhost:2008',
    timeout: 10000,
    headers: {
        'x-user-id': 'order-service-system',
        'x-user-role': 'admin',
        'x-internal-secret': process.env.INTERNAL_SERVICE_SECRET || ''
    }
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
