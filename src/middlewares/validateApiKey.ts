import { Request, Response, NextFunction } from 'express';
import { userModel } from '../models/userModel';

const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({ error: 'API key is missing' });
  }

  const user = await userModel.findOne({ apiKey });

  if (!user) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
};

export default validateApiKey;
