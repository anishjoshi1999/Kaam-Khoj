const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

// Enable CORS for all routes
app.use(cors());
dotenv.config();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// Enable body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = process.env.PORT || 3000;
const MONGODB_URI = `${process.env.MONGODB_URI}`;
//Import Routes
const kaamKhojRoute = require("./Routes/kaamKhojRoute");
const facebookRoute = require("./Routes/facebookRoute");
const apiRoute = require("./Routes/apiRoute");
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

//Routes
app.get("/", (req, res) => {
  res.send("Kaam Khoj");
});
app.use("/kaamkhoj", kaamKhojRoute);
app.use("/api", apiRoute);
app.use("/facebook", facebookRoute);
