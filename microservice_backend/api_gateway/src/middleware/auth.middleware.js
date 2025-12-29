import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};


export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};


export const isSelfOrAdmin = (req, res, next) => {
  const paramUserId = String(req.params.userId);
  const loggedInUserId = String(req.user.id);

  if (
    paramUserId !== loggedInUserId &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

