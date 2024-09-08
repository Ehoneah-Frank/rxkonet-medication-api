import { body } from "express-validator";
import { Router } from "express";
import { createManufacturer, getManufacturerById, updateManufacturer, deleteManufacturer, getAllManufacturers } from "../controllers/manufacturerController";
import { validateInput } from "../middlewares/validationMiddleware";

const manufacturerRouter = Router();

manufacturerRouter.post('/manufacturers', 
    [
        body('name').isString().notEmpty(),
        body('address').optional().isString(),
        body('contact').optional().isString(),
    ],
    validateInput,
    createManufacturer
);

manufacturerRouter.get('/manufacturers', getAllManufacturers);

manufacturerRouter.get('/manufacturers/:id', getManufacturerById);

manufacturerRouter.patch('/manufacturers/:id',
    [
        body('name').optional().isString(),
        body('address').optional().isString(),
        body('contact').optional().isString(),
    ],
    validateInput,
    updateManufacturer
);

manufacturerRouter.delete('/manufacturers/:id', deleteManufacturer);

export default manufacturerRouter;