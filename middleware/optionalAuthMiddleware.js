
import jwt from "jsonwebtoken";

const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No token: continue as a guest
  if (!authHeader) {
    req.userId = null;
    return next();
  }

  // A token was supplied, so it must be valid
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default optionalAuthMiddleware;
