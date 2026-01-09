import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { router as portfolioRoutes } from "./routes/portfolio.routes.js";
import { requestLogger } from "../../shared/middleware/logger.middleware.js";
import { requestContext } from "../../shared/logger/requestContext.js";
import { errorHandler } from "../../shared/middleware/error.middleware.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 2005;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestContext);
app.use(requestLogger);
app.use('/portfolio', portfolioRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "portfolio_service" });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
