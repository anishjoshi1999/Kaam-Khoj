const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  contact: {
    type: String,
    // required: true,
    // unique: true, // Ensures uniqueness in the MongoDB collection
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
