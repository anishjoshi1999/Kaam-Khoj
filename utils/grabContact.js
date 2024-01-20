const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const Contact = require("../Models/Contact");

async function fetchContact() {
  try {
    const response = await axios.get(
      "https://api.hamrobazaar.com/api/AppData/GetAllCategory",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "access-control-allow-origin": "*",
          apikey: `${process.env.APIKEY}`,
          country_code: "null",
          deviceid: `${process.env.DEVICEID}`,
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
      }
    );

    // Do something with the response data
    const { data } = response.data;
    for (const category of data) {
      console.log(`Currently Scraping ${category.id} Category`);
      await getAll(category.id);
    }
  } catch (error) {
    // Handle errors
    console.error("Error fetching data:", error.message);
  }
}

async function getAll(CategoryId, nextPageNumber = 1) {
  try {
    const response = await axios.get(
      `https://api.hamrobazaar.com/api/Product?PageSize=250&CategoryId=${CategoryId}&IsHBSelect=false&PageNumber=${nextPageNumber}`,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,la;q=0.7,ne;q=0.6",
          "access-control-allow-origin": "*",
          apikey: `${process.env.APIKEY}`,
          "cache-control": "no-cache",
          country_code: "null",
          deviceid: `${process.env.DEVICEID}`,
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
    let { data } = response.data;
    let nextPage = response.data.nextPageNumber;

    let totalRecords = response.data.totalRecords;

    if (nextPage != null) {
      console.log(`Currently Scraping Page ${nextPage}`);
      if (nextPage == 2) {
        console.log(`Total Records: ${totalRecords}`);
      }
      const value = [];
      const uniqueSet = new Set();

      data.forEach((element) => {
        if (!element.creatorInfo.createdByUsername.includes("*")) {
          const contactObject = {
            name: element.creatorInfo.createdByName,
            contact: element.creatorInfo.createdByUsername,
          };

          // Convert the contact object to a string for Set comparison
          const contactString = JSON.stringify(contactObject);

          if (!uniqueSet.has(contactString)) {
            // If the contact object is not in the Set, push it to the array and add it to the Set
            value.push(contactObject);
            uniqueSet.add(contactString);
          }
        }
      });
      try {
        await Contact.insertMany(value);
        console.log(
          `Successfully inserted Contact Information for ${nextPage - 1}`
        );
        delete value;
        delete uniqueSet;
      } catch (error) {
        console.log("Something went wrong");
      }
      await getAll(CategoryId, nextPage);
    } else {
      return;
    }
  } catch (error) {
    // Handle errors
    console.error("Error fetching data:", error.message);
  }
}

module.exports = { fetchContact };
