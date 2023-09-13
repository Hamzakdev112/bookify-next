// Session store model to preserve sessions across restarts.
import mongoose, { mongo } from "mongoose";

const sessionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  shop: {
    type: String,
    required: true,
  },
});

export default mongoose.models.session || mongoose.model("session", sessionSchema);

