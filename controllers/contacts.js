//response plus uzycie metod baz danych
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");
const ID = nanoid();
const contactsPath = path.join(__dirname, "..", "models", "contacts.json");
console.log(contactsPath);

const Contact = require("../models/contactsSchema");

const getContacts = async (req, res, next) => {
  try {
    const results = await Contact.find();

    res.json({
      status: "success",
      code: 200,
      data: { results },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find(({ id }) => id === contactId);
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(({ id }) => id === contactId);
  if (index !== -1) {
    contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return true;
  }
  return false;
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
