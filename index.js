const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

const PORT = process.env.PORT || 3000;
const MONGODB_URI = `${process.env.MONGODB_URI}`;
//Import Routes
const kaamKhojRoute = require("./Routes/kaamKhojRoute");
const facebookRoute = require("./Routes/facebookRoute");
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
app.use("/facebook", facebookRoute);
