import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://harshshukla:harsh12@cluster0.ob6lhlw.mongodb.net/food-delivery"
    )
    .then(() => console.log("DB Connected"));
};
