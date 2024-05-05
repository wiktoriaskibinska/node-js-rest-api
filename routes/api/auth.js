const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/user");
const auth = require("../../validators/authenticate");
const validateCredentials = require("../../validators/userdata");
const multer = require("multer");
const path = require("path");

const tmpDir = path.join(__dirname, "..", "..", "tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/signup", validateCredentials, ctrl.register);

router.post("/login", validateCredentials, ctrl.login);

router.post("/logout", auth, ctrl.logout);

router.get("/current", auth, ctrl.current);

router.post("/avatars", auth, upload.single("avatar"), ctrl.updateAvatar);
router.get("/verify/:veridicationToken", ctrl.verifyemail);

module.exports = router;
