// utils/circuit.breaker.js
export class CircuitBreaker {
    constructor(serviceName, options = {}) {
        this.serviceName = serviceName;
        this.failureThreshold = options.failureThreshold || 3;
        this.resetTimeout = options.resetTimeout || 30000; // 30 seconds
        this.timeout = options.timeout || 10000; // 10 seconds
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.lastFailureTime = null;
        this.nextAttempt = null;
        this.successCount = 0;
        this.requestCount = 0;
    }

    async execute(fn) {
        this.requestCount++;
        
        // Check if circuit is open
        if (this.state === 'OPEN') {
            if (Date.now() >= this.nextAttempt) {
                this.state = 'HALF_OPEN';
                console.log(`[Circuit Breaker] ${this.serviceName}: Trying half-open state`);
            } else {
                const remainingTime = Math.ceil((this.nextAttempt - Date.now()) / 1000);
                throw new Error(`Service ${this.serviceName} unavailable. Circuit open. Try again in ${remainingTime}s`);
            }
        }

        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Service ${this.serviceName} timeout after ${this.timeout}ms`)), this.timeout);
        });

        try {
            // Race between function and timeout
            const result = await Promise.race([fn(), timeoutPromise]);
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure(error);
            throw error;
        }
    }

    onSuccess() {
        this.failureCount = 0;
        this.successCount++;
        
        if (this.state === 'HALF_OPEN') {
            console.log(`[Circuit Breaker] ${this.serviceName}: Success in half-open state. Closing circuit.`);
            this.state = 'CLOSED';
            this.nextAttempt = null;
        }
    }

    onFailure(error) {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        
        console.warn(`[Circuit Breaker] ${this.serviceName} failure ${this.failureCount}/${this.failureThreshold}:`, error.message);
        
        if (this.state === 'HALF_OPEN' || this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
            this.nextAttempt = Date.now() + this.resetTimeout;
            console.error(`[Circuit Breaker] ${this.serviceName}: Circuit OPEN for ${this.resetTimeout/1000}s`);
            console.error(`[Circuit Breaker] Next attempt at: ${new Date(this.nextAttempt).toLocaleTimeString()}`);
        }
    }

    getStats() {
        const stats = {
            serviceName: this.serviceName,
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
            requestCount: this.requestCount,
            lastFailureTime: this.lastFailureTime ? new Date(this.lastFailureTime).toISOString() : null,
            availability: this.requestCount > 0 ? 
                Math.round((this.successCount / this.requestCount) * 100) + '%' : 'N/A'
        };
        
        if (this.state === 'OPEN' && this.nextAttempt) {
            stats.nextAttempt = new Date(this.nextAttempt).toISOString();
            stats.remainingOpenTime = Math.max(0, this.nextAttempt - Date.now());
        }
        
        return stats;
    }

    reset() {
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.successCount = 0;
        this.requestCount = 0;
        this.lastFailureTime = null;
        this.nextAttempt = null;
        console.log(`[Circuit Breaker] ${this.serviceName}: Circuit reset`);
    }

    isOpen() {
        return this.state === 'OPEN';
    }

    isHalfOpen() {
        return this.state === 'HALF_OPEN';
    }

    isClosed() {
        return this.state === 'CLOSED';
    }
}

// Create circuit breakers for different services
export const circuitBreakers = {
    orderService: new CircuitBreaker('Order Service', {
        failureThreshold: 3,
        resetTimeout: 60000, // 1 minute
        timeout: 15000 // 15 seconds
    }),
    walletService: new CircuitBreaker('Wallet Service', {
        failureThreshold: 3,
        resetTimeout: 60000,
        timeout: 10000
    }),
    portfolioService: new CircuitBreaker('Portfolio Service', {
        failureThreshold: 3,
        resetTimeout: 60000,
        timeout: 10000
    }),
    stockService: new CircuitBreaker('Stock Service', {
        failureThreshold: 3,
        resetTimeout: 60000,
        timeout: 10000
    })
};

// Helper function to get all circuit breaker stats
export const getAllCircuitBreakerStats = () => {
    const stats = {};
    Object.entries(circuitBreakers).forEach(([key, breaker]) => {
        stats[key] = breaker.getStats();
    });
    return stats;
};

export const resetAllCircuitBreakers = () => {
    Object.values(circuitBreakers).forEach(breaker => breaker.reset());
    console.log('[Circuit Breaker] All circuit breakers reset');
};