const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = require("../models/users");
require("dotenv").config();

// Database Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Database Not Connected !!!"));

const createFirstAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ userRole: 1 });
    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    // Create first admin
    const adminData = {
      name: "Admin",
      email: "admin@fardo.com",
      password: bcrypt.hashSync("admin123", 10),
      userRole: 1, // Admin role
    };

    const newAdmin = new userModel(adminData);
    await newAdmin.save();
    
    console.log("First admin created successfully!");
    console.log("Email:", adminData.email);
    console.log("Password: admin123");
    console.log("Please change the password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createFirstAdmin(); 