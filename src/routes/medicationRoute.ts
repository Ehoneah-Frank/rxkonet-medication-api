import { body } from "express-validator";
import { Router } from "express";
import { createMedication, getMedicationById, updateMedication, deleteMedication } from "../controllers/medicationController";
import { validateInput } from "../middlewares/validationMiddleware";

const medicationRouter = Router();

medicationRouter.post('/medications', 
    [
        body('resourceType').isString().notEmpty(),
        body('status').isString().notEmpty(),
        body('brandName').isString().notEmpty(),
        body('code.coding').isArray().notEmpty(),
        body('code.coding.*.system').isString().notEmpty(),
        body('code.coding.*.code').isString().notEmpty(),
        body('code.coding.*.display').isString().notEmpty(),
        body('manufacturer.name').isString().notEmpty(),
        body('ingredients').isArray().notEmpty(),
        body('ingredients.*.item.coding').isArray().notEmpty(),
        body('ingredients.*.strength.numerator.value').isNumeric(),
        body('ingredients.*.strength.numerator.unit').isString().notEmpty(),
        body('ingredients.*.strength.numerator.system').isString().notEmpty(),
        body('ingredients.*.strength.numerator.code').isString().notEmpty(),
    ],
    validateInput,
    createMedication
);

medicationRouter.get('/medications/:id', getMedicationById);

medicationRouter.patch('/medications/:id',
    [
        body('status').optional().isString(),
        body('brandName').optional().isString(),
        body('code.coding').optional().isArray(),
        body('code.coding.*.system').optional().isString(),
        body('code.coding.*.code').optional().isString(),
        body('code.coding.*.display').optional().isString(),
        body('manufacturer.name').optional().isString(),
        body('manufacturer.address').optional().isString(),
        body('manufacturer.contact').optional().isString(),
        body('ingredients').optional().isArray(),
        body('ingredients.*.item.coding').optional().isArray(),
        body('ingredients.*.item.coding.*.system').optional().isString(),
        body('ingredients.*.item.coding.*.code').optional().isString(),
        body('ingredients.*.item.coding.*.display').optional().isString(),
        body('ingredients.*.strength.numerator.value').optional().isNumeric(),
        body('ingredients.*.strength.numerator.unit').optional().isString(),
        body('ingredients.*.strength.numerator.system').optional().isString(),
        body('ingredients.*.strength.numerator.code').optional().isString(),
        body('type').optional().isIn(['generic', 'brand']),
    ],
    validateInput,
    updateMedication
);

medicationRouter.delete('/medications/:id', deleteMedication);

export default medicationRouter;