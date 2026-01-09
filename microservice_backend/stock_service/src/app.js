import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { router as stockRoutes } from "./routes/stock.routes.js";
import { requestLogger } from "../../shared/middleware/logger.middleware.js";
import { requestContext } from "../../shared/logger/requestContext.js";
import { errorHandler } from "../../shared/middleware/error.middleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2006;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestContext);
app.use(requestLogger);
app.use('/stocks', stockRoutes);
app.use(errorHandler);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "stock_service" });
});

app.listen(PORT, () => {
    console.log(`Stock Service running on http://localhost:${PORT}`);
});

export default app;
