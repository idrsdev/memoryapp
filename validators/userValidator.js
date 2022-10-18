import Joi from "joi";

const validateNewUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    passsword: Joi.string().required(),
  });
  const { error, value } = schema.validate(user);
  return error;
};

const validateAuthCredentials = () => {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string(),
  });

  const { error, value } = schema.validate(req.body);
  return error;
};

export { validateNewUser, validateAuthCredentials };
