import { Router } from "express";
import { bulkCreateMedications, bulkUpdateMedications, bulkDeleteMedications } from "../controllers/batchController";

const bulkRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Bulk Operations
 *   description: API for bulk operations on medications
 */

/**
 * @swagger
 * /medications/bulk:
 *   post:
 *     tags: [Bulk Operations]
 *     summary: Bulk create medications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 resourceType:
 *                   type: string
 *                 status:
 *                   type: string
 *                 brandName:
 *                   type: string
 *                 code:
 *                   type: object
 *                   properties:
 *                     coding:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           system:
 *                             type: string
 *                           code:
 *                             type: string
 *                           display:
 *                             type: string
 *     responses:
 *       '201':
 *         description: Medications created successfully
 *       '400':
 *         description: Invalid input
 */
bulkRouter.post('/medications/bulk', bulkCreateMedications);

/**
 * @swagger
 * /medications/bulk:
 *   patch:
 *     tags: [Bulk Operations]
 *     summary: Bulk update medications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 updateData:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     brandName:
 *                       type: string
 *     responses:
 *       '200':
 *         description: Medications updated successfully
 *       '400':
 *         description: Invalid input
 */
bulkRouter.patch('/medications/bulk', bulkUpdateMedications);

/**
 * @swagger
 * /medications/bulk:
 *   delete:
 *     tags: [Bulk Operations]
 *     summary: Bulk delete medications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *     responses:
 *       '200':
 *         description: Medications deleted successfully
 *       '404':
 *         description: Medications not found
 */
bulkRouter.delete('/medications/bulk', bulkDeleteMedications);

export default bulkRouter;
