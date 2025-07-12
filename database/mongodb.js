import mongoose from "mongoose";

import { MONGO_URI, NODE_ENV } from "../config/env.js";

if (!MONGO_URI) {
  throw new Error(
    "Please define MONGO_URI enviroment variable inside .env.<development/production>.local"
  );
}

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB in ${NODE_ENV} mode`);
  } catch (error) {
    console.error("Error connecting MongoDB");
    process.exit(1);
  }
};

export default connectToMongoDB;
