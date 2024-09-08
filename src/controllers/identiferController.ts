import { Request, Response } from 'express';
import { identifierModel, IIdentifier } from '../models/identifierModel';
import mongoose from 'mongoose';

// Create a new identifier
export const createIdentifier = async (req: Request, res: Response) => {
  try {
    const identifier = new identifierModel(req.body);
    await identifier.validate();
    await identifier.save();
    res.status(201).json(identifier);
  } catch (error) {
    console.error("Identifier creation error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to add identifier" });
  }
};

// Get an identifier by ID
export const getIdentifierById = async (req: Request, res: Response) => {
  try {
    const identifier = await identifierModel.findById(req.params.id);
    if (!identifier) {
      return res.status(404).json({ error: "Identifier not found" });
    }
    res.json(identifier);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch identifier" });
  }
};

// Update an identifier
export const updateIdentifier = async (req: Request, res: Response) => {
  try {
    const identifier = await identifierModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!identifier) {
      return res.status(404).json({ error: 'Identifier not found' });
    }
    res.json(identifier);
  } catch (error) {
    console.error("Error updating identifier:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update identifier' });
  }
};

// Delete an identifier
export const deleteIdentifier = async (req: Request, res: Response) => {
  try {
    const identifier = await identifierModel.findByIdAndDelete(req.params.id);
    if (!identifier) {
      return res.status(404).json({ error: "Identifier Not Found" });
    }
    res.json({ message: "Identifier deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete identifier" });
  }
};