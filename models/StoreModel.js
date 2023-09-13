import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
  shop: { type: String, required: true, unique: true },
  isActive: { type: Boolean, required: true, default: false },
});

export default mongoose.models.Active_Store ||  mongoose.model("Active_Store", StoreSchema);

