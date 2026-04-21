import express from "express";
import { 
    registerUser, 
    loginUser, 
    getUsers, 
    approveUser, 
    deleteUser 
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Manajemen User (Admin Only)
router.get("/users", protect, adminOnly, getUsers);
router.put("/users/:id/approve", protect, adminOnly, approveUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;
