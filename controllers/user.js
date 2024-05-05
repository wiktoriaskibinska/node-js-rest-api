const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const jimp = require("jimp");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const { nanoid } = require("nanoid");
require("dotenv").config();
const secret = process.env.SECRET;
const publicDir = path.join(__dirname, "..", "public");
const avatarsDir = path.join(publicDir, "avatars");
const MAILGUN_KEY = process.env.MAILGUN_KEY;
const MAILGUN_DOMAIN = process.env.DOMAIN;

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: MAILGUN_KEY,
});

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
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
    const verificationToken = nanoid();
    const newUser = new User({ email, avatarURL });
    newUser.verificationToken = verificationToken;
    newUser.verify = false;
    newUser.setPassword(password);
    await newUser.save();
    const verificationUrl = `http://localhost:8080/users/verify/${verificationToken}`;
    const data = {
      from: "Wika <wikas4000@wp.pl>",
      to: newUser.email,
      subject: "Please verify your email",
      text: `Kliknij ten link, aby zweryfikować swój email: ${verificationUrl}`,
      html: `<strong>Kliknij ten link, aby zweryfikować swój email:</strong> <a href="${verificationUrl}">${verificationUrl}</a>`,
    };
    mg.messages
      .create(MAILGUN_DOMAIN, data)
      .then((msg) => console.log(msg))
      .catch((err) => console.log(err));

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

  if (!user || !user.validPassword(password) || !user.verify) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password or unverified email",
      data: "Bad request",
    });
  }

  const payload = {
    id: user._id,
    email: user.email,
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
    data: {
      email: user.email,
      subscription: user.subscription,
      avatar: user.avatarURL || null,
    },
  });
};

const updateAvatar = async (req, res, next) => {
  try {
    const { file, user } = req;
    const image = await jimp.read(file.path);
    await image.resize(250, 250).writeAsync(file.path);
    const newFilename = `${Date.now()}-${file.originalname}`;
    const newFilePath = path.join(avatarsDir, newFilename);
    await fs.promises.rename(file.path, newFilePath);
    const avatarURL = `/avatars/${newFilename}`;
    await User.findByIdAndUpdate(user._id, {
      avatarURL: avatarURL,
    });

    res.json({
      status: "success",
      code: 200,
      data: {
        avatarURL,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Błąd podczas aktualizacji awatara" });
  }
};
const verifyemail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.verificationToken,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification link has already been used" });
    }
    user.verify = true;
    user.verificationToken = null;
    await user.save();
    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

const resendEmail = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }
    const verificationToken = user.verificationToken;
    const verificationUrl = `http://localhost:8080/users/verify/${verificationToken}`;
    const data = {
      from: "Wika <wikas4000@wp.pl>",
      to: user.email,
      subject: "Please verify your email",
      text: `Kliknij ten link, aby zweryfikować swój email: ${verificationUrl}`,
      html: `<strong>Kliknij ten link, aby zweryfikować swój email:</strong> <a href="${verificationUrl}">${verificationUrl}</a>`,
    };
    mg.messages
      .create(MAILGUN_DOMAIN, data)
      .then((msg) => console.log(msg))
      .catch((err) => console.log(err));

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  current,
  updateAvatar,
  verifyemail,
  resendEmail,
};
