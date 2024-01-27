const mongoose = require("mongoose");

const scrapedInfoSchema = new mongoose.Schema({
  totalJobProviders: Number,
  phoneNumber: Number,
  withoutBroker: Number,
  postWithIn2Months: Number,
});

const jobSchema = new mongoose.Schema({
  jobName: String,
  salary: String,
  ownerName: String,
  description: String,
  contactNumber: String,
  location: String,
  createdTime: String,
});
const totalSchema = new mongoose.Schema({
  type: String,
  scrapedInfo: scrapedInfoSchema,
  total: [jobSchema],
});

const Job = mongoose.model("Job", totalSchema);

module.exports = Job;
