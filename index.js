import express from "express";
import { PORT } from "./config/env.js";
import connectToMongoDB from './database/mongodb.js';

const app = express();

app.listen(PORT, async () => {
  console.log(`Server is running at PORT ${PORT}`);
  await connectToMongoDB();
});
