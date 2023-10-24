import jwt from "jsonwebtoken";

import { User } from "../models/User.js";
import { FriendRequest } from "../models/FriendRequest.js";

const getUser = async (req, res) => {
  try {
    //Get the User Id from Parameter
    const { id } = req.params;
    const { userId } = req.body.user;
    //Check the User is Exist or not
    const foundUser = await User.findById(id ?? userId).populate({
      path: "friends",
      select: "-password",
    });
    if (!foundUser) {
      return res.status(200).json({
        success: false,
        message: "User not found.",
      });
    }
    //Not Send the Password to Front-End
    foundUser.password = undefined;

    return res.status(200).json({
      success: true,
      user: foundUser,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    //Get the Datas from the Request Body
    const { firstName, lastName, profession, location, profileImage } =
      req.body;
    if (!firstName || !lastName || !profession || !location || !profileImage) {
      return res
        .status(404)
        .json({ message: "Please provide all required fields." });
    }

    const { userId } = req.body.user;
    const updateUser = {
      _id: userId,
      firstName,
      lastName,
      profession,
      location,
      profileImage,
    };
    const foundUser = await User.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });

    await foundUser.populate({ path: "friends", select: "-password" });
    //Create JWT
    const token = jwt.sign(
      { userId: foundUser?._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    foundUser.password = undefined;

    return res.status(200).json({
      sucess: true,
      message: "User updated successfully.",
      user: foundUser,
      token,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const friendRequest = async (req, res) => {
  try {
    //Get the Datas from the Request
    const { userId } = req.body.user;
    const { requestTo } = req.body;
    //Check User is already Request or not
    const foundRequestTo = await FriendRequest.findOne({
      requestTo,
      requestFrom: userId,
    });
    if (foundRequestTo) {
      return res.status(409).json({ message: "Friend request already sent." });
    }
    //Check User has been already Requested or not
    const foundRequestFrom = await FriendRequest.findOne({
      requestTo: userId,
      requestFrom: requestTo,
    });
    if (foundRequestFrom) {
      return res.status(409).json({ message: "Friend request already sent." });
    }
    //Create and Save Friend Request
    const request = await FriendRequest.create({
      requestTo,
      requestFrom: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Friend request sent successfully.",
      data: request,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getFriendRequest = async (req, res) => {
  try {
    //Get the Datas from Request
    const { userId } = req.body.user;
    //Find the Request
    const request = await FriendRequest.find({
      requestTo: userId,
      requestStatus: "Pending",
    })
      .populate({
        path: "requestFrom",
        select: "firstName lastName profileImage location profession -password",
      })
      .limit(10)
      .sort({
        _id: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Get request lists successfully.",
      data: request,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const acceptRequest = async (req, res) => {
  try {
    //Get the Datas from the Request
    const { userId } = req.body.user;
    const { requestId, status } = req.body;
    //Check Friend Request Exist or not
    const foundRequest = await FriendRequest.findById(requestId);
    if (!foundRequest) {
      return res.status(409).json({ message: "No friend request found." });
    }
    //Update Accept Status in the database
    const updateAccept = await FriendRequest.findByIdAndUpdate(
      { _id: requestId },
      { requestStatus: status }
    );

    if (status === "Accepted") {
      //Add the Friend in the User List
      const user = await User.findById(userId);
      user.friends.push(updateAccept?.requestFrom);
      await user.save();
      //Add the User in the Friend List
      const friend = await User.findById(updateAccept?.requestFrom);
      friend.friends.push(updateAccept?.requestTo);
      await friend.save();
    }

    return res.status(201).json({
      success: true,
      message: "Friend request accepted.",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const profileView = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.body.user;

    const user = await User.findById(id);
    if (user.views.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User already viewed this profile.",
      });
    }
    user.views.push(userId);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Profile view add successfully.",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const suggestedFriends = async (req, res) => {
  try {
    const { userId } = req.body.user;

    let queryObject = {};
    queryObject._id = { $ne: userId };
    queryObject.friends = { $nin: userId };

    const suggestedFriends = await User.find(queryObject)
      .limit(10)
      .select("firstName lastName profileImage profession -password");

    return res.status(200).json({
      success: true,
      message: "Add suggested friends successfully.",
      data: suggestedFriends,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getUser,
  updateUser,
  friendRequest,
  getFriendRequest,
  acceptRequest,
  profileView,
  suggestedFriends,
};
