import { body } from "express-validator";
import { Router } from "express";
import { createIdentifier, getIdentifierById, updateIdentifier, deleteIdentifier } from "../controllers/identiferController";
import { validateInput } from "../middlewares/validationMiddleware";

const identifierRouter = Router();

identifierRouter.post('/identifiers', 
    [
        body('system').isString().notEmpty(),
        body('value').isString().notEmpty(),
    ],
    validateInput,
    createIdentifier
);

identifierRouter.get('/identifiers/:id', getIdentifierById);

identifierRouter.patch('/identifiers/:id',
    [
        body('system').optional().isString(),
        body('value').optional().isString(),
    ],
    validateInput,
    updateIdentifier
);

identifierRouter.delete('/identifiers/:id', deleteIdentifier);

export default identifierRouter;