import { Request, Response } from 'express';
import { codingModel, ICoding } from '../models/codingModel';
import mongoose from 'mongoose';

// Create a new coding
export const createCoding = async (req: Request, res: Response) => {
  try {
    const coding = new codingModel(req.body);
    await coding.validate();
    await coding.save();
    res.status(201).json(coding);
  } catch (error) {
    console.error("Coding creation error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to add coding" });
  }
};

// Get a coding by ID
export const getCodingById = async (req: Request, res: Response) => {
  try {
    const coding = await codingModel.findById(req.params.id);
    if (!coding) {
      return res.status(404).json({ error: "Coding not found" });
    }
    res.json(coding);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch coding" });
  }
};

// Update a coding
export const updateCoding = async (req: Request, res: Response) => {
  try {
    const coding = await codingModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!coding) {
      return res.status(404).json({ error: 'Coding not found' });
    }
    res.json(coding);
  } catch (error) {
    console.error("Error updating coding:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update coding' });
  }
};

// Delete a coding
export const deleteCoding = async (req: Request, res: Response) => {
  try {
    const coding = await codingModel.findByIdAndDelete(req.params.id);
    if (!coding) {
      return res.status(404).json({ error: "Coding Not Found" });
    }
    res.json({ message: "Coding deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete coding" });
  }
};

// Get all codings
export const getAllCodings = async (req: Request, res: Response) => {
  try {
    const codings = await codingModel.find();
    res.json(codings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch codings" });
  }
};

// Add a new function for paginated codings
export const getPaginatedCodings = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const codings = await codingModel.find()
      .skip(skip)
      .limit(limit);

    const total = await codingModel.countDocuments();

    res.json({
      data: codings,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch paginated codings" });
  }
};