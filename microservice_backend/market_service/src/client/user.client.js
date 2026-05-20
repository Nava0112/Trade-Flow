import axios from 'axios';
import bcrypt from 'bcrypt';

const userClient = axios.create({
    baseURL: process.env.USER_SERVICE_URL ? `${process.env.USER_SERVICE_URL}/users` : 'http://localhost:2007/users',
    timeout: 5000,
    headers: {
        'x-user-id': 'market-service-system',
        'x-user-role': 'admin',
        'x-internal-secret': process.env.INTERNAL_SERVICE_SECRET || ''
    }
});

export const createBotUser = async (botData) => {
    try {
        const response = await userClient.post('/', botData);
        if (response.data.success) {
            return [response.data.data];
        }
        throw new Error('User service did not return success');
    } catch (error) {
        throw new Error(`Failed to create bot user: ${error.message}`);
    }
}

export const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
}

export const getUserByEmail = async (email) => {
    try {
        const response = await userClient.get(`/email/${email}`);
        return response.data;
    } catch (error) {
        // If 404, return null? 
        if (error.response && error.response.status === 404) {
            return null;
        }
        throw new Error(`Failed to get user by email: ${error.message}`);
    }
};
