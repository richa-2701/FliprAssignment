import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://richabhupendrasharma2701:Richa_1234@cluster0.y2wdm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
};

export default connectDB;
