export const services = {
    auth : {
        host : "http://localhost:2002",
        routes : {
            signup : "/signup",
            login : "/login",
            logout : "/logout",
            refreshToken : "/refresh-token"
        }
    },
    market : {
        host : "http://localhost:2003",
        routes : {
            getStocks : "/stocks",
            getStock : "/stock/:id",
            createStock : "/stock",
            updateStock : "/stock/:id",
            deleteStock : "/stock/:id"
        }
    },
    order : {
        host : "http://localhost:2004",
        routes : {
            getAllOrders : "/orders",
            getOrderById : "/order/:id",
            getOrdersBySymbol : "/order/symbol/:symbol",
            createOrder : "/order",
            updateOrder : "/order/:id",
            deleteOrder : "/order/:id"
        }
    },
    portfolio : {
        host : "http://localhost:2005",
        routes : {
            getPortfolios : "/portfolios",
            getPortfolio : "/portfolio/:id",
            createPortfolio : "/portfolio",
            updatePortfolio : "/portfolio/:id",
            deletePortfolio : "/portfolio/:id"
        }
    },
    stock : {
        host : "http://localhost:2006",
        routes : {
            getStocks : "/stocks",
            getStock : "/stock/:id",
            createStock : "/stock",
            updateStock : "/stock/:id",
            deleteStock : "/stock/:id"
        }
    },
    user : {
        host : "http://localhost:2007",
        routes : {
            getUserByEmail : "/user/email/:email",
            getAllUsers : "/users",
            createUser : "/user",
            updateUser : "/user/:id",
            updateUserPassword : "/user/:id/password",
            deleteUser : "/user/:id"
        }
    },
    wallet : {
        host : "http://localhost:2008",
        routes : {
            getWallet : "/wallet/:id",
            getWallets : "/wallets",
            createWallet : "/wallet",
            updateWallet : "/wallet/:id",
            deleteWallet : "/wallet/:id",
            createdeposit : "/deposit/:id",
            confirmdeposit : "/deposit/confirm/:transactionId",
            createTransaction : "/transaction",
            getTransactions : "/transactions",
            getTransactionById : "/transaction/:id",
            getTransactionsByTransactionId : "/transaction/transaction/:transactionId",
            updateTransaction : "/transaction/:id",
            deleteTransaction : "/transaction/:id"
        }
    }    
}