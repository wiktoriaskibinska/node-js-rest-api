const { handleContactNotFound } = require("../helpers/404handler");
const { sendResponse } = require("../helpers/response");

const Contact = require("../models/contactsSchema");
const User = require("../models/userSchema");

const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ owner: req.user._id });
    sendResponse(res, 200, { contacts });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findOne({
      _id: contactId,
      owner: req.user._id,
    });
    if (contact) {
      sendResponse(res, 200, { contact });
    } else {
      handleContactNotFound(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleted = await Contact.findByIdAndDelete({
      _id: contactId,
      owner: req.user._id,
    });
    if (deleted) {
      res.status(200).json({ message: "contact deleted" });
    } else {
      handleContactNotFound(req, res, next);
    }
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const newContactData = { ...req.body, owner: req.user._id };
    const newContact = await Contact.create(newContactData);
    sendResponse(res, 201, { newContact });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      { _id: contactId, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!updatedContact) {
      handleContactNotFound(req, res, next);
    }
    sendResponse(res, 200, { updatedContact });
  } catch (error) {
    next(error);
  }
};
const updateFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );
    if (!updatedContact) {
      handleContactNotFound(req, res, next);
    }
    sendResponse(res, 200, { updatedContact });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getContacts,
  updateFavorite,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
