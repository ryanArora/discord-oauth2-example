import { verify, JsonWebTokenError } from "jsonwebtoken";

export default function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized", message: "No JWT provided" });
    return;
  }

  verify(token, process.env.TOKEN_SECRET, (err: JsonWebTokenError, decoded) => {
    if (err) {
      res.status(403).json({ error: "Forbidden", message: "JWT is incorrect" });
      return;
    }

    req.userId = decoded.userId;
    next();
  });
}
