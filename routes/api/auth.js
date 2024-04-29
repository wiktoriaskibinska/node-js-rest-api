const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/user");
const auth = require("../../validators/authenticate");
const validateCredentials = require("../../validators/userdata");

router.post("/signup", validateCredentials, ctrl.register);

router.post("/login", validateCredentials, ctrl.login);

router.post("/logout", auth, ctrl.logout);

router.get("/current", auth, ctrl.current);

module.exports = router;
