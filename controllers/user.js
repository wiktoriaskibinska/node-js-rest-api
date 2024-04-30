const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const jimp = require("jimp");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs");

require("dotenv").config();
const secret = process.env.SECRET;
const tmpDir = path.join(__dirname, "tmp");
const publicDir = path.join(__dirname, "public");
const avatarsDir = path.join(publicDir, "avatars");

const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email });
  try {
    if (user) {
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "Email is already in use",
        data: "Conflict",
      });
    }

    const avatarURL = gravatar.url(req.body.email, {
      s: "250",
      r: "pg",
      d: "identicon",
    });
    const newUser = new User({ username, email, avatarURL });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password",
      data: "Bad request",
    });
  }

  const payload = {
    id: user._id,
    username: user.username,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user._id, { token: token });
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    status: "success",
    code: 204,
    data: {
      message: "user logout",
    },
  });
  if (!result) {
    res.json({
      status: "error",
      code: 401,
      data: {
        message: "Not authorized",
      },
    });
  }
};

const current = async (req, res, next) => {
  const user = req.user;
  res.json({
    status: "succes",
    code: 200,
    data: { email: user.email, subscription: user.subscription },
  });
};

module.exports = {
  register,
  login,
  logout,
  current,
};
