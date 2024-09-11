import { body } from "express-validator";
import { Router } from "express";
import { createIdentifier, getIdentifierById, updateIdentifier, deleteIdentifier, getAllIdentifiers, getPaginatedIdentifiers } from "../controllers/identiferController";
import { validateInput } from "../middlewares/validationMiddleware";

const identifierRouter = Router();

/**
 * @swagger
 * /identifiers:
 *   post:
 *     summary: Create a new identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               system:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Identifier created successfully
 *       '400':
 *         description: Invalid input
 */
identifierRouter.post('/identifiers', 
    [
        body('system').isString().notEmpty(),
        body('value').isString().notEmpty(),
    ],
    validateInput,
    createIdentifier
);

/**
 * @swagger
 * /identifiers/{id}:
 *   get:
 *     summary: Get an identifier by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the identifier
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Identifier found
 *       '404':
 *         description: Identifier not found
 */
identifierRouter.get('/identifiers/:id', getIdentifierById);

/**
 * @swagger
 * /identifiers:
 *   get:
 *     summary: Get all identifiers
 *     responses:
 *       '200':
 *         description: A list of identifiers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   system:
 *                     type: string
 *                   value:
 *                     type: string
 */
identifierRouter.get('/identifiers', getAllIdentifiers);

/**
 * @swagger
 * /identifiers/paginated:
 *   get:
 *     summary: Get paginated identifiers
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: A paginated list of identifiers
 */
identifierRouter.get('/identifiers/paginated', getPaginatedIdentifiers);

/**
 * @swagger
 * /identifiers/{id}:
 *   patch:
 *     summary: Update an identifier
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the identifier
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               system:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Identifier updated successfully
 *       '404':
 *         description: Identifier not found
 */
identifierRouter.patch('/identifiers/:id',
    [
        body('system').optional().isString(),
        body('value').optional().isString(),
    ],
    validateInput,
    updateIdentifier
);

/**
 * @swagger
 * /identifiers/{id}:
 *   delete:
 *     summary: Delete an identifier
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the identifier
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Identifier deleted successfully
 *       '404':
 *         description: Identifier not found
 */
identifierRouter.delete('/identifiers/:id', deleteIdentifier);

export default identifierRouter;