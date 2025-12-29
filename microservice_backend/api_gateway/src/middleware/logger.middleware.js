import { createLogger } from "../../../shared/logger/index.js";

export const requestLogger = (req, res, next) => {
    const logger = createLogger({ serviceName: "API Gateway" });
    const start = Date.now();
    res.on("finish", () => {
        logger.info({
            requestId: req.requestId,
            method: req.method,
            path: req.originalUrl,
            status: res.statusCode,
            durationMs: Date.now() - start
        });
    });

  next();
};
