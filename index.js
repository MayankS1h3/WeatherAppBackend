import express from "express";
import { PORT } from "./config/env.js";
import cookieParser from "cookie-parser";

// Database import 
import connectToMongoDB from './database/mongodb.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// Routes import
import authRouter from "./routes/auth.routes.js";

app.use('/api/v1/auth',authRouter);

app.listen(PORT, async () => {
  console.log(`Server is running at PORT ${PORT}`);
  await connectToMongoDB();
});
