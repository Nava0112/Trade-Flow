// client/user.client.js
import axios from 'axios';

const userClient = axios.create({
    baseURL: process.env.USER_SERVICE_URL || 'http://localhost:3005',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'x-service-name': 'order-service'
    }
});

export const getUserById = async (userId) => {
    try {
        const response = await userClient.get(`/users/${userId}`);
        return response.data.data || response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error("Get user by ID client error:", error.message);
        throw error;
    }
};

export const getUserByEmail = async (email) => {
    try {
        const response = await userClient.get(`/users/email/${email}`);
        return response.data.data || response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error("Get user by email client error:", error.message);
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await userClient.post('/users', userData);
        return response.data.data || response.data;
    } catch (error) {
        console.error("Create user client error:", error.message);
        throw error;
    }
};

export const updateUser = async (userId, updates) => {
    try {
        const response = await userClient.put(`/users/${userId}`, updates);
        return response.data.data || response.data;
    } catch (error) {
        console.error("Update user client error:", error.message);
        throw error;
    }
};

export const healthCheck = async () => {
    try {
        const response = await userClient.get('/health');
        return {
            healthy: response.status === 200,
            service: 'user-service',
            data: response.data
        };
    } catch (error) {
        return {
            healthy: false,
            service: 'user-service',
            error: error.message
        };
    }
};