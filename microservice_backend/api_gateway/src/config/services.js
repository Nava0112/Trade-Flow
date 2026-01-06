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
            getOrderBook: "/order-book",
            addBuyOrder: "/order-book/buy",
            addSellOrder: "/order-book/sell",
            triggerMatching: "/matching-engine/trigger"
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
            updateOrderStatus: "/:id/status"
        }
    },
    portfolio: {
        host: "http://localhost:2005",
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
        host: "http://localhost:2006",
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
        host: "http://localhost:2007",
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
        host: "http://localhost:2008",
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
        host: "http://localhost:2008",
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