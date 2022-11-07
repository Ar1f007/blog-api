const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

module.exports = validator;