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

router.get("/:contactId", ctrl.getContactById);

router.post("/", validateNewData, ctrl.addContact);

router.delete("/:contactId", ctrl.removeContact);

router.put("/:contactId", validateUpdates, ctrl.updateContact);

router.patch("/:contactId/favorite", validateFavorite, ctrl.updateFavorite);
module.exports = router;
