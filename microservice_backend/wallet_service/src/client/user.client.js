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
        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        console.error("Error getting user by transaction ID:", error);
        return {
            success: false,
            error: error.message
        }
    }
};

export const getUserById = async (id) => {
    try {
        const response = await userClient.get(`/users/${id}`);
        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        console.error("Error getting user by ID:", error);
        return {
            success: false,
            error: error.message
        }
    }
};
