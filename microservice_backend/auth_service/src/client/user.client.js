import axios from "axios";

const userClient = axios.create({
    baseURL: "http://localhost:2000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

export const createUser = async (user) => {
    try {
        const response = await userClient.post("/users", user);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const getUserByEmail = async (email) => {
    try {
        const response = await userClient.get(`/users/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error getting user by email:", error);
        throw error;
    }
};