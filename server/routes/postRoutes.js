import express from "express";

import { userAuth } from "../middleware/userAuth.js";
import {
  createPost,
  getPosts,
  getPost,
  getUserPosts,
  likePost,
  commentPost,
  deletePost,
  getComments,
  likeComment,
  replyComment,
} from "../controllers/postControllers.js";

const postRoutes = express.Router();

postRoutes.post("/create-post", userAuth, createPost);
postRoutes.post("/", userAuth, getPosts);
postRoutes.post("/:id", userAuth, getPost);
postRoutes.post("/get-user-posts/:id", userAuth, getUserPosts);
postRoutes.post("/like/:id", userAuth, likePost);
postRoutes.post("/comment/:id", userAuth, commentPost);
postRoutes.delete("/:id", userAuth, deletePost);
postRoutes.get("/comments/:postId", getComments);
postRoutes.post("/like-comment/:id/:replyId?", userAuth, likeComment);
postRoutes.post("/reply-comment/:id", userAuth, replyComment);

export { postRoutes };
