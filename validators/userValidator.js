import Joi from "joi";

const validateNewUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    throw new Error(error);
  }
  next();
};

const validateAuthCredentials = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    throw new Error(error);
  }
  next();
};

export { validateNewUser, validateAuthCredentials };
