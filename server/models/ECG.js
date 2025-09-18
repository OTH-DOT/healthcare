import mongoose from "mongoose";


const ecgSchema = new mongoose.Schema({
  idECG: { type: Number, required: true, unique: true },
  signal: Buffer, // Binary data for ECG
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ECG", ecgSchema);