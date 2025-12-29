import express from "express";
import dotenv from "dotenv";
import { requestLogger } from "../middleware/logger.middleware.js";
import { rateLimitMiddleware } from "../middleware/rateLimit.middleware.js";
import { requestContext } from "../../shared/logger/requestContext.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(rateLimitMiddleware);
app.use(requestContext);
app.use(requestLogger);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 