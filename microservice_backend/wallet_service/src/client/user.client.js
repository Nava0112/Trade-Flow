import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const userClient = axios.create({
    baseURL: process.env.USER_SERVICE,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

export const getUserByTransactionId = async (transactionId) => {
    try {
        const response = await userClient.get(`/transactions/${transactionId}`);
        return response.data;
    } catch (error) {
        console.error("Error getting user by transaction ID:", error);
        return null;
    }
};

export const getUserById = async (id) => {
    try {
        const response = await userClient.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error getting user by ID:", error);
        return null;
    }
};

export const getUserWalletBalance = async (id) => {
    try {
        const response = await userClient.get(`/users/${id}/wallet`);
        return response.data;
    } catch (error) {
        console.error("Error getting user wallet balance:", error);
        return null;
    }
};