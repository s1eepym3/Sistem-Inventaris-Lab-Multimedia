import express from "express";
import { 
    catatBarangMasuk, 
    catatBarangKeluar, 
    getRiwayatMasuk, 
    getRiwayatKeluar,
    deleteRiwayatMasuk,
    deleteRiwayatKeluar
} from "../controllers/transaksiController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/masuk", protect, catatBarangMasuk);
router.get("/masuk", getRiwayatMasuk);
router.delete("/masuk/:id", protect, adminOnly, deleteRiwayatMasuk);

router.post("/keluar", protect, catatBarangKeluar);
router.get("/keluar", getRiwayatKeluar);
router.delete("/keluar/:id", protect, adminOnly, deleteRiwayatKeluar);

export default router;
