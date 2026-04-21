import express from "express";
import { createBarang, getBarang, deleteBarang } from "../controllers/barangController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBarang);
router.get("/", getBarang);
router.delete("/:id", protect, adminOnly, deleteBarang);

export default router;