import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.cookies?.accessToken;

    if (!token) {
      console.log("verifyToken: Token missing from headers and cookies");
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("verifyToken: Token verification failed", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};



export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin only" });
  }

  next();
};



export const isSelfOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const paramId = req.params.id || req.params.userId;
  const paramUserId = String(paramId);
  const loggedInUserId = String(req.user.id);

  if (paramUserId !== loggedInUserId && req.user.role !== "admin") {
    console.warn(`isSelfOrAdmin: Forbidden. User ${loggedInUserId} tried to access ${paramUserId}`);
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};


