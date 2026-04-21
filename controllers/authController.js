import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Fungsi untuk men-generate token JWT
const generateToken = (id) => {
    // Gunakan JWT_SECRET dari file .env, atau fallback jika belum ada
    const secret = process.env.JWT_SECRET || "rahasia_super_aman_123";
    return jwt.sign({ id }, secret, {
        expiresIn: "30d",
    });
};

// @desc    Register user baru
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { nama, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email sudah terdaftar!" });
        }

        // Cek jika ini adalah user pertama di sistem, jadikan admin otomatis
        const isFirstUser = (await User.countDocuments({})) === 0;

        const user = await User.create({
            nama,
            email,
            password,
            role: isFirstUser ? "admin" : "member",
            isApproved: isFirstUser ? true : false,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                nama: user.nama,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                message: isFirstUser 
                    ? "Admin pertama berhasil didaftarkan!" 
                    : "Registrasi berhasil! Silakan tunggu persetujuan admin sebelum login.",
            });
        } else {
            res.status(400).json({ message: "Data user tidak valid" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Cek apakah user sudah disetujui admin
            if (!user.isApproved) {
                return res.status(401).json({ message: "Akun Anda belum disetujui oleh Admin. Mohon tunggu." });
            }

            res.json({
                _id: user._id,
                nama: user.nama,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Email atau password salah!" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get semua user (untuk Admin)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve user
// @route   PUT /api/auth/users/:id/approve
// @access  Private/Admin
export const approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.isApproved = true;
            await user.save();
            res.json({ message: `User ${user.nama} telah disetujui` });
        } else {
            res.status(404).json({ message: "User tidak ditemukan" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Hapus/Reject user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: "User berhasil dihapus" });
        } else {
            res.status(404).json({ message: "User tidak ditemukan" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
