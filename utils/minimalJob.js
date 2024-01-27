const axios = require("axios");
const Job = require("../Models/Job");
const { toTitleCase, checkForSalary } = require("./usefulMethods");

async function fetchData() {
  try {
    const response = await axios.get(
      "https://api.hamrobazaar.com/api/Product?PageSize=1000&CategoryId=010F9ADD-2A94-468D-A937-02BB42F50FA2&IsHBSelect=false&PageNumber=1",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,la;q=0.7,ne;q=0.6",
          "access-control-allow-origin": "*",
          apikey: "09BECB8F84BCB7A1796AB12B98C1FB9E",
          "cache-control": "no-cache",
          country_code: "null",
          deviceid: "89700155-17fd-452c-b9e4-718f5dc70c5f",
          devicesource: "web",
          pragma: "no-cache",
          "sec-ch-ua":
            '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
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

    const regex =
      /\b(helper|cook|driver|sale|delivery|needed|sales|required|nanny|cashier|सिक्युरिटी|security|maid|peon|cleaner|technician|receptionist|waiter|हेल्पर|waitress|mechanic|कुक|हाउसकिपिङ|guard)\b/i;
    const excludeRegex =
      /\b(chahi|need|u|if|available|ma|chahiya|ma|hola|call|garnu|\d{10,})\b/i;

    const withPhoneNumbers = response.data.data.filter((element) => {
      return !element.creatorInfo.createdByUsername.includes("*");
    });

    const filteredJobInfos = withPhoneNumbers.filter((element) => {
      return !excludeRegex.test(element.name.toLowerCase());
    });

    // Only want the job which are less than 2 months old
    let final = filteredJobInfos.filter((job) => {
      return (
        job.createdTime.includes("mins") ||
        job.createdTime.includes("hours") ||
        job.createdTime.includes("days") ||
        (job.createdTime.includes("1 month") &&
          !job.createdTime.includes("11 months"))
      );
    });

    console.log(`Fetched ${final.length} latest jobs`);
    let temp = final.map((element) => ({
      jobName: toTitleCase(element.name),
      salary: checkForSalary(element.price),
      ownerName: toTitleCase(element.creatorInfo.createdByName),
      contactNumber: toTitleCase(element.creatorInfo.createdByUsername),
      location: toTitleCase(element.location.locationDescription),
      createdTime: element.createdTime,
    }));
    // Clear existing jobs in the database
    await Job.deleteMany({});

    // Save all jobs to MongoDB in a single insertMany operation
    await Job.insertMany(temp);
  } catch (error) {
    console.error("Error fetching and saving data:", error.message);
    // or console.error("Error fetching and saving data:", error.response.data);
  }
}

module.exports = { fetchData };
