import express from "express";
import cors from "cors";
import barangRoutes from "./routes/barangRoutes.js";
import transaksiRoutes from "./routes/transaksiRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/barang", barangRoutes);
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/auth", authRoutes);

export default app;