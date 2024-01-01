const axios = require("axios");
const Service = require("../Models/service");
const { toTitleCase, checkForSalary } = require("./usefulMethods");
async function fetchServiceData() {
  try {
    const response = await axios(
      "https://api.hamrobazaar.com/api/Product?PageSize=6000&CategoryId=AA71A415-8970-46FF-A775-D1BC2089CB87&IsHBSelect=false&PageNumber=1",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "access-control-allow-origin": "*",
          apikey: "09BECB8F84BCB7A1796AB12B98C1FB9E",
          country_code: "null",
          deviceid: "89700155-17fd-452c-b9e4-718f5dc70c5f",
          devicesource: "web",
          "sec-ch-ua":
            '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
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
    console.log(response.data.data.length);
    console.log(withPhoneNumbers);
    let final = withPhoneNumbers.filter((job) => {
      return (
        job.createdTime.includes("mins") ||
        job.createdTime.includes("hours") ||
        job.createdTime.includes("days") ||
        (job.createdTime.includes("1 month") &&
          !job.createdTime.includes("11 months"))
      );
    });
    // Clear existing services in the database
    await Service.deleteMany({});
    const finalService = final.map((element) => {
      return {
        jobName: toTitleCase(element.name),
        desiredSalary: checkForSalary(element.price),
        employeeName: toTitleCase(element.creatorInfo.createdByName),
        contactNumber: toTitleCase(element.creatorInfo.createdByUsername),
        location: toTitleCase(element.location.locationDescription),
        createdTime: element.createdTime,
      };
    });
    await Service.insertMany(finalService);
    console.log(`${finalService.length} Data saved to MongoDB successfully.`);
  } catch (error) {
    console.error("Error fetching and saving data:", error);
  }
}

// (async () => {
//   await fetchData();
// })();

module.exports = { fetchServiceData };
