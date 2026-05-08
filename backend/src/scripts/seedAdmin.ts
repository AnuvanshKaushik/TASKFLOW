import mongoose from "mongoose";
import { env } from "../config/env";
import { User } from "../models/User";

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.mongoUri);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "mainuser@gmail.com" });
    if (adminExists) {
      console.log("✅ Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "mainuser@gmail.com",
      password: "Ani@2610",
      role: "Admin"
    });

    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
