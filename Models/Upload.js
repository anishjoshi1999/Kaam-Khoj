const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  role: {
    type: String,
    enum: ["jobProvider", "jobSeeker"],
  },
  contactNumber: {
    type: String,
  },
  location: {
    type: String,
  },
  salary: {
    type: String,
  },
  description: {
    type: String,
  },
});

const Upload = mongoose.model("Upload", uploadSchema);

module.exports = Upload;
