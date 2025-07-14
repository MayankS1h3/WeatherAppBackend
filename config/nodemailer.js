import nodemailer from "nodemailer";
import { USER_EMAIL, USER_PASS } from "./env.js";

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: USER_EMAIL,
    pass: USER_PASS,
  },
});

export default transporter;
