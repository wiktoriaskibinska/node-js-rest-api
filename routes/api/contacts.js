const express = require("express");
const contacts = require("../../models/contacts");
const {
  validateNewData,
  validateUpdates,
} = require("../../validators/validation");
const { handleContactNotFound } = require("../../helpers/404handler");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const allcontacts = await contacts.listContacts();
    res.json({
      status: "success",
      code: 200,
      data: {
        allcontacts,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const allContacts = await contacts.listContacts();
    const [contact] = allContacts.filter((contact) => contact.id === contactId);
    if (contact) {
      res.json({
        status: "success",
        code: 200,
        data: {
          contact,
        },
      });
    } else {
      handleContactNotFound(req, res, next);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", validateNewData, async (req, res, next) => {
  try {
    const newContact = await contacts.addContact(req.body);
    res.status(201).json({
      status: "success",
      code: 201,
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const isDeleted = await contacts.removeContact(contactId);
    if (isDeleted) {
      res.status(200).json({ message: "contact deleted" });
    } else {
      handleContactNotFound(req, res, next);
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", validateUpdates, async (req, res, next) => {
  const { contactId } = req.params;
  const updates = req.body;
  try {
    const updatedContact = await contacts.updateContact(contactId, updates);
    if (!updatedContact) {
      handleContactNotFound(req, res, next);
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
