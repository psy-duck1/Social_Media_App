import User from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import Post from "../models/post.js";

dotenv.config();

const register = async (req, res) => {
  const { name, email, password, secret } = req.body;
  console.log("reached");
  if (!name) return res.status(400).send("Name is required");
  if (!password || password.length < 6) {
    return res
      .status(400)
      .send("Password is required and should be 6 characters long");
  }

  if (!secret) {
    return res.status(400).send("Answer is required");
  }
  const exist = await User.findOne({ email });
  //   console.log(exist);
  if (exist) {
    return res.status(400).send("Email is taken");
  }
  //hash password
  const hashedPassword = await hashPassword(password);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    secret,
    username: nanoid(6),
  });
  try {
    await user.save();

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("try again :err ");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check if our db has username with this email
    console.log("reaching the right place", req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("No user found");
    //check pass
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Incorrect Password");
    console.log(user);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    //dont send password to frontend
    user.password = undefined;
    user.secret = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    // console.log("error on bXKWND")
    return res.status(400).send("Error");
  }
};

const currentUser = async (req, res) => {
  //the middleware applied automatically adds user info in auth
  // console.log(req);
  try {
    const user = await User.findById(req.auth._id);

    res.json({
      ok: true,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
const forgotPassword = async (req, res) => {
  const { email, NewPassword, secret } = req.body; //
  console.log(req.body);

  if (!NewPassword || NewPassword.length < 6) {
    return res.status(400).json({
      error: "Password should be min 6 characters long",
    });
  }
  if (!secret) {
    return res.status(400).json({
      error: "Secret is required",
    });
  }
  const user = await User.findOne({ email, secret });
  if (!user) {
    return res.status(400).json({
      error: "We can't verify your details",
    });
  }
  try {
    const hashed = await hashPassword(NewPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    return res.json({
      success: "You can now login with your new password",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something went wrong. Try again.",
    });
  }
};
const profileUpdate = async (req, res) => {
  try {
    console.log(req.body);
    const data = {};
    if (req.body.username) {
      data.username = req.body.username;
    }
    if (req.body.bio) {
      data.bio = req.body.bio;
    }
    if (req.body.name) {
      data.name = req.body.name;
    }
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res
          .status(400)
          .send("Password should be minimum 6 character long");
      } else data.password = req.body.password;
    }
    if (req.body.secret) {
      data.secret = req.body.secret;
    }
    if (req.body.image) {
      data.image = req.body.image;
    }

    let user = await User.findByIdAndUpdate(req.auth._id, data, { new: true });
    //  console.log("updated user",user);
    user.password = undefined;
    user.secret = undefined;

    return res.json(user);
  } catch (err) {
    if (err.code == 11000) {
      return res.status(400).send("Duplciate username");
    }
    console.log(err);
  }
};

const findPeople = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    //user following
    let following = user.following;
    following.push(req.auth._id);
    //all users which the user is not following
    const people = await User.find({ _id: { $nin: following } }).limit(10);
    res.json(people);
  } catch (err) {}
};
const addFollower = async (req, res, next) => {
  try {
    console.log("addFollower", req.body);
    const user = await User.findByIdAndUpdate(
      req.body._id,
      {
        $addToSet: { followers: req.auth._id },
      },
      { new: true }
    );
    next();
  } catch (err) {
    console.log(err);
  }
};
const userFollow = async (req, res) => {
  try {
    console.log("userFollow", req.body._id);
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $addToSet: { following: req.body._id },
      },
      { new: true }
    ).select("-password -secret");
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};
const userFollowing = async (req, res) => {
  try {
    console.log("userfollowing");
    const user = await User.findById(req.auth._id);
    const following = await User.find({ _id: user.following }).limit(100);
    res.json(following);
  } catch (err) {
    console.log(err);
  }
};
const removeFollower = async (req, res, next) => {
  try {
    console.log(req.body._id);
    const user = await User.findByIdAndUpdate(req.body._id, {
      $pull: { followers: req.auth._id },
    });
    next();
  } catch (err) {
    console.log(err);
  }
};
const userUnfollow = async (req, res) => {
  try {
    
   console.log("reached",req.body._id);
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      { $pull: { following: req.body._id } },
      { new: true }
    );
    console.log(user);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};
const searchUser = async (req, res) => {
  const { query } = req.params;

  try {
    const user = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    });
    user.password = undefined;
    user.secret = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};
const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
    user.password=undefined;
    user.secret=undefined;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const posts=await Post.find({postedBy:user._id}).populate("postedBy", "_id name image")
    res.json({user,posts});
    
  } catch (err) {
    console.log(err);
  }
};

export {
  register,
  login,
  currentUser,
  forgotPassword,
  profileUpdate,
  findPeople,
  addFollower,
  userFollow,
  userFollowing,
  removeFollower,
  userUnfollow,
  searchUser,
  getUser,
};
