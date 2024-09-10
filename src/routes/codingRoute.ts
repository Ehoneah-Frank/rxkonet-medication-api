import { body } from "express-validator";
import { Router } from "express";
import { createCoding, getCodingById, updateCoding, deleteCoding, getAllCodings, getPaginatedCodings } from "../controllers/codingController";
import { validateInput } from "../middlewares/validationMiddleware";

const codingRouter = Router();

codingRouter.post('/codings', 
    [
        body('system').isString().notEmpty(),
        body('code').isString().notEmpty(),
        body('display').isString().notEmpty(),
    ],
    validateInput,
    createCoding
);

codingRouter.get('/codings', getAllCodings);

codingRouter.get('/codings/:id', getCodingById);

codingRouter.patch('/codings/:id',
    [
        body('system').optional().isString(),
        body('code').optional().isString(),
        body('display').optional().isString(),
    ],
    validateInput,
    updateCoding
);

codingRouter.delete('/codings/:id', deleteCoding);

codingRouter.get('/codings/paginated', getPaginatedCodings);

export default codingRouter;