import jwt from "jsonwebtoken";

export const protect =
  (req, res, next) => {
    try {
      const authorization =
        req.headers.authorization;

      if (
        !authorization ||
        !authorization.startsWith(
          "Bearer "
        )
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      const token =
        authorization.split(" ")[1];

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      req.user = decoded;

      next();

    } catch (error) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired authentication token.",
      });
    }
  };

export const adminOnly =
  (req, res, next) => {
    if (
      !req.user ||
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Administrator access required.",
      });
    }

    next();
  };