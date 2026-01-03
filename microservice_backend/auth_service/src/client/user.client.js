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

export const createUser = async (user) => {
    try {
        const response = await userClient.post("/users", user);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error creating user:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const getUserByEmail = async (email) => {
    try {
        const response = await userClient.get(`/users/email/${email}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error getting user by email:", error);
        return {
            success: false,
            error: error.message
        };
    }
};