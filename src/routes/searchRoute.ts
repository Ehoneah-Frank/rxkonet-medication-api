import { Router } from "express";
import { query } from "express-validator";
import { advancedSearchMedications } from "../controllers/searchController";
import { validateInput } from "../middlewares/validationMiddleware";

const searchRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: API for searching medications
 */

/**
 * @swagger
 * /medications/search:
 *   get:
 *     tags: [Search]
 *     summary: Search for medications
 *     parameters:
 *       - name: sort
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       '200':
 *         description: A list of medications matching the search criteria
 *       '400':
 *         description: Invalid query parameters
 */
searchRouter.get('/medications/search', [
  query('sort').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], validateInput, advancedSearchMedications);

export default searchRouter;
