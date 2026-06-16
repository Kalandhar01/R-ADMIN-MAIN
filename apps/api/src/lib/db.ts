import mongoose from "mongoose";

let isConnected = false;

export async function connectDatabase(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn("MONGODB_URI is not set. API will use in-memory content.");
    return false;
  }

  if (isConnected) return true;

  try {
    await mongoose.connect(uri, {
      autoIndex: true
    });
    isConnected = true;
    return true;
  } catch (error) {
    console.error("MongoDB connection failed. Falling back to memory store.", error);
    return false;
  }
}
