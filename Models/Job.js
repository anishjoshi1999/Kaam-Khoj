const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobName: String,
  salary: Number,
  ownerName: String,
  contactNumber: String,
  location: String,
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
