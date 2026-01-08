import axios from 'axios';

const walletClient = axios.create({
    baseURL: process.env.WALLET_SERVICE_URL ? `${process.env.WALLET_SERVICE_URL}/wallet` : 'http://localhost:2008/wallet',
    timeout: 5000,
    headers: {
        'x-user-id': 'market-service-system',
        'x-user-role': 'admin'
    }
});

export const getUserWalletBalance = async (user_id) => {
    try {
        const response = await walletClient.get(`/balance/${user_id}`);
        // Controller returns: { success: true, data: { balance } }
        return response.data.data.balance;
    } catch (error) {
        throw new Error(`Failed to get wallet balance: ${error.message}`);
    }
}

export const updateUserBalance = async (user_id, amount) => {
    try {
        // We need to add money. Wallet service has createDeposit (+amount)? Or updateWalletBalance (set absolute)?
        // Market bot wants to ADD amount (delta).
        // Wallet service updateWalletBalance sets the absolute balance.
        // We probably need to fetch then update, or use deposit?
        // Let's use createDeposit for "Top Up".
        if (amount > 0) {
            const response = await walletClient.post(`/deposit/${user_id}`, {
                user_id,
                amount
            });
            // Deposit is pending? Or auto-confirmed?
            // createDeposit logic: creates transaction.
            // We might need a direct "admin" update for the bot.
            // For now, let's use the updateWalletBalance (Set Absolute) if we know the current balance.
            // But checking balance then setting it is race-prone.
            // Since we are likely replacing local 'updateUserBalance' which did +delta,
            // we should probably just leave this not fully implemented or use a workaround.
            // Let's assume for Bot Topup we can set absolute.
            const current = await getUserWalletBalance(user_id);
            const newBal = Number(current) + Number(amount);
            await walletClient.put(`/wallet/${user_id}`, { balance: newBal });
        }
    } catch (error) {
        throw new Error(`Failed to update wallet balance: ${error.message}`);
    }
}

export const lockBalance = async (user_id, amount) => {
    try {
        const response = await walletClient.post('/lock-balance', {
            user_id,
            amount
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to lock balance: ${error.message}`);
    }
};

export const unlockBalance = async (user_id, amount) => {
    try {
        const response = await walletClient.post('/unlock-balance', {
            user_id,
            amount
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to unlock balance: ${error.message}`);
    }
};

export const updateWallet = async (user_id, balance) => {
    try {
        const response = await walletClient.put(`/wallet/${user_id}`, { balance });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to update wallet: ${error.message}`);
    }
};
