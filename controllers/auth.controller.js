import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET, JWT_EXPIRY } from "../config/env.js";

export const registerUser = async (req, res, next) => {
  const mongooseSession = await mongoose.startSession();
  mongooseSession.startTransaction();
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exist");
      error.status = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session: mongooseSession }
    );

    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });

    res.status(201).json({
      success: true,
      message: "New user created successfully",
      data: {
        token: token,
        userId: newUsers[0]._id,
      },
    });

    await mongooseSession.commitTransaction();
    mongooseSession.endSession();
  } catch (error) {
    await mongooseSession.abortTransaction();
    mongooseSession.endSession();
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const existingUser = await User.findOne({email});

        if(!existingUser){
            const error = new Error('User does not exist');
            error.status = 404;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if(!isMatch){
            const error = new Error('Password does not match');
            error.status = 401;
            throw error;
        }

        const token = jwt.sign({userId: existingUser._id}, JWT_SECRET, {expiresIn: JWT_EXPIRY});

        res.status(200).json({
            success: true,
            message: 'Login Successfull',
            data: {
                token: token,
                userId: existingUser._id
            }
        })
    } catch (error) {
        next(error);
    }
}

export const logoutUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout Successfull"
    })
  } catch (error) {
    next(error);
  }
}