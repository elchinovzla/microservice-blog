const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", (req, res) => {
  const event = req.body;

  axios
    .post("http://localhost:4000/events", event)
    .catch((error) => console.log("4000 service error out: " + error.code));
  axios
    .post("http://localhost:4001/events", event)
    .catch((error) => console.log("4001 service error out: " + error.code));
  axios
    .post("http://localhost:4002/events", event)
    .catch((error) => console.log("4002 service error out: " + error.code));

  res.status(200);
});

app.listen(4005, () => {
  console.log("event-bus listening in port 4005");
});
