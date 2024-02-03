const express = require("express");
const Job = require("../Models/Job");
const { jobFilterMethod } = require("../utils/filterMethod");
const { fetchData } = require("../utils/minimalJob");
const router = express.Router();

router.get("/", async (req, res) => {
  //This will fetch all the latest data
  await fetchData();
  //To further simplify the latest fetched data
  let jobsData = await jobFilterMethod();
  res.json({ jobsData });
});

router.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery.replace(/[^a-zA-Z0-9 ]/g, "");

    if (!searchQuery) {
      res.status(400).json({ error: "Search query is required." });
      return;
    }

    const searchRegex = new RegExp(searchQuery, "i");

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

    const matchedJobs = searchResults
      .map((result) => result.matchedJobs)
      .flat();

    let value = {
      name: searchQuery,
      jobs: matchedJobs,
      totalAvailableJobs: matchedJobs.length,
    };

    res.json({ jobsData: value, userAuthenticated: req.userId });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
