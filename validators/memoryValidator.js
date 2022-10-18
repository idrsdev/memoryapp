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

  const { error } = memorySchema.validate(payload);

  if (error) {
    throw new Error(error);
  }
  next();
};

export { newMemoryValidation };
