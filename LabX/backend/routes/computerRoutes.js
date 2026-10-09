import express from "express";

import {
  getComputers,
  addComputer,
} from "../controllers/computerController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

/* =========================================================
   GET COMPUTERS
   ADMIN + USER
========================================================= */

router.get(
  "/",
  protect,
  getComputers
);

/* =========================================================
   ADD COMPUTER
   ADMIN ONLY
========================================================= */

router.post(
  "/",
  protect,
  adminOnly,
  addComputer
);

export default router;