import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 2003;

import { router as marketRoutes } from "./routes/market.routes.js";
import { hydrateOrderBook } from "./services/hydration.js";

import { requestContext } from "../../shared/logger/requestContext.js";
import { requestLogger } from "../../shared/middleware/logger.middleware.js";

app.use(express.json());
app.use(requestContext);
app.use(requestLogger);
app.use('/market', marketRoutes);
import { errorHandler } from "../../shared/middleware/error.middleware.js";
app.use(errorHandler);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "market_service" });
});

const startServer = async () => {
    try {
        await hydrateOrderBook();
        app.listen(PORT, () => {
            console.log(`Market Service running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start market service:", error);
        process.exit(1);
    }
};

startServer();

export default app;