import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    content: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
