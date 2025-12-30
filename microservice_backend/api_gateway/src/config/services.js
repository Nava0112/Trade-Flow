const services = {
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
            getStocks : "/",
            getStock : "/:id",
            createStock : "/",
            updateStock : "/:id",
            deleteStock : "/:id"
        }
    },
    order : {
        host : "http://localhost:2000",
        routes : {
            getAllOrders : "/",
            getOrderById : "/:id",
            getOrdersBySymbol : "/symbol/:symbol",
            createOrder : "/",
            updateOrder : "/:id",
            updateOrderStatus : "/status/:id",
            deleteOrder : "/:id"
        }
    },
    portfolio : {
        host : "http://localhost:2005",
        routes : {
            getAllPortfolios : "/",
            getPortfolioById : "/:id",
            getPortfolioByUserId : "/user/:id",
            getPortfolioBySymbol : "/symbol/:symbol",
            createPortfolioEntry : "/",
            updatePortfolioEntry : "/:id",
            deletePortfolioEntry : "/:id"
        }
    },
    stock : {
        host : "http://localhost:2006",
        routes : {
            getStocks : "/",
            getStockBySymbol : "/symbol/:symbol",
            getStockByPriceRange : "/price/:min/:max",
            createStock : "/",
            updateStock : "/:id",
            deleteStock : "/:id"
        }
    },
    user : {
        host : "http://localhost:2007",
        routes : {
            getUserByEmail : "/email/:email",
            getAllUsers : "/",
            createUser : "/",
            updateUser : "/:id",
            updateUserPassword : "/:id/password",
            deleteUser : "/:id"
        }
    },
    wallet : {
        host : "http://localhost:2008",
        routes : {
            getWalletById : "/:id",
            getWalletByUserId : "/user/:id",
            getWallets : "/",
            createWallet : "/",
            updateWallet : "/:id",
            deleteWallet : "/:id",
            createdeposit : "/deposit/:id",
            confirmdeposit : "/deposit/confirm/:transactionId",
            createTransaction : "/",
            getTransactions : "/",
            getTransactionByUserId : "/user/:id",
            getTransactionsByTransactionId : "/transaction/:transactionId",
            updateTransaction : "/:id",
            deleteTransaction : "/:id"
        }
    }    
}

export default services;