import mongoose from "mongoose";

const barangMasukSchema = new mongoose.Schema({
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
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export default mongoose.model("BarangMasuk", barangMasukSchema);
