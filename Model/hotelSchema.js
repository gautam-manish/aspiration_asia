import mongoose from "mongoose";
 
const mealPlanSchema = new mongoose.Schema(
  {
    mealPlan: {
      type: String,
      enum: ["EP", "CP", "MAP", "AP", "JP"],
      required: [true, "Meal plan is required"],
    },
    rate: {
      type: Number,
      required: [true, "Rate is required"],
      min: [0, "Rate cannot be negative"],
    },
  },
  { _id: false }
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
  }
);
 
const Hotel = mongoose.model("Hotel", hotelSchema);
 
export default Hotel;
 