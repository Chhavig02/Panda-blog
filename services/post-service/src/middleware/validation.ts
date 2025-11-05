import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const postSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  content: Joi.string().min(1).required(),
  tags: Joi.array().items(Joi.string()).optional(),
  featuredImage: Joi.string().uri().optional(),
  isPremium: Joi.boolean().optional(),
});

export const validatePost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

