import mongoose from "mongoose";

const computerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    status: {
      type: String,
      enum: [
        "Available",
        "In Use",
        "Maintenance",
        "Faulty",
      ],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

const Computer =
  mongoose.model(
    "Computer",
    computerSchema
  );

export default Computer;