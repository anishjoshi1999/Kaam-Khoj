const mongoose = require("mongoose");
const connectDB = async (uri) => {
  try {
    await mongoose
      .connect(uri)
      .then(() => {
        console.log("Connected to MongoDB Atlas");
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB Atlas:", err);
      });
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
