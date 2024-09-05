import { medicationModel } from "../models/medicationModel";
import { Request, Response } from "express";


// Advanced search for medications
export const advancedSearchMedications = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { sort, page, limit, ...filters } = req.query;
      let query: Record<string, unknown> = {};
  
      // Apply filters
      Object.assign(query, filters);
  
      const pageNumber = parseInt(page as string, 10) || 1;
      const pageSize = parseInt(limit as string, 10) || 10;
      const skip = (pageNumber - 1) * pageSize;
  
  const sortOrder : any = sort ? {[sort as string]: 1} : {};
  
  const medications = await medicationModel.find(query)
  .populate("code.coding")
  .populate("doseForm.coding")
  .populate("ingredients.item.coding")
  .populate("manufacturer")
  .sort(sortOrder)
  .skip(skip)
  .limit(pageSize);
  
  const totalMedications = await medicationModel.countDocuments(query)
  
  res.json({
      data: medications,
      total: totalMedications,
      page: pageNumber,
      pages: Math.ceil(totalMedications / pageSize),
  });
    } catch (error) {
      res.status(500).json({ error: 'Failed to perform advance search'});
    }
  };