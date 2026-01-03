import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const walletClient = axios.create({
    baseURL: process.env.WALLET_SERVICE,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

export const createWallet = async (userId, initialBalance) => {
    try {
        const response = await walletClient.post("/wallets", {
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
