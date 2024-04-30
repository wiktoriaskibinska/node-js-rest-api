const express = require("express");
const {
  validateNewData,
  validateUpdates,
  validateFavorite,
} = require("../../validators/validation");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const auth = require("../../validators/authenticate");

router.get("/", auth, ctrl.getContacts);

router.get("/:contactId", auth, ctrl.getContactById);

router.post("/", validateNewData, auth, ctrl.addContact);

router.delete("/:contactId", auth, ctrl.removeContact);

router.put("/:contactId", validateUpdates, auth, ctrl.updateContact);

router.patch(
  "/:contactId/favorite",
  validateFavorite,
  auth,
  ctrl.updateFavorite
);
module.exports = router;
