import { body } from "express-validator";
import { Router } from "express";
import { createMedication, getMedicationById, updateMedication, deleteMedication, getAllMedications, getPaginatedMedications } from "../controllers/medicationController";
import { validateInput } from "../middlewares/validationMiddleware";

const medicationRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Medications
 *   description: API for managing medications
 */

/**
 * @swagger
 * /medications:
 *   post:
 *     tags: [Medications]
 *     summary: Create a new medication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resourceType:
 *                 type: string
 *               status:
 *                 type: string
 *               brandName:
 *                 type: string
 *               code:
 *                 type: object
 *                 properties:
 *                   coding:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         system:
 *                           type: string
 *                         code:
 *                           type: string
 *                         display:
 *                           type: string
 *               manufacturer:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     item:
 *                       type: object
 *                       properties:
 *                         coding:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               system:
 *                                 type: string
 *                               code:
 *                                 type: string
 *                               display:
 *                                 type: string
 *                     strength:
 *                       type: object
 *                       properties:
 *                         numerator:
 *                           type: object
 *                           properties:
 *                             value:
 *                               type: number
 *                             unit:
 *                               type: string
 *                             system:
 *                               type: string
 *                             code:
 *                               type: string
 *     responses:
 *       '201':
 *         description: Medication created successfully
 *       '400':
 *         description: Invalid input
 */
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

/**
 * @swagger
 * /medications/{id}:
 *   get:
 *     tags: [Medications]
 *     summary: Get a medication by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the medication
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Medication found
 *       '404':
 *         description: Medication not found
 */
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

medicationRouter.get('/medications', getAllMedications);
medicationRouter.get('/medications/paginated', getPaginatedMedications);

export default medicationRouter;