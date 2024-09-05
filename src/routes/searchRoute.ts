import { Router } from "express";
import { query } from "express-validator";
import { advancedSearchMedications } from "../controllers/searchController";
import { validateInput } from "../middlewares/validationMiddleware";

const searchRouter = Router();

searchRouter.get('/medical/search', [
  query('sort').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  // Add more query parameter validations as needed
], validateInput, advancedSearchMedications);

export default searchRouter;
