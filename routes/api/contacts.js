const express = require("express");
const {
  validateNewData,
  validateUpdates,
} = require("../../validators/validation");
const { handleContactNotFound } = require("../../helpers/404handler");
const { sendResponse } = require("../../helpers/response");
const router = express.Router();
const ctrl = require("../../controllers/contacts");

router.get("/", ctrl.getContacts);

router.get("/:contactId", ctrl.getContactById);

router.post("/", validateNewData, ctrl.addContact);

router.delete("/:contactId", ctrl.removeContact);

router.put("/:contactId", validateUpdates, async (req, res, next) => {
  const { contactId } = req.params;
  const updates = req.body;
  try {
    const updatedContact = await contacts.updateContact(contactId, updates);
    if (!updatedContact) {
      handleContactNotFound(req, res, next);
    }
    sendResponse(res, 200, { updatedContact });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
