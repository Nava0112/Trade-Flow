const services = {
    auth: {
        host: "http://localhost:2002",
        mountPoint: "/auth",
        routes: {
            signup: "/signup",
            login: "/login",
            logout: "/logout",
            refreshToken: "/refresh-token"
        }
    },
    market: {
        host: "http://localhost:2003",
        mountPoint: "/market",
        routes: {
            getStocks: "/",
            getStock: "/:id",
            createStock: "/",
            updateStock: "/:id",
            deleteStock: "/:id"
        }
    },
    order: {
        host: "http://localhost:2004",
        mountPoint: "/orders",
        routes: {
            getAllOrders: "/",
            getOrderById: "/:id",
            getOrdersBySymbol: "/symbol/:symbol",
            createOrder: "/",
            updateOrder: "/:id",
            updateOrderStatus: "/status/:id",
            deleteOrder: "/:id"
        }
    },
    portfolio: {
        host: "http://localhost:2005",
        mountPoint: "/portfolios",
        routes: {
            getAllPortfolios: "/",
            getPortfolioById: "/:id",
            getPortfolioByUserId: "/user/:id",
            getPortfolioBySymbol: "/symbol/:symbol",
            createPortfolioEntry: "/",
            updatePortfolioEntry: "/:id",
            deletePortfolioEntry: "/:id"
        }
    },
    stock: {
        host: "http://localhost:2006",
        mountPoint: "/stocks",
        routes: {
            getStocks: "/",
            getStockBySymbol: "/symbol/:symbol",
            getStockByPriceRange: "/price/:min/:max",
            createStock: "/",
            updateStock: "/:id",
            deleteStock: "/:id"
        }
    },
    user: {
        host: "http://localhost:2007",
        mountPoint: "/users",
        routes: {
            getUserByEmail: "/email/:email",
            getAllUsers: "/",
            createUser: "/",
            updateUser: "/:id",
            updateUserPassword: "/:id/password",
            deleteUser: "/:id"
        }
    },
    wallet: {
        host: "http://localhost:2008",
        mountPoint: "/wallet",
        routes: {
            getWalletById: "/:id",
            getWalletByUserId: "/user/:id",
            getWallets: "/",
            getUserWalletBalance: "/balance/:id",
            createWallet: "/",
            updateWallet: "/:id",
            deleteWallet: "/:id",
            createdeposit: "/deposit/:id",
            confirmdeposit: "/deposit/confirm/:transactionId"
        }
    },
    transaction: {
        host: "http://localhost:2008",
        mountPoint: "/transaction",
        routes: {
            createTransaction: "/",
            getTransactions: "/",
            getTransactionByUserId: "/user/:id",
            getTransactionsByTransactionId: "/transaction/:transactionId",
            updateTransaction: "/:id",
            deleteTransaction: "/:id"
        }
    }
}

export default services;