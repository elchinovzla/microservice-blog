const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const posts = {};

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  const { id } = data;
  switch (type) {
    case "POST_CREATED":
      const { title } = data;
      posts[id] = { id, title, comments: [] };
      break;
    case "COMMENT_CREATED":
      const { content, postId } = data;
      const post = posts[postId];
      post?.comments?.push({ id, content });
      break;
    default:
      console.log("event type unknown");
      res.status(500);
  }

  res.status(201);
});

app.listen(4002, () => {
  console.log("query service listing in port 4002");
});
