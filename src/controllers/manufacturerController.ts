import { Request, Response } from 'express';
import { manufacturerModel, IManufacturer } from '../models/manufacturerModel';
import mongoose from 'mongoose';

// Create a new manufacturer
export const createManufacturer = async (req: Request, res: Response) => {
  try {
    const manufacturer = new manufacturerModel(req.body);
    await manufacturer.validate();
    await manufacturer.save();
    res.status(201).json(manufacturer);
  } catch (error) {
    console.error("Manufacturer creation error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to add manufacturer" });
  }
};

// Get a manufacturer by ID
export const getManufacturerById = async (req: Request, res: Response) => {
  try {
    const manufacturer = await manufacturerModel.findById(req.params.id);
    if (!manufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }
    res.json(manufacturer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch manufacturer" });
  }
};

// Update a manufacturer
export const updateManufacturer = async (req: Request, res: Response) => {
  try {
    const manufacturer = await manufacturerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!manufacturer) {
      return res.status(404).json({ error: 'Manufacturer not found' });
    }
    res.json(manufacturer);
  } catch (error) {
    console.error("Error updating manufacturer:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update manufacturer' });
  }
};

// Delete a manufacturer
export const deleteManufacturer = async (req: Request, res: Response) => {
  try {
    const manufacturer = await manufacturerModel.findByIdAndDelete(req.params.id);
    if (!manufacturer) {
      return res.status(404).json({ error: "Manufacturer Not Found" });
    }
    res.json({ message: "Manufacturer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete manufacturer" });
  }
};

// Get all manufacturers
export const getAllManufacturers = async (req: Request, res: Response) => {
  try {
    const manufacturers = await manufacturerModel.find();
    res.json(manufacturers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch manufacturers" });
  }
};

// Add a new function for paginated manufacturers
export const getPaginatedManufacturers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const manufacturers = await manufacturerModel.find()
      .skip(skip)
      .limit(limit);

    const total = await manufacturerModel.countDocuments();

    res.json({
      data: manufacturers,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch paginated manufacturers" });
  }
};