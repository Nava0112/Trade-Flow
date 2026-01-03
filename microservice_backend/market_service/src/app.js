import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

import { router as marketRoutes } from "./routes/market.routes.js";
import { hydrateOrderBook } from "./services/hydration.js";

app.use(express.json());
app.use('/market', marketRoutes);

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