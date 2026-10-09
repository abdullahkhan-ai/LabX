import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import computerRoutes from "./routes/computerRoutes.js";

import {
  seedUsers,
} from "./controllers/authController.js";

import {
  seedComputers,
} from "./controllers/computerController.js";

dotenv.config();

const app =
  express();

const PORT =
  process.env.PORT || 5000;

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================================================
   BASIC ROUTES
========================================================= */

app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,
      message:
        "LabX backend is running.",
    });
  }
);

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      message:
        "LabX API is healthy.",
    });
  }
);

/* =========================================================
   AUTH ROUTES
========================================================= */

app.use(
  "/api/auth",
  authRoutes
);

/* =========================================================
   COMPUTER ROUTES
========================================================= */

app.use(
  "/api/computers",
  computerRoutes
);

/* =========================================================
   START SERVER
========================================================= */

const startServer =
  async () => {
    try {

      await connectDB();

      await seedUsers();

      await seedComputers();

      app.listen(
        PORT,
        () => {
          console.log(
            `LabX backend running on http://localhost:${PORT}`
          );
        }
      );

    } catch (error) {

      console.error(
        "Server startup failed:",
        error.message
      );

      process.exit(1);
    }
  };

startServer();