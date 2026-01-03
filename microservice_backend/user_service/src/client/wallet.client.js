import axios from "axios";

export const createWallet = async (userId, initialBalance) => {
    try {
        const response = await axios.post("/wallets", {
            user_id: userId,
            initial_balance: initialBalance
        });

        return {
            success: true,
            data: response.data,
            status: response.status
        };

    } catch (error) {
        return {
            success: false,
            status: error.response?.status || 500,
            error: error.response?.data?.error || "WALLET_SERVICE_ERROR"
        };
    }
};
