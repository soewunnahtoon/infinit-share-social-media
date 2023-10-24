import express from "express";

import { userAuth } from "../middleware/userAuth.js";
import {
  acceptRequest,
  friendRequest,
  getFriendRequest,
  getUser,
  profileView,
  suggestedFriends,
  updateUser,
} from "../controllers/userControllers.js";

const userRoutes = express.Router();
//User Routes
userRoutes.post("/get-user/:id?", userAuth, getUser);
userRoutes.put("/update-user", userAuth, updateUser);
//Friend Request Routes
userRoutes.post("/friend-request", userAuth, friendRequest);
userRoutes.post("/get-friend-request", userAuth, getFriendRequest);
//Accept or Deny Request Routes
userRoutes.post("/accept-request", userAuth, acceptRequest);
//Views of the Profile Route
userRoutes.post("/profile-view", userAuth, profileView);
//Suggested Friends Route
userRoutes.post("/suggested-friends", userAuth, suggestedFriends);

export { userRoutes };
