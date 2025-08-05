import express from "express";
import { PORT } from "./config/env.js";
import cookieParser from "cookie-parser";

// Database import 
import connectToMongoDB from './database/mongodb.js'



import cron from 'node-cron';
import User from './models/User.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// Routes import
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users', userRouter);

import cleanUpUnverifiedUsers from "./cron/cleanUpUnverifiedUsers.js";

cleanUpUnverifiedUsers();

app.listen(PORT, async () => {
  console.log(`Server is running at PORT ${PORT}`);
  await connectToMongoDB();
});
