import axios from "axios";
import logger from "../../../shared/logger/index.js";
import services from "../config/services.js";

export const forwardRequest = (serviceName, routeKey) => {
  return async (req, res) => {
    try {
      logger.info({
        requestId: req.requestId,
        msg: "Forwarding request",
        serviceName,
        routeKey
      });
      const serviceConfig = services[serviceName];
      if (!serviceConfig) {
        throw new Error(`Service ${serviceName} not found`);
      }

      let routePath = serviceConfig.routes[routeKey];
      if (!routePath) {
        throw new Error(`Route ${routeKey} not found for service ${serviceName}`);
      }

      routePath = routePath.replace(/:(\w+)/g, (_, key) => req.params[key]);

      const target = `${serviceConfig.host}${serviceConfig.mountPoint}${routePath}`;

      const response = await axios({
        method: req.method,
        url: target,
        data: req.body,
        params: req.query,
        headers: {
          authorization: req.headers.authorization,
          cookie: req.headers.cookie,
          "x-user-id": req.user?.id,
          "x-user-role": req.user?.role
        },
        timeout: 5000
      });

      if (response.headers["set-cookie"]) {
        res.setHeader("set-cookie", response.headers["set-cookie"]);
      }

      res.status(response.status).json(response.data);
    } catch (err) {
      logger.error({
        requestId: req.requestId,
        msg: "Error forwarding request",
        error: err.message,
        status: err.response?.status,
        targetService: serviceName
      });
      res.status(err.response?.status || 500).json(
        err.response?.data || { error: "Gateway error" }
      );
    }
  };
};
