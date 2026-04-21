import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware untuk mengecek apakah user sudah login (memiliki token valid)
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Ambil token dari header "Bearer <token>"
            token = req.headers.authorization.split(" ")[1];

            // Verifikasi token
            const secret = process.env.JWT_SECRET || "rahasia_super_aman_123";
            const decoded = jwt.verify(token, secret);

            // Ambil data user dari database (kecuali password) dan simpan di req.user
            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(401).json({ message: "Tidak ada otorisasi, token gagal diverifikasi" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Tidak ada otorisasi, tidak ada token" });
    }
};

// Middleware untuk mengecek apakah user adalah Admin
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Akses ditolak, khusus Admin!" });
    }
};
