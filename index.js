const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const methodOverride = require("method-override");

const { PORT, MONGODB_URI } = require("./utils/constants");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
    }),
  })
);
app.use(methodOverride("_method"));

const connectDB = require("./utils/connectDB");

connectDB(MONGODB_URI);

const apiRoute = require("./Routes/apiRoute");
const hamroBazzarRoute = require("./Routes/hamrobazzarRoute");
const facebookRoute = require("./Routes/facebookRoute");

app.get("/", async (req, res) => {
  try {
    res.json({ message: "Welcome To KaamKhoj API" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// To Upload Job Seeker's and Job Provider's Information
app.use("/api", apiRoute);
// To Look through from hamrobazzar
app.use("/hamrobazzar", hamroBazzarRoute);
// To Post it on facebook
app.use("/facebook", facebookRoute);

app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
