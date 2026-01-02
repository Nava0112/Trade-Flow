import axios from "axios";
import logger from "../../../shared/logger/index.js";
import services from "../config/services.js";

export const forwardRequest = (serviceName, routeKey) => {
  return async (req, res) => {
    try {
      const serviceConfig = services[serviceName];
      if (!serviceConfig) {
        throw new Error(`Service ${serviceName} not found in config`);
      }

      let routePath = serviceConfig.routes[routeKey];
      if (!routePath) {
        throw new Error(`Route ${routeKey} not found for service ${serviceName}`);
      }

      // Replace path params :param with req.params.param
      routePath = routePath.replace(/:(\w+)/g, (_, key) => {
        const val = req.params[key];
        if (!val) {
          console.warn(`Missing param ${key} for route ${routeKey}`);
          return `:${key}`; // Keep it or fail? Better to keep or empty. using original logic implies it should be there.
        }
        return val;
      });

      const target = `${serviceConfig.host}${serviceConfig.mountPoint}${routePath}`;

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
        params: req.query,
        headers: {
          ...req.headers,
          "x-user-id": req.user?.id,
          "x-user-role": req.user?.role
        }
      });

      if (response.headers['set-cookie']) {
        res.setHeader('set-cookie', response.headers['set-cookie']);
      }
      res.status(response.status).json(response.data);
    } catch (err) {
      logger.error({
        requestId: req.requestId,
        msg: "Upstream service error",
        error: err.message,
        status: err.response?.status,
        targetService: serviceName
      });

      res.status(err.response?.status || 500).json({
        error: err.response?.data || "Gateway error"
      });
    }
  };
};
