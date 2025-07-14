import cron from "node-cron";
import User from "../models/User.js";

const cleanUpUnverifiedUsers = async (next) => {
  try {
    const result = await User.deleteMany({
      isVerified: false,
      otpExpiry: { $lt: Date.now() },
    });

    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} unverified users.`);
    }
  } catch (error) {
    next(error);
  }
};

export default cleanUpUnverifiedUsers;
