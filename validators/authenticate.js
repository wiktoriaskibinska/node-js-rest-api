const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("../models/userSchema");
require("dotenv").config();
const secret = process.env.SECRET;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

// JWT Strategy
passport.use(
  new Strategy(params, async (payload, done) => {
    try {
      const user = await User.findOne({
        _id: payload.id,
      });
      if (!user) {
        return done(new Error("User not found"));
      }
      return done(null, user);
    } catch (err) {
      done(err);
    }
  })
);

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err || !user.token) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
        data: "Unauthorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = auth;
