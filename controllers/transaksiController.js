import Barang from "../models/Barang.js";
import BarangMasuk from "../models/BarangMasuk.js";
import BarangKeluar from "../models/BarangKeluar.js";

// Mencatat Barang Masuk
export const catatBarangMasuk = async (req, res) => {
    const { barangId, jumlah, keterangan } = req.body;
    try {
        // 1. Buat catatan transaksi (Audit Trail: simpan req.user._id)
        const transaksiMasuk = await BarangMasuk.create({
            barang: barangId,
            jumlah,
            keterangan,
            user: req.user._id // User yang sedang login
        });

        // 2. Update stok secara ATOMIC (Mencegah Race Condition)
        const barang = await Barang.findByIdAndUpdate(
            barangId, 
            { $inc: { stok: Number(jumlah) } },
            { new: true }
        );

        if (!barang) return res.status(404).json({ message: "Barang tidak ditemukan" });

        res.status(201).json({ message: "Barang masuk berhasil dicatat", transaksi: transaksiMasuk });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mencatat Barang Keluar
export const catatBarangKeluar = async (req, res) => {
    const { barangId, jumlah, keterangan } = req.body;
    try {
        const barang = await Barang.findById(barangId);
        if (!barang) return res.status(404).json({ message: "Barang tidak ditemukan" });

        // Cek apakah stok cukup sebelum transaksi
        if (barang.stok < jumlah) {
            return res.status(400).json({ message: "Stok barang tidak mencukupi" });
        }

        // 1. Buat catatan transaksi
        const transaksiKeluar = await BarangKeluar.create({
            barang: barangId,
            jumlah,
            keterangan,
            user: req.user._id
        });

        // 2. Kurangi stok secara ATOMIC
        await Barang.findByIdAndUpdate(
            barangId, 
            { $inc: { stok: -Number(jumlah) } }
        );

        res.status(201).json({ message: "Barang keluar berhasil dicatat", transaksi: transaksiKeluar });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mengambil riwayat barang masuk
export const getRiwayatMasuk = async (req, res) => {
    try {
        const data = await BarangMasuk.find()
            .populate('barang', 'nama_barang kategori satuan')
            .populate('user', 'nama email'); // Lihat siapa yang input
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mengambil riwayat barang keluar
export const getRiwayatKeluar = async (req, res) => {
    try {
        const data = await BarangKeluar.find()
            .populate('barang', 'nama_barang kategori satuan')
            .populate('user', 'nama email');
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Menghapus riwayat barang masuk & mengembalikan stok (ATOMIC)
export const deleteRiwayatMasuk = async (req, res) => {
    try {
        const transaksi = await BarangMasuk.findById(req.params.id);
        if (!transaksi) return res.status(404).json({ message: "Transaksi tidak ditemukan" });

        // Kembalikan stok (Atomic decrement karena ini barang masuk)
        await Barang.findByIdAndUpdate(transaksi.barang, { $inc: { stok: -transaksi.jumlah } });

        await transaksi.deleteOne();
        res.json({ message: "Riwayat barang masuk dihapus & stok dikembalikan" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Menghapus riwayat barang keluar & mengembalikan stok (ATOMIC)
export const deleteRiwayatKeluar = async (req, res) => {
    try {
        const transaksi = await BarangKeluar.findById(req.params.id);
        if (!transaksi) return res.status(404).json({ message: "Transaksi tidak ditemukan" });

        // Kembalikan stok (Atomic increment karena ini barang keluar)
        await Barang.findByIdAndUpdate(transaksi.barang, { $inc: { stok: transaksi.jumlah } });

        await transaksi.deleteOne();
        res.json({ message: "Riwayat barang keluar dihapus & stok dikembalikan" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
