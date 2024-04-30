const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const newUser = new User({ username, email });
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
