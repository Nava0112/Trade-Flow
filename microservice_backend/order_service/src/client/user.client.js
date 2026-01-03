import axios from 'axios';

const userClient = axios.create({
    baseURL: process.env.USER_SERVICE_URL || 'http://localhost:2007',
    headers: { 'Content-Type': 'application/json' },
    timeout: 5000
});

export const getUserById = async (id) => {
    try {
        const response = await userClient.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get user: ${error.message}`);
    }
};
