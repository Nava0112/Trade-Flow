const env = process.env.NODE_ENV || 'development';

const services = {
    auth: {
        host: env === 'development' ? "http://localhost:2002" : process.env.AUTH_SERVICE,
        mountPoint: "/auth",
        routes: {
            signup: "/signup",
            login: "/login",
            logout: "/logout",
            refreshToken: "/refresh-token"
        }
    },
    market: {
        host: env === 'development' ? "http://localhost:2003" : process.env.MARKET_SERVICE,
        mountPoint: "/market",
        routes: {
            getOrderBook: "/order-book",
            addBuyOrder: "/order-book/buy",
            addSellOrder: "/order-book/sell",
            triggerMatching: "/matching-engine/trigger"
        }
    },
    order: {
        host: env === 'development' ? "http://localhost:2004" : process.env.ORDER_SERVICE,
        mountPoint: "/orders",
        routes: {
            getAllOrders: "/",
            getOrderById: "/:id",
            getOrdersBySymbol: "/symbol/:symbol",
            createOrder: "/",
            updateOrderStatus: "/:id/status",
            updateOrder: "/:id",
            deleteOrder: "/:id"
        }
    },
    portfolio: {
        host: env === 'development' ? "http://localhost:2005" : process.env.PORTFOLIO_SERVICE,
        mountPoint: "/portfolio",
        routes: {
            getAllPortfolios: "/",
            getPortfolioById: "/:id",
            getPortfolioByUserId: "/user/:user_id",
            getPortfolioByUserIdAndSymbol: "/user/:user_id/symbol/:symbol",
            getPortfolioBySymbol: "/symbol/:symbol",
            buyStock: "/buy",
            sellStock: "/sell",
            lockStock: "/lock",
            unlockStock: "/unlock",
            deletePortfolio: "/user/:user_id/symbol/:symbol"
        }
    },
    stock: {
        host: env === 'development' ? "http://localhost:2006" : process.env.STOCK_SERVICE,
        mountPoint: "/stocks",
        routes: {
            getAllStocks: "/",
            getStockBySymbol: "/symbol/:symbol",
            getStockByPriceRange: "/price/:min/:max",
            createStock: "/",
            updateStock: "/:symbol",
            deleteStock: "/:symbol",
            updateStockPrice: "/:symbol/price"
        }
    },
    user: {
        host: env === 'development' ? "http://localhost:2007" : process.env.USER_SERVICE,
        mountPoint: "/users",
        routes: {
            getUserByEmail: "/email/:email",
            getAllUsers: "/",
            createUser: "/",
            updateUser: "/:id",
            updateUserPassword: "/:id/password",
            deleteUser: "/:id",
            getUserById: "/:id"
        }
    },
    wallet: {
        host: env === 'development' ? "http://localhost:2008" : process.env.WALLET_SERVICE,
        mountPoint: "/wallet",
        routes: {
            getWalletById: "/wallet/:id",
            getWalletByUserId: "/wallet/user/:id",
            getWallets: "/wallets",
            getUserWalletBalance: "/balance/:id",
            createWallet: "/wallet",
            updateWallet: "/wallet/:id",
            deleteWallet: "/wallet/:id",
            createDeposit: "/deposit/:id",
            confirmDeposit: "/deposit/confirm/:transactionId",
            lockBalance: "/lock-balance",
            unlockBalance: "/unlock-balance"
        }
    },
    transaction: {
        host: env === 'development' ? "http://localhost:2008" : process.env.TRANSACTION_SERVICE,
        mountPoint: "/transaction",
        routes: {
            getTransactions: "/",
            getUserTransactions: "/user/:userId",
            getTransactionById: "/:Transactionid",
            deleteTransaction: "/:Transactionid"
        }
    }
}

export default services;