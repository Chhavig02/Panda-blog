import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const commentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
});

export const validateComment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

