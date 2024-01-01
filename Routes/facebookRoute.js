const express = require("express");
const Job = require("../Models/Job");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
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
module.exports = router;
