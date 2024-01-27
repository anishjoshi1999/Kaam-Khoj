const express = require("express");
const Job = require("../Models/Job");
const Service = require("../Models/service");
const Contact = require("../Models/Contact");
const router = express.Router();

const { fetchData } = require("../utils/minimalJob");
const { fetchServiceData } = require("../utils/service");
const { fetchContact } = require("../utils/grabContact");

router.get("/jobs", async (req, res) => {
  await fetchData();
  res.redirect("/");
});
// router.get("/contact", async (req, res) => {
//   //const uniqueContacts = await Contact.find({});
//   // console.log("Grabing all the Contact From HamroBazzar");
//   // await fetchContact();
//   // res.redirect("/");
// });
// router.get("/contact/show", async (req, res) => {
//   try {
//     // Use aggregate pipeline to group by name and contact
//     const uniqueContacts = await Contact.aggregate([
//       {
//         $group: {
//           _id: { name: "$name", contact: "$contact" },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           name: "$_id.name",
//           contact: "$_id.contact",
//         },
//       },
//     ]);
//     console.log(`Unique Contact Information: ${uniqueContacts.length}`);
//     res.json(uniqueContacts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
router.get("/services", async (req, res) => {
  await fetchServiceData();
  res.redirect("/");
});

module.exports = router;
