const express = require("express");
const contacts = require("../../models/contacts");

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
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "missing required field" });
  }
  const newContact = await contacts.addContact(req.body);
  res.status(201).json({
    status: "success",
    code: 201,
    data: newContact,
  });
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const isDeleted = await contacts.removeContact(contactId);
  if (isDeleted) {
    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
