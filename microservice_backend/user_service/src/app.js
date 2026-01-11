import express from "express";
import dotenv from "dotenv";
import { router } from "./routes/user.routes.js";
import { requestContext, errorHandler, requestLogger } from "@trade-flow/shared";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 2007;
app.use(express.json());
app.use(requestContext);
app.use(requestLogger);
app.use('/users', router);
app.use(errorHandler);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "user_service" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
