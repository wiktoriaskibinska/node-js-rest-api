const handleContactNotFound = (req, res, next) => {
  res.status(404).json({ message: "Contact not found " });
};
module.exports = {
  handleContactNotFound,
};
