// client/order.client.js
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { circuitBreakers } from '../utils/circuit.breaker.js';

// Generate service token for inter-service communication
const generateServiceToken = () => {
    const payload = {
        id: 0, // System user ID
        email: 'market-service@system.local',
        role: 'admin',
        service: 'market-service'
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', { 
        expiresIn: '24h' 
    });
};

const orderClient = axios.create({
    baseURL: process.env.ORDER_SERVICE_URL ? `${process.env.ORDER_SERVICE_URL}/orders` : 'http://localhost:2004/orders',
    timeout: 10000,
    headers: {
        'x-user-id': 'market-service-system',
        'x-user-role': 'admin',
        'Content-Type': 'application/json'
    }
});

orderClient.interceptors.request.use(
    config => {
        // Generate a fresh JWT for every request (Bug 1 fix)
        config.headers.Authorization = `Bearer ${generateServiceToken()}`;
        console.log(`[Order Client] ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    error => {
        console.error('[Order Client] Request error:', error.message);
        return Promise.reject(error);
    }
);

orderClient.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ECONNREFUSED') {
            console.error('[Order Client] Connection refused - Order service may be down');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('[Order Client] Request timeout - Order service is slow or unresponsive');
        } else if (error.response) {
            console.error(`[Order Client] HTTP ${error.response.status}: ${error.response.statusText}`);
        }
        return Promise.reject(error);
    }
);

export const createBuyOrderService = async ({ user_id, symbol, quantity, price }) => {
    try {
        const response = await circuitBreakers.orderService.execute(async () => {
            return await orderClient.post('/', {
                user_id,
                symbol,
                quantity,
                price,
                order_type: 'BUY'
            });
        });
        
        return response.data.data || response.data;
    } catch (error) {
        if (error.response?.data?.error) {
            throw new Error(`Failed to create buy order: ${error.response.data.error}`);
        }
        throw new Error(`Failed to create buy order: ${error.message}`);
    }
};

export const createSellOrderService = async ({ user_id, symbol, quantity, price }) => {
    try {
        const response = await circuitBreakers.orderService.execute(async () => {
            return await orderClient.post('/', {
                user_id,
                symbol,
                quantity,
                price,
                order_type: 'SELL'
            });
        });
        
        return response.data.data || response.data;
    } catch (error) {
        if (error.response?.data?.error) {
            throw new Error(`Failed to create sell order: ${error.response.data.error}`);
        }
        throw new Error(`Failed to create sell order: ${error.message}`);
    }
};

export const updateOrder = async (id, data) => {
    try {
        const response = await circuitBreakers.orderService.execute(async () => {
            return await orderClient.put(`/${id}`, data);
        });
        
        return response.data.data || response.data;
    } catch (error) {
        if (error.response?.data?.error) {
            throw new Error(`Failed to update order: ${error.response.data.error}`);
        }
        throw new Error(`Failed to update order: ${error.message}`);
    }
};

export const updateOrderStatus = async (id, status) => {
    try {
        const response = await circuitBreakers.orderService.execute(async () => {
            return await orderClient.put(`/${id}/status`, { status });
        });
        
        return response.data.data || response.data;
    } catch (error) {
        if (error.response?.data?.error) {
            throw new Error(`Failed to update order status: ${error.response.data.error}`);
        }
        throw new Error(`Failed to update order status: ${error.message}`);
    }
};

export const getOrdersBySymbol = async (symbol) => {
    try {
        const response = await circuitBreakers.orderService.execute(async () => {
            return await orderClient.get(`/symbol/${symbol}`);
        });
        
        return response.data.data || response.data;
    } catch (error) {
        if (error.response?.data?.error) {
            throw new Error(`Failed to get orders by symbol: ${error.response.data.error}`);
        }
        throw new Error(`Failed to get orders by symbol: ${error.message}`);
    }
};

export const getAllOrders = async () => {
    try {
        const response = await circuitBreakers.orderService.execute(async () => {
            return await orderClient.get('/');
        });
        
        return response.data.data || response.data;
    } catch (error) {
        console.error('[Order Client] getAllOrders failed:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            throw new Error('Order service connection refused. Please ensure the order service is running.');
        } else if (error.code === 'ETIMEDOUT') {
            throw new Error('Order service request timeout. The service may be overloaded.');
        } else if (error.response?.status === 500) {
            throw new Error(`Order service internal error: ${error.response.statusText}`);
        } else if (error.response?.status === 404) {
            throw new Error('Order service endpoint not found. Please check the service URL.');
        }
        
        throw new Error(`Failed to get all orders: ${error.message}`);
    }
};

export const getOrderById = async (id) => {
    try {
        const response = await circuitBreakers.orderService.execute(async () => {
            return await orderClient.get(`/${id}`);
        });
        
        return response.data.data || response.data;
    } catch (error) {
        if (error.response?.data?.error) {
            throw new Error(`Failed to get order by ID: ${error.response.data.error}`);
        }
        throw new Error(`Failed to get order by ID: ${error.message}`);
    }
};

export const cancelOrder = async (id) => {
    try {
        const response = await circuitBreakers.orderService.execute(async () => {
            return await orderClient.delete(`/${id}`);
        });
        
        return response.data.data || response.data;
    } catch (error) {
        if (error.response?.data?.error) {
            throw new Error(`Failed to cancel order: ${error.response.data.error}`);
        }
        throw new Error(`Failed to cancel order: ${error.message}`);
    }
};

export const getPendingOrdersByUser = async (userId) => {
    try {
        const response = await circuitBreakers.orderService.execute(async () => {
            return await orderClient.get(`/user/${userId}/pending`);
        });
        
        return response.data.data || response.data;
    } catch (error) {
        if (error.response?.data?.error) {
            throw new Error(`Failed to get pending orders: ${error.response.data.error}`);
        }
        throw new Error(`Failed to get pending orders: ${error.message}`);
    }
};

export const healthCheck = async () => {
    try {
        const healthClient = axios.create({
            baseURL: process.env.ORDER_SERVICE_URL || 'http://localhost:2004',
            timeout: 5000,
            headers: {
                'x-health-check': 'true'
            }
        });
        
        const response = await healthClient.get('/health');
        return {
            healthy: response.status === 200,
            status: response.status,
            data: response.data
        };
    } catch (error) {
        return {
            healthy: false,
            error: error.message,
            code: error.code
        };
    }
};

// Utility function for order validation
export const validateOrderData = (order) => {
    const errors = [];
    
    if (!order.user_id) errors.push('user_id is required');
    if (!order.symbol) errors.push('symbol is required');
    if (!order.quantity || order.quantity <= 0) errors.push('quantity must be positive');
    if (!order.price || order.price <= 0) errors.push('price must be positive');
    if (!order.order_type || !['BUY', 'SELL'].includes(order.order_type)) {
        errors.push('order_type must be BUY or SELL');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};