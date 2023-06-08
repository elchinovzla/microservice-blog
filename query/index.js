const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const posts = {};

const handleEvent = (type, data) => {
  const { id, content, postId, status } = data;
  const post = posts[postId];

  switch (type) {
    case "POST_CREATED":
      const { title } = data;
      posts[id] = { id, title, comments: [] };
      break;
    case "COMMENT_CREATED":
      post?.comments?.push({ id, content, status });
      break;
    case "COMMENT_UPDATED":
      const comment = post.comments.find((comment) => comment.id === id);
      comment.status = status;
      comment.content = content;
      break;
  }
};

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.status(201);
});

app.listen(4002, async () => {
  console.log("query service listing in port 4002");

  try {
    const res = await axios.get("http://localhost:4005/events");
    for (let event of res.data) {
      console.log("Processing event: " + event.type);
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log("error in query service: " + error);
  }
});
