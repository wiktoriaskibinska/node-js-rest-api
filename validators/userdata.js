const Joi = require("joi");

const credentialsSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "pl", "gmail"] },
    })
    .required(),
});
const validateCredentials = async (req, res, next) => {
  const { error } = credentialsSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = validateCredentials;
