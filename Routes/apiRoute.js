const express = require("express");
const Job = require("../Models/Job");
const Upload = require("../Models/Upload");
// const Service = require("../Models/service");

const router = express.Router();

router.get("/jobs", async (req, res) => {
  try {
    let jobs = await Job.find({});
    let driverJobs = [];
    let cookJobs = [];
    let houseJobs = [];
    let receptionJobs = [];
    let salesJobs = [];
    let otherJobs = [];

    jobs[0].total.forEach((job) => {
      const lowerCaseJobName = job.jobName.toLowerCase();

      if (lowerCaseJobName.includes("driver")) {
        driverJobs.push(job);
      } else if (lowerCaseJobName.includes("cook")) {
        cookJobs.push(job);
      } else if (/\bsale(s)?\b/.test(lowerCaseJobName)) {
        salesJobs.push(job);
      } else if (
        lowerCaseJobName.includes("help") ||
        lowerCaseJobName.includes("maid")
      ) {
        houseJobs.push(job);
      } else if (lowerCaseJobName.includes("recept")) {
        receptionJobs.push(job);
      } else {
        otherJobs.push(job);
      }
    });
    let jobInformation = [
      {
        name: "Driving Jobs",
        totalAvailableJobs: driverJobs.length,
        jobs: driverJobs,
      },
      {
        name: "Cook and Maid Jobs",
        totalAvailableJobs: cookJobs.length,
        jobs: cookJobs,
      },
      {
        name: "Sales Jobs",
        totalAvailableJobs: salesJobs.length,
        jobs: salesJobs,
      },
      {
        name: "Household Jobs",
        totalAvailableJobs: houseJobs.length,
        jobs: houseJobs,
      },
      {
        name: "Reception Jobs",
        totalAvailableJobs: receptionJobs.length,
        jobs: receptionJobs,
      },
      {
        name: "Other Jobs",
        totalAvailableJobs: otherJobs.length,
        jobs: otherJobs,
      },
    ];
    res.send(jobInformation);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery;
    const searchNoSpecialChar = searchQuery.replace(/[^a-zA-Z0-9 ]/g, "");
    console.log(searchNoSpecialChar);

    if (!searchQuery) {
      res.status(400).json({ error: "Search query is required." });
      return;
    }

    const searchRegex = new RegExp(searchQuery, "i");

    // Use aggregation to unwind and match the matching elements in the total array
    const searchResults = await Job.aggregate([
      {
        $unwind: "$total",
      },
      {
        $match: {
          $or: [
            { "total.jobName": searchRegex },
            { "total.description": searchRegex },
            { "total.salary": searchRegex },
            { "total.ownerName": searchRegex },
            { "total.contactNumber": searchRegex },
            { "total.location": searchRegex },
            { "total.createdTime": searchRegex },
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
          matchedJobs: { $push: "$total" },
        },
      },
    ]);

    // Extract all matched jobs from the result
    const matchedJobs = searchResults
      .map((result) => result.matchedJobs)
      .flat();

    res.status(200).json({ matchedJobs });
  } catch (error) {
    console.error("Error while searching:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/upload", async (req, res) => {
  try {
    // Create a new instance of the Upload model with data from the request body
    const newUpload = new Upload({
      name: req.body.name,
      role: req.body.role,
      contactNumber: req.body.contactNumber,
      location: req.body.location,
      salary: req.body.salary,
      description: req.body.description,
    });

    // Save the new upload to the database
    const savedUpload = await newUpload.save();

    console.log("Upload saved successfully:", savedUpload);

    res.status(201).json({ message: "Upload successful", data: savedUpload });
  } catch (error) {
    console.error("Error handling form submission:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// router.get("/services", async (req, res) => {
//   try {
//     let jobs = await Service.find({});
//     let driverJobs = [];
//     let cookJobs = [];
//     let houseJobs = [];
//     let receptionJobs = [];
//     let salesJobs = [];
//     let otherJobs = [];

//     jobs.forEach((job) => {
//       const lowerCaseJobName = job.jobName.toLowerCase();

//       if (lowerCaseJobName.includes("driver")) {
//         driverJobs.push(job);
//       } else if (lowerCaseJobName.includes("cook")) {
//         cookJobs.push(job);
//       } else if (/\bsale(s)?\b/.test(lowerCaseJobName)) {
//         salesJobs.push(job);
//       } else if (
//         lowerCaseJobName.includes("help") ||
//         lowerCaseJobName.includes("maid")
//       ) {
//         houseJobs.push(job);
//       } else if (lowerCaseJobName.includes("recept")) {
//         receptionJobs.push(job);
//       } else {
//         otherJobs.push(job);
//       }
//     });
//     let jobInformation = [
//       {
//         name: "Driving Jobs",
//         totalAvailableJobs: driverJobs.length,
//         jobs: driverJobs,
//       },
//       {
//         name: "Cook and Maid Jobs",
//         totalAvailableJobs: cookJobs.length,
//         jobs: cookJobs,
//       },
//       {
//         name: "Sales Jobs",
//         totalAvailableJobs: salesJobs.length,
//         jobs: salesJobs,
//       },
//       {
//         name: "Household Jobs",
//         totalAvailableJobs: houseJobs.length,
//         jobs: houseJobs,
//       },
//       {
//         name: "Reception Jobs",
//         totalAvailableJobs: receptionJobs.length,
//         jobs: receptionJobs,
//       },
//       {
//         name: "Other Jobs",
//         totalAvailableJobs: otherJobs.length,
//         jobs: otherJobs,
//       },
//     ];
//     res.send(jobInformation);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });
module.exports = router;
