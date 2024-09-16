import { body } from "express-validator";
import { Router } from "express";
import { createCoding, getCodingById, updateCoding, deleteCoding, getAllCodings, getPaginatedCodings } from "../controllers/codingController";
import { validateInput } from "../middlewares/validationMiddleware";

const codingRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Codings
 *   description: API for managing codings
 */

/**
 * @swagger
 * /codings:
 *   post:
 *     tags: [Codings]
 *     summary: Create a new coding
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               system:
 *                 type: string
 *               code:
 *                 type: string
 *               display:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Coding created successfully
 *       '400':
 *         description: Invalid input
 */
codingRouter.post('/codings', 
    [
        body('system').isString().notEmpty(),
        body('code').isString().notEmpty(),
        body('display').isString().notEmpty(),
    ],
    validateInput,
    createCoding
);

/**
 * @swagger
 * /codings:
 *   get:
 *     tags: [Codings]
 *     summary: Get all codings
 *     responses:
 *       '200':
 *         description: A list of codings
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
 *                   code:
 *                     type: string
 *                   display:
 *                     type: string
 */
codingRouter.get('/codings', getAllCodings);

/**
 * @swagger
 * /codings/{id}:
 *   get:
 *     tags: [Codings]
 *     summary: Get a coding by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the coding
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Coding found
 *       '404':
 *         description: Coding not found
 */
codingRouter.get('/codings/:id', getCodingById);

/**
 * @swagger
 * /codings/{id}:
 *   patch:
 *     tags: [Codings]
 *     summary: Update a coding
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the coding
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
 *               code:
 *                 type: string
 *               display:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Coding updated successfully
 *       '404':
 *         description: Coding not found
 */
codingRouter.patch('/codings/:id',
    [
        body('system').optional().isString(),
        body('code').optional().isString(),
        body('display').optional().isString(),
    ],
    validateInput,
    updateCoding
);

/**
 * @swagger
 * /codings/{id}:
 *   delete:
 *     tags: [Codings]
 *     summary: Delete a coding
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the coding
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Coding deleted successfully
 *       '404':
 *         description: Coding not found
 */
codingRouter.delete('/codings/:id', deleteCoding);

/**
 * @swagger
 * /codings/paginated:
 *   get:
 *     tags: [Codings]
 *     summary: Get paginated codings
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
 *         description: A paginated list of codings
 */
codingRouter.get('/codings/paginated', getPaginatedCodings);

export default codingRouter;
