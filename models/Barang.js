import mongoose from "mongoose";

const barangSchema = new mongoose.Schema({
    nama_barang: {
        type: String,
        required: true
    },
    kategori: String,
    stok: {
        type: Number,
        default: 0
    },
    satuan: String
}, { timestamps: true });

export default mongoose.model("Barang", barangSchema);