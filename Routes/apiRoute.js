const express = require("express");
const Upload = require("../Models/Upload");
const router = express.Router();

router.post("/upload", async (req, res) => {
  try {
    const availability = req.body.availability === "true";
    const newUpload = new Upload({
      name: req.body.name,
      role: req.body.role,
      specificJob: req.body.specificJob,
      contactNumber: req.body.contactNumber,
      location: req.body.location,
      salary: req.body.salary,
      description: req.body.description,
      availability: availability,
    });
    let temp = await newUpload.save();
    res.json({ success: true, message: "Upload successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/view", async (req, res) => {
  try {
    let temp = await Upload.find({});
    res.json({ jobsData: temp });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/view/:id", async (req, res) => {
  const { id } = req.params;
  let docs = await Upload.findById(id);
  res.json({ docs });
});

router.post("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      role,
      availability,
      contactNumber,
      location,
      salary,
      description,
    } = req.body;

    const isAvailable = availability === "true";

    const updatedJob = await Upload.findByIdAndUpdate(
      id,
      {
        name: name,
        role: role,
        availability: isAvailable,
        contactNumber: contactNumber,
        location: location,
        salary: salary,
        description: description,
      },
      { new: true }
    );

    res.json({ success: true, message: "Update successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Upload.findByIdAndDelete(id);
    res.json({ success: true, message: "Delete successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
