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
  res.status(201);
});

app.listen(4002, () => {
  console.log("query service listing in port 4002");
});
