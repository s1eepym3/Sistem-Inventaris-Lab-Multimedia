import Barang from "../models/Barang.js";

export const createBarang = async (req, res) => {
    try {
        const barang = await Barang.create(req.body);
        res.status(201).json(barang);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getBarang = async (req, res) => {
    const data = await Barang.find();
    res.json(data);
};

export const deleteBarang = async (req, res) => {
    try {
        const barang = await Barang.findById(req.params.id);
        if (barang) {
            await barang.deleteOne();
            res.json({ message: "Barang berhasil dihapus" });
        } else {
            res.status(404).json({ message: "Barang tidak ditemukan" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};