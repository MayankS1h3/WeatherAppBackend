import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "../models/User.js";
import transporter from "../config/nodemailer.js";
import { JWT_SECRET, JWT_EXPIRY, USER_EMAIL } from "../config/env.js";

export const registerUser = async (req, res, next) => {
  const mongooseSession = await mongoose.startSession();
  mongooseSession.startTransaction();
  try {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exist");
      error.status = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    const newUsers = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
          otp,
          otpExpiry,
          isVerified: false,
        },
      ],
      { session: mongooseSession }
    );

    await transporter.sendMail({
      from: USER_EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    });

    res.status(201).json({
      success: true,
      message:
        "OTP sent to your email. Please verify to complete registration.",
      userId: newUsers[0]._id,
    });

    await mongooseSession.commitTransaction();
    mongooseSession.endSession();
  } catch (error) {
    await mongooseSession.abortTransaction();
    mongooseSession.endSession();
    next(error);
  }
};





export const verifyOTP = async (req, res, next) => {
  try {
    const { otp, email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified",
      });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      res.status(400).json({
        success: false,
        message: "Wrong otp and otp has expired",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });

    res.status(200).json({
      success: true,
      message: 'OTP verified',
      token:token
    })
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const error = new Error("User does not exist");
      error.status = 404;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      const error = new Error("Password does not match");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });

    res.status(200).json({
      success: true,
      message: "Login Successfull",
      data: {
        token: token,
        userId: existingUser._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout Successfull",
    });
  } catch (error) {
    next(error);
  }
};
