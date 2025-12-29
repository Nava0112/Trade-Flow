import axios from "axios";
import { logger } from "./logger.js";

export const forwardRequest = async (req, res, target) => {
  try {
    logger.info({
      requestId: req.requestId,
      msg: "Forwarding request",
      target,
      path: req.originalUrl
    });

    const response = await axios({
      method: req.method,
      url: target + req.originalUrl.replace(/^\/api/, ""),
      headers: {
        ...req.headers,
        "x-user-id": req.user.id,
        "x-user-role": req.user.role
      }
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    logger.error({
      requestId: req.requestId,
      msg: "Upstream service error",
      error: err.message,
      status: err.response?.status
    });

    res.status(err.response?.status || 500).json({
      error: err.response?.data || "Gateway error"
    });
  }
};
