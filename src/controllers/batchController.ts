import { Request, Response } from "express";
import { medicationModel } from "../models/medicationModel";
import { manufacturerModel } from "../models/manufacturerModel";
import { codingModel } from "../models/codingModel";
import { identifierModel } from "../models/identifierModel";
import mongoose from "mongoose";

// Batch create medications
export const bulkCreateMedications = async (req: Request, res: Response) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { medications } = req.body;

		if (!medications || !Array.isArray(medications)) {
			return res.status(400).json({ error: 'Medications must be provided as an array' });
		}

		const createdMedications = [];

		for (const medicationData of medications) {
			// Create manufacturer
			const manufacturer = new manufacturerModel(medicationData.manufacturer);
			await manufacturer.save({ session });

			// Create coding for code
			const codingPromises = medicationData.code.coding.map(async (coding: any) => {
				const newCoding = new codingModel(coding);
				await newCoding.save({ session });
				return newCoding._id;
			});
			const codingIds = await Promise.all(codingPromises);

			// Create ingredients
			const ingredientsPromises = medicationData.ingredients.map(async (ingredient: any) => {
				const itemCodingPromises = ingredient.item.coding.map(async (coding: any) => {
					const newCoding = new codingModel(coding);
					await newCoding.save({ session });
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
			const medication = new medicationModel({
				...medicationData,
				manufacturer: manufacturer._id,
				code: { coding: codingIds },
				ingredients: ingredients
			});

			// Create identifier
			const identifier = new identifierModel({
				system: `https://medications.rxkonet.com/medications`,
				value: medication.id.toString(),
			});
			await identifier.save({ session });
			medication.identifier = [identifier.id];

			await medication.save({ session });
			createdMedications.push(medication);
		}

		await session.commitTransaction();
		res.status(201).json(createdMedications);
	} catch (error) {
		await session.abortTransaction();
		console.error("Bulk medication creation error:", error);
		if (error instanceof mongoose.Error.ValidationError) {
			return res.status(400).json({ error: error.message });
		}
		res.status(500).json({ error: "Failed to create medications in bulk"});
	} finally {
		session.endSession();
	}
};

// Batch update medications 
export const bulkUpdateMedications = async (req: Request, res: Response) => {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const { updates } = req.body;

		if (!updates || !Array.isArray(updates)) {
			return res.status(400).json({ error: 'Updates must be provided as an array' });
		}

		const updatedMedications = [];

		for (const update of updates) {
			const { id, ...updateData } = update;

			// Handle code.coding update
			if (updateData.code && updateData.code.coding) {
				const codingPromises = updateData.code.coding.map(async (coding: any) => {
					const newCoding = await codingModel.findOneAndUpdate(
						{ system: coding.system, code: coding.code },
						coding,
						{ upsert: true, new: true, session }
					);
					return newCoding._id;
				});
				const codingIds = await Promise.all(codingPromises);
				updateData.code = { coding: codingIds };
			}

			// Handle manufacturer update
			if (updateData.manufacturer) {
				const newManufacturer = await manufacturerModel.findOneAndUpdate(
					{ name: updateData.manufacturer.name },
					updateData.manufacturer,
					{ upsert: true, new: true, session }
				);
				updateData.manufacturer = newManufacturer._id;
			}

			// Handle ingredients update
			if (updateData.ingredients) {
				const ingredientsPromises = updateData.ingredients.map(async (ingredient: any) => {
					const itemCodingPromises = ingredient.item.coding.map(async (coding: any) => {
						const newCoding = await codingModel.findOneAndUpdate(
							{ system: coding.system, code: coding.code },
							coding,
							{ upsert: true, new: true, session }
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
			const updatedMedication = await medicationModel.findByIdAndUpdate(
				id,
				updateData,
				{ new: true, runValidators: true, session }
			).populate('code.coding')
				.populate('manufacturer')
				.populate('ingredients.item.coding')
				.populate('identifier');

			if (!updatedMedication) {
				throw new Error(`Medication with id ${id} not found`);
			}

			updatedMedications.push(updatedMedication);
		}

		await session.commitTransaction();
		res.json(updatedMedications);
	} catch (error) {
		res.status(500).json({ error: "Failed to update medications in bulk" });
	} finally {
		session.endSession();
	}
};

// Batch delete medications
export const bulkDeleteMedications = async(req: Request, res: Response) =>{
	try {
		const {ids} =req.body;
		if(!ids || !Array.isArray(ids)) {
			return res.status(400).json({error: 'IDs must be provided as an array'});
		}

		const result = await medicationModel.deleteMany({_id: {$in: ids}});
		res.json({ message: `${result.deletedCount} medications deleted`});
	} catch (error) {
		res.status(500).json({error: 'Failed to delete medications in bulk'});
	}
};