import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/User.js";

const register = async (req, res, next) => {
  //Get Datas from the Request
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res
      .status(404)
      .json({ message: "Please provide all required fields." });
  }

  try {
    //Check User is already Esists or not
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res
        .status(404)
        .json({ message: "That email address is already in use." });
    }
    //Hash the Password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Create and Save New User
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const login = async (req, res, next) => {
  //Get the Datas from Request
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "Please fill the user's information." });
  }

  try {
    //Check User is Esists or not and reference from the friends Collection
    const foundUser = await User.findOne({ email })
      .select("+password")
      .populate({
        path: "friends",
        select: "firstName lastName location profileImage -password",
      });
    if (!foundUser) {
      return res.status(404).json({ message: "Invalid Email." });
    }
    //Compare the Password
    const matchPassword = await bcrypt.compare(password, foundUser?.password);
    if (!matchPassword) {
      return res.status(404).json({ message: "Invalid Password." });
    }
    //Not Send the Password to Front-End
    foundUser.password = undefined;
    //Create JWT
    const token = jwt.sign(
      { userId: foundUser?._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      success: true,
      message: "Login successfully.",
      user: foundUser,
      token,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export { register, login };
