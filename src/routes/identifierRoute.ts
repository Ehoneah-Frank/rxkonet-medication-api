import { body } from "express-validator";
import { Router } from "express";
import { createIdentifier, getIdentifierById, updateIdentifier, deleteIdentifier, getAllIdentifiers, getPaginatedIdentifiers } from "../controllers/identiferController";
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

identifierRouter.get('/identifiers', getAllIdentifiers);

identifierRouter.get('/identifiers/paginated', getPaginatedIdentifiers);

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