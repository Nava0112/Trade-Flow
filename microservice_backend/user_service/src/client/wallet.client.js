import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const walletClient = axios.create({
    baseURL: process.env.WALLET_SERVICE || "http://localhost:2008",
    headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_SERVICE_SECRET || "",
        "x-user-id": "user-service-system",
        "x-user-role": "admin"
    },
    timeout: 5000,
});

export const createWallet = async (userId, initialBalance) => {
    try {
        const response = await walletClient.post("/wallet/wallet", {
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
