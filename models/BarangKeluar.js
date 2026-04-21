import mongoose from "mongoose";

const barangKeluarSchema = new mongoose.Schema({
    barang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Barang",
        required: true
    },
    jumlah: {
        type: Number,
        required: true,
        min: 1
    },
    tanggal: {
        type: Date,
        default: Date.now
    },
    keterangan: {
        type: String,
        required: true // Ini digunakan untuk menyimpan keterangan, seperti "Fakultas Ekonomi dan Bisnis memesan papan akrilik..."
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export default mongoose.model("BarangKeluar", barangKeluarSchema);
