import e, { Request, Response } from "express";
import { medicationModel, IMedication } from "../models/medicationModel";
import { identifierModel } from "../models/identifierModel";
import { manufacturerModel } from "../models/manufacturerModel";
import { codingModel } from "../models/codingModel";
import mongoose from "mongoose";
import { error } from "console";
import { parse } from "path";

// Create a new medication
export const createMedication = async (req: Request, res: Response) => {
  try {
    // Create manufacturer
    const manufacturer = new manufacturerModel(req.body.manufacturer);
    await manufacturer.save();

    // Create coding for code
    const codingPromises = req.body.code.coding.map(async (coding: any) => {
      const newCoding = new codingModel(coding);
      await newCoding.save();
      return newCoding._id;
    });
    const codingIds = await Promise.all(codingPromises);

    // Create ingredients
    const ingredientsPromises = req.body.ingredients.map(async (ingredient: any) => {
      const itemCodingPromises = ingredient.item.coding.map(async (coding: any) => {
        const newCoding = new codingModel(coding);
        await newCoding.save();
        return newCoding._id;
      });
      const itemCodingIds = await Promise.all(itemCodingPromises);
      return {
        item: { coding: itemCodingIds },
        strength: ingredient.strength
      };
    });
    const ingredients = await Promise.all(ingredientsPromises);

    // Create medication
    const medicationData = {
      ...req.body,
      manufacturer: manufacturer._id,
      code: { coding: codingIds },
      ingredients: ingredients
    };

    const medication = new medicationModel(medicationData);

    // Create identifier
    const identifier = new identifierModel({
      system: `https://medications.rxkonet.com/medications`,
      value: medication.id.toString(),
    });
    await identifier.save();
    medication.identifier = [identifier.id];

    await medication.validate(); // This will throw a ValidationError if the data is invalid
    await medication.save();
    res.status(201).json(medication);
  } catch (error) {
    console.error("Medication creation error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to add medication" });
  }
};

// Get a medication by ID
export const getMedicationById = async (req: Request, res: Response) => {
  try {
    const medication = await medicationModel
      .findById(req.params.id)
      .populate("code.coding")
    //   .populate("doseForm.coding")
      .populate("ingredients.item.coding")
      .populate("identifier")
    //   .populate("manufacturer");

    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }
    res.json(medication);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to fetch medication" });
  }
};

// Update a medication
export const updateMedication = async (req: Request, res: Response) => {
  try {
    const { code, manufacturer, ingredients, ...updateData } = req.body;

    // Handle code.coding update
    if (code && code.coding) {
      const codingPromises = code.coding.map(async (coding: any) => {
        const newCoding = await codingModel.findOneAndUpdate(
          { system: coding.system, code: coding.code },
          coding,
          { upsert: true, new: true }
        );
        return newCoding._id;
      });
      const codingIds = await Promise.all(codingPromises);
      updateData.code = { coding: codingIds };
    }

    // Handle manufacturer update
    if (manufacturer) {
      const newManufacturer = await manufacturerModel.findOneAndUpdate(
        { name: manufacturer.name },
        manufacturer,
        { upsert: true, new: true }
      );
      updateData.manufacturer = newManufacturer._id;
    }

    // Handle ingredients update
    if (ingredients) {
      const ingredientsPromises = ingredients.map(async (ingredient: any) => {
        const itemCodingPromises = ingredient.item.coding.map(async (coding: any) => {
          const newCoding = await codingModel.findOneAndUpdate(
            { system: coding.system, code: coding.code },
            coding,
            { upsert: true, new: true }
          );
          return newCoding._id;
        });
        const itemCodingIds = await Promise.all(itemCodingPromises);
        return {
          item: { coding: itemCodingIds },
          strength: ingredient.strength
        };
      });
      updateData.ingredients = await Promise.all(ingredientsPromises);
    }

    // Update medication
    const medication = await medicationModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('code.coding')
      .populate('manufacturer')
      .populate('ingredients.item.coding')
      .populate('identifier');

    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    res.json(medication);
  } catch (error) {
    console.error("Error updating medication:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update medication' });
  }
};

// Delete a medication
export const deleteMedication = async (req: Request, res: Response) => {
  try {
    const medication = await medicationModel.findByIdAndDelete(req.params.id);
    if (!medication) {
      return res.status(404).json({ error: "Medication Not Found" });
    }
    res.json({ message: "Medication deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete medication" });
  }
};

// Get all medications
export const getAllMedications = async (req: Request, res: Response) => {
  try {
    const medications = await medicationModel.find()
      .populate("code.coding")
      .populate("ingredients.item.coding")
      .populate("identifier")
      .populate("manufacturer");
    res.json(medications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch medications" });
  }
};

// Get paginated medications
export const getPaginatedMedications = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const medications = await medicationModel.find()
      .populate("code.coding")
      .populate("ingredients.item.coding")
      .populate("identifier")
      .populate("manufacturer")
      .skip(skip)
      .limit(limit);

    const total = await medicationModel.countDocuments();

    res.json({
      data: medications,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch paginated medications" });
  }
};




