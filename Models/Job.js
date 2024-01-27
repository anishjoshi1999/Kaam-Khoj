const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobName: String,
  salary: String,
  ownerName: String,
  description: String,
  contactNumber: String,
  location: String,
  createdTime: String,
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
