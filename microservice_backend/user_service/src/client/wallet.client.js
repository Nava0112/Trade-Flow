import axios from "axios";

export const createWallet = async (userId, initialBalance) => {
    try {
        const response = await axios.post(`/wallets`, { user_id: userId, initial_balance: initialBalance });
        return response.data;
    } catch (error) {
        console.error("Error creating wallet:", error);
        return null;
    }
};