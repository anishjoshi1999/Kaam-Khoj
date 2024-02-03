const express = require("express");
const axios = require("axios");
const { ACCESS_TOKEN, FACEBOOK_PAGE } = require("../utils/constants");
const router = express.Router();
const { fetchData } = require("../utils/minimalJob");
const Job = require("../Models/Job");

router.get("/", async (req, res) => {
  try {
    const facebookPageURI = `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE}/posts?access_token=${ACCESS_TOKEN}&fields=id,permalink_url,message,comments,likes,full_picture,created_time&limit=20`;
    const response = await axios.get(facebookPageURI);
    const { data } = response.data;
    res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/post", async (req, res) => {
  try {
    await fetchData();
    let jobs = await Job.find({});
    let randomJobs = getRandomObjects(jobs[0].total);
    let uniqueJobs = filterUniqueJobs(randomJobs);
    const combinedNews = uniqueJobs
      .map((element, index) => {
        return `Position ${index + 1}:  ${element.jobName.trim()}, Salary: Rs ${
          element.salary
        } Per Month\n`;
      })
      .join("");

    const facebookResponse = await postNewsToFacebook(combinedNews);
    console.log("Automatic post request triggered:", facebookResponse.data);
    res.json({ success: true, message: "Post request successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function filterUniqueJobs(jobs) {
  const uniqueJobNames = new Set();
  const uniqueJobs = jobs.filter((job) => {
    if (!uniqueJobNames.has(job.jobName)) {
      uniqueJobNames.add(job.jobName);
      return true;
    }
    return false;
  });

  return uniqueJobs;
}

async function postNewsToFacebook(sources) {
  const facebookUrl = `https://graph.facebook.com/${process.env.FACEBOOK_PAGE_ID}/feed`;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

  const caption = `Urgent Manpower Wanted!!! \n\n${sources} \nजनकारीका लागी 9865645065, 9863679399 अथवा हामीसँग Messenger मार्फत सम्पर्क गर्नु होला।`;

  const data = {
    message: caption,
    access_token: accessToken,
    published: true,
  };

  try {
    const response = await axios.post(facebookUrl, data);
    return response;
  } catch (error) {
    console.error("Error posting to Facebook:", error);
    throw error;
  }
}

function getRandomObjects(array) {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray.slice(0, 5);
}

module.exports = router;
