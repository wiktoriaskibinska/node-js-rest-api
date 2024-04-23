//response plus uzycie metod baz danych
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");
const ID = nanoid();
const contactsPath = path.join(__dirname, "..", "models", "contacts.json");
const { handleContactNotFound } = require("../helpers/404handler");
const { sendResponse } = require("../helpers/response");

const Contact = require("../models/contactsSchema");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};
//Task.find()
const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    sendResponse(res, 200, { contacts });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
//Task.findOne({ _id: id })
const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findOne({ _id: contactId });
    if (contact) {
      sendResponse(res, 200, { contact });
    } else {
      handleContactNotFound(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};
//Task.findByIdAndDelete({ _id: id })
const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleted = await Contact.findByIdAndDelete({ _id: contactId });
    if (deleted) {
      res.status(200).json({ message: "contact deleted" });
    } else {
      handleContactNotFound(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const { name, email, phone } = body;
  const newContact = { ID, name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

module.exports = {
  getContacts,
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
