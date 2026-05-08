import mongoose from "mongoose";

const mealPlanSchema = new mongoose.Schema(
  {
    mealPlan: {
      type: String,
      enum: ["EP", "CP", "MAP", "AP", "JP"],
      required: [true, "Meal plan is required"],
    },
    inrRate: {
      type: Number,
      required: [true, "INR Rate is required"],
      min: [0, "INR Rate cannot be negative"],
    },
    usdRate: {
      type: Number,
      required: [true, "USD Rate is required"],
      min: [0, "USD Rate cannot be negative"],
    },
  },
  { _id: false },
);

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    costPerRoom: {
      type: [mealPlanSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one meal plan is required",
      },
    },
  },
  {
    timestamps: true,
  },
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
