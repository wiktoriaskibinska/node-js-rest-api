const Joi = require("joi");
const updateSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email(),
  phone: Joi.string().regex(/^\d{3}-\d{3}-\d{4}$/),
}).or("name", "email", "phone");

const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^\d{3}-\d{3}-\d{3}$/)
    .required(),
});

const validateNewData = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
const validateUpdates = (req, res, next) => {
  const { error } = updateSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "missing fields " + error.details[0].message });
  }
  next();
};

module.exports = {
  validateNewData,
  validateUpdates,
};
