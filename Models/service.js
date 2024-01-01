const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  jobName: String,
  desiredSalary: String,
  employeeName: String,
  contactNumber: String,
  location: String,
  createdTime: String,
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
