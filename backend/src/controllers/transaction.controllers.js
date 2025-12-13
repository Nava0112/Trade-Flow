import {
    getTransactions,
    getTransactionById,
    createTransaction,
    getTransactionsByUserId,
    getTransactionsBySymbol,
    getTransactionsByUserIdAndSymbol,
    deleteTransaction,
    getTransactionsInDateRange,
    getTransactionsByType
} from '../models/transaction.models.js';

export const createTransactionController = async (req, res) => {
    const transactionData = req.body;
    try {
        if (!transactionData.user_id || !transactionData.symbol || 
            !transactionData.quantity || !transactionData.price_per_share || 
            !transactionData.type || !transactionData.order_id) {
            return res.status(400).json({ 
                error: "Missing required fields" 
            });
        }

        const validTypes = ['BUY', 'SELL'];
        if (!validTypes.includes(transactionData.type)) {
            return res.status(400).json({ 
                error: "Invalid transaction type" 
            });
        }

        if (transactionData.quantity <= 0 || transactionData.price_per_share <= 0) {
            return res.status(400).json({ 
                error: "Invalid quantity or price" 
            });
        }

        const newTransaction = {
            user_id: transactionData.user_id,
            order_id: transactionData.order_id,
            type: transactionData.type,
            symbol: transactionData.symbol,
            quantity: transactionData.quantity,
            price_per_share: transactionData.price_per_share,
            total_amount: transactionData.quantity * transactionData.price_per_share
        };

        const createdTransaction = await createTransaction(newTransaction);
        res.status(201).json({
            success: true,
            data: createdTransaction
        });
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

export const getAllTransactionsController = async (req, res) => {
    try {
        const transactions = await getTransactions();
        res.status(200).json({
            success: true,
            data: transactions,
            count: transactions.length
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

export const getTransactionByIdController = async (req, res) => {
    const id = req.params.id;
    try {
        const transaction = await getTransactionById(id);
        if (transaction) {
            res.status(200).json({
                success: true,
                data: transaction
            });
        } else {
            res.status(404).json({ 
                error: "Transaction not found" 
            });
        }
    } catch (error) {
        console.error("Error fetching transaction by ID:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

export const getTransactionsByUserIdController = async (req, res) => {
    const user_id = req.params.userId;
    try {
        const transactions = await getTransactionsByUserId(user_id);
        res.status(200).json({
            success: true,
            data: transactions,
            count: transactions.length
        });
    } catch (error) {
        console.error("Error fetching transactions by user ID:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

export const getTransactionsBySymbolController = async (req, res) => {
    const symbol = req.params.symbol;
    try {
        const transactions = await getTransactionsBySymbol(symbol);
        res.status(200).json({
            success: true,
            data: transactions,
            count: transactions.length
        });
    } catch (error) {
        console.error("Error fetching transactions by symbol:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

export const getTransactionsByUserIdAndSymbolController = async (req, res) => {
    const user_id = req.params.userId;
    const symbol = req.params.symbol;
    try {
        const transactions = await getTransactionsByUserIdAndSymbol(user_id, symbol);
        res.status(200).json({
            success: true,
            data: transactions,
            count: transactions.length
        });
    } catch (error) {
        console.error("Error fetching transactions by user ID and symbol:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

export const deleteTransactionController = async (req, res) => {
    const id = req.params.id;
    try {
        const transaction = await getTransactionById(id);
        if (!transaction) {
            return res.status(404).json({ 
                error: "Transaction not found" 
            });
        }

        const deletedCount = await deleteTransaction(id);
        if (deletedCount) {
            res.status(200).json({
                success: true,
                message: "Transaction deleted"
            });
        } else {
            res.status(404).json({ 
                error: "Transaction not found" 
            });
        }
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

export const getTransactionsInDateRangeController = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        if (!startDate || !endDate) {
            return res.status(400).json({ 
                error: "Both startDate and endDate are required" 
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ 
                error: "Invalid date format" 
            });
        }

        if (start > end) {
            return res.status(400).json({ 
                error: "startDate must be before endDate" 
            });
        }

        const transactions = await getTransactionsInDateRange(startDate, endDate);
        res.status(200).json({
            success: true,
            data: transactions,
            count: transactions.length
        });
    } catch (error) {
        console.error("Error fetching transactions in date range:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

export const getTransactionsByTypeController = async (req, res) => {
    const type = req.params.type;
    try {
        const validTypes = ['BUY', 'SELL'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ 
                error: "Invalid transaction type" 
            });
        }

        const transactions = await getTransactionsByType(type);
        res.status(200).json({
            success: true,
            data: transactions,
            count: transactions.length
        });
    } catch (error) {
        console.error("Error fetching transactions by type:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

export const getTransactionsByOrderIdController = async (req, res) => {
    const order_id = req.params.orderId;
    try {
        const transactions = await db('transactions').where({ order_id });
        res.status(200).json({
            success: true,
            data: transactions,
            count: transactions.length
        });
    } catch (error) {
        console.error("Error fetching transactions by order ID:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};

export const getUserPortfolioSummaryController = async (req, res) => {
    const user_id = req.params.userId;
    try {
        const transactions = await getTransactionsByUserId(user_id);
        
        const portfolio = {};
        
        transactions.forEach(transaction => {
            const { symbol, quantity, price_per_share, type } = transaction;
            
            if (!portfolio[symbol]) {
                portfolio[symbol] = {
                    symbol: symbol,
                    totalQuantity: 0,
                    avgBuyPrice: 0,
                    totalInvested: 0,
                    currentValue: 0
                };
            }
            
            if (type === 'BUY') {
                portfolio[symbol].totalQuantity += quantity;
                portfolio[symbol].totalInvested += quantity * price_per_share;
                portfolio[symbol].avgBuyPrice = portfolio[symbol].totalInvested / portfolio[symbol].totalQuantity;
            } else if (type === 'SELL') {
                portfolio[symbol].totalQuantity -= quantity;
                if (portfolio[symbol].totalQuantity <= 0) {
                    delete portfolio[symbol];
                }
            }
        });
        
        const activePortfolio = Object.values(portfolio).filter(stock => stock.totalQuantity > 0);
        
        res.status(200).json({
            success: true,
            data: {
                userId: user_id,
                portfolio: activePortfolio,
                totalStocks: activePortfolio.length
            }
        });
    } catch (error) {
        console.error("Error generating portfolio summary:", error);
        res.status(500).json({ 
            error: "Internal server error" 
        });
    }
};