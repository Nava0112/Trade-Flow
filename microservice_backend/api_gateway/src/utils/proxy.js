import axios from "axios";
import logger from "../../../shared/logger/index.js";
import services from "../config/services.js";

export const forwardRequest = (service, routeKey) => {
  return async (req, res) => {
    try {
      const target =
        services[service].host + `/${service}/${routeKey}`;
      console.log(target);
      logger.info({
        requestId: req.requestId,
        msg: "Forwarding request",
        target,
        path: req.originalUrl
      });

      const response = await axios({
        method: req.method,
        url: target,
        data: req.body,
        headers: {
          ...req.headers,
          "x-user-id": req.user?.id,
          "x-user-role": req.user?.role
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
};
