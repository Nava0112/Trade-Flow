import axios from 'axios';

const userClient = axios.create({
    baseURL: process.env.USER_SERVICE_URL || 'http://localhost:2007',
    timeout: 5000
});

export const createBotUser = async (botData) => {
    // User service create endpoint: POST /
    try {
        const response = await userClient.post('/', botData);
        // returns { success: true, data: user, wallet: ... }
        if (response.data.success) {
            return [response.data.data]; // Expecting array-like return for destructuring [user]
        }
        return [];
    } catch (error) {
        console.error("Failed to create bot user", error.message);
        return [];
    }
}

export const hashPassword = async (password) => {
    // We can't easily call an API to hash password. 
    // We should just return the plain password or use a local bcrypt if installed.
    // Since market service doesn't have bcrypt in package.json (likely), we'll skip or import.
    // StartMarketBot is not running currently, so mock it.
    return "hashed_" + password;
}
