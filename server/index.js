const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRoute = require("./Routes/AuthRoute");
const cookieParser = require("cookie-parser");

const app = express();
const port = 5000;
app.use(cookieParser());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use("/auth", AuthRoute);
