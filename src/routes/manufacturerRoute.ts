import { body } from "express-validator";
import { Router } from "express";
import { createManufacturer, getManufacturerById, updateManufacturer, deleteManufacturer, getAllManufacturers, getPaginatedManufacturers } from "../controllers/manufacturerController";
import { validateInput } from "../middlewares/validationMiddleware";

const manufacturerRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Manufacturers
 *   description: API for managing manufacturers
 */

/**
 * @swagger
 * /manufacturers:
 *   post:
 *     tags: [Manufacturers]
 *     summary: Create a new manufacturer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               contact:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Manufacturer created successfully
 *       '400':
 *         description: Invalid input
 */
manufacturerRouter.post('/manufacturers', 
    [
        body('name').isString().notEmpty(),
        body('address').optional().isString(),
        body('contact').optional().isString(),
    ],
    validateInput,
    createManufacturer
);

/**
 * @swagger
 * /manufacturers:
 *   get:
 *     tags: [Manufacturers]
 *     summary: Get all manufacturers
 *     responses:
 *       '200':
 *         description: A list of manufacturers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   contact:
 *                     type: string
 */
manufacturerRouter.get('/manufacturers', getAllManufacturers);

/**
 * @swagger
 * /manufacturers/{id}:
 *   get:
 *     tags: [Manufacturers]
 *     summary: Get a manufacturer by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the manufacturer
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Manufacturer found
 *       '404':
 *         description: Manufacturer not found
 */
manufacturerRouter.get('/manufacturers/:id', getManufacturerById);

/**
 * @swagger
 * /manufacturers/{id}:
 *   patch:
 *     tags: [Manufacturers]
 *     summary: Update a manufacturer
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the manufacturer
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               contact:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Manufacturer updated successfully
 *       '404':
 *         description: Manufacturer not found
 */
manufacturerRouter.patch('/manufacturers/:id',
    [
        body('name').optional().isString(),
        body('address').optional().isString(),
        body('contact').optional().isString(),
    ],
    validateInput,
    updateManufacturer
);

/**
 * @swagger
 * /manufacturers/{id}:
 *   delete:
 *     tags: [Manufacturers]
 *     summary: Delete a manufacturer
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the manufacturer
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Manufacturer deleted successfully
 *       '404':
 *         description: Manufacturer not found
 */
manufacturerRouter.delete('/manufacturers/:id', deleteManufacturer);

/**
 * @swagger
 * /manufacturers/paginated:
 *   get:
 *     tags: [Manufacturers]
 *     summary: Get paginated manufacturers
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
 *         description: A paginated list of manufacturers
 */
manufacturerRouter.get('/manufacturers/paginated', getPaginatedManufacturers);

export default manufacturerRouter;