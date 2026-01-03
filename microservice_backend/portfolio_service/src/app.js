import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import { router as portfolioRoutes } from "./routes/portfolio.routes.js";

app.use('/portfolios', portfolioRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "portfolio_service" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
