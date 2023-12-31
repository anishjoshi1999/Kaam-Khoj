const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const Job = require("./Models/Job");
const axios = require("axios");
dotenv.config();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
const { fetchData } = require("./utils/minimalJob");
const PORT = process.env.PORT || 3000;
const MONGODB_URI = `${process.env.MONGODB_URI}`;
mongoose.set("strictQuery", false);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on :${PORT}`);
    });
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });
app.get("/", (req, res) => {
  res.send("Kaam Khoj");
});
app.get("/jobs", async (req, res) => {
  await fetchData(res);
});

app.get("/api", async (req, res) => {
  try {
    let jobs = await Job.find({});
    let driverJobs = [];
    let cookJobs = [];
    let houseJobs = [];
    let receptionJobs = [];
    let salesJobs = [];
    let otherJobs = [];

    jobs.forEach((job) => {
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

app.get("/facebook", async (req, res) => {
  let jobs = await Job.find({});
  let randomJobs = getRandomObjects(jobs);
  const combinedNews = randomJobs
    .map((element, index) => {
      return `Position ${index + 1}:  ${element.jobName}, Salary: Rs ${
        element.salary
      } Per Month\n`;
    })
    .join("");

  const facebookResponse = await postNewsToFacebook(combinedNews);
  console.log("Automatic post request triggered:", facebookResponse.data);
  res.redirect("/");
});
async function postNewsToFacebook(sources) {
  const facebookUrl = `https://graph.facebook.com/${process.env.FACEBOOK_PAGE_ID}/feed`;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

  // Construct the formatted date and time string
  const caption = `Urgent Manpower Wanted!!! \n\n${sources} \n इच्छुक उम्मेदवारले हामीसँग Messenger मार्फत सम्पर्क गर्न सक्नुहुनेछ।`;

  const data = {
    message: caption,
    //link: "your_url"
    access_token: accessToken,
    published: true,
  };
  try {
    const response = await axios.post(facebookUrl, data);
    return response;
  } catch (error) {
    console.error("Error posting to Facebook:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}
function getRandomObjects(array) {
  // Clone the array to avoid modifying the original array
  const shuffledArray = [...array];

  // Fisher-Yates shuffle algorithm
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  // Return the first three elements
  return shuffledArray.slice(0, 5);
}
