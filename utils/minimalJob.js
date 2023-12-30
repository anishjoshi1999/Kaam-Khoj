const axios = require("axios");
const Job = require("../Models/Job");
async function fetchData(res) {
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

    const filteredJobInfos1 = withPhoneNumbers.filter((element) => {
      return regex.test(element.name.toLowerCase());
    });

    const filteredJobInfos = filteredJobInfos1.filter((element) => {
      return !excludeRegex.test(element.name.toLowerCase());
    });

    console.log(`Fetched ${filteredJobInfos.length} jobs`);

    // Clear existing jobs in the database
    await Job.deleteMany({});

    // Save each job to MongoDB
    for (const element of filteredJobInfos) {
      const job = new Job({
        jobName: toTitleCase(element.name),
        salary: element.price,
        ownerName: toTitleCase(element.creatorInfo.createdByName),
        contactNumber: toTitleCase(element.creatorInfo.createdByUsername),
        location: toTitleCase(element.location.locationDescription),
      });

      await job.save();
    }

    console.log("Jagir Khoj");
    res.redirect("/");
  } catch (error) {
    console.error("Error fetching and saving data:", error);
  }
}

function toTitleCase(inputString) {
  const words = inputString.toLowerCase().split(" ");
  const titleCaseWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return titleCaseWords.join(" ");
}

module.exports = { fetchData };
