import { Router } from "express";
import { bulkCreateMedications, bulkUpdateMedications, bulkDeleteMedications } from "../controllers/batchController";

const bulkRouter = Router();

bulkRouter.post('/medications/bulk', bulkCreateMedications);
bulkRouter.patch('/medications/bulk', bulkUpdateMedications);
bulkRouter.delete('/medications/bulk', bulkDeleteMedications);

export default bulkRouter;
