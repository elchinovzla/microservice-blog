const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.status(200).send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const postId = req.params.id;

  const comments = commentsByPostId[postId] || [];
  const newComment = { id: commentId, content, status: "PENDING" };
  comments.push(newComment);

  commentsByPostId[postId] = comments;

  await axios.post("http://event-bus-srv:4005/events", {
    type: "COMMENT_CREATED",
    data: {
      id: commentId,
      content,
      postId,
      status: "PENDING",
    },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  const { data, type } = req.body;
  if (type === "COMMENT_MODERATED") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    await axios.post("http://event-bus-srv:4005/events", {
      type: "COMMENT_UPDATED",
      data: {
        id,
        postId,
        content,
        status,
      },
    });
  }

  res.status(200);
});

app.listen(4001, () => {
  console.log("comments service listening in port 4001");
});
