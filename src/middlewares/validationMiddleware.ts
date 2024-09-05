import { Request, Response, NextFunction } from "express";
import {body, validationResult} from "express-validator"

// Middleware for input validation
export const validateInput = (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

