import Joi from "joi";
const memorySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.array(),
  images: Joi.array(),
  user: Joi.object(),
});

const newMemoryValidation = async (req, res, next) => {
  const payload = {
    title: req.body.title,
    description: req.body.description,
    tags: req.body.tags,
    images: req.body.images,
    user: Joi.object(),
  };

  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  const { error } = memorySchema.validate(payload, options);

  if (error) {
    throw new Error(error);
  }
  next();
};

export { newMemoryValidation };
