const axios = require("axios");
const Job = require("../Models/Job");
const { toTitleCase, checkForSalary } = require("./usefulMethods");
const { APIKEY, DEVICEID } = require("./constants");
async function fetchData() {
  try {
    const response = await axios.get(
      "https://api.hamrobazaar.com/api/Product?PageSize=1000&CategoryId=010F9ADD-2A94-468D-A937-02BB42F50FA2&IsHBSelect=false&PageNumber=1",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "access-control-allow-origin": "*",
          apikey: APIKEY,
          country_code: "null",
          deviceid: DEVICEID,
          devicesource: "web",
          "sec-ch-ua":
            '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "strict-transport-security": "max-age=2592000",
          "x-content-type-options": "nosniff",
          "x-frame-options": "SAMEORIGIN",
          Referer: "https://hamrobazaar.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      }
    );
    const withPhoneNumbers = response.data.data.filter((element) => {
      return !element.creatorInfo.createdByUsername.includes("*");
    });
    //Add Brokers if you want to exclude them
    const excludeRegex =
      /^(Paramount Management Solution Pvt\.Ltd|Malaxmi Job Placement|Meraki Job|Urgent Job Wanted|Looking For Job|Online Typing)$/i;

    const withoutBroker = withPhoneNumbers.filter((element) => {
      const createdByName = element.creatorInfo.createdByName;
      return !excludeRegex.test(createdByName && createdByName.trim());
    });

    // Only want the job which are less than 2 months old
    let final = withoutBroker.filter((job) => {
      // Extract the number of days from the createdTime
      const daysAgo = parseInt(job.createdTime.match(/\d+/)[0]);

      // Check if the job was created within the last 7 days
      return (
        job.createdTime.includes("mins") ||
        job.createdTime.includes("hours") ||
        (job.createdTime.includes("days") && daysAgo <= 7)
      );
    });

    let temp = final.map((element) => ({
      jobName: toTitleCase(element.name),
      salary: checkForSalary(element.price),
      ownerName: toTitleCase(element.creatorInfo.createdByName),
      description: element.description,
      contactNumber: toTitleCase(element.creatorInfo.createdByUsername),
      location: toTitleCase(element.location.locationDescription),
      createdTime: element.createdTime,
    }));
    let infoScrape = {
      totalJobProviders: response.data.data.length,
      phoneNumber: withPhoneNumbers.length,
      withoutBroker: withoutBroker.length,
      postWithIn2Months: temp.length,
    };

    const existingDocument = await Job.findOne({ type: "job" });

    // If the document exists, update it; otherwise, create a new one
    if (existingDocument) {
      // Update the existing document
      await Job.updateOne(
        { type: "job" },
        { $set: { scrapedInfo: infoScrape, total: temp } }
      );
      console.log("Updated successfully");
    } else {
      // Create a new document if it doesn't exist
      const jobInstance = new Job({
        type: "job",
        scrapedInfo: infoScrape,
        total: temp,
      });
      await jobInstance.save();
      console.log("Inserted successfully");
    }
  } catch (error) {
    console.error("Error fetching and saving data:", error.message);
    // or console.error("Error fetching and saving data:", error.response.data);
  }
}

module.exports = { fetchData };
